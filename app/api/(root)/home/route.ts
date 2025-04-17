import dotenv from "dotenv";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { NextResponse } from "next/server";
import OpenAI from "openai";

dotenv.config({ path: `.env` });
const openai = new OpenAI();

type HomeProps = {
    params: Promise<{
        category: string;
    }>;
};

export async function GET(request: Request, { params }: HomeProps) {
    const user = await currentUser();

    // const body = await request.json();

    try {
        const rawMessages = await openai.beta.threads.messages.list(
            "thread_ywC4SFMGhKY3SuWtJN5IXfNr"
        );

        return NextResponse.json({ data: rawMessages });
    } catch (error: any) {
        return new NextResponse(`${JSON.stringify(error)}`, { status: 500 });
    }
}
