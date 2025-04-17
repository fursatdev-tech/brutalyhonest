import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

import { MenubarItem, MenubarSeparator } from "@/components/ui/menubar";
import { hostMenuItems, menuItems } from "./data";
import { AppContext } from "@/util/AppContext";
import { Menu } from "@/util/types";
import { cn } from "@/lib/utils";

const SignedInMenu = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data, setData } = useContext(AppContext);

    // const handlePostSignOut = () => {
    //     router.refresh();
    //     router.push("/");
    // };

    const switchRole = () => {
        setData((prev) => ({ ...prev, isHost: !prev.isHost }));

        const url = data?.isHost ? "/" : "/hosting";

        router.push(url);
    };

    const menu: Menu[] = data?.isHost ? hostMenuItems : menuItems;

    return (
        <SignedIn>
            {menu.map((item, index) => (
                <MenubarItem key={index} asChild>
                    <Link
                        href={item.link}
                        className={cn(
                            "w-full cursor-pointer",
                            pathname === item.link && "font-bold"
                        )}
                    >
                        {pathname === item.link && <>&#x2022;</>} {item.name}
                    </Link>
                </MenubarItem>
            ))}
            <MenubarSeparator />
            <MenubarItem onClick={switchRole}>
                <div className="w-full cursor-pointer">
                    Switch to {data?.isHost ? "travelling" : "hosting"}
                </div>
            </MenubarItem>
            <MenubarItem>
                <SignOutButton>
                    <span className="w-full cursor-pointer">Logout</span>
                </SignOutButton>
            </MenubarItem>
        </SignedIn>
    );
};

export default SignedInMenu;
