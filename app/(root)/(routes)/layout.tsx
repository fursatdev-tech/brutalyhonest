import Navbar from "@/components/navbar/Navbar";
import HomeWrapper from "@/components/common/HomeWrapper";
import ClientLayout from "@/components/layout/ClientLayout";

type RootProps = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: RootProps) => {
  return (
    <main className="min-h-[calc(100dvh-4.9rem)]">
      <ClientLayout>
        <Navbar />
      </ClientLayout>
      <HomeWrapper>{children}</HomeWrapper>
    </main>
  );
};

export default RootLayout;
