import React, { useState } from 'react';
import { 
  LifeBuoy, 
  AlertTriangle, 
  MessageCircle, 
  Star, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Plus,
  FileText,
  Search,
  Filter
} from 'lucide-react';

// Mock Data
const DISPUTES = [
  { id: 'L-2401', date: '10/01/2026', subject: 'Retard livraison Mission #M-24501', status: 'OPEN', type: 'Retard' },
  { id: 'L-2398', date: '05/01/2026', subject: 'Casse miroir Mission #M-24450', status: 'RESOLVED', type: 'Assurance' },
];

const REQUESTS = [
  { id: 'R-102', date: '14/01/2026', subject: 'Demande accès anticipé Bourse Premium', status: 'PENDING' },
  { id: 'R-099', date: '02/01/2026', subject: 'Changement IBAN facturation', status: 'COMPLETED' },
];

const REVIEWS = [
  { id: 'S-45', date: '12/01/2026', rating: 5, comment: 'Plateforme très intuitive, merci.', from: 'Service Qualité' },
  { id: 'S-42', date: '20/12/2025', rating: 4, comment: 'Bon matching, mais manque de filtres par région.', from: 'Enquête Trimestrielle' },
];

const Support: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LITIGES' | 'DEMANDES' | 'SATISFACTION'>('LITIGES');

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            Centre de Support
          </h1>
          <p className="text-slate-500 mt-1">
            Gérez vos litiges, vos demandes spécifiques et consultez vos retours qualité.
          </p>
        </div>
        <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
          <Plus size={20} />
          Ouvrir un ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
            <NavButton 
              active={activeTab === 'LITIGES'} 
              onClick={() => setActiveTab('LITIGES')} 
              icon={AlertTriangle} 
              label="Historique Litiges" 
              count={1}
              color="text-red-500"
            />
            <NavButton 
              active={activeTab === 'DEMANDES'} 
              onClick={() => setActiveTab('DEMANDES')} 
              icon={FileText} 
              label="Demandes Spéciales" 
            />
            <NavButton 
              active={activeTab === 'SATISFACTION'} 
              onClick={() => setActiveTab('SATISFACTION')} 
              icon={Star} 
              label="Satisfaction & Avis" 
              color="text-yellow-500"
            />
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-lg">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <LifeBuoy size={24} className="text-white" />
             </div>
             <h3 className="font-bold text-lg mb-2">Besoin d'aide ?</h3>
             <p className="text-blue-100 text-sm mb-4 leading-relaxed">
               Notre équipe support est disponible du Lundi au Vendredi de 9h à 18h.
             </p>
             <button className="w-full py-2.5 bg-white text-blue-900 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors">
               Contacter le support
             </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          
          {/* CONTENT: LITIGES */}
          {activeTab === 'LITIGES' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-bold text-slate-800">Litiges en cours & clôturés</h2>
                   <div className="flex gap-2">
                      <button className="p-2 bg-slate-50 rounded-lg hover:bg-slate-100 border border-slate-100">
                         <Filter size={18} className="text-slate-500" />
                      </button>
                   </div>
                </div>

                <div className="space-y-4">
                   {DISPUTES.map(item => (
                     <div key={item.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white">
                        <div className="flex justify-between items-start">
                           <div className="flex gap-4">
                              <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.status === 'OPEN' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                 <AlertTriangle size={20} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-800 text-lg">{item.subject}</span>
                                    {item.status === 'OPEN' ? (
                                       <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Ouvert</span>
                                    ) : (
                                       <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wide">Résolu</span>
                                    )}
                                 </div>
                                 <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <span>#{item.id}</span> • <span>{item.date}</span> • <span className="font-medium text-slate-600">{item.type}</span>
                                 </p>
                              </div>
                           </div>
                           <ChevronRight className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT: DEMANDES */}
          {activeTab === 'DEMANDES' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800 mb-6">Demandes Spéciales</h2>
                 <div className="space-y-4">
                   {REQUESTS.map(item => (
                     <div key={item.id} className="group p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white">
                        <div className="flex justify-between items-start">
                           <div className="flex gap-4">
                              <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                 <FileText size={20} />
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-slate-800">{item.subject}</span>
                                 </div>
                                 <p className="text-sm text-slate-500 flex items-center gap-2">
                                    <span>#{item.id}</span> • <span>{item.date}</span>
                                 </p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>
                                 {item.status === 'PENDING' ? 'En traitement' : 'Terminé'}
                              </span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT: SATISFACTION */}
          {activeTab === 'SATISFACTION' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              
              {/* Score Card */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                 <h2 className="text-lg font-bold text-slate-800 mb-4">Votre Score Qualité</h2>
                 <div className="flex justify-center items-end gap-2 mb-2">
                    <span className="text-5xl font-black text-slate-900">4.8</span>
                    <span className="text-xl font-bold text-slate-400 mb-2">/ 5</span>
                 </div>
                 <div className="flex justify-center gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} size={24} className="text-yellow-400 fill-yellow-400" />)}
                 </div>
                 <p className="text-sm text-slate-500 max-w-md mx-auto">
                    Votre score est calculé sur la base des 12 derniers mois d'activité sur la bourse et des retours clients.
                 </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                 <h2 className="text-xl font-bold text-slate-800 mb-6">Derniers Avis & Enquêtes</h2>
                 <div className="space-y-4">
                   {REVIEWS.map(item => (
                     <div key={item.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                           <div className="flex items-center gap-2">
                              <div className="flex">
                                 {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
                                 ))}
                              </div>
                              <span className="text-sm font-bold text-slate-700">{item.rating}/5</span>
                           </div>
                           <span className="text-xs text-slate-400">{item.date}</span>
                        </div>
                        <p className="text-slate-800 italic mb-3">"{item.comment}"</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Source: {item.from}</p>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string, count?: number, color?: string }> = ({ 
  active, onClick, icon: Icon, label, count, color = "text-slate-400" 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-1 ${
       active 
         ? 'bg-orange-50 text-orange-700 font-bold shadow-sm' 
         : 'text-slate-600 hover:bg-slate-50 font-medium'
    }`}
  >
    <div className="flex items-center gap-3">
       <Icon size={20} className={active ? 'text-orange-600' : color} />
       <span>{label}</span>
    </div>
    {count && (
       <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {count}
       </span>
    )}
  </button>
);

export default Support;