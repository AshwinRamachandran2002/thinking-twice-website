// filepath: /home/ashwin/Desktop/thinking-twice-website/src/components/TeamMember.tsx
import React from 'react';
import { LinkedinIcon, BookOpenIcon, TwitterIcon, GithubIcon, AwardIcon, GraduationCapIcon, BriefcaseIcon } from "lucide-react";

interface TeamMemberProps {
  name: string;
  role: string;
  imageUrl: string;
  linkedinUrl: string;
  scholarUrl: string;
  twitterUrl: string;
  githubUrl: string;
  bio?: React.ReactNode;
  achievements?: {icon?: string; text: React.ReactNode}[];
  featuredAchievement?: {
    title: string;
    description: React.ReactNode;
    imageUrl?: string;
  };
  imageOnRight?: boolean;
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
  achievements = [],
  featuredAchievement,
  imageOnRight = false
}: TeamMemberProps) => {
  const renderIcon = (iconName?: string) => {
    switch(iconName) {
      case 'award': return <AwardIcon className="w-5 h-5 text-blue-600" />;
      case 'education': return <GraduationCapIcon className="w-5 h-5 text-green-600" />;
      case 'work': return <BriefcaseIcon className="w-5 h-5 text-purple-600" />;
      default: return <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />;
    }
  };

  const isEarlence = name.includes("Earlence");
  
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full mb-12">
      {(!imageOnRight || isEarlence) && (
        <div className={`${isEarlence ? 'block md:hidden' : ''} md:w-1/3 flex justify-center`}>
          <img
            src={imageUrl}
            alt={name}
            className="w-48 h-48 rounded-full object-cover shadow-lg"
          />
        </div>
      )}
      
      <div className="md:w-2/3 flex flex-col">
        <h3 className="text-2xl font-semibold mb-1 text-center md:text-left">{name}</h3>
        <p className="text-gray-600 mb-4 text-center md:text-left">{role}</p>
        
        {bio && (
          <div className="mb-6 bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
            <div className="text-gray-700 prose">
              {bio}
            </div>
          </div>
        )}

        {featuredAchievement && (
          <div className="mb-6 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-md">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <h4 className="font-bold text-lg">{featuredAchievement.title}</h4>
            </div>
            
            <div className="p-5">
              {featuredAchievement.imageUrl && (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={featuredAchievement.imageUrl} 
                    alt={featuredAchievement.title}
                    className="rounded-md shadow-sm max-h-72 object-contain" 
                  />
                </div>
              )}
              <div className="text-gray-700 prose">
                {featuredAchievement.description}
              </div>
            </div>
          </div>
        )}

        {achievements && achievements.length > 0 && (
          <div className="space-y-3 mb-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 bg-white p-3 rounded-md border-l-4 border-blue-500 shadow-sm">
                <div className="flex-shrink-0">
                  {renderIcon(achievement.icon)}
                </div>
                <div className="text-gray-700">{achievement.text}</div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex space-x-4 justify-center md:justify-start mt-4">
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
      
      {(imageOnRight || isEarlence) && (
        <div className={`${isEarlence ? 'hidden md:block' : ''} md:w-1/3 flex justify-center`}>
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