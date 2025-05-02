
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

const MeetingScheduler = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Meeting request submitted:', { name, email, company, message });
    // In a real implementation, you would send this data to your backend or a service like Calendly
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Thank you for your interest!</h3>
        <p className="text-gray-600">
          We've received your request and will be in touch shortly to schedule a meeting.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@company.com"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <Input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Your company name"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message (optional)
          </label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us about your specific needs or questions"
            rows={4}
          />
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule a Call
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MeetingScheduler;
