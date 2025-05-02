
import React from 'react';
import { LinkedinIcon, BookOpenIcon, TwitterIcon, GithubIcon } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
  scholarUrl: string;
  twitterUrl: string;
  githubUrl: string;
}

const TeamMember = ({ 
  name, 
  role, 
  imageUrl, 
  linkedinUrl, 
  scholarUrl, 
  twitterUrl, 
  githubUrl 
}: TeamMemberProps) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={imageUrl}
        alt={name}
        className="w-48 h-48 rounded-full object-cover mb-4 shadow-lg"
      />
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-gray-600 mb-3">{role}</p>
      <div className="flex space-x-4">
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={`${name}'s LinkedIn profile`}
        >
          <LinkedinIcon className="w-6 h-6" />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-400 transition-colors"
          aria-label={`${name}'s Twitter profile`}
        >
          <TwitterIcon className="w-6 h-6" />
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
          aria-label={`${name}'s GitHub profile`}
        >
          <GithubIcon className="w-6 h-6" />
        </a>
        <a
          href={scholarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-600 transition-colors"
          aria-label={`${name}'s Google Scholar profile`}
        >
          <BookOpenIcon className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};

export default TeamMember;
