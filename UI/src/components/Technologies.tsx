import React from 'react';

const Technologies: React.FC = () => {
  const technologies = [
    { name: 'FastAPI', logo: '⚡', description: 'Ultra-high performance async framework', color: 'cyan' },
    { name: 'LangChain', logo: '🦜', description: 'Advanced LLM orchestration platform', color: 'violet' },
    { name: 'FAISS', logo: '🔍', description: 'Meta\'s vector similarity engine', color: 'green' },
    { name: 'HuggingFace', logo: '🤗', description: 'Transformer ecosystem & models', color: 'orange' },
    { name: 'OpenAI GPT', logo: '🧠', description: 'Next-generation language intelligence', color: 'blue' },
    { name: 'Python', logo: '🐍', description: 'AI-optimized backend foundation', color: 'yellow' },
    { name: 'React', logo: '⚛️', description: 'Component-driven UI architecture', color: 'cyan' },
    { name: 'Tailwind CSS', logo: '💨', description: 'Atomic design system framework', color: 'teal' }
  ];

  return (
    <section className="py-20 relative">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-violet-500/5 rounded-full blur-xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Technology Foundation
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Engineered with cutting-edge, enterprise-grade technologies that deliver exceptional performance, 
            infinite scalability, and an unparalleled developer experience.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up animation-delay-200">
          {technologies.map((tech, index) => (
            <div 
              key={index}
              className="bg-black/60 border border-gray-700/30 rounded-xl p-6 text-center hover:bg-black/80 hover:border-cyan-500/50 transition-all duration-500 group hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                {tech.logo}
              </div>
              <h3 className={`text-lg font-bold text-${tech.color}-400 mb-2 group-hover:animate-pulse`}>
                {tech.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {tech.description}
              </p>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="max-w-5xl mx-auto animate-fade-in-up animation-delay-600">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">System Architecture</h3>
          <div className="bg-black/40 border border-gray-700/30 rounded-2xl p-8 hover:bg-black/60 hover:border-cyan-500/30 transition-all duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-4 group">
                <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl p-6 group-hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-cyan-500/30">
                  <h4 className="text-xl font-bold text-white mb-2">Frontend</h4>
                  <p className="text-cyan-100 text-sm">React + TypeScript + Modern UI</p>
                </div>
                <div className="text-gray-400 text-sm">
                  Responsive, interactive user experience with real-time capabilities
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-xl p-6 group-hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-violet-500/30">
                  <h4 className="text-xl font-bold text-white mb-2">Backend API</h4>
                  <p className="text-violet-100 text-sm">FastAPI + LangChain + Async</p>
                </div>
                <div className="text-gray-400 text-sm">
                  Ultra-fast API with streaming and concurrent processing
                </div>
              </div>

              <div className="space-y-4 group">
                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 group-hover:scale-105 transition-all duration-500 hover:shadow-lg hover:shadow-green-500/30">
                  <h4 className="text-xl font-bold text-white mb-2">AI Engine</h4>
                  <p className="text-green-100 text-sm">FAISS + Neural Networks + LLM</p>
                </div>
                <div className="text-gray-400 text-sm">
                  Advanced vector processing with intelligent AI generation
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-700/30 animate-fade-in-up animation-delay-800">
              <div className="flex justify-center items-center space-x-4 text-gray-400 text-sm">
                <span className="hover:text-cyan-400 transition-colors duration-300">Document Input</span>
                <span className="text-cyan-500">→</span>
                <span className="hover:text-violet-400 transition-colors duration-300">Neural Processing</span>
                <span className="text-violet-500">→</span>
                <span className="hover:text-green-400 transition-colors duration-300">Vector Indexing</span>
                <span className="text-green-500">→</span>
                <span className="hover:text-orange-400 transition-colors duration-300">Intelligent Retrieval</span>
                <span className="text-orange-500">→</span>
                <span className="hover:text-pink-400 transition-colors duration-300">AI Generation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;