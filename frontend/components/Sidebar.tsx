import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Search, 
  MessageSquare, 
  Truck,
  Box,
  PlusCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard' },
    { icon: Search, label: 'Bourse Chantier' },
    { icon: Truck, label: 'Mes Missions' },
    { icon: PlusCircle, label: 'Vendre un Chantier' },
    { icon: Briefcase, label: 'Mes Chantiers' },
    { icon: MessageSquare, label: 'Messagerie' },
  ];

  return (
    <div className="w-64 h-full bg-orange-600 text-white flex flex-col flex-shrink-0 font-sans shadow-xl relative z-20">
      {/* Sidebar Header / Logo */}
      <div className="p-6 border-b border-orange-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-white/20 rounded-xl flex items-center justify-center bg-white/10">
            <Box size={24} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Mobilis Bourse</h1>
            <p className="text-xs text-orange-100 opacity-80">Espace Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="mb-2 px-3">
          <p className="text-xs font-semibold text-orange-200 tracking-wider uppercase">Menu Principal</p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item, index) => (
            <button 
              key={index}
              onClick={() => onTabChange(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left ${
                activeTab === item.label 
                  ? 'bg-white text-orange-600 shadow-sm font-medium' 
                  : 'text-white hover:bg-orange-500/50'
              }`}
            >
              <item.icon size={20} className={activeTab === item.label ? 'text-orange-600' : 'text-orange-100'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;