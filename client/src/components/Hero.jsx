import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-800 via-blue-700 to-yellow-600 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-yellow-500 rounded-lg mr-2"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">InstantFix</span>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-3">
              <Link 
                to="/login" 
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.6'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 py-24 pt-24">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white bg-opacity-25 rounded-full mb-8 backdrop-blur-sm shadow-xl">
            <span className="text-5xl font-bold text-yellow-300">⚡</span>
          </div>
          
          <h1 className="text-7xl font-bold mb-8 animate-fade-in text-yellow-100">
            InstantFix - Your Trusted Electrical Service Platform
          </h1>
          
          <p className="text-3xl mb-8 text-yellow-50 font-light">
            Connect with certified electricians in minutes
          </p>
          
          <p className="text-xl mb-16 max-w-4xl mx-auto text-yellow-100 leading-relaxed">
            Fast, reliable, and professional electrical services at your fingertips. Get instant help for all your electrical needs from verified professionals.
          </p>
          
          <div className="mt-20 flex justify-center space-x-12 text-lg">
            <div className="flex items-center bg-yellow-600 bg-opacity-30 px-6 py-3 rounded-full backdrop-blur-sm border border-yellow-400">
              <span className="mr-3 text-yellow-200">⚡</span>
              <span className="font-medium">Instant Service</span>
            </div>
            <div className="flex items-center bg-blue-600 bg-opacity-30 px-6 py-3 rounded-full backdrop-blur-sm border border-blue-400">
              <span className="mr-3 text-blue-200">✓</span>
              <span className="font-medium">Verified Electricians</span>
            </div>
            <div className="flex items-center bg-green-600 bg-opacity-30 px-6 py-3 rounded-full backdrop-blur-sm border border-green-400">
              <span className="mr-3 text-green-200">💰</span>
              <span className="font-medium">Fair Pricing</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 text-yellow-50" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
