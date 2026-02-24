import React from 'react';
import { FaFan, FaLightbulb, FaPlug, FaBolt, FaTools, FaExclamationTriangle } from 'react-icons/fa';

const ServicesSection = () => {
  const services = [
    {
      title: "Fan Repair",
      description: "Expert fan motor repairs and replacements",
      icon: FaFan,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Light Fixtures", 
      description: "Complete lighting installation and repair",
      icon: FaLightbulb,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      title: "Switch Boards",
      description: "Modern switch board installation and repairs", 
      icon: FaPlug,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Wiring Issues",
      description: "Professional wiring and rewiring services",
      icon: FaBolt,
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Circuit Problems",
      description: "MCB, fuse and complete circuit repairs",
      icon: FaTools,
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "Emergency Service",
      description: "24/7 emergency electrical support",
      icon: FaExclamationTriangle,
      gradient: "from-indigo-500 to-purple-600"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233b82f6' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            ⚡ Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            ⚡ Complete Electrical
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Solutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            🔧 Professional electrical services for your home and business needs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                {/* Icon container */}
                <div className={`relative p-8 pb-4 bg-gradient-to-br ${service.gradient} rounded-t-2xl`}>
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-8 pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  {/* Hover indicator */}
                  <div className="flex items-center text-blue-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn More</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
