import React from 'react';
import TeamMember from "@/components/TeamMember";

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
          
          <div className="text-center mb-16">
            <p className="text-gray-600 text-xl max-w-3xl mx-auto">
              We're machine learning and security researchers who have worked on both sides of the problem.
            </p>
          </div>
          
          <div className="space-y-24">
            {/* Team members */}
            <TeamMember
              name="Ashwin Ramachandran"
              role="Co-Founder"
              linkedinUrl="https://www.linkedin.com/in/ashwinram2002/"
              scholarUrl="https://scholar.google.com/citations?user=y7H-6IgAAAAJ&hl=en"
              twitterUrl="https://x.com/ashwinram2002"
              githubUrl="https://github.com/AshwinRamachandran2002/"
              achievements={[
                { 
                  icon: "award", 
                  text: "Recently demonstrated vulnerabilities in Tour De France bikes, showcasing a new form of wireless doping in sport" 
                },
                { 
                  icon: "award", 
                  text: "His Research Lab discovered information leakages in Google's Gemini fine-tuning service and demonstrated automated data exfiltration attacks on Mistral's LeChat agent" 
                },
                { 
                  icon: "award", 
                  text: "Published research at top Machine Learning conferences including NeurIPS and ICLR" 
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
            
            <TeamMember
              name="Harshvardhan Agarwal"
              role="Co-Founder"
              imageUrl="https://media.licdn.com/dms/image/C4E03AQHXR6pa8M0zpw/profile-displayphoto-shrink_800_800/0/1615090546675?e=1719446400&v=beta&t=v4CwPVilfr3fyCW9_UsYB6cpjWZQmQmMQlvpQ65ZnvM"
              linkedinUrl="https://www.linkedin.com/in/harshvardhan-agarwal/"
              scholarUrl="https://scholar.google.com/citations?user=krgHhkIAAAAJ&hl=en"
              twitterUrl="https://twitter.com/harsh919195"
              githubUrl="https://github.com/harsh919195"
              achievements={[
                { 
                  icon: "award", 
                  text: "Built Talent Protocol (Top 8 in YC W22) and MyCareerSync (Used by Uber Engineering)" 
                },
                { 
                  icon: "award", 
                  text: "Ranked 2389 globally in IOI Training Camp" 
                },
                { 
                  icon: "award", 
                  text: "Represented IIT Bombay at the ICPC World Finals, the premier global programming competition" 
                },
                { 
                  icon: "education", 
                  text: "Masters from Stanford University and B.Tech in CSE from IIT Bombay" 
                }
              ]}
            />

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
                description: "One of the first researchers to demonstrate physical adversarial attacks against computer vision. The stop sign attack has become a canonical example in AI security and is widely cited.",
                imageUrl: "https://www.earlence.com/assets/images/stopsign.png"
              }}
              achievements={[
                { 
                  icon: "award", 
                  text: "His research has been featured in The New York Times, Wired, and ACM Tech News" 
                },
                { 
                  icon: "award", 
                  text: "Discovered IoT security vulnerabilities in Samsung SmartThings and Philips Hue" 
                },
                { 
                  icon: "work", 
                  text: "At Microsoft Research, developed techniques to secure Machine Learning platforms" 
                },
                { 
                  icon: "education", 
                  text: "Assistant Professor @ UW-Madison & University of San Diego" 
                }
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
