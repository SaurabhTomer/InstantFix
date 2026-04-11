import { useState } from "react";
import { MessageCircle, Bot, Sparkles } from "lucide-react";

export default function FloatingChatButton({ onClick, isOpen }) {
  const [isHovered, setIsHovered] = useState(false);

  if (isOpen) return null;

  return (
    <div style={{ zIndex: 9999, position: 'fixed', bottom: '24px', right: '24px' }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110 border-2 border-white"
      >
        <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
        
        {/* Pulsing dot */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white">
          <div className="absolute inset-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Bot size={16} />
              <span>Chat with FixBot</span>
              <Sparkles size={14} className="text-amber-400" />
            </div>
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* Ripple */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
      </button>
    </div>
  );
}