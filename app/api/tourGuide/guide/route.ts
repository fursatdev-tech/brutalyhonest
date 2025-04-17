import { getTourGuide } from "@/lib/actions/getTourGuide";
import { postTourGuide } from "@/lib/actions/getTourGuide";
import { NextResponse, NextRequest } from "next/server";



export async function GET(request: NextRequest) {
    try {
        const tourId = request.nextUrl.searchParams.get("tourId");


        if (!tourId) {
            return new NextResponse("Tour ID is required", { status: 400 });
        }

        const tourGuide = await getTourGuide(tourId);

        if (tourGuide && tourGuide.tourGuide) {
            return NextResponse.json({ data: tourGuide.tourGuide });
        }

        return new NextResponse("Tour guide not found", { status: 404 });
    } catch (error: any) {
        console.error("Error fetching tour guide data:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}



export async function POST(request: Request) {
    try {
      const body = await request.json();
      console.log("Request Body:", body); 
  
      const { tourId, options } = body;
  
      if (!tourId || !options) {
        return new NextResponse("Missing required fields", { status: 400 });
      }
  
      if (!Array.isArray(options)) {
        return new NextResponse("Options must be an array", { status: 400 });
      }
  
      options.forEach((option) => {
        if (!Array.isArray(option.content)) {
          return new NextResponse("Content must be an array", { status: 400 });
        }
      });
  
      const result = await postTourGuide(tourId, options);
  
      return NextResponse.json({ data: result.newTourGuide }, { status: 201 });
  
    } catch (error: any) {
      console.error("Error posting tour guide data:", error);
      return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 });
    }
  }
  