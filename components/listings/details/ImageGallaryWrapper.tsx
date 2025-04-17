"use client";
import { parseAsBoolean, parseAsInteger, useQueryStates } from "nuqs";

import { cn } from "@/lib/utils";

interface Props {
    idx: number;
    children: React.ReactNode;
    images: string[];
}

const ImageGallaryWrapper = ({ idx, children, images }: Props) => {
    const [showDialog, setShowDialog] = useQueryStates({
        idx: parseAsInteger,
        "gallery-single": parseAsBoolean,
    });

    const onImageClick = () => {
        setShowDialog({ idx, "gallery-single": true });
    };

    return (
        <>
            <div
                key={idx}
                onClick={onImageClick}
                className={cn(
                    "w-full h-96 relative mx-auto cursor-pointer",
                    idx % 3 !== 0 && "h-48 w-[calc(50%-0.5rem)]"
                )}
            >
                {children}
            </div>
        </>
    );
};

export default ImageGallaryWrapper;
