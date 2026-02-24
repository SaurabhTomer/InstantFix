import React from 'react';
import { FaTools, FaArrowRight, FaPhone, FaClock } from 'react-icons/fa';

const CTASection = () => {
  return (
    <div className="relative py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
      </div>

      {/* Pattern overlay */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M20 20l10-10v20L20 20zm0 0L10 30V10l10 10z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8">
          <FaTools className="w-10 h-10 text-white" />
        </div>

        {/* Main Content */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          ⚡ Need Electrical Help
          <span className="block text-yellow-300">Right Now?</span>
        </h2>
        
        <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
          🔧 Join thousands of satisfied customers who trust InstantFix for reliable, 
          fast, and professional electrical services across India
        </p>

        {/* Emergency Info */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <FaPhone className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">24/7 Emergency Support</span>
          </div>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <FaClock className="w-5 h-5 text-green-300" />
            <span className="text-white font-medium">30 Min Response Time</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10 flex items-center gap-3">
              Create Service Request
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <button className="group border-2 border-white/40 backdrop-blur-sm text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300">
            <span className="flex items-center gap-3">
              Become an Electrician
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8">
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            Verified Professionals
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            Secure Payments
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            Satisfaction Guaranteed
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
