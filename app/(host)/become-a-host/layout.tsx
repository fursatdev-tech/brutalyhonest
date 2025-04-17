import { Metadata } from "next";

import Logo from "@/components/navbar/Logo";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Become a host",
  description: "Earn by Sharing Your Favorite Stays!",
};

const HostLayout = ({ children }: Props) => {
  return (
    <>
      <div className="p-6">
        <Logo />
      </div>

      {children}
    </>
  );
};

export default HostLayout;
