import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.tsx';

interface WhatsAppFloatingProps {
  currentPath?: string;
  contextService?: string;
}

export const WhatsAppFloating: React.FC<WhatsAppFloatingProps> = ({ currentPath = '/', contextService }) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const rawNumber = settings?.whatsappNumber || '919810234567';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const getDefaultMessage = () => {
    if (contextService) {
      return `Hi Laxmi Digital Photo Studio, I would like to enquire about ${contextService}.`;
    }
    if (currentPath.includes('wedding')) {
      return 'Hi Laxmi Digital Studio, I would like to inquire about wedding photography and videography packages.';
    }
    if (currentPath.includes('packages')) {
      return 'Hi Laxmi Digital Studio, I saw your photography packages and would like to get a customized quotation.';
    }
    return 'Hi Laxmi Digital Photo Studio, I would like to discuss booking a photography session.';
  };

  const handleSend = () => {
    const textToSend = customMsg.trim() || getDefaultMessage();
    const encoded = encodeURIComponent(textToSend);
    const url = `https://wa.me/${cleanNumber}?text=${encoded}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* WhatsApp Popup Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-4 text-white animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <MessageSquare className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h5 className="text-sm font-semibold text-neutral-100">Laxmi Studio Desk</h5>
                <p className="text-[10px] text-emerald-400 font-medium">Online • Instant WhatsApp Reply</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-neutral-300 mb-3 bg-neutral-950 p-2.5 rounded-lg border border-neutral-800/80 leading-relaxed">
            Namaste! How can we assist you with your photography or wedding inquiry today?
          </p>

          <textarea
            value={customMsg}
            onChange={(e) => setCustomMsg(e.target.value)}
            placeholder={getDefaultMessage()}
            rows={2}
            className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 mb-3 resize-none"
          />

          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Start WhatsApp Chat</span>
          </button>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/40"
        aria-label="Chat on WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wider uppercase">WhatsApp Us</span>
      </button>
    </div>
  );
};
