

import React, { useState } from 'react';
import axios from 'axios';
import './ContactForm.css'; 

const ContactForm = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({
    success: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setStatus({ success: false, message: '' });

    try {
      
      const response = await axios.post('/api/send-email', formData);

      if (response.data.success) {
        setStatus({ success: true, message: 'Message sent successfully!' });
        
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ success: false, message: response.data.message || 'Failed to send message.' });
      }
    } catch (error) {
      console.error('Submit Error:', error);
      setStatus({
        success: false,
        message: error.response?.data?.message || 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <h2>Contact Us</h2>
        <p>We'll get back to you as soon as possible.</p>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Sonu Rao"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="sonu@example.com"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            required
            placeholder="How can we help you?"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>

        {}
        {status.message && (
          <p className={`status-message ${status.success ? 'success' : 'error'}`}>
            {status.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;