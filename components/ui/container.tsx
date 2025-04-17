"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
    const pathname = usePathname();

    const onListingsPage = pathname.includes("/listings/");

    return (
        <div
            className={cn(
                "container px-4 md:px-8",
                className,
                onListingsPage && "max-w-[1120px]"
            )}
        >
            {children}
        </div>
    );
};

export default Container;
