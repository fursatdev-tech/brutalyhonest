"use server";

import dotenv from "dotenv";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import OpenAI from "openai";
import { ReservationStatus, UserRole } from "@prisma/client";
import * as z from "zod";

import prismadb from "@/lib/prismadb";

dotenv.config({ path: `.env` });
const openai = new OpenAI();

export async function getAIresponse(
    prevState: { message: string },
    formData: FormData
) {
    try {
        const schema = z.object({
            prompt: z.string(),
            messageId: z.string(),
            reservationId: z.string(),
        });

        let parse = schema.safeParse({
            prompt: formData.get("prompt"),
            messageId: formData.get("messageId"),
            reservationId: formData.get("reservationId"),
        });

        if (!parse.success) return { message: "Invalid form data" };

        let { prompt, messageId, reservationId } = parse.data;

        if (containsEmailOrPhone(prompt))
            return {
                message:
                    "Please do not include email or phone number or external links in the message.",
            };

        let userId = null;

        if (!userId) {
            const user = await currentUser();
            userId = user?.id;
        }

        const reservation = await prismadb.reservation.findUnique({
            where: {
                id: reservationId,
            },
            select: {
                status: true,
            },
        });

        if (!reservation || reservation.status !== ReservationStatus.confirmed)
            return {
                message: "Reservation not found or Not confirmed by the Host.",
            };

        if (!userId) return { message: "Unauthorized" };

        const dbThread = await prismadb.message.findUnique({
            where: {
                id: messageId,
            },
            select: {
                gptThreadId: true,
                listing: {
                    select: {
                        hostId: true,
                        assistantId: true,
                    },
                },
            },
        });

        if (!dbThread || !dbThread?.listing?.assistantId)
            return { message: "Conversation thread not found" };

        let { gptThreadId } = dbThread;

        let gptThread = null;

        if (!gptThreadId) {
            gptThread = await openai.beta.threads.create({ metadata: {} });

            gptThreadId = gptThread.id;
        }

        const guestId = userId;
        const hostId = dbThread.listing.hostId;

        await prismadb.message.update({
            where: {
                id: messageId,
            },
            data: {
                gptThreadId,
                thread: {
                    create: {
                        text: prompt,
                        role: UserRole.guest,
                        guestId,
                        hostId,
                    },
                },
            },
        });

        await openai.beta.threads.messages.create(gptThreadId, {
            role: "user",
            content: prompt,
        });

        const run = await openai.beta.threads.runs.create(gptThreadId, {
            assistant_id: dbThread.listing.assistantId,
        });

        let runCompleted = false;

        do {
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const runStatusResponse = await openai.beta.threads.runs.retrieve(
                gptThreadId,
                run.id
            );

            runCompleted = runStatusResponse.status === "completed";
        } while (!runCompleted);

        const rawMessages = await openai.beta.threads.messages.list(
            gptThreadId
        );

        const message = rawMessages.data.map((message) => {
            return {
                content: message.content[0],
                role: message.role,
            };
        })[0];

        let response: string;
        if ("text" in message.content) {
            response = message.content.text.value;
        } else {
            throw new Error("Unexpected message content type");
        }

        if (message.role !== UserRole.assistant)
            return { message: "No response from assistant" };

        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null); // End of the stream

        await prismadb.message.update({
            where: {
                id: messageId,
            },
            data: {
                thread: {
                    create: {
                        text: response,
                        role: UserRole.assistant,
                        isUnread: false,
                        guestId,
                        hostId,
                    },
                },
            },
        });

        revalidatePath(`/messages/${messageId}`);

        return { message: "done" };
    } catch (error: any) {
        return { message: `${error}` };
    }
}

function containsEmailOrPhone(prompt: string): boolean {
    const emailRegex: RegExp =
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

    const phoneRegex: RegExp = /\d{5,}/;

    const websiteRegex: RegExp =
        /\b(?:https?:\/\/)?(?:www\.)?[-A-Z0-9+&@#\/%?=~_|!:,.;]*[A-Z0-9+&@#\/%=~_|]\.[A-Z]{2,}\b/i;

    return (
        emailRegex.test(prompt) ||
        phoneRegex.test(prompt) ||
        websiteRegex.test(prompt)
    );
}
