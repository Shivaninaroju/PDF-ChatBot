import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 border-t border-gray-800/50 py-12 relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-24 h-24 bg-violet-500/5 rounded-full blur-xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Project Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent mb-4 animate-gradient-x">
              PDF RAG Assistant
            </h3>
            <p className="text-gray-400 mb-4 leading-relaxed">
              A revolutionary AI-powered document intelligence platform that transforms static PDFs 
              into dynamic, interactive knowledge systems using cutting-edge RAG technology.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Shivaninaroju/PDF-ChatBot.git" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/60 hover:bg-black/80 hover:scale-110 p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href="https://www.linkedin.com/in/shivani-naroju-820302291" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black/60 hover:bg-black/80 hover:scale-110 p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
              <a 
                href="shivaninaroju1@gmail.com"
                className="bg-black/60 hover:bg-black/80 hover:scale-110 p-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20"
              >
                <Mail className="w-5 h-5 text-gray-400 hover:text-white transition-colors duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 inline-block">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 inline-block">About</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 inline-block">Features</a></li>
              <li><a href="#tech" className="text-gray-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 inline-block">Technology</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-cyan-400 hover:scale-105 transition-all duration-300 inline-block">Contact</a></li>
            </ul>
          </div>

          {/* Technologies */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Technology Stack</h4>
            <ul className="space-y-2 text-gray-400">
              <li className="hover:text-cyan-400 hover:scale-105 transition-all duration-300 cursor-pointer">FastAPI</li>
              <li className="hover:text-violet-400 hover:scale-105 transition-all duration-300 cursor-pointer">LangChain</li>
              <li className="hover:text-green-400 hover:scale-105 transition-all duration-300 cursor-pointer">FAISS</li>
              <li className="hover:text-orange-400 hover:scale-105 transition-all duration-300 cursor-pointer">OpenAI GPT</li>
              <li className="hover:text-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer">React + TypeScript</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 PDF RAG Assistant. Engineered with cutting-edge AI technologies.
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 mx-1 fill-current animate-pulse" />
            <span>for innovation</span>
          </div>
        </div>

        {/* Creator Credit */}
        <div className="mt-8 text-center border-t border-gray-800/30 pt-6">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/30 rounded-full px-6 py-3 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">Created by Shivani Naroju</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;