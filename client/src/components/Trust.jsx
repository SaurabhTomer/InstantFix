function Trust() {
  const stats = [
    { number: "10,000+", label: "Happy Customers", color: "text-blue-700" },
    { number: "500+", label: "Verified Electricians", color: "text-yellow-700" },
    { number: "50,000+", label: "Services Completed", color: "text-green-700" }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      rating: 5,
      text: "Amazing service! The electrician arrived within 30 minutes and fixed my issue quickly. Very professional.",
      avatar: "RS"
    },
    {
      name: "Priya Patel",
      rating: 5,
      text: "InstantFix saved my day! Had an electrical emergency and they connected me with a certified electrician immediately.",
      avatar: "PP"
    },
    {
      name: "Amit Kumar",
      rating: 4,
      text: "Great platform! Easy to use and the electricians are really skilled. Pricing is transparent too.",
      avatar: "AK"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-yellow-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-blue-800 mb-6">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Join our growing community of satisfied customers
          </p>
        </div>
        
        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-6xl font-bold mb-4 ${stat.color} transform transition-transform duration-300 group-hover:scale-110`}>
                {stat.number}
              </div>
              <p className="text-blue-800 text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-blue-300 opacity-50 text-2xl">
                  "
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 text-lg">{testimonial.name}</h4>
                    <div className="flex text-yellow-600 text-lg">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>{i < testimonial.rating ? "★" : "☆"}</span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-blue-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                
                {/* Verified Badge */}
                <div className="mt-6 flex items-center text-sm text-green-700">
                  <span className="mr-2">✓</span>
                  Verified Customer
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Trust;
