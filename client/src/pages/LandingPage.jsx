import { useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: "⚡", title: "Instant Booking",      desc: "Book a certified electrician in under 2 minutes, anytime of the day or night." },
  { icon: "🛡️", title: "Verified Pros",        desc: "Every electrician is background-checked, licensed, and insured for your safety." },
  { icon: "📍", title: "Live Tracking",         desc: "Track your electrician in real-time from dispatch to your doorstep." },
  { icon: "💳", title: "Transparent Pricing",   desc: "Upfront quotes with zero hidden charges. Pay only when the job is done." },
  { icon: "🔧", title: "All Electrical Work",   desc: "From fixing a socket to full panel upgrades — we handle everything." },
  { icon: "⭐", title: "Rated & Reviewed",      desc: "Read real reviews from verified customers before you book." },
];

const steps = [
  { n: "01", title: "Describe the job",  desc: "Tell us what needs fixing — wiring, panel, outlets, short circuit, anything electrical." },
  { n: "02", title: "Get matched fast",  desc: "We instantly find the nearest available verified electrician in your city." },
  { n: "03", title: "Track & relax",     desc: "Watch your pro arrive in real-time. Get notified at every step." },
  { n: "04", title: "Pay securely",      desc: "Pay in-app only after the job is done and you're fully satisfied." },
];

const testimonials = [
  { name: "Riya Sharma",    role: "Homeowner, Delhi",      text: "Got an electrician in 15 minutes on a Sunday night. Absolute lifesaver when my main fuse blew.",  avatar: "RS" },
  { name: "Amit Verma",     role: "Shop Owner, Mumbai",    text: "Used InstantFix for my entire shop rewiring. Professional team, clean work, zero mess left behind.", avatar: "AV" },
  { name: "Priya Nair",     role: "Apartment Owner, Pune", text: "The live tracking feature is brilliant. I knew exactly when the electrician would arrive.",          avatar: "PN" },
  { name: "Suresh Reddy",   role: "Homeowner, Hyderabad",  text: "Transparent pricing — no surprises on the bill. Booked twice already and will keep coming back.",    avatar: "SR" },
  { name: "Neha Gupta",     role: "Homeowner, Bangalore",  text: "Super easy to use. Described the problem, got matched, done in an hour. Incredible service.",        avatar: "NG" },
  { name: "Karan Mehta",    role: "Cafe Owner, Jaipur",    text: "Fixed our cafe's entire lighting setup overnight. The electrician was skilled and very professional.", avatar: "KM" },
];

const services = [
  { icon: "🔌", title: "Wiring & Rewiring",    desc: "Complete home or office wiring solutions" },
  { icon: "💡", title: "Lighting Installation", desc: "Indoor, outdoor, and smart lighting setups" },
  { icon: "🔋", title: "Panel Upgrades",        desc: "MCB, fuse box, and distribution board work" },
  { icon: "🏠", title: "Home Automation",       desc: "Smart switches, sensors, and automation" },
  { icon: "🌀", title: "Fan & AC Wiring",       desc: "Ceiling fans, AC units, and exhaust fans" },
  { icon: "🛡️", title: "Safety Inspections",   desc: "Full electrical audit and safety check" },
];

const faqs = [
  { q: "How quickly can I get an electrician?",        a: "Most bookings are fulfilled within 15–30 minutes depending on your location and time of day." },
  { q: "Are the electricians verified?",               a: "Yes. Every electrician on InstantFix is background-checked, licensed, and has passed our skills test." },
  { q: "What areas do you cover?",                     a: "We currently operate in Delhi, Mumbai, Bangalore, Pune, Hyderabad, and Jaipur — with more cities coming soon." },
  { q: "How does pricing work?",                       a: "You get an upfront quote before confirming. No hidden charges. You pay only after the job is completed." },
  { q: "Can I schedule a booking in advance?",         a: "Absolutely. You can book for right now or schedule up to 7 days in advance." },
  { q: "What if I'm not satisfied with the service?",  a: "We offer a satisfaction guarantee. If you're not happy, we'll send another electrician at no extra charge." },
];

