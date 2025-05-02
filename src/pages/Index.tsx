
import React from 'react';
import { LinkedinIcon, BookOpenIcon, TwitterIcon, GithubIcon } from "lucide-react";
import TeamMember from "@/components/TeamMember";
import MeetingScheduler from "@/components/MeetingScheduler";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="section-padding flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Thinking Twice <span className="gradient-text">Machines</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          [Your Mission Statement] Empowering organizations to identify and neutralize threats through advanced AI-driven analysis
        </p>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">The Problem</h2>
          <div className="relative w-full aspect-video rounded-lg overflow-hidden">
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
          <h2 className="text-3xl font-bold text-center mb-12">Schedule a Sales Call</h2>
          <MeetingScheduler />
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TeamMember
              name="[Team Member 1]"
              role="Co-Founder & CEO"
              imageUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="#"
              scholarUrl="#"
              twitterUrl="#"
              githubUrl="#"
            />
            <TeamMember
              name="[Team Member 2]"
              role="Co-Founder & CTO"
              imageUrl="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="#"
              scholarUrl="#"
              twitterUrl="#"
              githubUrl="#"
            />
            <TeamMember
              name="[Team Member 3]"
              role="Chief Research Officer"
              imageUrl="https://images.unsplash.com/photo-1519345182560-3f2917c472ef?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&w=300"
              linkedinUrl="#"
              scholarUrl="#"
              twitterUrl="#"
              githubUrl="#"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="section-padding bg-gray-900 text-white text-center">
        <p>&copy; 2025 Thinking Twice Machines. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
