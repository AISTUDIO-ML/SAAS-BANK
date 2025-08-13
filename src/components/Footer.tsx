
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                SAAS BANK
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4 max-w-md">
              A decentralized SaaS platform enabling real-time and time-locked crypto-based subscriptions 
              using Superfluid and Sablier. Hosted in TEE environment with AI-powered access control.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link></li>
              <li><Link to="/admin" className="text-sm text-gray-600 hover:text-gray-900">Admin Panel</Link></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">API Docs</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 mt-8 text-center text-sm text-gray-600">
          <p>© 2024 SAAS BANK. Developed with ❤️ by Honeypotz Inc in Greenwich, CT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
