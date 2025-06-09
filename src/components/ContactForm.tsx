import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { Calendar, Loader2 } from "lucide-react";

const GOOGLE_CALENDAR_URL = 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2-LisBxMgnCRJ-LKKb-R3pFbF841mGLD05pQdMbsBW-4MJvb0Jy2ksFKVYziMHfKcECrF9yIHt';

const ContactForm = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // FormSubmit will handle the form processing but we need to prevent
    // the default form redirect behavior to show our own success message
    e.preventDefault();
    
    // Set loading state
    setIsLoading(true);
    
    // Get the form element
    const form = e.currentTarget;
    
    // Create FormData object
    const formDataObj = new FormData(form);
    
    // Send the form data to FormSubmit endpoint
    fetch("https://formsubmit.co/ashwin@contextfort.ai", {
      method: "POST",
      body: formDataObj,
    })
    .then(response => {
      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Form submission failed");
        alert("Form submission failed. Please try again or contact us directly.");
      }
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again or contact us directly.");
      setIsLoading(false);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const openCalendar = () => {
    window.open(GOOGLE_CALENDAR_URL, '_blank');
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
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
            className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
          >
            <svg 
              className="w-8 h-8 text-green-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>
        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl font-semibold mb-4"
        >
          Thank you for reaching out!
        </motion.h3>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-600 mb-8"
        >
          We've received your message and will get back to you soon.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Button 
            onClick={openCalendar}
            className="bg-[#ffa62b] hover:bg-orange-600 text-white flex items-center gap-2 mx-auto"
          >
            <Calendar className="h-5 w-5" />
            Schedule a Meeting
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <form 
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {/* FormSubmit configuration */}
        <input type="hidden" name="_subject" value="New Contact Form Submission - Context Fort" />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_captcha" value="true" />
        <input type="hidden" name="_honey" value="" /> {/* Honeypot spam prevention */}
        <input type="hidden" name="_autoresponse" value="Thank you for contacting us. We have received your submission and will get back to you soon." />
        
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
          <Button 
            type="submit" 
            className="bg-[#ffa62b] hover:bg-orange-600 text-white transform transition-all duration-300 hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Form"
            )}
          </Button>
          <Button 
            type="button"
            onClick={openCalendar}
            className="flex items-center gap-2 rounded-lg bg-white/80 backdrop-blur-sm border border-[#ffa62b]/20 text-slate-600 shadow-md hover:bg-[#ffa62b]/10 transform transition-all duration-300 hover:scale-105"
            disabled={isLoading}
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
