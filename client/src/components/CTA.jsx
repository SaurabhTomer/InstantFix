import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-yellow-600 text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <div className="mb-8">
          <h2 className="text-5xl font-bold mb-6 text-yellow-100">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-yellow-50 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust InstantFix for their electrical needs
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
          <Link 
            to="/signup" 
            className="group bg-yellow-600 hover:bg-yellow-700 text-white px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center">
              Sign Up Now
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
          
          <Link 
            to="/login" 
            className="border-3 border-white text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-800 transition-all duration-300 transform hover:scale-105"
          >
            Login
          </Link>
        </div>
        
        {/* Trust Indicators */}
        <div className="flex justify-center space-x-12 text-sm">
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="mr-2 text-yellow-300">✓</span>
            No Credit Card Required
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="mr-2 text-yellow-300">✓</span>
            Free to Join
          </div>
          <div className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="mr-2 text-yellow-300">✓</span>
            Cancel Anytime
          </div>
        </div>
      </div>
      
      {/* Top Wave */}
      <div className="absolute top-0 left-0 right-0 transform rotate-180">
        <svg className="w-full h-20 text-blue-50" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}

export default CTA;
