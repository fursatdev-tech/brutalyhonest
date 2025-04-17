import { currentUser } from "@clerk/nextjs/server";
import { Amenity, ListingStatus, Price, User } from "@prisma/client";
import axios from "axios";
import { NextResponse } from "next/server";

interface RawBody {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    bedrooms: number;
    baths: number;
    guests: number;
    beds: number;
    images: string[];
    listingLat: number;
    listingLng: number;
    location: string;
    propertyType: string;
    roomType: string;
    allowsChildren: boolean;
    allowsInfants: boolean;
    allowsPets: boolean;
    minNights: number;
    maxNights: number;
    valueRating: number;
    locationRating: number;
    communicationRating: number;
    checkinRating: number;
    accuracyRating: number;
    cleanlinessRating: number;
    guestSatisfactionOverall: number;
    originalPrice: Price;
    b2bPrice: Price;
    pgOriginalPrice: Price;
    pgB2bPrice: Price;
    perGuestPricing: boolean;
    cancellationPolicyId: string;
    hostName: string;
    hostEmail: string;
    hostPhone: string;
    hostProfilePhotoUrl: string;
    isSuperhost: boolean;
    amenities: Amenity[];
    allowFreeStay: boolean;
}

import { MODE_URL } from "@/util/constants";
import prismadb from "@/lib/prismadb";
import {
    createListingAssistant,
    hostOnboarding,
    listingCreated,
} from "@/util/routes";
import { getConvertedPricePG } from "@/lib/actions/getConvertedPrice";

export async function POST(request: Request) {
    const user = await currentUser();

    try {
        if (!user) return NextResponse.json("Unauthorized", { status: 401 });

        const body: RawBody = await request.json();

        let {
            id,
            title,
            description,
            listingLat,
            listingLng,
            location,
            hostName,
            hostEmail,
            hostPhone,
            hostProfilePhotoUrl,
            isSuperhost,
            amenities,
        } = body;

        amenities = id
            ? []
            : amenities.map(({ title, amenities }: Amenity) => {
                  return {
                      title,
                      amenities,
                  };
              });

        hostEmail = hostEmail?.toLocaleLowerCase().trim();

        const foundUser = await prismadb.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!foundUser)
            return NextResponse.json("User not found", { status: 401 });

        const host = await getOrCreateHost(
            hostName,
            hostProfilePhotoUrl,
            hostEmail,
            hostPhone,
            isSuperhost
        );

        let coHost = null;

        const isCoHostPostingProperty = foundUser.email !== hostEmail;

        if (isCoHostPostingProperty)
            coHost = await getOrCreateCoHost(user.id, foundUser);

        const listing = await createOrUpdateListing(
            { ...body, amenities },
            host,
            user.id,
            isCoHostPostingProperty
        );

        const listingId = listing.id;

        await createOrUpdateGpt(
            amenities,
            listingId,
            title,
            listingLat,
            listingLng,
            description,
            location,
            id ? true : false
        );

        if (id)
            return NextResponse.json({
                message: "Listing updated. Redirecting ...",
            });

        if (coHost)
            await prismadb.listingCohost.create({
                data: {
                    listingId,
                    hostId: coHost.id,
                },
            });

        if (coHost)
            await axios.post(`${MODE_URL}${hostOnboarding}`, {
                cohostName: foundUser.name,
                hostName,
                hostEmail,
                listingName: title,
                listingId,
            });

        await axios.post(`${MODE_URL}${listingCreated}`, {
            name: foundUser.name,
            email: foundUser.email,
            listingName: title,
            listingId,
        });

        return NextResponse.json({ message: "Listing created" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: `${error}` }, { status: 500 });
    }
}

const getOrCreateCoHost = async (clerkId: string, foundUser: User) => {
    let coHost = await prismadb.host.findUnique({
        where: { userId: clerkId },
        select: { id: true },
    });

    if (coHost) return coHost;

    return await prismadb.host.create({
        data: {
            userId: clerkId,
            name: foundUser.name || "Co-host",
            profilePhotoUrl: foundUser.image,
            hostEmail: foundUser.email!,
            hostPhone: foundUser.phoneNumber!,
        },
    });
};

