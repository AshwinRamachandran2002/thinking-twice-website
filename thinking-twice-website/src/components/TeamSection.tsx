import React from 'react';
import TeamMember from './TeamMember';
import { teamMembersData } from '../data/team';

const TeamSection = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembersData.map((member) => (
            <TeamMember
              key={member.name}
              name={member.name}
              role={member.role}
              imageUrl={member.imageUrl}
              linkedinUrl={member.linkedinUrl}
              scholarUrl={member.scholarUrl}
              twitterUrl={member.twitterUrl}
              githubUrl={member.githubUrl}
              bio={member.bio}
              achievements={member.achievements}
              featuredAchievement={member.featuredAchievement}
              imageOnRight={member.imageOnRight}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;