"use client";

import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";
import ImageGallery from "react-image-gallery";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";

import "react-image-gallery/styles/css/image-gallery.css";

interface Props {
    images: string[];
}

const SingleImageGallery = ({ images }: Props) => {
    const [idx, setIdx] = useQueryState("idx", parseAsInteger.withDefault(0));

    const [gallerySingle, setGallerySingle] = useQueryState(
        "gallery-single",
        parseAsBoolean.withDefault(false)
    );

    const modifiedImages = images.map((image) => ({
        original: image,
    }));

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [gallerySingle]);

    return (
        <Dialog open={gallerySingle} onOpenChange={setGallerySingle}>
            <DialogTrigger></DialogTrigger>
            <DialogContent
                className="bg-foreground w-screen min-w-full max-w-screen h-screen min-h-screen"
                hideClose
            >
                <DialogHeader className="text-background">
                    <IoClose
                        size={40}
                        className="ml-auto p-2 cursor-pointer"
                        onClick={() => setGallerySingle(false)}
                    />
                </DialogHeader>

                {modifiedImages && (
                    <ImageGallery
                        items={modifiedImages}
                        showThumbnails={false}
                        lazyLoad={true}
                        startIndex={idx}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default SingleImageGallery;
