'use client'
import { searchHotelByDestination, searchHotels } from '@/services/hotelService'
import Loader2 from '@/util/Loader2'
import { DayActivity, HotelDetails } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IoClose, IoLocationOutline, IoTimeOutline, IoBedOutline, IoStarOutline } from 'react-icons/io5'
import { GiCheckMark } from 'react-icons/gi'
import { TbBuildingSkyscraper } from 'react-icons/tb'
import { MdOutlinePolicy } from 'react-icons/md'

interface RoomType {
  name: string;
  maxOccupancy: number;
  bedTypes: string[];
  roomSize: string;
  amenities: string[];
}

interface HotelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
}

interface ExtendedHotelDetails extends HotelDetails {
  reviewScore?: number;
  reviewCount?: number;
  roomTypes?: RoomType[];
  policies?: HotelPolicies;
}

interface Props {
  activity: DayActivity
  hotelDetails: HotelDetails[]
}

const HotelDetailCard = ({ activity, hotelDetails }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hotel, setHotel] = useState<ExtendedHotelDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHotelDetails = async () => {
    if (!activity.hotel) return;

    setLoading(true)
    setError(null)

    try {
      const filteredHotelName = activity.hotel.includes("or similar")
        ? activity.hotel.split("or similar")[0].trim()
        : activity.hotel.trim()

      if (!filteredHotelName) {
        throw new Error('Invalid hotel name')
      }

      const destinationResults = await searchHotelByDestination(filteredHotelName)
      if (!destinationResults || destinationResults.length === 0) {
        throw new Error('No destination found for this hotel')
      }

      const { dest_id, city_name, country } = destinationResults[0]

      if (!dest_id) {
        throw new Error('Invalid destination ID')
      }

      const hotels = await searchHotels(
        dest_id,
        "hotel",
        new Date(Date.now() + 86400000).toISOString().split('T')[0],
        new Date(Date.now() + 86400000 + 86400000).toISOString().split('T')[0]
      )

      if (!hotels || hotels.length === 0) {
        throw new Error('No hotels found for this destination')
      }

      const hotelResult = hotels[0]

      if (!hotelResult || !hotelResult.property) {
        throw new Error('Invalid hotel data received')
      }

      setHotel({
        city: city_name,
        stay: 1,
        address: `${city_name}, ${country}`,
        name: hotelResult.property.name,
        facilityHighlight: hotelResult.property.facilities?.map(facility => ({
          id: Math.floor(Math.random() * 1000),
          level: 'standard',
          title: facility.name
        })) || [],
        photo: [{
          id: 1,
          photoUri: hotelResult.property.photoUrls[0] || '',
          ranking: 1,
          thumbnailUri: hotelResult.property.photoUrls[0] || ''
        }],
        latitude: hotelResult.property.latitude,
        longitude: hotelResult.property.longitude,
        reviewScore: hotelResult.property.reviewScore,
        reviewCount: hotelResult.property.reviewCount,
        roomTypes: hotelResult.property.roomTypes,
        policies: hotelResult.property.policies
      })
    } catch (error) {
      console.error('Error fetching hotel details:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred while fetching hotel details')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchHotelDetails()
    }
  }, [isOpen])

  return (
    <div className="flex items-start">
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs flex underline gap-1 items-center text-muted-foreground hover:text-primary transition-colors"
      >
        Hotel Details
        <ExternalLinkIcon className="h-3 w-3" />
      </button>

      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: 0.2,
              }}
              className="fixed inset-0 bg-background rounded-xl shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
                >
                  <IoClose size={24} />
                </button>

                <div className="h-full overflow-y-auto p-6">
                  {loading ? (
                    <div className="flex h-[50vh] justify-center items-center p-6">
                      <Loader2 />
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-red-500 mb-4">{error}</p>
                      <button
                        onClick={() => {
                          setError(null)
                          setLoading(true)
                          fetchHotelDetails()
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : hotel ? (
                    <div className="mx-auto max-w-3xl">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                        <div>
                          <h3 className="text-2xl font-bold">{hotel.name}</h3>
                          <p className="text-muted-foreground mt-1">{hotel.address}</p>
                        </div>
                        {hotel.reviewScore && (
                          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                            <IoStarOutline className="text-primary" size={20} />
                            <span className="font-bold">{hotel.reviewScore}</span>
                            <span className="text-muted-foreground text-sm">
                              ({hotel.reviewCount} reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <IoLocationOutline size={20} />
                              Location
                            </h4>
                            <p className="text-muted-foreground">
                              {hotel.address}
                            </p>
                          </div>

                          {hotel.roomTypes && hotel.roomTypes.length > 0 && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <IoBedOutline size={20} />
                                Room Types
                              </h4>
                              <div className="space-y-4">
                                {hotel.roomTypes.map((room, index) => (
                                  <div key={index} className="border rounded-lg p-4 bg-background">
                                    <h5 className="font-medium mb-2">{room.name}</h5>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                      <p className="flex items-center gap-1">
                                        <TbBuildingSkyscraper size={16} />
                                        {room.roomSize}
                                      </p>
                                      <p className="flex items-center gap-1">
                                        <IoBedOutline size={16} />
                                        {room.maxOccupancy} guests
                                      </p>
                                      {room.bedTypes && room.bedTypes.length > 0 && (
                                        <p className="col-span-2">Bed Types: {room.bedTypes.join(', ')}</p>
                                      )}
                                      {room.amenities && room.amenities.length > 0 && (
                                        <div className="col-span-2">
                                          <p className="font-medium mb-1">Amenities:</p>
                                          <div className="grid grid-cols-2 gap-1">
                                            {room.amenities.map((amenity, i) => (
                                              <p key={i} className="flex items-center gap-1 text-sm">
                                                <GiCheckMark className="text-green-500" />
                                                {amenity}
                                              </p>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {hotel.policies && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <MdOutlinePolicy size={20} />
                                Policies
                              </h4>
                              <div className="space-y-2 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                  <IoTimeOutline size={16} />
                                  Check-in: {hotel.policies.checkIn}
                                </p>
                                <p className="flex items-center gap-2">
                                  <IoTimeOutline size={16} />
                                  Check-out: {hotel.policies.checkOut}
                                </p>
                                <p className="flex items-center gap-2">
                                  <MdOutlinePolicy size={16} />
                                  Cancellation: {hotel.policies.cancellation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-6">
                          {hotel.facilityHighlight && hotel.facilityHighlight.length > 0 && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <TbBuildingSkyscraper size={20} />
                                Facilities
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {hotel.facilityHighlight.map((facility) => (
                                  <p
                                    key={facility.id}
                                    className="text-muted-foreground flex items-center gap-1 text-sm"
                                  >
                                    <GiCheckMark className="text-green-500" />
                                    {facility.title}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {hotel.photo && hotel.photo.length > 0 && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold mb-3">Photos</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {hotel.photo.map((photo) => (
                                  <div
                                    key={photo.id}
                                    className="relative aspect-video rounded-lg overflow-hidden"
                                  >
                                    <Image
                                      src={photo.photoUri}
                                      alt={hotel.name}
                                      fill
                                      className="object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No hotel details available
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HotelDetailCard
