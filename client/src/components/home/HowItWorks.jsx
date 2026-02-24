import React from 'react';
import { FaEdit, FaUserCheck, FaTools, FaCreditCard } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      step: "1",
      title: "Book Service",
      description: "Describe your electrical issue and location details",
      icon: FaEdit,
      color: "from-blue-500 to-blue-600"
    },
    {
      step: "2", 
      title: "Get Matched",
      description: "We connect you with nearby available electricians",
      icon: FaUserCheck,
      color: "from-purple-500 to-purple-600"
    },
    {
      step: "3",
      title: "Get Fixed",
      description: "Professional electrician arrives and fixes the issue",
      icon: FaTools,
      color: "from-green-500 to-green-600"
    },
    {
      step: "4",
      title: "Pay & Rate",
      description: "Secure payment and share your experience",
      icon: FaCreditCard,
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.03'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            ⚡ How It Works
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🔧 Get Your Electrical Issues
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Fixed in 4 Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ⚡ Simple, fast, and reliable process to get your electrical problems solved
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="relative group">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 -z-10"></div>
                )}
                
                {/* Step Card */}
                <div className="relative bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8 text-center">
                  {/* Step Number */}
                  <div className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${item.color} text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg`}>
                    {item.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  
                  {/* Hover effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <span>Get Started Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
