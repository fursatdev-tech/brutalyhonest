"use client";

import { AiOutlineMenu } from "react-icons/ai";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Menubar,
    MenubarContent,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar";
import SignedInMenu from "./SignedInMenu";
import SignedOutMenu from "./SignedOutMenu";
import { cn } from "@/lib/utils";
import { AppContext } from "@/util/AppContext";

interface Props {
    nolink?: boolean;
    isExistingHost?: boolean;
}

const UserMenu = ({ nolink = false, isExistingHost = false }: Props) => {
    const { setData } = useContext(AppContext);
    const router = useRouter();
    const { user } = useUser();
    const pathname = usePathname();

    const navigate = () => {
        const url = isExistingHost ? "/hosting" : "/become-a-host";

        setData((prev) => ({ ...prev, isHost: isExistingHost }));

        return router.push(url);
    };

    return (
        <div className="relative">
            <div className="flex flex-row items-center gap-3">
                {isExistingHost && (
                    <div
                        onClick={navigate}
                        className={cn(
                            "hidden text-sm font-semibold py-3 px-4 rounded-full hover:bg-muted-background transition cursor-pointer",
                            !nolink && "md:block"
                        )}
                    >
                        Switch to Hosting
                    </div>
                )}

                <Menubar className="flex items-center border-input bg-input shadow-sm hover:shadow-md border rounded-full h-12 transition">
                    <MenubarMenu>
                        <MenubarTrigger className="data-[state=open]:bg-transparent focus:bg-transparent cursor-pointer">
                            <AiOutlineMenu
                                className="text-secondary"
                                size={16}
                            />
                            <div className="md:block hidden ml-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage
                                        src={
                                            user?.imageUrl ||
                                            "images/placeholder.jpg"
                                        }
                                        alt="user"
                                    />
                                </Avatar>
                            </div>
                        </MenubarTrigger>
                        <MenubarContent align="end">
                            <SignedInMenu />
                            <SignedOutMenu />
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
            </div>
        </div>
    );
};

export default UserMenu;
