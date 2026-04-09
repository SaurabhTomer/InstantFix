import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu, Zap, Star, Clock, Search, Bell, ArrowRight
} from "lucide-react";
import UserSidebar from "./UserSidebar";
import AIChatAssistant from "../../components/AIChatAssistant";
import FloatingChatButton from "../../components/FloatingChatButton";

export default function UserDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

 const banners = [
  {
    id: 1,
    label: "Always available",
    title: "24/7 Emergency Service",
    subtitle: "Fast response, anytime you need us",
    gradient: "from-rose-500 to-orange-400",
    cta: "Book Now",
  },
  {
    id: 2,
    label: "Certified pros",
    title: "Verified Electricians",
    subtitle: "Background-checked experts at your door",
    gradient: "from-blue-500 to-sky-400",
    cta: "Browse Experts",
  },
  {
    id: 3,
    label: "Limited time",
    title: "20% Off This Month",
    subtitle: "Save on all services through April",
    gradient: "from-emerald-500 to-teal-400",
    cta: "Claim Offer",
  },
  {
    id: 4,
    label: "Free add-on",
    title: "Free Safety Inspection",
    subtitle: "Book any service, get a full panel check-up free",
    gradient: "from-violet-500 to-purple-400",
    cta: "Learn More",
  },
  {
    id: 5,
    label: "New service",
    title: "Smart Home Wiring",
    subtitle: "EV chargers, solar, smart panels — future-ready upgrades",
    gradient: "from-indigo-500 to-blue-400",
    cta: "Explore Plans",
  },
  {
    id: 6,
    label: "Rewards",
    title: "Refer & Earn",
    subtitle: "Share with a friend — both get ₹500 off next booking",
    gradient: "from-amber-500 to-yellow-400",
    cta: "Invite Friends",
  },
  {
    id: 7,
    label: "Top rated",
    title: "Rated 4.9 by 10,000+",
    subtitle: "Thousands of happy homeowners trust us every month",
    gradient: "from-orange-500 to-amber-400",
    cta: "See Reviews",
  },
  {
    id: 8,
    label: "Best value",
    title: "Annual Maintenance Plan",
    subtitle: "One subscription, unlimited priority support all year",
    gradient: "from-cyan-500 to-teal-400",
    cta: "View Plans",
  },
  {
    id: 9,
    label: "Welcome deal",
    title: "First Booking? 15% Off",
    subtitle: "New users get a welcome discount on their first service",
    gradient: "from-fuchsia-500 to-pink-400",
    cta: "Get Started",
  },
];

  const categories = [
    { id: 1, name: "Wiring", icon: "⚡", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    { id: 2, name: "Lighting", icon: "💡", bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
    { id: 3, name: "Appliances", icon: "🔧", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
    { id: 4, name: "Inspection", icon: "🛡️", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    { id: 5, name: "Panel", icon: "⚙️", bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    { id: 6, name: "Generator", icon: "🔌", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  ];

  const popularServices = [
    {
      id: 1,
      name: "Home Wiring",
      description: "Complete electrical wiring solutions for new & old homes",
      price: "₹2,500 – ₹8,000",
      rating: 4.8,
      reviews: 312,
      time: "2–4 hrs",
      icon: "⚡",
      tag: "Most Booked",
      tagColor: "bg-amber-100 text-amber-700",
    },
    {
      id: 2,
      name: "LED Installation",
      description: "Energy-efficient LED lighting setup & fixture replacement",
      price: "₹1,500 – ₹5,000",
      rating: 4.9,
      reviews: 508,
      time: "1–3 hrs",
      icon: "💡",
      tag: "Top Rated",
      tagColor: "bg-green-100 text-green-700",
    },
    {
      id: 3,
      name: "AC Repair",
      description: "Air conditioner electrical diagnostics & repair",
      price: "₹800 – ₹2,500",
      rating: 4.7,
      reviews: 201,
      time: "1–2 hrs",
      icon: "❄️",
      tag: null,
    },
    {
      id: 4,
      name: "Switchboard",
      description: "Switchboard installation, repair & safety upgrades",
      price: "₹1,200 – ₹3,500",
      rating: 4.6,
      reviews: 178,
      time: "1–2 hrs",
      icon: "🔘",
      tag: null,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextBanner = () => setCurrentBanner((prev) => (prev + 1) % banners.length);
  const prevBanner = () => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);

  // Set dynamic greeting based on time of day
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting("Good morning");
      } else if (hour < 17) {
        setGreeting("Good afternoon");
      } else {
        setGreeting("Good evening");
      }
    };

    updateGreeting();
    const interval = setInterval(updateGreeting, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <UserSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* ── Navbar ── */}
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

            {/* Left */}
            {/* <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <Menu size={20} />
              </button>
            </div> */}

            {/* Center search */}
            <div className="flex-1 max-w-md hidden sm:flex items-center bg-gray-100 rounded-xl px-4 gap-3 h-10">
              <Search size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search services…"
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
              </button>
              <Link to="/user/profile" className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center text-sm font-semibold text-white hover:bg-amber-500 transition-colors overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                )}
              </Link>
            </div>
          </div>
        </nav>

        {/* ── Page Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Greeting */}
        <div>
          <p className="text-sm text-gray-400 mb-0.5">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-gray-900">
            What do you need <span className="text-amber-500">fixed</span> today?
          </h1>
        </div>

        {/* ── Banner Carousel ── */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className={`bg-gradient-to-r ${banners[currentBanner].gradient} p-8 transition-all duration-500`}>
            <span className="inline-block text-xs font-medium bg-white/25 text-white rounded-full px-3 py-0.5 mb-3">
              {banners[currentBanner].label}
            </span>
            <h2 className="text-3xl font-bold text-white mb-2">{banners[currentBanner].title}</h2>
            <p className="text-base text-white/80 mb-6">{banners[currentBanner].subtitle}</p>
            <button 
              onClick={() => navigate('/user/book-request')}
              className="bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {banners[currentBanner].cta}
            </button>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBanner(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentBanner ? "bg-white w-6" : "bg-white/40 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Categories ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <button className="text-sm text-amber-500 font-medium hover:underline">See all</button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id === activeCategory ? null : cat.id);
                  navigate('/user/book-request');
                }}
                className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border transition-all duration-150
                  ${cat.bg} ${cat.border}
                  ${activeCategory === cat.id
                    ? "ring-2 ring-offset-1 ring-amber-400 scale-105"
                    : "hover:scale-105 hover:shadow-sm"
                  }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-xs font-medium text-center leading-tight ${cat.text}`}>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Popular Services ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Popular Services</h2>
            <button className="text-sm text-amber-500 font-medium hover:underline">See all</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularServices.map((svc) => (
              <div
                key={svc.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl">
                    {svc.icon}
                  </div>
                  {svc.tag && (
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${svc.tagColor}`}>
                      {svc.tag}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{svc.name}</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed flex-1">{svc.description}</p>
                <p className="text-base font-semibold text-amber-500 mb-4">{svc.price}</p>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-medium text-gray-600">{svc.rating}</span>
                    <span>({svc.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {svc.time}
                  </span>
                </div>
                <button 
                  onClick={() => navigate('/user/book-request')}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Emergency Banner ── */}
        <div className="bg-gray-900 rounded-2xl p-8 flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              <span className="text-sm font-semibold text-rose-400 uppercase tracking-wide">Live Support</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Emergency Service</h2>
            <p className="text-base text-gray-400 mb-6">Need immediate electrical help? We're here 24/7.</p>
            <button 
              onClick={() => navigate('/user/book-request')}
              className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-base font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Call 1800-XXX-XXXX
            </button>
          </div>
          <div className="hidden lg:flex text-6xl select-none">🚨</div>
        </div>

        </div>

        {/* AI Chat Assistant */}
        <AIChatAssistant 
          isOpen={chatOpen} 
          onClose={() => setChatOpen(false)} 
        />

        {/* Floating Chat Button */}
        <FloatingChatButton 
          onClick={() => setChatOpen(!chatOpen)}
          isOpen={chatOpen}
        />
      </div>
    </div>
  );
}