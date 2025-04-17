"use client";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  text?: string;
}

const UsernameClaim = ({ text }: Props) => {
  const [username, setUsername] = useState("");

  const singupUrl = `/sign-up?username=${username}`;

  return (
    <>
      <div className="border-2 transition hover:border-muted rounded-full px-8 py-4 text-2xl flex font-bold items-center">
        <p className="">brutalyhonest.ai/</p>
        <Input
          placeholder="username"
          className="border-0 ring-0 text-2xl font-bold p-0 text-primary"
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && (window.location.href = singupUrl);
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-end gap-4 md:gap-10">
        <Link
          target="_blank"
          href={singupUrl}
          className="w-full md:w-auto order-0 md:order-1"
          aria-disabled
        >
          <Button className="w-full rounded-full h-12 md:h-16 md:px-16">
            Get Started
          </Button>
        </Link>

        {!!text && (
          <p className="text-muted-foreground text-center md:text-right md:max-w-sm">
            {text}
          </p>
        )}
      </div>
    </>
  );
};

export default UsernameClaim;
