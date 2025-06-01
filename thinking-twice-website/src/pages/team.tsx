import React from 'react';
import TeamSection from '../components/TeamSection';
import { teamData } from '../data/team';

const TeamPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Meet Our Team</h1>
      <p className="text-center text-gray-600 mb-8">
        Our team is composed of talented individuals dedicated to delivering the best solutions for our clients.
      </p>
      <TeamSection members={teamData} />
    </div>
  );
};

export default TeamPage;