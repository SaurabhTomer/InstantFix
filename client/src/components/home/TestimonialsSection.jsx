import React from 'react';
import { FaStar, FaQuoteLeft, FaUserCircle } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Rahul Sharma",
      service: "Fan Repair",
      comment: "Outstanding service! The electrician arrived within 30 minutes and fixed my fan quickly. Very professional and affordable.",
      rating: 5,
      location: "Delhi"
    },
    {
      name: "Priya Patel",
      service: "Wiring Issue", 
      comment: "InstantFix saved my day! Had a major wiring problem and they sent an expert who solved it safely. Highly recommend!",
      rating: 5,
      location: "Mumbai"
    },
    {
      name: "Amit Kumar",
      service: "Switch Board",
      comment: "Great experience from booking to completion. The electrician was knowledgeable and the pricing was transparent.",
      rating: 4,
      location: "Bangalore"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"} />
    ));
  };

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Cpath d='M30 30l15-15v30L30 30zm0 0L15 45V15l15 15z'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 rounded-full px-4 py-2 mb-6 text-sm font-semibold">
            <FaQuoteLeft className="w-4 h-4" />
            ⚡ Customer Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            🔧 What Our Customers
            <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent"> Say About Us</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            ⚡ Real experiences from satisfied customers across India
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-8"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <FaQuoteLeft className="w-5 h-5 text-white" />
              </div>
              
              {/* Rating */}
              <div className="flex mb-6 justify-center">
                {renderStars(testimonial.rating)}
              </div>
              
              {/* Comment */}
              <p className="text-gray-700 mb-6 italic leading-relaxed text-center">
                "{testimonial.comment}"
              </p>
              
              {/* Customer Info */}
              <div className="border-t pt-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <FaUserCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                <p className="text-sm text-blue-600 font-medium">{testimonial.service}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {testimonial.location}</p>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-orange-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">5000+</div>
            <div className="text-gray-600 text-sm">Happy Customers</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600 text-sm">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">30min</div>
            <div className="text-gray-600 text-sm">Response Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
            <div className="text-gray-600 text-sm">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
