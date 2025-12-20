import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Activity, 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  Calendar, 
  ChevronRight,
  Euro,
  ArrowUpRight
} from 'lucide-react';
import BourseChantier from './BourseChantier';
import MesMissions from './MesMissions';
import VendreChantier from './VendreChantier';
import MesChantiers from './MesChantiers';
import Messagerie from './Messagerie';
import Support from './Support';
import { NotificationType } from '../App';

interface DashboardSkeletonProps {
  activeTab: string;
  onNotification?: (type: NotificationType, title: string, message: string) => void;
}

const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ activeTab, onNotification }) => {
  
  // Render different layouts based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'Messagerie':
        return <Messagerie />;
      case 'Vendre un Chantier':
        return <VendreChantier />;
      case 'Paramètres':
        return <SettingsSkeleton />;
      case 'Bourse Chantier':
        return <BourseChantier />;
      case 'Mes Missions':
        return <MesMissions />;
      case 'Mes Chantiers':
        return <MesChantiers onNotification={onNotification} />;
      case 'Support':
        return <Support />;
      case 'Comptabilité':
        return <ListSkeleton title={activeTab} />;
      default:
        return <RealDashboard />;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 relative min-h-full">
      <div className="max-w-7xl mx-auto space-y-8">
        {renderContent()}
      </div>
    </div>
  );
};

// --- 1. Real Dashboard (Unlocked) ---

