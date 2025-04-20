import { DayActivity, HotelDetails, PackageActivity } from '@prisma/client'
import Image from 'next/image'
import { GiCheckMark, GiCrossMark } from 'react-icons/gi'
import { IoAirplaneOutline, IoLocationOutline } from 'react-icons/io5'
import { LuPlaneTakeoff } from 'react-icons/lu'

import ReactStarsWrapper from '@/components/tours/ReactStarsWrapper'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import HotelDetailCard from './HotelDetailCard'

interface Props {
  dayActivities: DayActivity[]
  inclusions: string[]
  exclusions: string[]
  hotelDetails: HotelDetails[]
  bookingScore: number[]
  accommodationStar: number[]
}

export default function PackageInfo({
  dayActivities,
  inclusions,
  exclusions,
  hotelDetails,
  bookingScore,
  accommodationStar,
}: Props) {
  const groupByCity = () => {
    let cityGroup: DayActivity[][] = []

    dayActivities.forEach((dayActivity, index) => {
      if (index == 0 || index == dayActivities.length - 1)
        cityGroup.push([dayActivity])
      else if (
        dayActivity.accomodationCity ==
        dayActivities[index - 1].accomodationCity
      )
        cityGroup[cityGroup.length - 1].push(dayActivity)
      else cityGroup.push([dayActivity])
    })

    return cityGroup
  }

  // const groupedByCity = dayActivities.reduce((acc, curr) => {
  //   const { accomodationCity } = curr;
  //   if (!acc[accomodationCity]) {
  //     acc[accomodationCity] = [];
  //   }
  //   acc[accomodationCity].push(curr);
  //   return acc;
  // }, {} as { [city: string]: DayActivity[] });

  const groupedByCity = groupByCity()

  const Event = ({
    time,
    events,
  }: {
    time: string
    events: PackageActivity[]
  }) => {
    return (
      <div className="col-span-3 flex gap-2 flex-col md:col-span-1">
        {/* <p className="uppercase font-bold text-muted-foreground text-xs italic">
          {time}
        </p> */}
        {!!events.length ? (
          events.map((evt) => (
            <div key={evt.time} className="space-y-2">
              <p className="text-sm font-base">{evt.time}</p>
              {/* <p className="text-xs text-muted-foreground">{evt.description}</p> */}
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">At Leisure</p>
        )}
      </div>
    )
  }

  const InclusionExclusion = ({
    title,
    data,
  }: {
    title: string
    data: string[]
  }) => {
    return (
      <div className=" space-y-3 p-6 col-span-2 md:col-span-1 ">
        <p className="font-bold text-xs">{title}</p>

        {data.map((item, index) => (
          <p
            key={item + index}
            className="text-muted-foreground text-sm flex gap-3 items-center"
          >
            {title === 'Inclusions' ? (
              <GiCheckMark className="text-green-500" />
            ) : (
              <GiCrossMark className="text-red-500" />
            )}
            {item}
          </p>
        ))}
      </div>
    )
  }

  const lastIndex = Object.entries(groupedByCity).length - 1

  return (
    <>
      {Object.entries(groupedByCity).map(([, activities], index) =>
        index !== lastIndex ? (
          <>
            <div
              key={activities?.[0]?.accomodationCity + Math.random()}
              className="border shadow-sm p-3 rounded-xl "
            >
              <div className="px-3 pt-2 rounded-t-xl">
                <h4 className="text-2xl">
                  {activities?.[0]?.accomodationCity || 'NA'}

                  <span className="ml-3 font-normal text-sm text-muted-foreground">
                    {activities.length} Nights Stay
                  </span>
                </h4>
              </div>

              <div className="md:divide-y-2 ">
                {activities.map((activity) => {
                  return (
                    <div
                      key={activity.day}
                      className="grid grid-cols-3 md:grid-cols-4 px-3 pt-3 gap-2 "
                    >
                      <h5 className="uppercase  md:flex-col  max-md:items-center max-md:justify-between  flex gap-2 px-2 justify-start max-md:border-b-2 text-muted-foreground py-1 pt-3 col-span-3 md:col-span-1 ">
                        <span>
                          Day {activity.day < 9 && 0}
                          {activity.day + 1}
                        </span>

                          <HotelDetailCard activity={activity} hotelDetails={hotelDetails}/>

                      </h5>

                      <div className="col-span-3 grid md:grid-cols-3 w-full gap-2 p-2">
                        <Event time="morning" events={activity.morning} />
                        <Event time="afternoon" events={activity.afternoon} />
                        <Event time="evening" events={activity.evening} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mx-auto relative">
              <div className="bg-[url('/images/image.png')] bg-cover bg-center w-[350px] bg-gray-50 h-[100px] before:content-[''] before:w-4 before:h-4 before:bg-muted-foreground before:absolute before:rounded-full before:ml-[13px] before:-mt-2 after:content-[''] after:w-4 after:h-4 after:bg-muted-foreground after:absolute after:rounded-full after:mr-[12px] after:-mb-2 after:bottom-0 after:right-0" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="text-primary-foreground bg-muted-foreground rounded-full p-1 w-fit mx-auto">
                  <IoAirplaneOutline />
                </div>
                <p className="text-xs italic font-semibold whitespace-nowrap">
                  Travel to{' '}
                  {groupedByCity?.[index + 1]?.[0]?.accomodationCity || 'Home'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div
            key={activities?.[0]?.accomodationCity + Math.random()}
            className="border  shadow-sm rounded-xl p-2 text-center flex justify-center items-center space-x-3 text-muted-foreground"
          >
            <LuPlaneTakeoff size={18} />
            <p className="text-sm font-semibold">Flight Departure</p>
          </div>
        )
      )}

      <div className="space-y-6 mt-6">
        {hotelDetails.map((hotel, index) => {
          return (
            <div
              className="border shadow-sm rounded-xl grid grid-cols-3"
              key={hotel.name}
            >
              <div className="col-span-3 bg-slate-50 rounded-t-xl px-4 py-3">
                <h4 className="font-semibold">
                  {hotel.stay}N @ {hotel.name}
                </h4>
                <p className="text-muted-foreground text-xs md:text-sm flex items-center gap-1">
                  <IoLocationOutline size={16} />
                  <span>{hotel.address}</span>
                </p>
              </div>

              <div className="col-span-3 md:col-span-1">
                <Carousel className="group">
                  <CarouselContent>
                    {hotel.photo.map((image) => {
                      return (
                        <CarouselItem
                          key={image.id}
                          className="relative w-full h-60 "
                        >
                          <Image
                            src={`${image.photoUri}`}
                            fill
                            alt="Property Image"
                          />
                        </CarouselItem>
                      )
                    })}
                  </CarouselContent>
                  <CarouselPrevious className="ml-14 hidden group-hover:flex transition" />
                  <CarouselNext className="mr-14 hidden group-hover:flex transition" />
                </Carousel>
              </div>

              <div className="col-span-3 md:col-span-2 px-4 py-3 grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-2 space-y-3">
                  <p className="text-muted-foreground text-xs font-semibold">
                    ROOM DETAILS:
                  </p>

                  <div className="grid grid-cols-2 gap-2">
                    {hotel.facilityHighlight.map((facility) => (
                      <p
                        key={facility.id}
                        className="text-muted-foreground text-sm flex gap-3 items-center"
                      >
                        <GiCheckMark className="text-green-500" />
                        {facility.title}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="col-span-3 md:col-span-1 order-first md:order-last text-center mx-auto flex gap-6 items-center md:block md:space-y-4">
                  <div>
                    {!!accommodationStar[index] ? (
                      <ReactStarsWrapper score={accommodationStar[index]} />
                    ) : (
                      <p className="text-sm">NA</p>
                    )}
                    <p className="text-muted-foreground text-xs font-light">
                      Star Category
                    </p>
                  </div>

                  <div>
                    <p className="font-bold">{bookingScore[index] || 'NA'}</p>
                    <p className="text-muted-foreground text-xs font-light">
                      On Booking.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="border shadow-sm rounded-xl grid grid-cols-2">
          <InclusionExclusion title="Inclusions" data={inclusions} />
          <InclusionExclusion title="Exclusions" data={exclusions} />
        </div>
      </div>
    </>
  )
}
