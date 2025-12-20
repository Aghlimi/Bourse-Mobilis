import React, { useState } from 'react';
import { ChevronLeft, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-24 bg-white border-b border-slate-200 px-6 flex items-center justify-between flex-shrink-0 relative z-30">
      
      {/* Left Section: Back, Brand Toggles, Title */}
      <div className="flex items-center gap-6">
        {/* Back Button */}
        <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors">
          <ChevronLeft size={20} />
        </div>

        {/* Brand Badges */}
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg shadow-sm flex items-center justify-center text-white text-xs font-bold">
            LB
          </div>
          <div className="w-10 h-10 bg-orange-100 rounded-lg border border-orange-200 flex items-center justify-center text-orange-600 text-xs font-bold">
            PRO
          </div>
        </div>

        {/* Page Title */}
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-800">Mon Entreprise</h2>
        </div>
      </div>

      {/* Right Section: Notifications & Profile */}
      <div className="flex items-center gap-6">
        
        {/* Notification Bell */}
        <div className="relative cursor-pointer group">
          <div className="p-2 rounded-full hover:bg-slate-50 transition-colors">
            <Bell size={24} className="text-slate-400 group-hover:text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-1.5 pr-2 rounded-full md:rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 outline-none"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-700 leading-tight">Jean Dupont</p>
              <p className="text-xs text-slate-500 font-medium">Administrateur</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center text-orange-600 font-bold shadow-sm">
              JD
            </div>
            <ChevronDown 
              size={16} 
              className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay to close on click outside */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              
              <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                 {/* Mobile User Info */}
                 <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                   <p className="text-sm font-bold text-slate-700">Jean Dupont</p>
                   <p className="text-xs text-slate-500">jean@transport.fr</p>
                 </div>
                 
                 <div className="p-1.5 space-y-0.5">
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left font-medium">
                      <User size={18} className="text-slate-400" />
                      <span>Mon Profil</span>
                   </button>
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left font-medium">
                      <Settings size={18} className="text-slate-400" />
                      <span>Paramètres du compte</span>
                   </button>
                 </div>
                 
                 <div className="h-px bg-slate-100 my-1 mx-2"></div>
                 
                 <div className="p-1.5">
                   <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium">
                      <LogOut size={18} />
                      <span>Déconnexion</span>
                   </button>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;