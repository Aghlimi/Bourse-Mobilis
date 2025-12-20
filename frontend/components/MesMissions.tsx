import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Box, 
  Truck, 
  Search, 
  Filter, 
  ChevronRight, 
  Euro, 
  Info, 
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Phone,
  User,
  Download,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

// Status types
type MissionStatus = 'PENDING' | 'NEGOTIATING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

interface MyMission {
  id: string;
  fromCity: string;
  fromZip: string;
  toCity: string;
  toZip: string;
  volume: number;
  distance: number;
  date: string;
  priceHT: number;
  status: MissionStatus;
  clientName?: string; // Hidden if pending
  clientPhone?: string; // Hidden if pending
  fullAddressStart?: string; // Hidden if pending
  fullAddressEnd?: string; // Hidden if pending
  notes?: string;
  myBid?: number; // If negotiating
}

// Mock Data representing the mover's history
const MY_MISSIONS_MOCK: MyMission[] = [
  {
    id: 'M-24498',
    fromCity: 'Lyon',
    fromZip: '69006',
    toCity: 'Grenoble',
    toZip: '38000',
    volume: 25,
    distance: 110,
    date: '05/01/2026',
    priceHT: 850,
    status: 'COMPLETED',
    clientName: 'Sophie Martin',
    clientPhone: '06 12 34 56 78',
    fullAddressStart: '12 Rue de la République, 69006 Lyon',
    fullAddressEnd: '45 Boulevard Foch, 38000 Grenoble'
  },
  {
    id: 'M-24505',
    fromCity: 'Paris',
    fromZip: '75017',
    toCity: 'Bordeaux',
    toZip: '33000',
    volume: 40,
    distance: 580,
    date: '20/01/2026',
    priceHT: 1800,
    status: 'IN_PROGRESS', // Won/Accepted
    clientName: 'Marc Dubois',
    clientPhone: '07 98 76 54 32',
    fullAddressStart: '8 Avenue des Ternes, 75017 Paris',
    fullAddressEnd: '10 Quai de Bacalan, 33000 Bordeaux',
    notes: "Code porte entrée : 1234A. Attention cour intérieure étroite."
  },
  {
    id: 'M-24510',
    fromCity: 'Lille',
    fromZip: '59000',
    toCity: 'Bruxelles',
    toZip: '1000',
    volume: 20,
    distance: 110,
    date: '25/01/2026',
    priceHT: 900,
    myBid: 950,
    status: 'NEGOTIATING', // User asked for more
  },
  {
    id: 'M-24512',
    fromCity: 'Nantes',
    fromZip: '44000',
    toCity: 'Rennes',
    toZip: '35000',
    volume: 15,
    distance: 100,
    date: '28/01/2026',
    priceHT: 500,
    status: 'PENDING', // Applied, waiting for answer
  }
];

