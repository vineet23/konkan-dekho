"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { TeamMember } from "@/lib/types";

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h2 className="text-xl font-semibold">{member.name}</h2>
        <p className="text-gray-600 mb-2">{member.role}</p>
        <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
        <div className="flex space-x-4">
          <a
            href={member.linkedin}
            className="text-gray-600 hover:text-[#FF385C]"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${member.email}`}
            className="text-gray-600 hover:text-[#FF385C]"
          >
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </Card>
  );
}
