"use server";

import { cookies } from "next/headers";

import { CURRENCY_OPTIONS, ICurrencyOption } from "@/components/footer/data";

const cookieName = process.env.CURRENCY_COOKIE_NAME || "currency";

export async function setCurrencyCookie(
    __currency: string,
    considerOldCookie?: boolean
): Promise<ICurrencyOption> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(cookieName);

    if (considerOldCookie && cookie) return getCurrencyOptions(cookie.value);

    setCookie(__currency);
    return getCurrencyOptions(__currency);
}

export const getCurrencyOptions = async (currency: string) => {
    return (
        CURRENCY_OPTIONS.find((option) => option.currency.includes(currency)) ||
        CURRENCY_OPTIONS[0]
    );
};

const setCookie = async (value: string) => {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, value, { secure: true, sameSite: "strict" });
};

export async function getCurrencyCookie(
    val?: string
): Promise<ICurrencyOption> {
    if (val) return getCurrencyOptions(val);

    return CURRENCY_OPTIONS[0];
}
