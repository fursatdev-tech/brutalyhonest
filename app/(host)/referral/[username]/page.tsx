"use client";

import { redirect, useParams } from "next/navigation";

const Page = () => {
  const { username } = useParams();

  localStorage.setItem("referral", username as string);

  redirect("/sign-up");
};

export default Page;
