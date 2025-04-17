import { Metadata } from "next";

import Logo from "@/components/navbar/Logo";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Write a review",
  description: "Earn by Sharing Your Favorite Stays!",
};

const Layout = ({ children }: Props) => {
  return (
    <>
      <div className="px-6 py-3 shadow">
        <Logo />
      </div>

      <section className="mt-16">{children}</section>
    </>
  );
};

export default Layout;
