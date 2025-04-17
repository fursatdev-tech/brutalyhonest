import dotenv from "dotenv";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { StreamingTextResponse } from "ai";
import { UserRole } from "@prisma/client";

import prismadb from "@/lib/prismadb";
import { CacheTagsType } from "@/util/types";

dotenv.config({ path: `.env` });
const openai = new OpenAI();

type HomeProps = {
    params: Promise<{
        messageId: string;
    }>;
};

export async function POST(request: Request, { params }: HomeProps) {
    try {
        const { messageId } = await params;

        let { prompt, userId } = await request.json();

        if (!userId) {
            const user = await currentUser();
            userId = user?.id;
        }

        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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
            return new NextResponse("Conversation thread not found", {
                status: 404,
            });

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
            return new NextResponse("No response from assistant", {
                status: 400,
            });

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

        revalidateTag(CacheTagsType.GET_THREADS);

        revalidatePath(`/messages/${messageId}`);

        return new StreamingTextResponse(s);
    } catch (error: any) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}
