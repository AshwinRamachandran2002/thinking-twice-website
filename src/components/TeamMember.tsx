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
  bio?: string;
  imageOnRight?: boolean; // New prop to control image position
}

const TeamMember = ({ 
  name, 
  role, 
  imageUrl, 
  linkedinUrl, 
  scholarUrl, 
  twitterUrl, 
  githubUrl,
  bio,
  imageOnRight = false // Default to image on left
}: TeamMemberProps) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full mb-12">
      {/* Conditionally render based on imageOnRight prop */}
      {!imageOnRight && (
        <div className="md:w-1/3 flex justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
        </div>
      )}
      
      {/* Details Section */}
      <div className="md:w-2/3 flex flex-col">
        <h3 className="text-2xl font-semibold mb-1 text-center md:text-left">{name}</h3>
        <p className="text-gray-600 mb-4 text-center md:text-left">{role}</p>
        
        {/* Bio text if provided */}
        {bio && <p className="text-gray-600 mb-4">{bio}</p>}
        
        <div className="flex space-x-4 justify-center md:justify-start">
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
      
      {/* Image on right if specified */}
      {imageOnRight && (
        <div className="md:w-1/3 flex justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default TeamMember;