export default function LandingPage() {
  const navigate   = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-[#f8f7f2] text-[#0a0a0a] min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-[#f8f7f2]/90 backdrop-blur border-b border-black/[0.08] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center text-lg">⚡</div>
          <span className="text-xl font-bold tracking-tight">
            Instant<span className="text-yellow-400">Fix</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Services", "How it works", "Reviews", "FAQ"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-black/60 hover:text-yellow-400 transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
                    <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-black/60 hover:text-yellow-400 transition-colors hidden sm:block">
            Login
          </button>
          <button onClick={() => navigate("/register")}
            className="px-5 py-2 text-sm font-semibold bg-yellow-400 text-black rounded-xl hover:bg-yellow-300 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="px-6 pt-28 pb-28 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-xs font-semibold px-4 py-2 rounded-full mb-10 tracking-wide uppercase">
          ⚡ On-demand electricians — available 24/7
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-8">
          Electrical fixes,<br />
          <span className="text-yellow-400">instantly.</span>
        </h1>

        <p className="text-lg text-black/40 max-w-2xl mx-auto mb-12 leading-relaxed">
          Connect with certified electricians in your city within minutes.
          Safe, fast, and affordable — guaranteed every single time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button onClick={() => navigate("/register")}
            className="px-10 py-4 bg-yellow-400 text-black font-bold rounded-2xl text-base hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95">
            Book an Electrician →
          </button>
          <button onClick={() => navigate("/register?role=electrician")}
            className="px-10 py-4 bg-white border border-black/[0.07] text-black font-medium rounded-2xl text-base hover:bg-black/[0.04] transition-all">
            Join as Electrician
          </button>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto`}>
          {[
            ["10,000+", "Jobs Completed"],
            ["500+",    "Verified Electricians"],
            ["4.9 ★",   "Average Rating"],
            ["15 min",  "Avg. Response Time"],
          ].map(([val, label]) => (
            <div key={label} className="bg-black/[0.04] rounded-2xl py-5 px-4">
              <div className="text-2xl font-extrabold text-yellow-400 mb-1">{val}</div>
              <div className="text-xs text-black/40 font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="px-6 py-24 bg-white border-y border-black/[0.08]">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">What we fix</p>
          <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight">Our Services</h2>
          <p className="text-center text-black/40 text-sm mb-14 max-w-xl mx-auto leading-relaxed">
            From small repairs to full installations — our certified electricians handle every job with precision.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <div key={s.title}
                className="bg-white border border-black/[0.07] rounded-2xl p-7 hover:border-yellow-400/40 transition-all group cursor-pointer">
                <div className="text-4xl mb-5">{s.icon}</div>
                <h3 className="font-bold text-base mb-2 group-hover:text-yellow-400 transition-colors">{s.title}</h3>
                <p className="text-sm text-black/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 py-24 max-w-5xl mx-auto">
        <p className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Why us</p>
        <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight">Why InstantFix?</h2>
        <p className="text-center text-black/40 text-sm mb-14 max-w-xl mx-auto leading-relaxed">
          We built InstantFix to make getting electrical help as easy as ordering food.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className="bg-white border border-black/[0.07] rounded-2xl p-7 hover:border-yellow-400/30 transition-all group">
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-bold text-sm mb-3 group-hover:text-yellow-400 transition-colors">{f.title}</h3>
              <p className="text-xs text-black/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="px-6 py-24 bg-white border-y border-black/[0.08]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Simple process</p>
          <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight">How it works</h2>
          <p className="text-center text-black/40 text-sm mb-16 max-w-xl mx-auto leading-relaxed">
            Four simple steps to get your electrical problem solved today.
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={s.n} className="relative text-center md:text-left">
                <div className="text-7xl font-extrabold text-black/[0.05] mb-3 leading-none">
                  {s.n}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-black/[0.07] -translate-x-4" />
                )}
                <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 rounded-xl flex items-center justify-center text-yellow-400 font-bold text-sm mb-4 mx-auto md:mx-0">
                  {i + 1}
                </div>
                <h3 className="font-bold text-base mb-2">{s.title}</h3>
                <p className="text-xs text-black/40 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="px-6 py-24 max-w-6xl mx-auto">
        <p className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Real customers</p>
        <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight">What people say</h2>
        <p className="text-center text-black/40 text-sm mb-14 max-w-xl mx-auto leading-relaxed">
          Thousands of happy customers trust InstantFix for all their electrical needs.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t2) => (
            <div key={t2.name}
              className="bg-white border border-black/[0.07] rounded-2xl p-7 flex flex-col gap-5">
              <div className="text-sm text-black/60 leading-relaxed">"{t2.text}"</div>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-black/[0.08]">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-xs font-bold text-yellow-400">
                  {t2.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t2.name}</div>
                  <div className="text-xs text-black/40">{t2.role}</div>
                </div>
                <div className="ml-auto text-yellow-400 text-xs font-bold">★★★★★</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR ELECTRICIANS ── */}
      <section className="px-6 py-24 bg-white border-y border-black/[0.08]">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <p className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">For professionals</p>
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
              Are you an electrician?<br />
              <span className="text-yellow-400">Join our network.</span>
            </h2>
            <p className="text-black/40 text-sm leading-relaxed mb-10 max-w-lg">
              Get access to hundreds of job requests in your city every day.
              Set your own schedule, grow your income, and build your reputation.
            </p>
            <div className="space-y-4 mb-10">
              {[
                "Verified badge boosts customer trust",
                "Get paid directly and securely in-app",
                "Flexible schedule — work when you want",
                "Dedicated support to help you succeed",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-yellow-400 text-xs">✓</div>
                  <span className="text-sm text-black/60">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/register?role=electrician")}
              className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-2xl text-sm hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95">
              Apply as Electrician →
            </button>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 w-full max-w-sm">
            {[
              { val: "₹800–₹2500", label: "Avg. earnings per job" },
              { val: "3 days",     label: "Avg. approval time" },
              { val: "500+",       label: "Active electricians" },
              { val: "24/7",       label: "Support available" },
            ].map(({ val, label }) => (
              <div key={label} className="bg-white border border-black/[0.07] rounded-2xl p-6 text-center">
                <div className="text-2xl font-extrabold text-yellow-400 mb-2">{val}</div>
                <div className="text-xs text-black/40 font-medium leading-relaxed">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="px-6 py-24 max-w-3xl mx-auto">
        <p className="text-center text-xs font-bold text-yellow-400 uppercase tracking-widest mb-4">Got questions?</p>
        <h2 className="text-4xl font-extrabold text-center mb-4 tracking-tight">Frequently asked</h2>
        <p className="text-center text-black/40 text-sm mb-14 max-w-xl mx-auto">
          Everything you need to know about InstantFix.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-black/[0.07] rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-black/[0.04] transition-colors"
              >
                <span className="font-semibold text-sm">{faq.q}</span>
                <span className={`text-yellow-400 text-lg flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-black/40 leading-relaxed border-t border-black/[0.08] pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 py-24">
        <div className="max-w-4xl mx-auto bg-white border border-black/[0.07] rounded-3xl p-16 text-center">
          <div className="text-5xl mb-6">⚡</div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Ready to get <span className="text-yellow-400">fixed?</span>
          </h2>
          <p className="text-black/40 text-sm mb-10 max-w-lg mx-auto leading-relaxed">
            Join thousands of happy customers who trust InstantFix for all their electrical needs.
            Fast, safe, and always affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate("/register")}
              className="px-10 py-4 bg-yellow-400 text-black font-bold rounded-2xl text-sm hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95">
              Book Now — It's Free →
            </button>
            <button onClick={() => navigate("/login")}
              className="px-10 py-4 bg-white border border-black/[0.07] font-medium rounded-2xl text-sm hover:bg-black/[0.04] transition-all">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-black/[0.08] px-6 py-10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center text-base">⚡</div>
            <span className="font-bold tracking-tight">
              Instant<span className="text-yellow-400">Fix</span>
            </span>
          </div>
          <div className="flex gap-8 text-xs text-black/40 font-medium">
            {["Privacy Policy", "Terms of Service", "Support", "Contact"].map((item) => (
              <a key={item} href="#" className="hover:text-yellow-400 transition-colors">{item}</a>
            ))}
          </div>
          <p className="text-xs text-black/40">© 2025 InstantFix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}