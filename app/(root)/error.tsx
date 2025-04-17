"use client";
import Image from "next/image";

import Container from "@/components/ui/container";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <Container className="flex flex-col h-screen w-screen items-center justify-center gap-8">
      <div className="w-full h-80 relative">
        <Image
          src="/images/tour/no-survey.svg"
          fill
          alt="no-survey"
          className="object-contain"
        />
      </div>

      <p className="italic">{error?.message || "Something went wrong"}</p>
    </Container>
  );
};

export default ErrorState;