const MesMissions: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<MyMission | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING' | 'COMPLETED'>('ALL');

  // Filter Logic
  const filteredMissions = MY_MISSIONS_MOCK.filter(m => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return m.status === 'ACCEPTED' || m.status === 'IN_PROGRESS';
    if (activeFilter === 'PENDING') return m.status === 'PENDING' || m.status === 'NEGOTIATING';
    if (activeFilter === 'COMPLETED') return m.status === 'COMPLETED' || m.status === 'CANCELLED';
    return true;
  });

  const handleViewMission = (mission: MyMission) => {
    setSelectedMission(mission);
    setView('detail');
  };

  const handleBack = () => {
    setView('list');
    setSelectedMission(null);
  };

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-300">
      {view === 'list' ? (
        <MissionList 
          missions={filteredMissions} 
          onSelect={handleViewMission} 
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
      ) : (
        selectedMission && <MissionDetail mission={selectedMission} onBack={handleBack} />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: LIST VIEW ---

const MissionList: React.FC<{ 
  missions: MyMission[], 
  onSelect: (m: MyMission) => void,
  activeFilter: string,
  onFilterChange: (f: any) => void
}> = ({ missions, onSelect, activeFilter, onFilterChange }) => {
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Mes Missions</h1>
        <p className="text-slate-500 mt-1">
          Suivez vos candidatures et gérez vos chantiers en cours.
        </p>
      </div>

      {/* Tabs / Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'ALL', label: 'Toutes' },
          { id: 'ACTIVE', label: 'En Cours / Validées' },
          { id: 'PENDING', label: 'En Attente / Négo' },
          { id: 'COMPLETED', label: 'Terminées' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeFilter === tab.id 
                ? 'border-orange-500 text-orange-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
        {missions.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
              <Truck size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">Aucune mission trouvée pour ce filtre.</p>
           </div>
        ) : (
          missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClick={() => onSelect(mission)} />
          ))
        )}
      </div>
    </div>
  );
};

// --- HELPER: MISSION CARD ---

const MissionCard: React.FC<{ mission: MyMission, onClick: () => void }> = ({ mission, onClick }) => {
  const statusConfig = {
    'PENDING': { color: 'bg-blue-50 text-blue-600', label: 'Candidature envoyée', icon: Clock },
    'NEGOTIATING': { color: 'bg-orange-50 text-orange-600', label: 'Négociation en cours', icon: MessageSquare },
    'ACCEPTED': { color: 'bg-green-50 text-green-600', label: 'Validée - À planifier', icon: CheckCircle },
    'IN_PROGRESS': { color: 'bg-purple-50 text-purple-600', label: 'En cours', icon: Truck },
    'COMPLETED': { color: 'bg-slate-100 text-slate-600', label: 'Terminée', icon: ShieldCheck },
    'CANCELLED': { color: 'bg-red-50 text-red-600', label: 'Annulée', icon: XCircle },
  };

  const config = statusConfig[mission.status];
  const StatusIcon = config.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center gap-6"
    >
      {/* Date Box */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-xl border border-slate-100">
         <span className="text-xs text-slate-400 font-bold uppercase">{mission.date.split('/')[1]}</span>
         <span className="text-xl font-bold text-slate-800">{mission.date.split('/')[0]}</span>
      </div>

      {/* Route Info */}
      <div className="flex-1 min-w-0">
         <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${config.color}`}>
               <StatusIcon size={14} />
               {config.label}
            </span>
            <span className="text-xs text-slate-400 font-mono">#{mission.id}</span>
         </div>
         <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-lg text-slate-800">{mission.fromCity}</span>
            <span className="text-slate-300">➜</span>
            <span className="font-bold text-lg text-slate-800">{mission.toCity}</span>
         </div>
         <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Box size={14}/> {mission.volume} m³</span>
            <span className="flex items-center gap-1"><MapPin size={14}/> {mission.distance} km</span>
         </div>
      </div>

      {/* Price & Action */}
      <div className="flex-shrink-0 text-right">
         <p className="text-xs text-slate-400 font-medium mb-1">Montant Net</p>
         <p className="text-xl font-bold text-slate-800 mb-2">
           {mission.status === 'NEGOTIATING' ? (mission.myBid || mission.priceHT) : mission.priceHT} €
         </p>
         <button className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center justify-end gap-1 group">
            Voir le détail <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: DETAIL VIEW ---

const MissionDetail: React.FC<{ mission: MyMission; onBack: () => void }> = ({ mission, onBack }) => {
  // Check if we can show confidential info
  const isUnlocked = ['ACCEPTED', 'IN_PROGRESS', 'COMPLETED'].includes(mission.status);

  return (
    <div className="max-w-5xl mx-auto pb-20">
       
       <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={20} />
        Retour à mes missions
      </button>

      {/* Status Banner */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Mission #{mission.id}</h1>
            <p className="text-slate-500 text-sm">
               {mission.status === 'IN_PROGRESS' && "Ce chantier est actuellement en cours. N'oubliez pas de le clôturer une fois terminé."}
               {mission.status === 'PENDING' && "En attente de réponse du donneur d'ordre."}
               {mission.status === 'COMPLETED' && "Mission terminée avec succès. Paiement débloqué."}
            </p>
         </div>
         {mission.status === 'IN_PROGRESS' && (
            <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors shadow-lg flex items-center gap-2">
               <CheckCircle size={18} />
               Marquer comme terminé
            </button>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left: Client & Route Info */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Confidential Client Info Block */}
            <div className={`p-6 rounded-3xl border transition-all ${isUnlocked ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-200 border-dashed relative overflow-hidden'}`}>
               
               <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-orange-100 text-orange-600' : 'bg-slate-200 text-slate-400'}`}>
                     <User size={20} />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg text-slate-800">Informations Client</h3>
                     <p className="text-xs text-slate-500">{isUnlocked ? 'Données débloquées' : 'Données confidentielles'}</p>
                  </div>
                  {isUnlocked && (
                     <span className="ml-auto bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> Sécurisé
                     </span>
                  )}
               </div>

               {isUnlocked ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                     <div className="space-y-4">
                        <div>
                           <p className="text-xs text-slate-400 uppercase font-bold mb-1">Nom du client</p>
                           <p className="font-bold text-slate-800">{mission.clientName}</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-400 uppercase font-bold mb-1">Téléphone</p>
                           <a href={`tel:${mission.clientPhone}`} className="font-bold text-orange-600 hover:underline flex items-center gap-2">
                              <Phone size={14} /> {mission.clientPhone}
                           </a>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <p className="text-xs text-slate-400 uppercase font-bold mb-1">Adresse Départ</p>
                           <p className="font-medium text-slate-700">{mission.fullAddressStart}</p>
                        </div>
                        <div>
                           <p className="text-xs text-slate-400 uppercase font-bold mb-1">Adresse Arrivée</p>
                           <p className="font-medium text-slate-700">{mission.fullAddressEnd}</p>
                        </div>
                     </div>
                     {mission.notes && (
                        <div className="col-span-full mt-2 p-4 bg-yellow-50 rounded-xl border border-yellow-100 text-sm text-yellow-800">
                           <span className="font-bold">Note : </span> {mission.notes}
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                     <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                        <LockIcon />
                     </div>
                     <p className="text-slate-800 font-bold">Informations masquées</p>
                     <p className="text-slate-500 text-sm max-w-xs mt-1">
                        Ces détails seront visibles une fois que votre offre sera validée par le donneur d'ordre.
                     </p>
                  </div>
               )}
            </div>

            {/* General Mission Details (Route, Date) */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-lg text-slate-800 mb-6">Détails du Trajet</h3>
               {/* Reusing a simplified route visual */}
               <div className="flex flex-col gap-6 relative pl-4 border-l-2 border-slate-100 ml-2">
                  <div className="relative">
                     <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-white border-4 border-slate-300"></div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Départ - {mission.date}</p>
                     <p className="text-lg font-bold text-slate-800">{mission.fromCity} ({mission.fromZip})</p>
                  </div>
                  <div className="relative">
                     <div className="absolute -left-[25px] top-0 w-4 h-4 rounded-full bg-white border-4 border-orange-500"></div>
                     <p className="text-xs text-slate-400 uppercase font-bold mb-1">Arrivée</p>
                     <p className="text-lg font-bold text-slate-800">{mission.toCity} ({mission.toZip})</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-50">
                  <div className="bg-slate-50 p-3 rounded-xl">
                     <p className="text-xs text-slate-400 mb-1">Volume</p>
                     <p className="font-bold text-slate-700">{mission.volume} m³</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl">
                     <p className="text-xs text-slate-400 mb-1">Distance</p>
                     <p className="font-bold text-slate-700">{mission.distance} km</p>
                  </div>
               </div>
            </div>

         </div>

         {/* Right: Actions & Documents */}
         <div className="space-y-6">
            
            {/* Documents Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Documents</h3>
               {isUnlocked ? (
                  <div className="space-y-3">
                     <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl transition-all group text-left">
                        <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm"><FileText size={18}/></div>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-slate-700 group-hover:text-orange-700">Lettre de Voiture</p>
                           <p className="text-[10px] text-slate-400">PDF • 1.2 MB</p>
                        </div>
                        <Download size={16} className="text-slate-400 group-hover:text-orange-500" />
                     </button>
                     <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl transition-all group text-left">
                        <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm"><FileText size={18}/></div>
                        <div className="flex-1">
                           <p className="text-sm font-bold text-slate-700 group-hover:text-orange-700">Inventaire</p>
                           <p className="text-[10px] text-slate-400">PDF • 0.8 MB</p>
                        </div>
                        <Download size={16} className="text-slate-400 group-hover:text-orange-500" />
                     </button>
                  </div>
               ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                     <p className="text-sm text-slate-500">Documents indisponibles avant validation.</p>
                  </div>
               )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4">Financier</h3>
               <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                     <span className="text-slate-500">Montant Validé</span>
                     <span className="font-bold text-slate-800">{mission.priceHT} € HT</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-slate-500">Commission (5%)</span>
                     <span className="font-medium text-red-500">-{Math.round(mission.priceHT * 0.05)} €</span>
                  </div>
                  <div className="h-px bg-slate-100 my-2"></div>
                  <div className="flex justify-between text-lg font-bold">
                     <span className="text-slate-800">Net perçu</span>
                     <span className="text-green-600">{mission.priceHT - Math.round(mission.priceHT * 0.05)} €</span>
                  </div>
               </div>
               {mission.status === 'COMPLETED' && (
                  <button className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-sm flex items-center justify-center gap-2">
                     <Download size={16} /> Télécharger Facture
                  </button>
               )}
            </div>

         </div>

      </div>
    </div>
  );
};

// Small Lock Icon helper
const LockIcon = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
);

export default MesMissions;