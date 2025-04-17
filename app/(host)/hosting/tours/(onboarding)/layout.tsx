import { ReactNode } from "react";

import OnboardingBreadcrump from "@/components/tours/OnboardingBreadcrump";

interface Props {
  children: ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <div className="grid place-content-center min-h-[calc(100vh-284px)] space-y-8 max-w-2xl mx-auto pb-28">
      <OnboardingBreadcrump />
      {children}
    </div>
  );
};

export default layout;
