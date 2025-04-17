import { ReactNode } from "react";

import Container from "@/components/ui/container";

interface Props {
  children: ReactNode;
}

const layout = ({ children }: Props) => {
  return (
    <Container className="max-w-[1120px] space-y-8 pb-28">{children}</Container>
  );
};

export default layout;