const RealDashboard: React.FC = () => {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Tableau de Bord</h1>
          <p className="text-slate-500 mt-1">Bienvenue sur votre espace Mobilis Bourse.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
            Filtrer par date
          </button>
          <button className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200 flex items-center gap-2">
            <Search size={16} />
            Trouver un chantier
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Euro} 
          label="Volume d'affaires" 
          value="12 450 €" 
          trend="+12%" 
          color="orange"
        />
        <StatCard 
          icon={Package} 
          label="Chantiers Disponibles" 
          value="42" 
          trend="+5" 
          subtext="nouveaux ajd"
          color="blue"
        />
        <StatCard 
          icon={Truck} 
          label="Mes Missions" 
          value="8" 
          trend="En cours" 
          color="green"
        />
        <StatCard 
          icon={Activity} 
          label="Taux de Remplissage" 
          value="78%" 
          trend="+4%" 
          color="purple"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Opportunities Table & Chart */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Revenue Chart */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-slate-800">Évolution du Chiffre d'Affaires</h3>
              <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-1 text-slate-600 outline-none">
                <option>Cette année</option>
                <option>6 derniers mois</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
               {[
                 { m: 'Jan', h: '40%' }, { m: 'Fév', h: '65%' }, { m: 'Mar', h: '45%' }, 
                 { m: 'Avr', h: '80%' }, { m: 'Mai', h: '55%' }, { m: 'Juin', h: '70%' }, 
                 { m: 'Juil', h: '40%' }, { m: 'Août', h: '60%' }, { m: 'Sep', h: '75%' }, 
                 { m: 'Oct', h: '50%' }, { m: 'Nov', h: '85%' }, { m: 'Déc', h: '65%' }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                    <div className="w-full bg-slate-100 rounded-t-lg relative h-full overflow-hidden">
                       <div 
                         className="absolute bottom-0 w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all duration-300 group-hover:opacity-90" 
                         style={{ height: item.h }}
                       ></div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{item.m}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Latest Opportunities Table */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
               <h3 className="font-bold text-lg text-slate-800">Dernières opportunités</h3>
               <button className="text-orange-600 text-sm font-semibold hover:text-orange-700 flex items-center gap-1">
                 Voir tout <ChevronRight size={16} />
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-sm border-b border-slate-100">
                    <th className="font-medium py-3 px-2">Départ / Arrivée</th>
                    <th className="font-medium py-3 px-2">Volume</th>
                    <th className="font-medium py-3 px-2 hidden md:table-cell">Distance</th>
                    <th className="font-medium py-3 px-2 hidden md:table-cell">Date</th>
                    <th className="font-medium py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { from: 'Paris (75)', to: 'Lyon (69)', vol: '30 m³', dist: '460 km', date: '12 Jan', color: 'bg-blue-50 text-blue-600' },
                    { from: 'Bordeaux (33)', to: 'Nantes (44)', vol: '15 m³', dist: '350 km', date: '14 Jan', color: 'bg-green-50 text-green-600' },
                    { from: 'Marseille (13)', to: 'Lille (59)', vol: '50 m³', dist: '1000 km', date: '15 Jan', color: 'bg-purple-50 text-purple-600' },
                  ].map((row, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-2 border-b border-slate-50">
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2 font-semibold text-slate-700">
                             <span className="w-2 h-2 rounded-full bg-slate-300"></span> {row.from}
                           </div>
                           <div className="flex items-center gap-2 font-semibold text-slate-700">
                             <span className="w-2 h-2 rounded-full bg-orange-500"></span> {row.to}
                           </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 border-b border-slate-50 font-medium text-slate-600">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${row.color}`}>{row.vol}</span>
                      </td>
                      <td className="py-4 px-2 border-b border-slate-50 text-slate-500 hidden md:table-cell">{row.dist}</td>
                      <td className="py-4 px-2 border-b border-slate-50 text-slate-500 hidden md:table-cell">{row.date}</td>
                      <td className="py-4 px-2 border-b border-slate-50 text-right">
                        <button className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors">
                          Voir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Activity & Quick Actions */}
        <div className="space-y-8">
          
          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-3xl shadow-lg shadow-orange-200 text-white">
             <h3 className="font-bold text-lg mb-4">Actions Rapides</h3>
             <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-left">
                   <div className="p-2 bg-white rounded-lg text-orange-600"><Truck size={18} /></div>
                   <span className="font-medium text-sm">Publier un trajet à vide</span>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 p-3 rounded-xl flex items-center gap-3 transition-colors text-left">
                   <div className="p-2 bg-white rounded-lg text-orange-600"><Package size={18} /></div>
                   <span className="font-medium text-sm">Vendre un chantier</span>
                </button>
             </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-800">Activité Récente</h3>
             </div>
             <div className="space-y-6 relative">
               {/* Timeline Line */}
               <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100"></div>

               {[
                 { title: 'Offre acceptée', desc: 'Votre offre pour Paris > Lyon a été validée.', time: '2 min', icon: 'Check', color: 'bg-green-100 text-green-600' },
                 { title: 'Nouveau message', desc: 'Transport express vous a envoyé un message.', time: '1h', icon: 'Message', color: 'bg-blue-100 text-blue-600' },
                 { title: 'Facture générée', desc: 'La facture #F-2024-001 est disponible.', time: '3h', icon: 'File', color: 'bg-purple-100 text-purple-600' },
                 { title: 'Alerte Trajet', desc: 'Un nouveau chantier correspond à votre alerte.', time: '5h', icon: 'Bell', color: 'bg-orange-100 text-orange-600' },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 relative">
                   <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center border-2 border-white shadow-sm z-10 flex-shrink-0`}>
                      <ArrowUpRight size={14} />
                   </div>
                   <div>
                      <p className="text-sm font-bold text-slate-700">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.time}</p>
                   </div>
                 </div>
               ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// --- Helper Component ---

const StatCard: React.FC<{icon: any, label: string, value: string, trend: string, subtext?: string, color: string}> = ({ 
  icon: Icon, label, value, trend, subtext, color 
}) => {
  const colorClasses: Record<string, string> = {
    orange: 'bg-orange-50 text-orange-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className={`text-xs font-bold px-2 py-1 rounded-full ${trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {trend}
        </div>
      </div>
      <div>
        <h4 className="text-3xl font-bold text-slate-800 tracking-tight">{value}</h4>
        <div className="flex items-center gap-1 mt-1">
          <p className="text-sm text-slate-500 font-medium">{label}</p>
          {subtext && <span className="text-xs text-slate-400">({subtext})</span>}
        </div>
      </div>
    </div>
  );
};


// --- 2. Skeletons for Locked Tabs (Unchanged logic, kept visually consistent) ---

const ListSkeleton: React.FC<{title: string}> = ({ title }) => (
  <div className="space-y-6 h-full flex flex-col">
    <div className="flex justify-between items-center">
       <div>
         <div className="h-8 w-48 bg-slate-800/10 rounded-lg mb-2"></div>
         <div className="h-4 w-32 bg-slate-400/10 rounded"></div>
       </div>
       <div className="h-10 w-40 bg-orange-500/20 rounded-lg"></div>
    </div>

    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col">
       <div className="flex gap-4 mb-8">
         <div className="flex-1 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center px-4">
            <Search className="text-slate-300 mr-2" />
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
         </div>
         <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
            <Filter className="text-slate-300" />
         </div>
       </div>
       <div className="h-10 bg-slate-100 rounded-lg w-full mb-4"></div>
       <div className="space-y-4 overflow-hidden">
         {[1, 2, 3, 4, 5, 6, 7].map((_, i) => (
           <div key={i} className="h-20 bg-slate-50 rounded-xl w-full flex items-center px-6 gap-6">
              <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                 <div className="h-4 w-1/3 bg-slate-300 rounded"></div>
                 <div className="h-3 w-1/4 bg-slate-200 rounded"></div>
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded-full"></div>
           </div>
         ))}
       </div>
    </div>
  </div>
);

const FormSkeleton: React.FC = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="h-8 w-64 bg-slate-800/10 rounded-lg"></div>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
       <div className="grid grid-cols-2 gap-8">
          <div className="space-y-3">
             <div className="h-4 w-24 bg-slate-400/20 rounded"></div>
             <div className="h-12 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
          <div className="space-y-3">
             <div className="h-4 w-24 bg-slate-400/20 rounded"></div>
             <div className="h-12 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
          </div>
       </div>
       <div className="space-y-3">
          <div className="h-4 w-32 bg-slate-400/20 rounded"></div>
          <div className="h-32 w-full bg-slate-50 rounded-xl border border-slate-100"></div>
       </div>
       <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3].map((_, i) => (
             <div key={i} className="aspect-video bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
             </div>
          ))}
       </div>
       <div className="flex justify-end pt-4">
          <div className="h-12 w-48 bg-orange-500/20 rounded-xl"></div>
       </div>
    </div>
  </div>
);

// Removed old ChatSkeleton since we now have the real component
const SettingsSkeleton: React.FC = () => (
  <div className="max-w-3xl space-y-8">
     <div className="h-8 w-48 bg-slate-800/10 rounded-lg"></div>
     <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {[1, 2, 3, 4].map((_, i) => (
           <div key={i} className="p-6 border-b border-slate-100 last:border-0 flex items-center justify-between">
              <div className="space-y-2">
                 <div className="h-4 w-32 bg-slate-700/20 rounded"></div>
                 <div className="h-3 w-64 bg-slate-400/20 rounded"></div>
              </div>
              <div className="h-6 w-12 bg-slate-200 rounded-full"></div>
           </div>
        ))}
     </div>
  </div>
);

export default DashboardSkeleton;