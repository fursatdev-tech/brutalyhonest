"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
  websiteUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Yogesh Bansal",
    role: "Director",
    imageUrl: "/images/yogesh.jpeg",
    websiteUrl: "https://www.linkedin.com/in/yogeba/",
  },
  {
    name: "Yash Sandeep Mittal",
    role: "CA, CA Foundation - AIR 38",
    imageUrl: "/images/ysm.jpeg",
    websiteUrl:
      "https://www.linkedin.com/in/ca-yash-sandeep-mittal-ysm-babb701aa/",
  },
  {
    name: "Pankaj Yadav",
    role: "Senior Developer",
    imageUrl: "",
    websiteUrl: "https://pankajyadav.dev/",
  },
  {
    name: "Utsav Rai",
    role: "Product Engineer",
    imageUrl: "",
    websiteUrl: "https://www.linkedin.com/in/raiutsav/",
  },
  {
    name: "Dhruv Gupta",
    role: "Product Engineer",
    imageUrl: "/images/dhruv.jpeg",
    websiteUrl: "https://www.linkedin.com/in/dhruv-gupta-9398a7223/",
  },
  {
    name: "Pratham Dwivedi",
    role: "AI/ML Engineer",
    imageUrl: "/images/pratham.png",
    websiteUrl: "https://www.linkedin.com/in/prathamdwivedi/",
  },
];

export default function TeamSection() {
  return (
    <div className="">
      <section className="bg-transparent mx-auto px-4 py-16 font-satoshi">
        <h2 className="text-center text-[32px] font-medium mb-16">
          Meet Our Team
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-full flex flex-wrap justify-center gap-6 mb-6">
            {teamMembers.slice(0, 3).map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
          <div className="w-full flex flex-wrap justify-center gap-6">
            {teamMembers.slice(3).map((member) => (
              <TeamMemberCard key={member.name} {...member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function TeamMemberCard({ name, role, imageUrl, websiteUrl }: TeamMember) {
  return (
    <Card className="w-full max-w-[384px] group cursor-pointer shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-shadow duration-300">
      <Link href={websiteUrl}>
        <CardContent className="p-4 flex items-center">
          <Avatar className="h-14 w-14 rounded-full">
            <AvatarImage src={imageUrl} alt={name} />
            <AvatarFallback>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-grow">
            <h3 className="text-base font-medium text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-200">{role}</p>
          </div>
          <ArrowUpRight className="text-gray-500 dark:text-gray-100 w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </CardContent>
      </Link>
    </Card>
  );
}
