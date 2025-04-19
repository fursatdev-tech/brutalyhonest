'use client'
import { searchHotelByDestination, searchHotels } from '@/services/hotelService'
import Loader2 from '@/util/Loader2'
import { DayActivity, HotelDetails } from '@prisma/client'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { IoClose, IoLocationOutline } from 'react-icons/io5'

interface Props {
  activity: DayActivity
  hotelDetails: HotelDetails[]
}

const HotelDetailCard = ({ activity, hotelDetails }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hotel, setHotel] = useState<HotelDetails | null>(null)
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
        facilityHighlight: [],
        photo: [{
          id: 1,
          photoUri: hotelResult.property.photoUrls[0] || '',
          ranking: 1,
          thumbnailUri: hotelResult.property.photoUrls[0] || ''
        }],
        latitude: hotelResult.property.latitude,
        longitude: hotelResult.property.longitude
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
                      <h3 className="text-2xl font-bold mb-4">{hotel.name}</h3>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <IoLocationOutline size={16} />
                            <span>{hotel.address}</span>
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2">Stay</h4>
                          <p className="text-muted-foreground">
                            {hotel.stay} night{hotel.stay > 1 ? 's' : ''}
                          </p>
                        </div>

                        {hotel.facilityHighlight &&
                          hotel.facilityHighlight.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Facilities</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {hotel.facilityHighlight.map((facility) => (
                                  <p
                                    key={facility.id}
                                    className="text-muted-foreground"
                                  >
                                    • {facility.title}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                        {hotel.photo && hotel.photo.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Photos</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {hotel.photo.map((photo) => (
                                <div
                                  key={photo.id}
                                  className="relative aspect-video"
                                >
                                  <Image
                                    src={photo.photoUri}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
