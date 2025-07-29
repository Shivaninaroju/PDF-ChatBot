import React from 'react';
import { Upload, Zap, Shield, Globe, Clock, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const Features: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Intelligent Document Processing',
      description: 'Advanced PDF parsing with multi-format support, automatic text extraction, and intelligent content structuring for optimal AI comprehension.',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Zap,
      title: 'Neural Embedding Engine',
      description: 'State-of-the-art transformer models generate high-dimensional semantic embeddings with exceptional accuracy and lightning-fast processing.',
      color: 'violet',
      gradient: 'from-violet-500 to-violet-600'
    },
    {
      icon: Shield,
      title: 'Precision Vector Search',
      description: 'FAISS-optimized similarity search with advanced indexing algorithms delivers the most relevant content with microsecond precision.',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      icon: Globe,
      title: 'Contextual AI Responses',
      description: 'Advanced language models provide nuanced, context-aware responses with deep understanding of document semantics and user intent.',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      icon: Clock,
      title: 'Real-time Intelligence',
      description: 'Streaming response generation with live processing indicators, delivering immediate insights as the AI formulates comprehensive answers.',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600'
    },
    {
      icon: Cpu,
      title: 'Enterprise Architecture',
      description: 'Robust, scalable infrastructure built on FastAPI with asynchronous processing, designed for high-performance enterprise deployment.',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-60 h-60 bg-violet-500/5 rounded-full blur-2xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Advanced Capabilities
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Revolutionary features that transform static documents into dynamic, intelligent knowledge systems 
            powered by the latest advances in artificial intelligence and machine learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up animation-delay-200">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="bg-black/60 border-gray-700/30 backdrop-blur-sm hover:bg-black/80 hover:border-cyan-500/30 transition-all duration-500 group hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`bg-gradient-to-r ${feature.gradient} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className={`text-xl font-bold text-${feature.color}-400 group-hover:animate-pulse`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Core Advantages */}
        <div className="mt-20 animate-fade-in-up animation-delay-800">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Core Advantages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-black/40 rounded-xl border border-gray-700/30 hover:border-cyan-500/50 hover:bg-black/60 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20 group">
              <div className="text-2xl font-bold text-cyan-400 mb-2 group-hover:animate-pulse">Multi-Format</div>
              <div className="text-gray-400 text-sm">Universal document compatibility</div>
            </div>
            <div className="text-center p-6 bg-black/40 rounded-xl border border-gray-700/30 hover:border-violet-500/50 hover:bg-black/60 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20 group">
              <div className="text-2xl font-bold text-violet-400 mb-2 group-hover:animate-pulse">Batch Processing</div>
              <div className="text-gray-400 text-sm">Concurrent document handling</div>
            </div>
            <div className="text-center p-6 bg-black/40 rounded-xl border border-gray-700/30 hover:border-green-500/50 hover:bg-black/60 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 group">
              <div className="text-2xl font-bold text-green-400 mb-2 group-hover:animate-pulse">Source Attribution</div>
              <div className="text-gray-400 text-sm">Precise reference tracking</div>
            </div>
            <div className="text-center p-6 bg-black/40 rounded-xl border border-gray-700/30 hover:border-orange-500/50 hover:bg-black/60 transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 group">
              <div className="text-2xl font-bold text-orange-400 mb-2 group-hover:animate-pulse">Export Ready</div>
              <div className="text-gray-400 text-sm">Multiple output formats</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;