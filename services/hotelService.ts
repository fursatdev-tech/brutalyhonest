import { HotelDetails } from '@prisma/client';

interface HotelSearchResult {
  dest_id: string;
  latitude: number;
  longitude: number;
  name: string;
  city_name: string;
  country: string;
}

interface HotelDetailsResult {
  hotel_id: number;
  accessibilityLabel: string;
  property: {
    name: string;
    reviewScore: number;
    reviewScoreWord: string;
    reviewCount: number;
    latitude: number;
    longitude: number;
    mainPhotoId: number;
    photoUrls: string[];
    priceBreakdown: {
      grossPrice: {
        value: number;
        currency: string;
      };
      strikethroughPrice?: {
        value: number;
        currency: string;
      };
      excludedPrice?: {
        value: number;
        currency: string;
      };
      benefitBadges?: Array<{
        text: string;
        explanation: string;
      }>;
    };
  };
}

export async function searchHotelByDestination(query: string): Promise<HotelSearchResult[]> {

  const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchDestination?query=${encodeURIComponent(query)}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY_BOOKING!,
      'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_HOST_BOOKING!
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("SearchByDestinationResponse", result);

    if (result.status && result.data) {
      return result.data.map((item: any) => ({
        dest_id: item.dest_id,
        latitude: item.latitude,
        longitude: item.longitude,
        name: item.name,
        city_name: item.city_name,
        country: item.country
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching hotel by destination:', error);
    throw error;
  }
}

export async function searchHotels(
  dest_id: string,
  search_type: string = "hotel",
  arrival_date: string = new Date(Date.now() + 86400000).toISOString().split('T')[0],
  departure_date: string = new Date(Date.now() + 86400000 + 86400000).toISOString().split('T')[0],
): Promise<HotelDetailsResult[]> {

  console.log("DEST_ID", dest_id);
  console.log("SEARCH_TYPE", search_type);
  console.log("ARRIVAL_DATE", arrival_date);
  console.log("DEPARTURE_DATE", departure_date);


  const url = `https://booking-com15.p.rapidapi.com/api/v1/hotels/searchHotels?dest_id=${dest_id}&search_type=${search_type}&arrival_date=${arrival_date}&departure_date=${departure_date}&units=metric&temperature_unit=c`

  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': process.env.NEXT_PUBLIC_RAPID_API_KEY_BOOKING!,
      'x-rapidapi-host': process.env.NEXT_PUBLIC_RAPID_HOST_BOOKING!
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("SearchHotelsResponse", result);

    if (result.status && result.data && result.data.hotels) {
      return result.data.hotels.map((hotel: any) => ({
        hotel_id: hotel.hotel_id,
        accessibilityLabel: hotel.accessibilityLabel,
        property: {
          name: hotel.property.name,
          reviewScore: hotel.property.reviewScore,
          reviewScoreWord: hotel.property.reviewScoreWord,
          reviewCount: hotel.property.reviewCount,
          latitude: hotel.property.latitude,
          longitude: hotel.property.longitude,
          mainPhotoId: hotel.property.mainPhotoId,
          photoUrls: hotel.property.photoUrls,
          priceBreakdown: {
            grossPrice: hotel.property.priceBreakdown.grossPrice,
            strikethroughPrice: hotel.property.priceBreakdown.strikethroughPrice,
            excludedPrice: hotel.property.priceBreakdown.excludedPrice,
            benefitBadges: hotel.property.priceBreakdown.benefitBadges
          }
        }
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching hotels:', error);
    throw error;
  }
}

export async function getHotelDetails(hotelName: string): Promise<HotelDetails | null> {
  try {
    // First search for the destination to get dest_id
    const filteredHotelName = hotelName.includes("or similar") ? hotelName.split("or similar")[0] : hotelName;
    const searchResults = await searchHotelByDestination(filteredHotelName);
    if (searchResults.length === 0) return null;

    // Use the dest_id to search for hotels
    const { dest_id, city_name, country } = searchResults[0];
    const hotels = await searchHotels(filteredHotelName, dest_id);

    // Find the exact hotel by name
    const hotel = hotels.find(h => h.property.name.toLowerCase() === filteredHotelName.toLowerCase());
    if (!hotel) return null;

    // Convert to HotelDetails format
    return {
      city: city_name,
      stay: 1, // Default to 1 night
      address: `${city_name}, ${country}`,
      name: hotel.property.name,
      facilityHighlight: [], // No facility highlights from the API
      photo: [{
        id: 1,
        photoUri: hotel.property.photoUrls[0] || '',
        ranking: 1,
        thumbnailUri: hotel.property.photoUrls[0] || ''
      }],
      latitude: hotel.property.latitude,
      longitude: hotel.property.longitude
    };
  } catch (error) {
    console.error('Error getting hotel details:', error);
    throw error;
  }
}