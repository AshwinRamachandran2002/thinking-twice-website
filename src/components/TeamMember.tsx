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
  // Helper function to render the appropriate icon
  const renderIcon = (iconName?: string) => {
    switch(iconName) {
      case 'award': return <AwardIcon className="w-5 h-5 text-[#ffa62b]" />;
      case 'education': return <GraduationCapIcon className="w-5 h-5 text-[#ffa62b]" />;
      case 'work': return <BriefcaseIcon className="w-5 h-5 text-[#ffa62b]" />;
      default: return <div className="w-2 h-2 bg-[#ffa62b] rounded-full mt-2" />;
    }
  };

  // For Earlence, special case to put image on left for mobile (name match)
  const isEarlence = name.includes("Earlence");
  const isCoFounder = role.includes("Co-Founder");
  
  return (
    <div className={`flex flex-col ${isCoFounder ? '' : 'md:flex-row'} items-center ${isCoFounder ? '' : 'md:items-start'} gap-6 w-full`}>
      {/* Co-founder specific layout */}
      {isCoFounder && (
        <>
          <div className="flex justify-center mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffa62b]/20 to-orange-500/20 rounded-full blur-xl opacity-70"></div>
            <img
              src={imageUrl}
              alt={name}
              className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-white transition-transform relative z-10"
            />
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-bold mb-1 text-center text-[#ffa62b]">{name}</h3>
            <p className="text-slate-600 mb-5 text-center">{role}</p>
            
            {/* Regular Achievements section */}
            {achievements && achievements.length > 0 && (
              <div className="space-y-3 mb-5 w-full">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border-l-4 border-[#ffa62b] shadow-md hover:bg-[#ffa62b]/10 duration-300 hover:shadow-lg">
                    <div className="flex-shrink-0 mt-0.5">
                      {renderIcon(achievement.icon)}
                    </div>
                    <div className="text-slate-700 text-sm">{achievement.text}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex space-x-4 justify-center mt-3">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-[#ffa62b]/10 border border-white/20"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-[#ffa62b]/10 border border-white/20"
                aria-label={`${name}'s Twitter profile`}
              >
                <TwitterIcon className="w-5 h-5" />
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-[#ffa62b]/10 border border-white/20"
                aria-label={`${name}'s GitHub profile`}
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-[#ffa62b]/10 border border-white/20"
                aria-label={`${name}'s Google Scholar profile`}
              >
                <BookOpenIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
        </>
      )}
      
      {/* Research Scientist layout */}
      {!isCoFounder && (
        <>
          {/* Show image on left for mobile if it's Earlence, or if imageOnRight is false */}
          {(!imageOnRight || isEarlence) && (
            <div className={`${isEarlence ? 'block md:hidden' : ''} md:w-1/3 flex justify-center`}>
              <img
                src={imageUrl}
                alt={name}
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
          )}
          
          {/* Details Section */}
          <div className="md:w-2/3 flex flex-col">
            <h3 className="text-2xl font-semibold mb-1 text-center md:text-left text-[#ffa62b]">{name}</h3>
            <p className="text-slate-600 mb-4 text-center md:text-left">{role}</p>
            
            {/* Enhanced bio display */}
            {bio && (
              <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg hover:shadow-xl duration-300">
                <div className="text-slate-700 prose">
                  {bio}
                </div>
              </div>
            )}

            {/* Featured Achievement with image */}
            {featuredAchievement && (
              <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 shadow-lg hover:shadow-xl duration-300">
                <div className="p-4 bg-gradient-to-r from-[#ffa62b] to-orange-600 text-white">
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
                  <div className="text-slate-700 prose">
                    {featuredAchievement.description}
                  </div>
                </div>
              </div>
            )}

            {/* Regular Achievements section */}
            {achievements && achievements.length > 0 && (
              <div className="space-y-3 mb-6">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-lg border-l-4 border-[#ffa62b] shadow-md hover:bg-[#ffa62b]/10 duration-300 hover:shadow-lg">
                    <div className="flex-shrink-0">
                      {renderIcon(achievement.icon)}
                    </div>
                    <div className="text-slate-700">{achievement.text}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex space-x-4 justify-center md:justify-start mt-4">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <LinkedinIcon className="w-6 h-6" />
              </a>
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors"
                aria-label={`${name}'s Twitter profile`}
              >
                <TwitterIcon className="w-6 h-6" />
              </a>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors"
                aria-label={`${name}'s GitHub profile`}
              >
                <GithubIcon className="w-6 h-6" />
              </a>
              <a
                href={scholarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#ffa62b] transition-colors"
                aria-label={`${name}'s Google Scholar profile`}
              >
                <BookOpenIcon className="w-6 h-6" />
              </a>
            </div>
          </div>
          
          {/* Image on right for desktop if specified, except for Earlence */}
          {(imageOnRight || isEarlence) && (
            <div className={`${isEarlence ? 'hidden md:block' : ''} md:w-1/3 flex justify-center`}>
              <img
                src={imageUrl}
                alt={name}
                className="w-48 h-48 rounded-full object-cover shadow-lg border-4 border-white"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeamMember;
