import React from 'react';
import { FaStar, FaCheckCircle, FaClock, FaArrowRight, FaInfoCircle, FaChevronDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Top Right Get Started Button */}
      <div className="absolute top-6 right-6 z-20">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 py-3 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
      {/* Background with gradient and premium pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Premium geometric pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
          }}
        ></div>
        
        {/* Radial gradient overlay for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(251, 191, 36, 0.1) 0%, transparent 50%)'
          }}
        ></div>
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-600/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-400/20 to-transparent"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Premium badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-white text-sm font-medium">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          ⚡ Available 24/7 Emergency Service
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            InstantFix
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Professional electrical repairs at your fingertips. 
          <span className="block text-yellow-300 font-semibold mt-2">⚡ Fast • 🔧 Reliable • ⚡ Trusted</span>
        </p>

        {/* Electrician SVG Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <svg 
              width="400" 
              height="200" 
              viewBox="0 0 400 200" 
              className="w-full max-w-md h-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Definitions for gradients and filters */}
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#60a5fa', stopOpacity: 0.1}} />
                  <stop offset="100%" style={{stopColor: '#3b82f6', stopOpacity: 0.05}} />
                </linearGradient>
                
                <linearGradient id="hardHatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#fde047'}} />
                  <stop offset="100%" style={{stopColor: '#f59e0b'}} />
                </linearGradient>
                
                <linearGradient id="uniformGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#60a5fa'}} />
                  <stop offset="100%" style={{stopColor: '#3b82f6'}} />
                </linearGradient>
                
                <linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor: '#4b5563'}} />
                  <stop offset="100%" style={{stopColor: '#374151'}} />
                </linearGradient>
                
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Premium background circle with gradient */}
              <circle cx="200" cy="100" r="85" fill="url(#bgGradient)" />
              <circle cx="200" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              
              {/* Electrician figure with premium styling */}
              <g transform="translate(200, 100)">
                {/* Shadow */}
                <ellipse cx="0" cy="35" rx="15" ry="3" fill="rgba(0,0,0,0.2)" />
                
                {/* Head with gradient */}
                <circle cx="0" cy="-30" r="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                
                {/* Premium hard hat with gradient */}
                <path d="M -14,-37 Q 0,-44 14,-37 L 12,-31 L -12,-31 Z" fill="url(#hardHatGradient)" stroke="#d97706" strokeWidth="1" />
                <rect x="-3" y="-40" width="6" height="3" fill="#dc2626" rx="1" />
                <rect x="-8" y="-34" width="16" height="2" fill="#d97706" opacity="0.5" />
                
                {/* Body with gradient */}
                <rect x="-10" y="-18" width="20" height="28" fill="url(#uniformGradient)" rx="3" />
                <rect x="-10" y="-18" width="20" height="5" fill="#1e40af" opacity="0.3" rx="3" />
                
                {/* Premium arms with better positioning */}
                <rect x="-22" y="-15" width="14" height="4" fill="#fbbf24" rx="2" />
                <rect x="8" y="-15" width="14" height="4" fill="#fbbf24" rx="2" />
                
                {/* Legs with gradient */}
                <rect x="-7" y="10" width="5" height="22" fill="#1e40af" rx="2" />
                <rect x="2" y="10" width="5" height="22" fill="#1e40af" rx="2" />
                
                {/* Premium wrench in hand */}
                <g transform="translate(20, -15) rotate(45)">
                  <rect x="-2.5" y="-10" width="5" height="20" fill="#9ca3af" rx="1" />
                  <rect x="-8" y="-10" width="16" height="5" fill="#6b7280" rx="1" />
                  <rect x="-8" y="5" width="16" height="5" fill="#6b7280" rx="1" />
                  <circle cx="0" cy="0" r="3" fill="#4b5563" />
                </g>
                
                {/* Premium tool belt */}
                <rect x="-12" y="8" width="24" height="5" fill="#374151" rx="2" />
                <rect x="-8" y="4" width="4" height="4" fill="#ef4444" rx="1" />
                <rect x="-2" y="4" width="4" height="4" fill="#3b82f6" rx="1" />
                <rect x="4" y="4" width="4" height="4" fill="#22c55e" rx="1" />
              </g>
              
              {/* Premium electrical panel */}
              <g transform="translate(100, 80)">
                {/* Panel shadow */}
                <rect x="-23" y="-17" width="46" height="36" fill="rgba(0,0,0,0.3)" rx="3" />
                
                {/* Main panel with gradient */}
                <rect x="-25" y="-20" width="50" height="40" fill="url(#panelGradient)" rx="4" stroke="#1f2937" strokeWidth="2" />
                <rect x="-20" y="-15" width="40" height="30" fill="#111827" rx="2" />
                
                {/* Premium circuit breakers with indicators */}
                <g>
                  <rect x="-15" y="-10" width="8" height="6" fill="#dc2626" rx="1" />
                  <rect x="-5" y="-10" width="8" height="6" fill="#22c55e" rx="1" />
                  <rect x="5" y="-10" width="8" height="6" fill="#22c55e" rx="1" />
                  
                  <rect x="-15" y="0" width="8" height="6" fill="#22c55e" rx="1" />
                  <rect x="-5" y="0" width="8" height="6" fill="#dc2626" rx="1" />
                  <rect x="5" y="0" width="8" height="6" fill="#22c55e" rx="1" />
                  
                  {/* LED indicators */}
                  <circle cx="-11" cy="-7" r="1" fill="#ef4444" opacity="0.8" />
                  <circle cx="-1" cy="-7" r="1" fill="#22c55e" opacity="0.8" />
                  <circle cx="9" cy="-7" r="1" fill="#22c55e" opacity="0.8" />
                </g>
                
                {/* Premium screws */}
                <circle cx="-20" cy="-15" r="2.5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                <circle cx="20" cy="-15" r="2.5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                <circle cx="-20" cy="15" r="2.5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                <circle cx="20" cy="15" r="2.5" fill="#6b7280" stroke="#4b5563" strokeWidth="1" />
                
                {/* Brand label */}
                <rect x="-10" y="8" width="20" height="4" fill="#1f2937" rx="1" />
                <text x="0" y="11" textAnchor="middle" fill="#6b7280" fontSize="3" fontFamily="monospace">INSTANTFIX</text>
              </g>
              
              {/* Premium wires with better curves */}
              <g>
                <path d="M 125,80 Q 150,65 180,72" stroke="#ef4444" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 125,85 Q 150,75 180,77" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
                <path d="M 125,90 Q 150,85 180,82" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
                
                {/* Wire highlights */}
                <path d="M 125,80 Q 150,65 180,72" stroke="#fca5a5" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M 125,85 Q 150,75 180,77" stroke="#86efac" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
                <path d="M 125,90 Q 150,85 180,82" stroke="#93c5fd" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6" />
              </g>
              
              {/* Premium spark effects with glow */}
              <g transform="translate(175, 75)" filter="url(#glow)">
                <path d="M 0,-10 L 3,-2 L -3,-2 Z" fill="#fde047" opacity="0.9">
                  <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
                </path>
                <path d="M 6,0 L 10,3 L 10,-3 Z" fill="#fde047" opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" begin="0.5s" repeatCount="indefinite" />
                </path>
                <path d="M -4,6 L -1,10 L -7,10 Z" fill="#fde047" opacity="0.8">
                  <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" begin="1s" repeatCount="indefinite" />
                </path>
                <circle cx="0" cy="0" r="2" fill="#fbbf24" opacity="0.6">
                  <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10 flex items-center gap-2">
              Book Service Now
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <button className="group border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300">
            <span className="flex items-center gap-2">
              Learn More
              <FaInfoCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-col sm:flex-row gap-8 justify-center items-center text-white/80">
          <div className="flex items-center gap-2">
            <FaStar className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium">⚡ 4.9/5 Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm font-medium">🔧 Verified Professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">⚡ 30 Min Response</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/50 animate-bounce">
        <FaChevronDown className="w-6 h-6" />
      </div>
    </div>
  );
};

export default HeroSection;
