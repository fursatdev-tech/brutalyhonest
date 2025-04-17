import { Metadata } from "next";

import { ProfileCategories } from "@/components/profile/data";
import ProfileSettings from "@/components/profile/dialog/ProfileSettings";
import PaymentDetails from "@/components/profile/dialog/PaymentDetails";

interface RenderViewProps {
  view: string;
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "My Profile",
  description: "Profile Settings",
};

const Profile = () => {
  const RenderView = ({ children, view }: RenderViewProps) => {
    switch (view) {
      case "profile-settings":
        return <ProfileSettings>{children}</ProfileSettings>;

      case "payment-details":
        return <PaymentDetails>{children}</PaymentDetails>;

      default:
        return <>{children}</>;
    }
  };

  return (
    <section className="space-y-5">
      <h1 className="!text-3xl font-bold">My profile</h1>
      <div className="grid grid-cols-6 gap-4">
        {ProfileCategories.map((category, idx) => (
          <RenderView view={category.view} key={idx}>
            <div className="col-span-6 md:col-span-2 xl:col-span-1 text-center border rounded-xl px-4 py-3 hover:shadow-md transition duration-300 ease-in-out cursor-pointer space-y-3">
              <category.icon className="w-14 h-14 text-muted-foreground mx-auto" />

              <p className="font-semibold">{category.name} </p>
            </div>
          </RenderView>
        ))}
      </div>
    </section>
  );
};

export default Profile;
