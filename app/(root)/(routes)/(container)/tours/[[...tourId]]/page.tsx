import { Metadata } from 'next'
import { cache } from 'react'

import getPackage from '@/lib/actions/getPackageById'
import PackageHead from '@/components/tours/PackageHead'
import PackageInfo from '@/components/tours/PackageInfo'
import PackageReservationWrapper from '@/components/tours/PackageReservationWrapper'
import PackageInfoDetails from '@/components/tours/PackageInfoDetails'
import ToursHome from '@/components/tours/ToursHome'
import { getTours } from '@/lib/actions/getListings'
import { SafePackage } from '@/util/types'
import prismadb from '@/lib/prismadb'
import TravelGuide from '@/components/tours/TravelGuide'
import RecommendedAirbnbs from '@/components/tours/RecommendedAirbnbs'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    tourId: string[]
  }>
}

const getPackageCache = cache(async (identifier: string) => {
  if (!identifier)
    return {
      id: '',
      name: 'Tour',
      duration: 'Packages',
      accommodationImages: [{ urls: ['https://brutalyhonest.ai/images/meta.jpg'] }],
      subtitle: '',
      accommodationStar: [],
      accommodationLocation: [],
      accommodationName: [],
      bookingScore: [],
      bookingPropertyUrl: [],
      daysSpent: 0,
      groupSizeMin: 0,
      groupSizeMax: 0,
      inclusions: [],
      exclusions: [],
      activities: [],
      activityDaySequence: [],
      itinerary: '',
      natureOfTravel: '',
      difficultyLevel: 0,
      costPrice: { inr: '0', usd: '0' },
      sellingPrice: { inr: '0', usd: '0' },
      startDate: new Date(),
      endDate: new Date(),
      citiesTraveling: [],
      guidesTips: '',
      dayActivities: [],
      hotelDetails: [],
      tourReservation: [],
      videoUrl: '',
      summary: '',
      isLive: false,
    }

  return await getPackage(identifier)
})

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const currentParams = await params

  const identifier = currentParams.tourId ? currentParams.tourId[0] : ''

  const {
    name,
    duration,
    accommodationImages,
    subtitle: description,
  } = await getPackageCache(identifier)

  const title = `${name} - ${duration}`

  const images = accommodationImages[0].urls

  return {
    title,
    metadataBase: new URL(`${process.env.META_URL}/tours/${encodeURIComponent(name)}`),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'BrutalyHonest',
      url: `${process.env.META_URL}/tours/${encodeURIComponent(name)}`,
      images: {
        url: 'https://brutalyhonest.ai/images/meta.jpg',
        alt: 'BrutalyHonest',
      },
    },
    twitter: {
      card: 'summary_large_image',
      images,
      site: '@brutalyhonest',
      title,
      description,
    },
  }
}

export async function generateStaticParams() {
  const packages = await prismadb.tourPackage.findMany({
    select: {
      name: true,
    },
  })

  return packages.map((pkg) => ({
    tourId: [encodeURIComponent(pkg.name)],
  }))
}

const PackageDetails = async ({ params }: PageProps) => {
  const currentParams = await params

  if (!currentParams.tourId)
    return <ToursHome packages={(await getTours({})) as SafePackage[]} />

  const _package = await getPackageCache(currentParams.tourId[0])

  return (
    <section className="flex w-full flex-col  gap-6 relative mb-6">
      <PackageHead {..._package} />

      <div className="md:gap-10 px-4 grid grid-cols-1 md:grid-cols-7">
        <div className="col-span-5 flex flex-col">
          <PackageInfo {..._package} />
          <PackageInfoDetails
            className="max-md:hidden mt-6"
            summary={_package.subtitle}
            guidesTips={_package.itinerary}
          />
        </div>

        <div className="order-last md:order-last md:col-span-2 mb-10">
          <PackageReservationWrapper
            {..._package}
            tourId={currentParams.tourId[0]}
          />
        </div>
      </div>
      <PackageInfoDetails
        className="md:hidden px-4"
        summary={_package.subtitle}
        guidesTips={_package.itinerary}
      />

      <TravelGuide tourId={currentParams} />

      <RecommendedAirbnbs cities={_package.citiesTraveling} />
    </section>
  )
}

export default PackageDetails
