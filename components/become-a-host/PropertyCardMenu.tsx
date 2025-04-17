import {
  FaEllipsisVertical,
  FaRegCopy,
  FaRegPenToSquare,
  FaRegEye,
  FaRegCircleCheck,
} from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ListingStatus } from "@prisma/client";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import copyToClipboard from "@/lib/copyToClipboard";
import { showError } from "@/util/catchError";
import { publishPropertyHost } from "@/util/routes";
import UnpublishProperty from "@/components/become-a-host/UnpublishProperty";
import { canUserPublish } from "@/lib/actions/canUserPublish";

interface Props {
  propertyId: string;
  status: ListingStatus;
}

const PropertyCardMenu = ({ propertyId, status }: Props) => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [puiblishVisible, setPublishVisible] = useState(false);

  const link = `${window.location.host}/${user?.username}?listing=${propertyId}`;

  const copyLink = useCallback(async () => {
    copyToClipboard({ link });
  }, [link]);

  const publishProperty = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.post(publishPropertyHost, {
        propertyId,
      });

      const { message } = res.data;

      router.refresh();

      toast({ title: message });
    } catch (error) {
      showError(error);
    } finally {
      setLoading(false);
    }
  }, [propertyId, router]);

  const navigateToEditView = () => {
    router.push(`/become-a-host/property-type?id=${propertyId}`);
  };

  const navigateToPreview = () => {
    router.push(`/listings/${propertyId}`);
  };

  useEffect(() => {
    checkPublish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkPublish = async () => {
    const isVisible = await canUserPublish(propertyId);
    setPublishVisible(isVisible);
  };

  return (
    <>
      <Menubar className="border-none ring-0 h-fit">
        <MenubarMenu>
          <MenubarTrigger asChild className="p-1 cursor-pointer rounded-full">
            <span>
              {isLoading ? (
                <BeatLoader size={8} />
              ) : (
                <FaEllipsisVertical size="18" className="text-primary" />
              )}
            </span>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={copyLink}>
              <p className="w-full flex gap-3 items-center">
                <FaRegCopy size={16} /> Copy link
              </p>
            </MenubarItem>
            <MenubarItem onClick={navigateToEditView}>
              <p className="w-full flex gap-3 items-center">
                <FaRegPenToSquare size={16} /> Edit
              </p>
            </MenubarItem>
            <MenubarItem onClick={navigateToPreview}>
              <p className="w-full flex gap-3 items-center">
                <FaRegEye size={16} /> Preview
              </p>
            </MenubarItem>
            {puiblishVisible && (
              <MenubarItem onClick={navigateToEditView}>
                <p className="w-full flex gap-3 items-center">
                  <FaRegCircleCheck size={16} /> Publish
                </p>
              </MenubarItem>
            )}
            {status === ListingStatus.published && (
              <UnpublishProperty propertyId={propertyId} />
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </>
  );
};

export default PropertyCardMenu;
