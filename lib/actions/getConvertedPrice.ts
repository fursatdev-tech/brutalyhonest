"use server";

import { cookies } from "next/headers";

const cookieName = process.env.CURRENCY_COOKIE_NAME || "currency";

const url = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/USD/INR`;

export const getConvertedPrice = async (
    __price: number | string,
    roundOff: boolean
) => {
    const price = typeof __price === "string" ? parseInt(__price) : __price;

    const cookiesList = await cookies();

    const foundCookie = cookiesList.get(cookieName);

    if (!foundCookie) return { price, symbol: "$" };

    if (foundCookie.value === "USD") return { price, symbol: "$" };

    const response = await fetch(url);

    const { conversion_rate } = await response.json();

    if (!conversion_rate) return { price, symbol: "$" };

    const convertedPrice = roundOff
        ? Math.round(price * conversion_rate)
        : price * conversion_rate;

    return { price: convertedPrice, symbol: "₹" };
};

export const getCookieVal = async () => {
    const cookiesList = await cookies();

    const foundCookie = cookiesList.get(cookieName);

    return foundCookie?.value?.toLowerCase() || "usd";
};

export const getConvertedPricePG = async (
    __price: number | string
): Promise<number> => {
    const price = typeof __price === "string" ? parseInt(__price) : __price;

    const response = await fetch(url);

    const { conversion_rate } = await response.json();

    if (!conversion_rate) return price;

    return parseFloat((price / conversion_rate).toFixed(2));
};
