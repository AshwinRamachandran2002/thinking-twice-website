import React from "react";
import TeamMember from "@/components/TeamMember";
import Navbar from "../components/Navbar";

// Team Section
const Team = () => (
  <div className="min-h-screen overflow-hidden font-sans text-slate-700" style={{ fontFamily: "Gellix, Inter, sans-serif", backgroundColor: '#fef9f3', fontWeight: 'bold' }}>
    {/* Muted mango background with subtle gradient */}
    <div className="absolute inset-0 -z-20 bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50" />
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_60%_20%,rgba(255,166,43,0.12),transparent_60%)]" />
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_80%,rgba(255,166,43,0.08),transparent_50%)]" />

    <Navbar />

    <section id="team-section" className="min-h-screen py-20 px-4 mt-16">
    
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center mb-6 text-black drop-shadow-sm">Meet the Team</h1>
      
      <div className="w-20 h-1 rounded-full mx-auto mb-12" style={{ backgroundColor: '#ffa62b' }}></div>
      
      <div className="mt-12 mb-16 text-center max-w-3xl mx-auto">
        <p className="text-slate-600 text-lg">
          We're machine learning and security researchers who have worked on both sides of the problem.
        </p>
      </div>
      
      {/* Co-Founders Section - Side by Side */}
      <div className="mb-20 pb-16">
        {/* Decorative element */}
        
        {/* <h2 className="text-3xl font-bold text-center mb-12 text-black">
          <span className="inline-block bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full border border-[#ffa62b]/30 shadow-lg">Co-Founders</span>
        </h2> */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div 
            className="relative rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 group"
            style={{
              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Removed floating particles animation */}
            <TeamMember
              name="Ashwin Ramachandran"
              role="Co-Founder"
              imageUrl="https://media.licdn.com/dms/image/v2/C4D03AQH23W0xscWHkQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1652949143415?e=1754524800&v=beta&t=GMTz9WY8anHtgXEtBDRzFbxUk0relVdn9Doy8oQmeZg"
              linkedinUrl="https://www.linkedin.com/in/ashwinram2002/"
              scholarUrl="https://scholar.google.com/citations?user=y7H-6IgAAAAJ&hl=en"
              twitterUrl="https://x.com/ashwinram2002"
              githubUrl="https://github.com/AshwinRamachandran2002/"
              achievements={[
                {
                  icon: "award",
                  text: <>
                    Published research at top Machine Learning conferences including <a href="https://neurips.cc/virtual/2024/poster/93261" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">NeurIPS</a> and <a href="https://iclr.cc/virtual/2025/poster/30929" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">ICLR</a>
                  </>
                },
                {
                  icon: "work",
                  text: "Saved 1700 SWE hours at Google during internship by automating code migration"
                },
                {
                  icon: "education",
                  text: "Masters from UC San Diego and B.Tech in CSE from IIT Bombay"
                }
              ]}
            />
          </div>
          <div 
            className="relative rounded-3xl p-6 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 group"
            style={{
              background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Removed floating particles animation */}
            <TeamMember
              name="Harshvardhan Agarwal"
              role="Co-Founder"
              imageUrl="https://media.licdn.com/dms/image/v2/D4D03AQF4ZtjkkCXsug/profile-displayphoto-shrink_800_800/B4DZVkWvePHYAg-/0/1741145438456?e=1752105600&v=beta&t=T-VzywV46vOcLFv00kEjNhnu70n1edc6xQfDyrgTQqw"
              linkedinUrl="https://www.linkedin.com/in/harshvardhan-agarwal-873013136/"
              scholarUrl="https://scholar.google.com/citations?hi=en&user=ECWdNxIAAAAJ"
              twitterUrl="https://x.com/Harshva90132589"
              githubUrl="https://github.com/draco976"
              achievements={[
                {
                  icon: "award",
                  text: "Published research at the International Conference on Machine Learning (ICML)"
                },
                {
                  icon: "award",
                  text: "Represented IIT Bombay at the ICPC World Finals and won Silver Medal in International Physics Olympiad"
                },
                {
                  icon: "education",
                  text: "Masters from Stanford University and B.Tech in CSE from IIT Bombay"
                }
              ]}
            />
          </div>
        </div>
      </div>
      
      {/* Research Team Section */}
      <div>
        {/* <h2 className="text-3xl font-bold text-center mb-12 text-slate-700">
          <span className="inline-block bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-2 rounded-full border border-[#ffa62b]/20 shadow-sm text-slate-700 font-bold">Research Team</span>
        </h2> */}
        <div 
          className="rounded-3xl p-8 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 group overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(156, 163, 175, 0.15) 0%, rgba(156, 163, 175, 0.08) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Removed floating particles animation */}
          
          <TeamMember
            name="Prof. Earlence Fernandes"
            role="Chief Research Scientist"
            imageUrl="https://www.earlence.com/assets/images/earlence_new.jpg"
            linkedinUrl="https://www.linkedin.com/in/earlence-fernandes-81857314"
            scholarUrl="https://scholar.google.com/citations?user=OSPeHGAAAAAJ&hl=en"
            twitterUrl="https://x.com/earlencef"
            githubUrl="https://github.com/earlence-security"
            featuredAchievement={{
              title: "The Famous Stop Sign Attack",
              imageUrl: "https://miro.medium.com/v2/resize:fit:626/1*4GcPQlKRT1mGTwaI18axxQ.png",
              description: (
                <div className="space-y-3">
                  <p>
                    Prof. Earlence led the pioneering team that demonstrated how autonomous vehicles could be tricked using physical-world stickers applied to stop signs.
                  </p>
                  <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-500 mt-2">
                    <p className="font-medium text-blue-800">Featured at the Science Museum in London and in the opening chapter of "Not with a bug, but with a sticker"</p>
                  </div>
                  <div className="flex justify-end">
                    <a
                      href="https://arxiv.org/abs/1707.08945"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      Read the research paper →
                    </a>
                  </div>
                </div>
              ),
            }}
            achievements={[
              {
                icon: "award",
                text: <>
                  Recently demonstrated vulnerabilities in <a href="https://www.wired.com/story/shimano-wireless-bicycle-shifter-jamming-replay-attacks/" className="text-blue-400 hover:underline">Tour De France bikes</a>, showcasing a new form of wireless doping in sport
                </>
              },
              {
                icon: "award",
                text: <>
                  His Research Lab discovered information leakages in <a href="https://arstechnica.com/security/2025/03/gemini-hackers-can-deliver-more-potent-attacks-with-a-helping-hand-from-gemini/" className="text-blue-400 hover:underline">Google's Gemini</a> fine-tuning service and demonstrated automated data exfiltration attacks on <a href="https://www.wired.com/story/ai-imprompter-malware-llm/" className="text-blue-400 hover:underline">Mistral's LeChat</a> agent
                </>
              },
              {
                icon: "education",
                text: "Assistant Professor at UC San Diego, specializing in machine learning security"
              }
            ]}
            bio={
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mb-4">
                <p className="text-blue-800 font-medium">
                  "Earlence has done work in machine learning security since before it was cool."
                </p>
              </div>
            }
            imageOnRight={true}
          />
        </div>
      </div>
      
      {/* Footer accent */}
      <div className="mt-20 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-slate-400 via-[#ffa62b] to-slate-400 rounded-full opacity-30"></div>
      </div>
    </div>
    </section>
  </div>
);

export default Team;
