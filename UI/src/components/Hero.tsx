import React from 'react';
import { Play, Github, Download, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface HeroProps {
  onTryNow: () => void;
}

const Hero: React.FC<HeroProps> = ({ onTryNow }) => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-green-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-pink-500/15 rounded-full blur-3xl animate-float-reverse"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 rounded-full px-6 py-3 mb-8 backdrop-blur-sm animate-fade-in-up hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-cyan-100 font-medium">Next-Generation Document Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up animation-delay-200">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Chat With Your PDF
            </span>
            <br />
            <span className="text-white text-4xl md:text-5xl animate-fade-in-up animation-delay-400">
              RAG-Based Assistant
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-600">
            Transform your documents into intelligent conversations using <span className="text-cyan-400 font-semibold bg-cyan-400/10 px-2 py-1 rounded">Retrieval-Augmented Generation</span>. 
            Experience the future of document interaction with AI-powered insights and instant, contextual responses.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 animate-fade-in-up animation-delay-800">
            <Button
              onClick={onTryNow}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-400 hover:to-violet-400 text-white font-semibold px-10 py-4 rounded-full shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 animate-pulse-glow"
            >
              <Play className="w-5 h-5 mr-2" />
              Explore the Assistant
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 font-semibold px-10 py-4 rounded-full backdrop-blur-sm transition-all duration-500 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/25"
              onClick={() => window.open('https://github.com/Shivaninaroju/PDF-ChatBot', '_blank')}
            >
              <Github className="w-5 h-5 mr-2" />
              Source Code
            </Button>
          
          </div>

          {/* Key Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-1000">
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-cyan-400 mb-2 group-hover:animate-bounce">Lightning Fast</div>
              <div className="text-gray-400">Instant AI Responses</div>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-violet-400 mb-2 group-hover:animate-bounce">Smart Search</div>
              <div className="text-gray-400">Vector-Based Retrieval</div>
            </div>
            <div className="text-center group hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-green-400 mb-2 group-hover:animate-bounce">Context Aware</div>
              <div className="text-gray-400">Precise Understanding</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-cyan-500/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;