import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { Calendar } from "lucide-react";

const ContactForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Let the form submit happen first, then redirect
    setTimeout(() => {
      setSubmitted(true);
      navigate('/success');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const openCalendly = () => {
    // Pre-fill Calendly info using query parameters if form data is available
    const calendlyUrl = `https://calendly.com/ashwinramachandrang/30min?name=${encodeURIComponent(formData.name)}&email=${encodeURIComponent(formData.email)}&a1=${encodeURIComponent(formData.company)}&a2=${encodeURIComponent(formData.description)}`;
    window.open(calendlyUrl, '_blank');
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-teal-50 p-8 rounded-lg shadow-lg text-center"
      >
        <div className="mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
            className="w-20 h-20 bg-teal-100 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-3 text-slate-800"
          >
            Thank You!
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-600 text-lg mb-4"
          >
            Your submission has been received successfully.
          </motion.p>
        </div>
        
        <div className="space-y-6 max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-teal-100"
          >
            <h4 className="font-semibold text-teal-600 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What happens next?
            </h4>
            <p className="text-slate-600">
              Our team will review your submission and reach out within 24-48 hours to discuss how we can help secure your agentic applications. We'll send a confirmation email shortly.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-teal-50 p-6 rounded-lg"
          >
            <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Meanwhile, explore our research
            </h4>
            <div className="text-teal-600 space-y-3">
              <a 
                href="https://arxiv.org/abs/2312.02119" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-teal-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Read our TAP Algorithm Paper
              </a>
              <a 
                href="https://storage.googleapis.com/deepmind-media/Security%20and%20Privacy/Gemini_Security_Paper.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block hover:text-teal-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                Learn about agent security best practices
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <form 
        action="https://formsubmit.co/ashwinramachandrang@gmail.com" 
        method="POST"
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* FormSubmit configuration */}
        <input type="hidden" name="_subject" value="New Contact Form Submission - Context Fort" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="true" />
        <input type="hidden" name="_next" value={window.location.origin + "/success"} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name*
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company*
            </label>
            <Input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Work Email*
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (optional)
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your phone number"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Tell us about your security concerns*
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What kind of autonomous agents are you using? What are your security concerns?"
            rows={4}
            required
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button type="submit" className="bg-gradient-to-r from-teal-500 to-slate-600 hover:from-teal-600 hover:to-slate-700 text-white transform transition-all duration-300 hover:scale-105">
            Submit Form
          </Button>
          <Button 
            type="button"
            onClick={openCalendly}
            className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-sm border border-teal-200 text-slate-600 shadow-md hover:bg-teal-50 transform transition-all duration-300 hover:scale-105"
          >
            <Calendar className="h-5 w-5" />
            Schedule Meeting
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