const getOrCreateHost = async (
    hostName: string,
    hostProfilePhotoUrl: string,
    hostEmail: string,
    hostPhone: string,
    isSuperhost: boolean
) => {
    const host = await prismadb.host.findUnique({
        where: { hostEmail },
        select: { id: true },
    });

    if (host) return host;

    const existingUser = await prismadb.user.findUnique({
        where: { email: hostEmail },
        select: { clerkId: true },
    });

    return await prismadb.host.create({
        data: {
            name: hostName,
            profilePhotoUrl: hostProfilePhotoUrl,
            hostEmail,
            hostPhone,
            isSuperhost,
            ...(existingUser && { userId: existingUser.clerkId }),
        },
    });
};

const createOrUpdateGpt = async (
    amenities: Amenity[],
    listingId: string,
    title: string,
    listingLat: number,
    listingLng: number,
    description: string,
    location: string,
    isEditing: boolean = false
) => {
    const gptAmenities = amenities.flatMap((amenity: Amenity) =>
        amenity.amenities
            .filter((detail) => detail.available)
            .map((detail) => detail.title)
    );

    await axios.post(`${MODE_URL}${createListingAssistant}`, {
        listingId,
        propertyName: title,
        location,
        country: "India",
        listingLat,
        listingLng,
        description,
        amenities: gptAmenities,
        checkInTime: "1:00 PM",
        checkOutTime: "11:00 AM",
        isEditing,
    });
};

const createOrUpdateListing = async (
    {
        id,
        title,
        description,
        imageUrl,
        category,
        bedrooms,
        baths,
        guests,
        beds,
        images,
        listingLat,
        listingLng,
        location,
        propertyType,
        roomType,
        allowsChildren,
        allowsInfants,
        allowsPets,
        minNights,
        maxNights,
        valueRating,
        locationRating,
        communicationRating,
        checkinRating,
        accuracyRating,
        cleanlinessRating,
        guestSatisfactionOverall,
        originalPrice,
        b2bPrice,
        pgOriginalPrice,
        pgB2bPrice,
        perGuestPricing,
        cancellationPolicyId,
        hostName,
        amenities,
        hostPhone,
        allowFreeStay,
    }: RawBody,
    host: { id: string },
    clerkId: string,
    isCoHostPostingProperty: boolean = false
) => {
    originalPrice = {
        ...originalPrice,
        usd: (await getConvertedPricePG(originalPrice.inr)).toString(),
    };

    b2bPrice = {
        ...b2bPrice,
        usd: (await getConvertedPricePG(b2bPrice.inr)).toString(),
    };

    if (pgOriginalPrice)
        pgOriginalPrice = {
            ...pgOriginalPrice,
            usd: (await getConvertedPricePG(pgOriginalPrice.inr)).toString(),
        };

    if (pgB2bPrice)
        pgB2bPrice = {
            ...pgB2bPrice,
            usd: (await getConvertedPricePG(pgB2bPrice.inr)).toString(),
        };

    if (id)
        return await prismadb.listing.update({
            where: { id },
            data: {
                imageUrl,
                title,
                description,
                location,
                images,
                bedrooms,
                baths,
                guests,
                beds,
                listingLat,
                listingLng,
                originalPrice,
                b2bPrice,
                pgOriginalPrice,
                pgB2bPrice,
                perGuestPricing,
                allowFreeStay,
                cancellationPolicy: {
                    connect: {
                        id: cancellationPolicyId,
                    },
                },
                host: {
                    update: {
                        name: hostName,
                        hostPhone,
                    },
                },
                category: {
                    connect: {
                        id: category,
                    },
                },
                status: isCoHostPostingProperty
                    ? ListingStatus.draft
                    : ListingStatus.published,
            },
        });

    return await prismadb.listing.create({
        data: {
            title,
            description,
            imageUrl,
            bedrooms,
            baths,
            guests,
            beds,
            images,
            listingLat,
            listingLng,
            location,
            propertyType,
            roomType,
            allowsChildren: allowsChildren ?? true,
            allowsInfants: allowsInfants ?? true,
            allowsPets: allowsPets ?? true,
            minNights,
            maxNights,
            valueRating,
            locationRating,
            communicationRating,
            checkinRating,
            accuracyRating,
            cleanlinessRating,
            guestSatisfactionOverall,
            originalPrice,
            b2bPrice,
            pgOriginalPrice,
            pgB2bPrice,
            perGuestPricing,
            amenities,
            user: {
                connect: {
                    clerkId,
                },
            },
            host: {
                connect: {
                    id: host.id,
                },
            },
            category: {
                connect: {
                    id: category,
                },
            },
            cancellationPolicy: {
                connect: {
                    id: cancellationPolicyId,
                },
            },
            ...(!isCoHostPostingProperty && {
                status: ListingStatus.published,
            }),
        },
    });
};
