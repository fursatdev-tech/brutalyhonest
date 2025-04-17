import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";

import { MenubarItem } from "@/components/ui/menubar";

const SignedOutMenu = () => {
  return (
    <SignedOut>
      <MenubarItem className="md:hidden">
        <SignInButton mode="modal">
          <span className="w-full cursor-pointer">Earn with BrutalyHonest</span>
        </SignInButton>
      </MenubarItem>
      <MenubarItem>
        <SignInButton mode="modal">
          <span className="w-full cursor-pointer">Login</span>
        </SignInButton>
      </MenubarItem>
      <MenubarItem>
        <SignUpButton mode="modal">
          <span className="w-full cursor-pointer">Sign up</span>
        </SignUpButton>
      </MenubarItem>
    </SignedOut>
  );
};

export default SignedOutMenu;
