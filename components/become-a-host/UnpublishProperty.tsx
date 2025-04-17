"use client";
import { MouseEvent, useState } from "react";
import { FaRegEyeSlash } from "react-icons/fa6";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MenubarItem } from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { showError } from "@/util/catchError";
import { toast } from "@/components/ui/use-toast";
import { unpublishListingAction } from "@/lib/actions/unpublishListingAction";

interface Props {
  propertyId: string;
}

const UnpublishProperty = ({ propertyId }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onMenuItemClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const unpublishListing = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    const { message, error } = await unpublishListingAction(propertyId);

    router.refresh();
    setLoading(false);

    if (error) return showError({ message });

    toast({ title: message, duration: 3000 });

    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <MenubarItem onClick={onMenuItemClick}>
          <p className="w-full flex gap-3 items-center">
            <FaRegEyeSlash size={16} /> Unpublish
          </p>
        </MenubarItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will un-publish your property and make it unavailable for
            booking.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              loading={loading}
              disabled={loading}
              onClick={unpublishListing}
            >
              Yes, I am sure!
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnpublishProperty;
