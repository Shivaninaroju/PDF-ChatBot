import React from 'react';
import { Brain, Database, Search, MessageSquare } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const About: React.FC = () => {
  return (
    <section className="py-20 relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-violet-500/10 rounded-full blur-xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              About the Project
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            This innovative RAG-based assistant transforms document interaction through cutting-edge AI technology. 
            By seamlessly integrating advanced retrieval mechanisms with state-of-the-art language models, 
            it delivers precise, contextual insights from your documents with unprecedented accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up animation-delay-200">
          <Card className="bg-black/60 border-cyan-500/30 backdrop-blur-sm hover:bg-black/80 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20 group">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 group-hover:animate-pulse">What is RAG?</h3>
              <p className="text-gray-300 leading-relaxed">
                Retrieval-Augmented Generation represents the pinnacle of AI-driven information processing. 
                This sophisticated framework enhances language models by intelligently retrieving relevant 
                information from vast knowledge bases, ensuring responses that are not only accurate but 
                contextually rich and dynamically informed.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-violet-500/30 backdrop-blur-sm hover:bg-black/80 hover:border-violet-400/50 transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-violet-500/20 group">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-violet-400 mb-4 group-hover:animate-pulse">How It Works</h3>
              <p className="text-gray-300 leading-relaxed">
                Our advanced system employs sophisticated document processing to create high-dimensional semantic 
                embeddings, storing them in optimized vector databases. Through intelligent similarity search 
                and contextual retrieval, it generates precise, nuanced responses using cutting-edge language models.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow */}
        <div className="max-w-6xl mx-auto animate-fade-in-up animation-delay-400">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center group animate-fade-in-up animation-delay-500">
              <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50">
                <Database className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-2 group-hover:animate-pulse">1. Document Upload</h4>
              <p className="text-gray-400 text-sm">Seamless document ingestion with intelligent preprocessing</p>
            </div>

            <div className="text-center group animate-fade-in-up animation-delay-600">
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-violet-400 mb-2 group-hover:animate-pulse">2. Neural Embeddings</h4>
              <p className="text-gray-400 text-sm">Advanced semantic vectorization using transformer models</p>
            </div>

            <div className="text-center group animate-fade-in-up animation-delay-700">
              <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-green-500/30 hover:shadow-green-500/50">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-green-400 mb-2 group-hover:animate-pulse">3. Intelligent Retrieval</h4>
              <p className="text-gray-400 text-sm">High-precision similarity search with contextual ranking</p>
            </div>

            <div className="text-center group animate-fade-in-up animation-delay-800">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-orange-400 mb-2 group-hover:animate-pulse">4. AI Generation</h4>
              <p className="text-gray-400 text-sm">Contextually-aware response synthesis with precision</p>
            </div>
          </div>
        </div>

        {/* Tech Stack Preview */}
        <div className="mt-20 text-center animate-fade-in-up animation-delay-900">
          <h3 className="text-2xl font-bold text-white mb-8">Powered by Cutting-Edge Technologies</h3>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
            <span className="text-cyan-400 font-semibold hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">FastAPI</span>
            <span className="text-gray-500">•</span>
            <span className="text-violet-400 font-semibold hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">LangChain</span>
            <span className="text-gray-500">•</span>
            <span className="text-green-400 font-semibold hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">FAISS</span>
            <span className="text-gray-500">•</span>
            <span className="text-orange-400 font-semibold hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">HuggingFace</span>
            <span className="text-gray-500">•</span>
            <span className="text-blue-400 font-semibold hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer">OpenAI GPT</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;