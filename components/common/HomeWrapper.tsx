"use client";
import { useContext } from "react";

import { cn } from "@/lib/utils";
import { AppContext, HomeView } from "@/util/AppContext";
import { usePathname } from "next/navigation";

interface Props {
    children: React.ReactNode;
}

export default function HomeWrapper({ children }: Props) {
    const { data } = useContext(AppContext);
    const pathname = usePathname();

    return (
        <section className={cn("mt-[50px]", pathname !== "/" && "mt-[20px]")}>
            {children}
        </section>
    );
}
