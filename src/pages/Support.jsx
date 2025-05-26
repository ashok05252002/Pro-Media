import React from 'react';
import { Mail, Phone, MessageSquare, FileQuestion, ExternalLink } from 'lucide-react';

const Support = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 mr-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-medium">Email Support</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Get in touch with our support team via email.</p>
          <a href="mailto:support@socialmediapro.com" className="text-theme-primary hover:underline font-medium flex items-center">
            support@socialmediapro.com
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 mr-4">
              <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-medium">Phone Support</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Call us directly for immediate assistance.</p>
          <a href="tel:+18001234567" className="text-theme-primary hover:underline font-medium flex items-center">
            +1 (800) 123-4567
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 mr-4">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-medium">Live Chat</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Chat with our support agents in real-time.</p>
          <button className="text-white bg-theme-primary hover:bg-opacity-90 py-2 px-4 rounded-md font-medium">
            Start Chat
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-medium">Frequently Asked Questions</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-theme-primary" />
                How do I connect my social media accounts?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-7">
                Go to "My Channels" page and click on the "Connect" button. You'll be guided through the authentication process for each platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-theme-primary" />
                Can I schedule posts across multiple platforms?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-7">
                Yes! You can create a single post and schedule it to be published across multiple social media platforms simultaneously.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-theme-primary" />
                How do I analyze the performance of my posts?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-7">
                Visit the "Analytics & Insights" page to view detailed performance metrics for all your social media posts and accounts.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2 flex items-center">
                <FileQuestion className="w-5 h-5 mr-2 text-theme-primary" />
                Can I invite team members to collaborate?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-7">
                Yes, go to "User Management" and click "Invite User" to add team members with different permission levels.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-theme-light-accent to-theme-light-accent/60 dark:from-theme-dark-accent/20 dark:to-theme-dark-accent/20 p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Need more help?</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Our comprehensive knowledge base has detailed guides, tutorials, and answers to common questions about using our platform.
          </p>
          <button className="bg-theme-primary hover:bg-opacity-90 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Visit Knowledge Base
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;
