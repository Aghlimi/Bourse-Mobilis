import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  MessageSquare, 
  Truck, 
  Box, 
  PlusCircle,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  Euro,
  LifeBuoy,
  AlertTriangle,
  Info
} from 'lucide-react';
import { AppNotification, NotificationType } from '../App';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: AppNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  onOpenNotifications: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  onTabChange, 
  notifications,
  markAsRead,
  markAllAsRead,
  onOpenNotifications
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'ALL' | 'UNREAD'>('ALL');

  const notifRef = useRef<HTMLDivElement>(null);

  // Close notif dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Search, label: 'Bourse Chantier' },
    { icon: Truck, label: 'Mes Missions' },
    { icon: PlusCircle, label: 'Vendre un Chantier' },
    { icon: Briefcase, label: 'Mes Chantiers' },
    { icon: MessageSquare, label: 'Messagerie' },
    { icon: LifeBuoy, label: 'Support' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notifTab === 'ALL' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'OFFER': return <Euro size={16} />;
      case 'MESSAGE': return <MessageSquare size={16} />;
      case 'ALERT': return <AlertTriangle size={16} />;
      case 'INFO': return <Info size={16} />;
      default: return <Bell size={16} />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'OFFER': return 'bg-orange-100 text-orange-600';
      case 'MESSAGE': return 'bg-blue-100 text-blue-600';
      case 'ALERT': return 'bg-red-100 text-red-600';
      case 'INFO': return 'bg-slate-100 text-slate-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] flex-shrink-0 transition-all">
      <div className="flex items-center justify-between h-14 max-w-[1920px] mx-auto">
        
        {/* LEFT: Logo & Brand */}
        <div className="flex items-center gap-3 min-w-fit mr-8">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FF7A00] to-orange-600 rounded-xl shadow-lg shadow-orange-200/50 flex items-center justify-center text-white">
            <Box size={20} />
          </div>
          <div className="hidden lg:block leading-tight">
            <h1 className="font-bold text-base text-slate-800 tracking-tight">Mobilis Bourse</h1>
            <p className="text-[10px] text-[#FF7A00] font-bold tracking-widest uppercase">ESPACE PRO</p>
          </div>
        </div>

        {/* CENTER: Navigation (Desktop) - EXPANDING ICONS */}
        <div className="hidden xl:flex items-center justify-center gap-3 flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => onTabChange(item.label)}
                className={`
                  group relative flex items-center h-11 px-3.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  overflow-hidden hover:shadow-md hover:shadow-orange-100 border
                  ${isActive 
                    ? 'bg-[#FF7A00] border-[#FF7A00] text-white shadow-lg shadow-orange-200 w-auto' 
                    : 'bg-white border-transparent hover:border-slate-100 text-slate-400 hover:text-slate-700 w-11 hover:w-auto hover:bg-slate-50'
                  }
                `}
              >
                <item.icon 
                  size={20} 
                  className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                />
                
                {/* Text Label - Transitions max-width/opacity */}
                <span className={`
                  whitespace-nowrap font-medium text-sm overflow-hidden transition-all duration-500 ease-in-out pl-0
                  ${isActive 
                    ? 'max-w-[200px] opacity-100 ml-2' 
                    : 'max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-2'
                  }
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* RIGHT: Actions, Search, Profile */}
        <div className="flex items-center gap-3 ml-auto pl-4">
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF7A00] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="pl-9 pr-10 py-2.5 bg-slate-50 border border-transparent hover:bg-white hover:border-slate-200 rounded-full text-sm text-slate-700 focus:outline-none focus:bg-white focus:border-[#FF7A00] focus:ring-4 focus:ring-orange-50 w-48 xl:w-64 transition-all duration-300 shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden xl:flex items-center">
                <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-mono shadow-sm">⌘K</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

          {/* Notifications Center */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => {
                const newState = !isNotifOpen;
                setIsNotifOpen(newState);
                if (newState) {
                  onOpenNotifications(); // STOP SOUND when opening
                }
              }}
              className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-all ${isNotifOpen ? 'bg-orange-50 text-orange-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                 {/* Header */}
                 <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <button onClick={markAllAsRead} className="text-[10px] font-bold text-orange-600 hover:text-orange-700 uppercase tracking-wide">
                       Tout marquer comme lu
                    </button>
                 </div>

                 {/* Tabs */}
                 <div className="flex border-b border-slate-50 px-2">
                    <button 
                      onClick={() => setNotifTab('ALL')}
                      className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${notifTab === 'ALL' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Toutes
                    </button>
                    <button 
                      onClick={() => setNotifTab('UNREAD')}
                      className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors ${notifTab === 'UNREAD' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                      Non lues ({unreadCount})
                    </button>
                 </div>

                 {/* List */}
                 <div className="max-h-[350px] overflow-y-auto bg-slate-50/50">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 flex flex-col items-center">
                         <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                            <Bell size={20} className="opacity-50" />
                         </div>
                         <p className="text-sm font-medium">Aucune notification</p>
                      </div>
                    ) : (
                      filteredNotifications.map(notif => (
                        <div 
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`p-4 border-b border-slate-50 hover:bg-white transition-colors cursor-pointer flex gap-3 ${!notif.read ? 'bg-white border-l-4 border-l-orange-500 pl-3' : 'border-l-4 border-l-transparent'}`}
                        >
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getColor(notif.type)}`}>
                              {getIcon(notif.type)}
                           </div>
                           <div className="flex-1">
                              <div className="flex justify-between items-start mb-0.5">
                                 <p className={`text-sm font-bold ${!notif.read ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</p>
                                 <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">{notif.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{notif.message}</p>
                           </div>
                        </div>
                      ))
                    )}
                 </div>
                 
                 {/* Footer */}
                 <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
                    <button onClick={() => onTabChange('Messagerie')} className="text-xs font-bold text-slate-500 hover:text-orange-600 transition-colors">
                       Voir toutes les activités
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-50 to-blue-100 text-[#4C6FFF] border border-blue-200 flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                JD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-slate-700 leading-none group-hover:text-slate-900">Jean Dupont</p>
              </div>
              <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 md:hidden">
                    <p className="text-sm font-bold text-slate-700">Jean Dupont</p>
                    <p className="text-xs text-slate-500">jean@transport.fr</p>
                  </div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left font-medium">
                      <User size={16} /> Mon Profil
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors text-left font-medium">
                      <Settings size={16} /> Paramètres
                    </button>
                  </div>
                  <div className="h-px bg-slate-100 my-1 mx-2"></div>
                  <div className="p-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl py-2 px-4 space-y-1 animate-in slide-in-from-top-2 z-40">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                onTabChange(item.label);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                activeTab === item.label
                  ? 'bg-[#FF7A00] text-white shadow-md shadow-orange-200'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;