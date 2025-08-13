
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Lock, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
            🚀 Powered by Superfluid & Sablier
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Decentralized{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Crypto Subscriptions
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Enable real-time and time-locked crypto-based subscriptions with AI-powered access control. 
            Built for the future of SaaS billing on Ethereum-compatible chains.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Real-time Streaming</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
              <Lock className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Time-locked Payments</span>
            </div>
            <div className="flex items-center justify-center space-x-2 p-4 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
              <Brain className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Control</span>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;