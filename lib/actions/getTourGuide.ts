// Define the TravelGuide and LinkType types
import prismadb from "@/lib/prismadb";

type LinkType = {
    name: string;
    url: string;
  };
  
  type TravelGuide = {
    name: string;
    title: string;
    content: string[];
    links: LinkType[];
    tip?: string;
  };
  

  
  // Function to fetch tour guide data based on tourId
  export const getTourGuide = async (tourId: string) => {
    try {

      const tourGuide = await prismadb.travelSection.findFirst({
        where: {tourId }, // matching by the tour id
        select: {
          tourId: true,
          options: true, // return the options array (which is of type TravelGuide[])
        },
      });
  
      if (tourGuide) {
        return { tourGuide };
      }
  
        // If no data is found, return
      return { tourGuide: null };
    } catch (error: any) {
      console.error("Error fetching tour guide data:", error);
      return { tourGuide: null };
    }
  };
  
  // Function to post new tour guide data
  export const postTourGuide = async (tourId: string, options: TravelGuide[]) => {
    try {
      
      const newTourGuide = await prismadb.travelSection.create({
        data: {
          tourId,        
          options,      
        },
      });
  
      return { newTourGuide };
    } catch (error: any) {
      console.error("Error posting tour guide data:", error);
      return { error: "Failed to post tour guide data" };
    }
  };
  