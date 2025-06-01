import React from 'react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-gray-600 mb-6 text-center">
        We would love to hear from you! Please fill out the form below to get in touch with us.
      </p>
      <ContactForm />
    </div>
  );
};

export default ContactPage;