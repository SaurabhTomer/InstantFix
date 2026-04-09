import { Link } from "react-router-dom";
import { Zap, Clock, Mail, Phone } from "lucide-react";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Instant<span className="text-yellow-400">Fix</span>
          </span>
        </Link>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg">
          {/* Status Icon */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-yellow-600" />
          </div>

          <h1 className="text-2xl font-extrabold mb-3 tracking-tight">Registration Submitted!</h1>
          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Your electrician account has been submitted for admin approval. 
            You'll be notified once your account is reviewed and approved.
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 mb-2 text-sm">What happens next?</h3>
              <ul className="text-xs text-blue-800 space-y-1 text-left">
                <li>• Admin will review your application</li>
                <li>• Verification process typically takes 24-48 hours</li>
                <li>• You'll receive an email confirmation</li>
                <li>• Once approved, you can start accepting jobs</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">Need help?</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail size={12} />
                  <span>support@instantfix.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={12} />
                  <span>+1-800-INSTANT</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center"
            >
              Back to Login
            </Link>
            
            <Link
              to="/"
              className="w-full py-3 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-xl text-sm transition-all flex items-center justify-center"
            >
              Go to Homepage
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Thank you for your patience. We're excited to have you join our team of professional electricians!
        </p>
      </div>
    </div>
  );
}
