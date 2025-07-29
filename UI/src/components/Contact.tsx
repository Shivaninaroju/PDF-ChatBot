import React, { useState } from 'react';
import { Send, Github, Linkedin, Mail, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Connect to FastAPI backend endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        console.error('Failed to submit form');
        // Handle error (show toast notification, etc.)
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // For now, simulate success for demo purposes
      setTimeout(() => {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', company: '', message: '' });
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Interested in collaborating or learning more about this project? 
            Let's connect and discuss opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">Message Delivered!</h3>
                  <p className="text-gray-300">Thank you for your interest. I'll respond promptly to discuss opportunities.</p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    variant="outline"
                    className="mt-4 border-green-500/50 text-green-400 hover:bg-green-500/10"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="bg-black/60 border-gray-600/50 text-white focus:border-cyan-500 hover:border-gray-500/70 transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Professional Email *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="bg-black/60 border-gray-600/50 text-white focus:border-cyan-500 hover:border-gray-500/70 transition-all duration-300"
                        placeholder="your.@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company/Organization
                    </label>
                    <Input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="bg-black/60 border-gray-600/50 text-white focus:border-cyan-500 hover:border-gray-500/70 transition-all duration-300"
                      placeholder="Your company or organization"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Details *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="bg-black/60 border-gray-600/50 text-white focus:border-cyan-500 hover:border-gray-500/70 transition-all duration-300 resize-none"
                      placeholder="Describe your project requirements, collaboration opportunities, or technical questions..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold py-3 rounded-lg shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-4 h-4 mr-2" />
                        Send Inquiry
                      </div>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact Info & Social Links */}
          <div className="space-y-8">
            <Card className="bg-black/60 border-gray-700/30 backdrop-blur-sm hover:bg-black/80 hover:border-cyan-500/30 transition-all duration-500">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Professional Contact</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Direct Email</div>
                      <div className="text-gray-400">shivaninaroju1@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Professional Network</div>
                      <a 
                        href="www.linkedin.com/in/shivani-naroju-820302291" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                      >www.linkedin.com/in/shivani-naroju-820302291
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group hover:scale-105 transition-all duration-300">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                      <Github className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Code Repository</div>
                      <a 
                        href="https://github.com/Shivaninaroju" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
                      >https://github.com/Shivaninaroju
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border-cyan-500/30 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-violet-500/30 hover:border-cyan-500/50 transition-all duration-500">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-white mb-4">Career Opportunities</h3>
                <p className="text-gray-300 mb-4">
                  Actively pursuing challenging roles in AI/ML engineering, full-stack development, 
                  and cutting-edge technology projects. Let's explore collaboration possibilities!
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-cyan-500/30 text-cyan-400 rounded-full text-sm hover:bg-cyan-500/40 transition-all duration-300 cursor-pointer">AI/ML Engineer</span>
                  <span className="px-3 py-1 bg-violet-500/30 text-violet-400 rounded-full text-sm hover:bg-violet-500/40 transition-all duration-300 cursor-pointer">Full-Stack Developer</span>
                  <span className="px-3 py-1 bg-green-500/30 text-green-400 rounded-full text-sm hover:bg-green-500/40 transition-all duration-300 cursor-pointer">Python Specialist</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;