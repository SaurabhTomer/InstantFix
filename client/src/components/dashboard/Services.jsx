import React, { useState } from 'react';
import { FaTools, FaBolt, FaLightbulb, FaPlug, FaFan, FaSearch, FaStar, FaClock } from 'react-icons/fa';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Services', icon: FaTools },
    { id: 'lighting', name: 'Lighting', icon: FaLightbulb },
    { id: 'wiring', name: 'Wiring', icon: FaBolt },
    { id: 'appliances', name: 'Appliances', icon: FaPlug },
    { id: 'fans', name: 'Fans & Cooling', icon: FaFan }
  ];

  const services = [
    {
      id: 1,
      name: 'Fan Installation & Repair',
      category: 'fans',
      description: 'Complete fan installation, wiring, and repair services for all types of fans',
      price: 'Starting from $50',
      duration: '1-2 hours',
      rating: 4.8,
      image: 'fan',
      popular: true
    },
    {
      id: 2,
      name: 'LED Light Installation',
      category: 'lighting',
      description: 'Professional LED light installation for homes and offices with energy-efficient solutions',
      price: 'Starting from $30',
      duration: '30-60 minutes',
      rating: 4.9,
      image: 'light',
      popular: true
    },
    {
      id: 3,
      name: 'Switch Board Repair',
      category: 'wiring',
      description: 'Repair and replacement of switch boards, circuit breakers, and electrical panels',
      price: 'Starting from $40',
      duration: '1-2 hours',
      rating: 4.7,
      image: 'switch',
      popular: false
    },
    {
      id: 4,
      name: 'Wiring & Rewiring',
      category: 'wiring',
      description: 'Complete wiring solutions for new constructions and rewiring for old properties',
      price: 'Starting from $100',
      duration: '2-4 hours',
      rating: 4.6,
      image: 'wiring',
      popular: false
    },
    {
      id: 5,
      name: 'AC Installation',
      category: 'appliances',
      description: 'Air conditioner installation, wiring, and maintenance services',
      price: 'Starting from $80',
      duration: '2-3 hours',
      rating: 4.8,
      image: 'ac',
      popular: true
    },
    {
      id: 6,
      name: 'Geyser Installation',
      category: 'appliances',
      description: 'Water geyser installation, plumbing connections, and electrical setup',
      price: 'Starting from $60',
      duration: '1-2 hours',
      rating: 4.5,
      image: 'geyser',
      popular: false
    }
  ];

  const getServiceIcon = (serviceName) => {
    if (serviceName.toLowerCase().includes('fan')) return FaFan;
    if (serviceName.toLowerCase().includes('light')) return FaLightbulb;
    if (serviceName.toLowerCase().includes('switch') || serviceName.toLowerCase().includes('wiring')) return FaBolt;
    return FaTools;
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h2>
        <p className="text-gray-600">Professional electrical services for all your needs</p>
      </div>

      {/* Category Filter */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search for services..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const Icon = getServiceIcon(service.name);
          return (
            <div key={service.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
              {/* Service Header */}
              <div className="relative">
                <div className="h-32 bg-gradient-to-br from-yellow-100 to-amber-100 flex items-center justify-center">
                  <Icon className="w-16 h-16 text-yellow-600" />
                </div>
                {service.popular && (
                  <div className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
                    Popular
                  </div>
                )}
              </div>

              {/* Service Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                {/* Service Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-semibold text-green-600">{service.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <FaClock className="w-3 h-3" />
                      Duration:
                    </span>
                    <span className="font-medium text-gray-700">{service.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <FaStar className="w-3 h-3 text-yellow-500" />
                      Rating:
                    </span>
                    <span className="font-medium text-gray-700">{service.rating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-semibold rounded-xl hover:from-yellow-500 hover:to-amber-600 transition-all">
                  Book Service
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <FaTools className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Emergency Service Banner */}
      <div className="mt-8 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Emergency Electrical Service</h3>
            <p className="opacity-90">24/7 emergency electrical services available</p>
          </div>
          <button className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors">
            Call Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Services;
