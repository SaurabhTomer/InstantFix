import { useNavigate } from 'react-router-dom'
import {
  FiZap, FiMapPin, FiPhone, FiMail,
  FiTwitter, FiInstagram, FiFacebook, FiLinkedin,
} from 'react-icons/fi'

const LINKS = {
  Company: [
    { label: 'About Us',     href: '#' },
    { label: 'Careers',      href: '#' },
    { label: 'Blog',         href: '#' },
    { label: 'Press',        href: '#' },
  ],
  Services: [
    { label: 'Wiring',           href: '#' },
    { label: 'Fan Installation', href: '#' },
    { label: 'AC Service',       href: '#' },
    { label: 'Emergency Repair', href: '#' },
  ],
  Support: [
    { label: 'Help Center',      href: '#' },
    { label: 'Safety',           href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy',   href: '#' },
  ],
}

const SOCIALS = [
  { icon: FiTwitter,   href: '#', label: 'Twitter'   },
  { icon: FiInstagram, href: '#', label: 'Instagram'  },
  { icon: FiFacebook,  href: '#', label: 'Facebook'   },
  { icon: FiLinkedin,  href: '#', label: 'LinkedIn'   },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-slate-900 text-slate-400">

      {/* ── top CTA strip ── */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Ready to fix it? Book in 2 minutes.
            </h3>
            <p className="text-sm text-blue-100">
              Verified electricians available 24/7 across India.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-white/20 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* ── main footer body ── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* brand column */}
          <div className="md:col-span-2">

            {/* logo */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <FiZap className="text-white text-lg" />
              </div>
              <span className="text-white text-lg font-bold tracking-tight">
                Instant<span className="text-blue-400">Fix</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed max-w-xs mb-6">
              India's most trusted platform for verified, on-demand
              electrical services. Fast, safe, and transparent — always.
            </p>

            {/* contact */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2.5 text-xs">
                <FiMapPin className="text-blue-400 shrink-0" />
                <span>123 Sector 18, Noida, Uttar Pradesh 201301</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <FiPhone className="text-blue-400 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <FiMail className="text-blue-400 shrink-0" />
                <span>support@instantfix.in</span>
              </div>
            </div>

            {/* socials */}
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: SocialIcon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-slate-800 hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors group"
                >
                  <SocialIcon className="text-slate-400 group-hover:text-white text-sm transition-colors" />
                </a>
              ))}
            </div>

          </div>

          {/* link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-white text-sm font-bold mb-4">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* ── bottom bar ── */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} InstantFix Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span>Made with</span>
            <span className="text-red-400">♥</span>
            <span>in India</span>
          </div>
        </div>
      </div>

    </footer>
  )
}