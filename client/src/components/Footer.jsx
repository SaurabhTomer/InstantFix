import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-800 via-blue-700 to-yellow-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-yellow-500 rounded-lg mr-2"></div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-yellow-600 bg-clip-text text-transparent">InstantFix</span>
            </div>
            <p className="text-blue-100 mb-4">
              Your trusted platform for instant electrical services. Connect with certified electricians in minutes.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors cursor-pointer">
                <span className="text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors cursor-pointer">
                <span className="text-sm">t</span>
              </div>
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors cursor-pointer">
                <span className="text-sm">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-100 hover:text-yellow-300 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-blue-100 hover:text-yellow-300 transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-blue-100 hover:text-yellow-300 transition-colors">Services</Link></li>
              <li><Link to="/electricians" className="text-blue-100 hover:text-yellow-300 transition-colors">Find Electricians</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-blue-100">Emergency Repair</span></li>
              <li><span className="text-blue-100">Installation</span></li>
              <li><span className="text-blue-100">Maintenance</span></li>
              <li><span className="text-blue-100">Inspection</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-yellow-300">Contact Info</h3>
            <ul className="space-y-2 text-blue-100">
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                +1 234 567 8900
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                support@instantfix.com
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span>
                123 Electric Ave, City
              </li>
              <li className="flex items-center">
                <span className="mr-2">⏰</span>
                24/7 Service Available
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-600 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-100 text-sm">
              © 2024 InstantFix. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-blue-100 hover:text-yellow-300 transition-colors text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-blue-100 hover:text-yellow-300 transition-colors text-sm">Terms of Service</Link>
              <Link to="/refund" className="text-blue-100 hover:text-yellow-300 transition-colors text-sm">Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
