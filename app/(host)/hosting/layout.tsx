import HostAccountValidator from "@/components/navbar/HostAccountValidator";
import HostNavBar from "@/components/navbar/HostNavbar";
import { getHostStripeAccount } from "@/lib/actions/getHostStripeAccount";

interface Props {
  children: React.ReactNode;
}

const HostingLayout = async ({ children }: Props) => {
  const isAccountValidated = await getHostStripeAccount();

  return (
    <div className="space-y-6">
      <nav className="sticky top-0 z-50">
        <HostNavBar />
        {!isAccountValidated && <HostAccountValidator />}
      </nav>

      {children}
    </div>
  );
};

export default HostingLayout;
