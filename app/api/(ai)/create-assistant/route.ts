import dotenv from "dotenv";
import { NextResponse } from "next/server";
import OpenAI from "openai";

import prismadb from "@/lib/prismadb";
import {
    AssistantCreateParams,
    AssistantUpdateParams,
} from "openai/resources/beta/assistants.mjs";

dotenv.config({ path: `.env` });
const openai = new OpenAI();

export async function POST(request: Request) {
    try {
        const {
            listingId,
            propertyName,
            location,
            country,
            listingLat,
            listingLng,
            description,
            amenities,
            checkInTime,
            checkOutTime,
            isEditing,
        } = await request.json();

        const gptInstructions: AssistantCreateParams = {
            instructions: `
        You are an advanced chatbot for [brutalyhonest.ai](http://brutalyhonest.ai), expertly crafted to offer comprehensive user assistance, from initial reservation inquiries to final confirmation guidance. Your specialization lies in enhancing the guest experience. As an expert tour guide chatbot, your task is to generate a welcoming guidebook itinerary, presenting it as the initial message to guests. This guidebook should be concise, informative, and formatted in an easy-to-read manner, avoiding links to external websites. You are created for ${propertyName} in ${location}, ${country} with lat ${listingLat} and long ${listingLng}.

        This listings description is as follows: ${description}.

        List of features and amaentities for ${propertyName} are as follows: ${amenities}

        Generate a guidebook based based on above information in a crystal, crisp and pointer format without link to external websites and provide it to user when asked" Now let's tell the bot to create an itinerary. "You are an expert tour guide of the region based on {the number of days}, create an customisable itinerary for the user. Ask the user if they wish to structure their trip for adventure, leisure, culture, food.

        - **Reservation Confirmation with Guidebook**
        - **Bot**: "Reservation confirmed for ${propertyName}. Exciting! Here's a [guidebook] for your trip. Need more details or have any questions? I'm here to help!"

        - **Inquiring About Local Attractions**
        - **User**: "What can I do around ${propertyName}?"
        - **Bot**: "There's plenty to explore! Check out [Local Attractions List] in the guidebook. Anything specific you're interested in?"

        - **Asking About Property Amenities**
        - **User**: "Does ${propertyName} have Wi-Fi?"
        - **Bot**: "Yes, ${propertyName} is equipped with Wi-Fi. You’ll find more amenities listed in the guidebook."

        - **Requesting Check-in and Check-out Information**
        - **User**: "What are the check-in and check-out times?"
        - **Bot**: "Check-in at ${propertyName} is at ${checkInTime}, and check-out is by ${checkOutTime}. Let me know if you need early check-in or late check-out."


        - **Clarifying Guest Accommodations**
        - **User**: "Is the place suitable for kids?"
        - **Bot**: "${propertyName} is kid-friendly, offering [List of Kid-Friendly Amenities]. Your family will have a great time!"


        - **Seeking Transportation Information**
        - **User**: "How do I get around the area?"
        - **Bot**: "Public transport is available at ${location}. For more convenience, consider [Local Taxi Services/Rental Options]. Details are in the guidebook."
      "
      `,
            name: propertyName + "-" + listingId,
            tools: [],
            model: process.env.OPENAI_MODEL!,
        };

        if (isEditing) {
            await updateGpt(gptInstructions, listingId);
            return NextResponse.json({ message: "Assistant updated" });
        }

        const assistant = await openai.beta.assistants.create(gptInstructions);

        await prismadb.listing.update({
            where: {
                id: listingId,
            },
            data: {
                assistantId: assistant.id,
            },
        });

        return NextResponse.json({ message: "Assistant created" });
    } catch (error: any) {
        return new NextResponse(`${error}`, { status: 500 });
    }
}

const updateGpt = async (
    gptInstructions: AssistantUpdateParams,
    listingId: string
) => {
    const foundListing = await prismadb.listing.findUnique({
        where: {
            id: listingId,
        },
        select: {
            assistantId: true,
        },
    });

    if (!foundListing || !foundListing.assistantId) return;

    await openai.beta.assistants.update(
        foundListing.assistantId,
        gptInstructions
    );
};
