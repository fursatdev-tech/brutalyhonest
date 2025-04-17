import { Metadata } from "next";

import PropertyByUser from "@/components/property-by-user/PropertyByUser";
import getHostByUsername from "@/lib/actions/getHostByUsername";

interface PageProps {
    params: Promise<{
        username: string;
    }>;
}

interface Props {
    params: Promise<{
        username?: string;
    }>;
    searchParams: Promise<{
        category?: string;
        listing?: string;
    }>;
}

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const username = (await params).username;

    const host = await getHostByUsername(username);

    let title = "Listings by host";

    if (!host)
        return {
            title,
            metadataBase: new URL(`${process.env.META_URL}}`),
            openGraph: {
                title,
            },
            twitter: {
                card: "summary_large_image",
                site: "@brutalyhonest",
                title,
            },
        };

    let { name, description, profilePhotoUrl: imageUrl } = host;

    title = `Listings by ${name}`;

    if (!description) description = "All listed properties";

    if (!imageUrl) imageUrl = "/public/images/logo.png";

    return {
        title,
        metadataBase: new URL(`${process.env.META_URL}/${username}`),
        openGraph: {
            title,
            description,
            type: "website",
            siteName: "BrutalyHonest",
            url: `${process.env.META_URL}/${username}`,
            images: {
                url: "https://brutalyhonest.ai/images/meta.jpg",
                alt: "BrutalyHonest",
            },
        },
        twitter: {
            card: "summary_large_image",
            images: [imageUrl],
            site: "@brutalyhonest",
            title,
            description,
        },
    };
}

const HostProperties = async ({ searchParams, params }: Props) => {
    return <PropertyByUser {...await searchParams} {...await params} />;
};

export default HostProperties;
