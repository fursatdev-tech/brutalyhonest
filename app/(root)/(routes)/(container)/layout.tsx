import { ReactNode } from "react";

import Container from "@/components/ui/container";

const layout = ({ children }: { children: ReactNode }) => {
  return <Container className="py-5 px-0">{children}</Container>;
};

export default layout;
