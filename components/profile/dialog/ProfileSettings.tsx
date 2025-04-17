import { UserProfile } from "@clerk/nextjs";
import { IoClose } from "react-icons/io5";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

const ProfileSettings = ({ children }: Props) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerDescription className="max-h-[80vh] mx-auto overflow-y-auto">
            <UserProfile />
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose className="absolute top-6 right-6">
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-destructive"
            >
              <IoClose className="h-6 w-6" />
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProfileSettings;
