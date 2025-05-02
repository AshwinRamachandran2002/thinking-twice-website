
import React from 'react';
import TeamMember from "@/components/TeamMember";
import MeetingScheduler from "@/components/MeetingScheduler";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Context <span className="gradient-text">Fort</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          The first security layer purpose-built for Model Context Protocol clients
        </p>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem</h2>
          <div className="mb-8 text-gray-600 text-lg max-w-3xl mx-auto">
            <p className="mb-4">
              Model Context Protocol (MCP) clients—Modern IDEs and Enterprise Copilots can now access privileged SaaS tools (CRMs, internal APIs, data lakes). The result? They're highly susceptible to prompt injection, tool misuse, and unauthorized access.
            </p>
          </div>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://drive.google.com/file/d/1sSNzBGDHqhYpK5ia1rSSgc_byV12xHMP/preview" 
              className="absolute top-0 left-0 w-full h-full border-0"
              allow="autoplay; fullscreen" 
              allowFullScreen
              title="Threat demonstration"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Meeting Scheduler Section */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Schedule a Call</h2>
          <MeetingScheduler />
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <TeamMember
              name="Ashwin Ramachandran"
              role="CEO"
              imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="https://linkedin.com/in/"
              scholarUrl="https://scholar.google.com/"
              twitterUrl="https://twitter.com/"
              githubUrl="https://github.com/"
            />
            <TeamMember
              name="Prof. Earlence Fernandes"
              role="Chief Research Scientist"
              imageUrl="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="https://linkedin.com/in/"
              scholarUrl="https://scholar.google.com/"
              twitterUrl="https://twitter.com/"
              githubUrl="https://github.com/"
            />
            <TeamMember
              name="Harshvardhan"
              role="CTO"
              imageUrl="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="https://linkedin.com/in/"
              scholarUrl="https://scholar.google.com/"
              twitterUrl="https://twitter.com/"
              githubUrl="https://github.com/"
            />
          </div>
          <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Why Us</h3>
            <p className="text-gray-600 mb-4">
              We're machine learning and security researchers who have worked on both sides of the problem.
            </p>
            <ul className="text-gray-600 space-y-4 pl-5 list-disc">
              <li>
                <strong>Ashwin Ramachandran</strong> (Masters, UC San Diego; B.Tech, CSE, IIT Bombay) - Published at NeurIPS and ICLR, and saved 1700 SWE hours at Google during his internship by automating code migration.
              </li>
              <li>
                <strong>Professor Earlence Fernandes</strong> (UC San Diego) - Security researcher since 2010. Led the team that did the "Stop sign" attack for computer vision (featured at the Science Museum in London); hacked Tour De France bikes showcasing a new form of wireless doping in sport; discovered information leakage in Google's Gemini fine-tuning service and demonstrated automated data exfiltration attacks on Mistral.
              </li>
              <li>
                <strong>Harshvardhan</strong> - 
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-gray-900 text-white text-center">
        <p>&copy; 2025 Context Fort. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
