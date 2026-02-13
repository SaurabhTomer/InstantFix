function HowItWorks() {
  const steps = [
    { number: 1, title: "Sign Up", description: "Create your account in seconds" },
    { number: 2, title: "Post Request", description: "Describe your electrical issue" },
    { number: 3, title: "Get Matched", description: "Connected with available electricians" },
    { number: 4, title: "Get Service", description: "Professional service at your doorstep" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-blue-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-blue-800 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Get your electrical issues resolved in 4 simple steps
          </p>
        </div>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-300 via-yellow-300 to-blue-300 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative group">
                {/* Step Circle */}
                <div className="relative z-10 mx-auto mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-yellow-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    {step.number}
                  </div>
                  {/* Pulse Animation */}
                  <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-blue-700 to-yellow-600 rounded-full opacity-0 group-hover:opacity-20 animate-ping"></div>
                </div>
                
                {/* Content */}
                <div className="text-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:-translate-y-2">
                  <h3 className="text-xl font-bold mb-3 text-blue-800">{step.title}</h3>
                  <p className="text-blue-700">{step.description}</p>
                  
                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 text-2xl text-yellow-600">
                      →
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Arrow Indicators */}
        <div className="md:hidden flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <div key={index} className="w-2 h-2 bg-blue-700 rounded-full"></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
