import React, { useState } from 'react';
import styles from '../styles/contactForm.module.css';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate form submission
    try {
      // Here you would typically send the data to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError('There was an error submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.contactForm} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Contact Us</h2>
      {success && <p className={styles.successMessage}>Thank you for your message!</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
      <div className={styles.formGroup}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className={styles.textarea}
        />
      </div>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Submitting...' : 'Send Message'}
      </button>
      <div className={styles.demoLinks}>
        <a href="/contact#demo" className={styles.demoLink}>Get a Demo</a>
        <a href="/contact#schedule" className={styles.demoLink}>Schedule a Demo</a>
      </div>
    </form>
  );
};

export default ContactForm;