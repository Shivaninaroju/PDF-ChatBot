import React from 'react';
import { GraduationCap, Building, Users, Star } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const Testimonials: React.FC = () => {
  const useCases = [
    {
      icon: GraduationCap,
      title: 'Academic Excellence',
      description: 'Revolutionize research workflows with instant insights from academic papers, textbooks, and scholarly documents. Transform complex literature into accessible knowledge.',
      benefits: ['Accelerated research discovery', 'Comprehensive literature analysis', 'Intelligent study assistance'],
      color: 'cyan',
      gradient: 'from-cyan-500 to-cyan-600'
    },
    {
      icon: Building,
      title: 'Enterprise Intelligence',
      description: 'Transform complex business documents, contracts, and reports into actionable intelligence. Accelerate decision-making with instant document insights.',
      benefits: ['Strategic document analysis', 'Automated report synthesis', 'Compliance intelligence'],
      color: 'violet',
      gradient: 'from-violet-500 to-violet-600'
    },
    {
      icon: Users,
      title: 'Legal Innovation',
      description: 'Navigate intricate legal landscapes with AI-powered document analysis. Transform regulatory complexity into clear, actionable guidance.',
      benefits: ['Advanced legal research', 'Regulatory compliance automation', 'Risk assessment intelligence'],
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    }
  ];

  return (
    <section className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-cyan-500/5 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-violet-500/5 rounded-full blur-2xl animate-float-delayed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-green-400 bg-clip-text text-transparent animate-gradient-x">
              Transformative Applications
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Empowering professionals across diverse industries to unlock unprecedented insights 
            and accelerate knowledge discovery through intelligent document interaction.
          </p>
        </div>

        {/* Use Cases */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20 animate-fade-in-up animation-delay-200">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card 
                key={index}
                className="bg-black/60 border-gray-700/30 backdrop-blur-sm hover:bg-black/80 hover:border-cyan-500/30 transition-all duration-500 group hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/20 animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className={`bg-gradient-to-r ${useCase.gradient} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold text-${useCase.color}-400 mb-4 group-hover:animate-pulse`}>
                    {useCase.title}
                  </h3>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {useCase.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-300">
                        <div className={`w-2 h-2 bg-${useCase.color}-400 rounded-full mr-3 group-hover:animate-pulse`}></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Impact Areas */}
        <div className="mt-20 animate-fade-in-up animation-delay-600">
          <h3 className="text-3xl font-bold text-center mb-12 text-white">Impact Areas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group hover:scale-110 transition-all duration-500">
              <div className="text-3xl font-bold text-cyan-400 mb-2 group-hover:animate-pulse">Research</div>
              <div className="text-gray-400 text-sm">Academic & Scientific</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-500">
              <div className="text-3xl font-bold text-violet-400 mb-2 group-hover:animate-pulse">Business</div>
              <div className="text-gray-400 text-sm">Enterprise Solutions</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-500">
              <div className="text-3xl font-bold text-green-400 mb-2 group-hover:animate-pulse">Legal</div>
              <div className="text-gray-400 text-sm">Compliance & Analysis</div>
            </div>
            <div className="group hover:scale-110 transition-all duration-500">
              <div className="text-3xl font-bold text-orange-400 mb-2 group-hover:animate-pulse">Education</div>
              <div className="text-gray-400 text-sm">Learning Enhancement</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;