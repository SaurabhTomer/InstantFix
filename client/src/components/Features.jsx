function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-yellow-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-blue-800 mb-6">
            Why Choose InstantFix?
          </h2>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            We provide the best electrical service experience with verified professionals and transparent pricing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-4xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800 text-center">Instant Service</h3>
              <p className="text-blue-700 text-center leading-relaxed">
                Get connected with electricians in minutes. No more waiting for days to get your electrical issues resolved.
              </p>
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-blue-700 font-semibold">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-4xl">✓</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800 text-center">Verified Professionals</h3>
              <p className="text-blue-700 text-center leading-relaxed">
                All electricians are background-checked, certified, and verified to ensure quality and safety for your home.
              </p>
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-yellow-700 font-semibold">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-green-700 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-4xl">💰</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-blue-800 text-center">Fair Pricing</h3>
              <p className="text-blue-700 text-center leading-relaxed">
                Transparent pricing with no hidden charges. Know the cost upfront before you book any service.
              </p>
              <div className="mt-6 text-center">
                <span className="inline-flex items-center text-green-700 font-semibold">
                  Learn more
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
