"use client";

import { TeamMemberCard } from "@/components/team/team-member-card";
import { teamMembers } from "@/lib/data/team-members";

export default function TeamPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-5xl font-caveat font-bold mb-8">Our Team</h1>
      <p className="text-gray-600 mb-12 max-w-3xl">
        Meet the dedicated professionals behind Konkan Dekho who work tirelessly
        to help you find your perfect plot of land or homestay in the Konkan
        region.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <TeamMemberCard key={member.name} member={member} />
        ))}
      </div>
    </div>
  );
}
