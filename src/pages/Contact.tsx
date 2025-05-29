import React from 'react';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        
        {/* Security Testing Form */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Test Your Agent's Security</h2>
            <p className="text-gray-600 mb-6 text-center">
              Interested in testing if your autonomous agent, now with tool-calling capabilities, can be misused by external attackers? 
              Let us help protect your agentic applications from attacks like indirect prompt injections.
            </p>
            <ContactForm />
          </div>
        </section>
        
        {/* Product Interest Form */}
        <section>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Get Early Access</h2>
            <p className="text-gray-600 mb-6 text-center">
              Our automated red teaming solution has already uncovered critical vulnerabilities in several leading companies building autonomous agent applications. 
              Want to learn more about these vulnerabilities and how we can help protect your systems?
              Leave your details and we'll share our findings along with information about our security solutions.
            </p>
            <ContactForm />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
