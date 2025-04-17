"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { HomeView } from "@/util/AppContext";

const cookieName = "view";

export const setViewCookie = async (view: HomeView) => {
    try {
        const cookieStore = await cookies();
        cookieStore.set(cookieName, view, { secure: true, sameSite: "strict" });

        revalidatePath("/");
    } catch (error) {}
};
