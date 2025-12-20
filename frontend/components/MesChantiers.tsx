import React, { useState, useEffect } from 'react';
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
  XCircle,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  Download,
  Eye,
  Bell,
  X
} from 'lucide-react';
import { NotificationType } from '../App';

// Types
type ChantierStatus = 'PUBLISHED' | 'OFFERS_RECEIVED' | 'IN_PROGRESS' | 'COMPLETED';

interface Offer {
  id: string;
  moverName: string;
  price: number;
  rating: number;
  message?: string;
  isScenario2?: boolean; // If true, price > initial budget (negotiation)
}

interface MyChantier {
  id: string;
  fromCity: string;
  fromZip: string;
  toCity: string;
  toZip: string;
  volume: number;
  distance: number;
  date: string;
  initialPriceHT: number;
  status: ChantierStatus;
  offers: Offer[];
  subcontractor?: string; // If in progress
  clientName: string;
}

const MY_CHANTIERS_MOCK: MyChantier[] = [
  {
    id: 'C-24100',
    fromCity: 'Paris',
    fromZip: '75012',
    toCity: 'Lyon',
    toZip: '69002',
    volume: 30,
    distance: 460,
    date: '12/02/2026',
    initialPriceHT: 1200,
    status: 'OFFERS_RECEIVED',
    clientName: 'Jean Dupont',
    offers: [
      { id: 'O-1', moverName: 'Déménageur Lyonnais', price: 1200, rating: 4.8, message: 'Disponible et intéressé.' },
      { id: 'O-2', moverName: 'Transport Rapide', price: 1350, rating: 4.5, message: 'Disponible mais accès difficile nécessite plus.', isScenario2: true }
    ]
  },
  {
    id: 'C-24102',
    fromCity: 'Strasbourg',
    fromZip: '67000',
    toCity: 'Colmar',
    toZip: '68000',
    volume: 50,
    distance: 70,
    date: '15/02/2026',
    initialPriceHT: 800,
    status: 'PUBLISHED', // Targeted for simulation
    clientName: 'Alice Weber',
    offers: []
  },
  {
    id: 'C-24090',
    fromCity: 'Marseille',
    fromZip: '13000',
    toCity: 'Nice',
    toZip: '06000',
    volume: 20,
    distance: 200,
    date: '20/01/2026',
    initialPriceHT: 600,
    status: 'IN_PROGRESS',
    clientName: 'Paul Ricard',
    subcontractor: 'Azur Move',
    offers: []
  }
];

interface MesChantiersProps {
  onNotification?: (type: NotificationType, title: string, message: string) => void;
}

const MesChantiers: React.FC<MesChantiersProps> = ({ onNotification }) => {
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedChantier, setSelectedChantier] = useState<MyChantier | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');
  
  // State for data to allow updates
  const [chantiers, setChantiers] = useState<MyChantier[]>(MY_CHANTIERS_MOCK);

  // Simulation Effect
  useEffect(() => {
    // Request permission on mount if needed
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const timer = setTimeout(() => {
      triggerNewOfferSimulation();
    }, 5000); // Trigger after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  const triggerNewOfferSimulation = () => {
    // Target the Strasbourg mission (C-24102)
    const targetId = 'C-24102';
    
    // Check if already processed to avoid duplicates in strict mode
    setChantiers(prev => {
      const target = prev.find(c => c.id === targetId);
      if (!target || target.offers.length > 0) return prev; // Already has offers or doesn't exist

      const newOffer: Offer = {
        id: `O-${Date.now()}`,
        moverName: 'Alsace Déménagement',
        price: 780, // Slightly below budget (Good news!)
        rating: 4.9,
        message: 'Disponible sur ce créneau. Camion vide au retour.'
      };

      // Trigger Global Notification
      if (onNotification) {
        onNotification(
          'OFFER',
          'Nouvelle offre reçue',
          'Alsace Déménagement propose 780€ pour votre chantier Strasbourg > Colmar.'
        );
      }

      return prev.map(c => 
        c.id === targetId 
          ? { ...c, status: 'OFFERS_RECEIVED', offers: [newOffer] } 
          : c
      );
    });
  };

  const handleSelect = (chantier: MyChantier) => {
    setSelectedChantier(chantier);
    setView('detail');
  };

  const filteredChantiers = chantiers.filter(c => {
    if (filter === 'ACTIVE') return ['PUBLISHED', 'OFFERS_RECEIVED', 'IN_PROGRESS'].includes(c.status);
    if (filter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-300 relative">
      
      {view === 'list' ? (
        <ChantierList 
          chantiers={filteredChantiers} 
          onSelect={handleSelect}
          filter={filter}
          setFilter={setFilter}
        />
      ) : (
        selectedChantier && (
          <ChantierDetail 
            chantier={selectedChantier} 
            onBack={() => { setView('list'); setSelectedChantier(null); }} 
          />
        )
      )}
    </div>
  );
};

// --- LIST VIEW ---

const ChantierList: React.FC<{ 
  chantiers: MyChantier[], 
  onSelect: (c: MyChantier) => void,
  filter: string,
  setFilter: (f: any) => void
}> = ({ chantiers, onSelect, filter, setFilter }) => (
  <div className="space-y-6 pb-20">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Mes Chantiers Publiés</h1>
      <p className="text-slate-500 mt-1">Gérez vos offres de sous-traitance et validez les candidatures.</p>
    </div>

    {/* Filters */}
    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[{ id: 'ALL', label: 'Tous' }, { id: 'ACTIVE', label: 'En Cours' }, { id: 'COMPLETED', label: 'Terminés' }].map(tab => (
           <button
             key={tab.id}
             onClick={() => setFilter(tab.id)}
             className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
               filter === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
             }`}
           >
             {tab.label}
           </button>
        ))}
    </div>

    <div className="grid grid-cols-1 gap-4">
       {chantiers.map(chantier => (
         <ChantierCard key={chantier.id} chantier={chantier} onClick={() => onSelect(chantier)} />
       ))}
    </div>
  </div>
);

const ChantierCard: React.FC<{ chantier: MyChantier, onClick: () => void }> = ({ chantier, onClick }) => {
  const getStatusInfo = (status: ChantierStatus) => {
    switch (status) {
      case 'PUBLISHED': return { color: 'bg-blue-50 text-blue-600', label: 'En Ligne', icon: Eye };
      case 'OFFERS_RECEIVED': return { color: 'bg-orange-50 text-orange-600', label: `${chantier.offers.length} Offre(s)`, icon: AlertCircle };
      case 'IN_PROGRESS': return { color: 'bg-purple-50 text-purple-600', label: 'Attribué', icon: Truck };
      case 'COMPLETED': return { color: 'bg-slate-100 text-slate-600', label: 'Terminé', icon: CheckCircle };
    }
  };
  const statusInfo = getStatusInfo(chantier.status);
  const Icon = statusInfo.icon;

  return (
    <div onClick={onClick} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex flex-col md:flex-row items-center gap-6">
       <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-slate-400 uppercase">{chantier.date.split('/')[1]}</span>
          <span className="text-xl font-bold text-slate-800">{chantier.date.split('/')[0]}</span>
       </div>
       <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
             <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${statusInfo.color}`}>
                <Icon size={14} /> {statusInfo.label}
             </span>
             <span className="text-xs text-slate-400 font-mono">#{chantier.id}</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="font-bold text-slate-800">{chantier.fromCity}</span>
             <span className="text-slate-300">➜</span>
             <span className="font-bold text-slate-800">{chantier.toCity}</span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
             <span className="flex items-center gap-1"><Box size={14}/> {chantier.volume} m³</span>
             <span className="flex items-center gap-1"><User size={14}/> {chantier.clientName}</span>
          </div>
       </div>
       <div className="text-right">
          <p className="text-xs text-slate-400 font-medium">Budget</p>
          <p className="text-xl font-bold text-slate-800">{chantier.initialPriceHT} €</p>
       </div>
       <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
          <ChevronRight size={18} />
       </div>
    </div>
  );
};

// --- DETAIL VIEW ---

const ChantierDetail: React.FC<{ chantier: MyChantier, onBack: () => void }> = ({ chantier, onBack }) => {
  
  return (
    <div className="max-w-5xl mx-auto pb-20">
       <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 font-medium">
          <ArrowLeft size={20} /> Retour
       </button>

       {/* Banner Status */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
             <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                Mission #{chantier.id}
                {chantier.status === 'OFFERS_RECEIVED' && (
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200 animate-pulse">Action Requise</span>
                )}
             </h1>
             <p className="text-slate-500 text-sm mt-1">
               {chantier.status === 'PUBLISHED' && "Votre annonce est en ligne. En attente de propositions."}
               {chantier.status === 'OFFERS_RECEIVED' && `Vous avez reçu ${chantier.offers.length} proposition(s). Veuillez en valider une.`}
               {chantier.status === 'IN_PROGRESS' && `Attribué à ${chantier.subcontractor}. En cours de réalisation.`}
             </p>
          </div>
          {chantier.status === 'PUBLISHED' && (
            <button className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 text-sm">
               Annuler la vente
            </button>
          )}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COL: Offers & Subcontractor Info */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* OFFERS SECTION (Scenario 1 & 2) */}
             {chantier.status === 'OFFERS_RECEIVED' && (
               <div className="space-y-4">
                  <h3 className="font-bold text-slate-800">Offres reçues ({chantier.offers.length})</h3>
                  {chantier.offers.map(offer => (
                    <OfferCard key={offer.id} offer={offer} initialPrice={chantier.initialPriceHT} />
                  ))}
               </div>
             )}

             {/* SUBCONTRACTOR INFO (In Progress) */}
             {chantier.status === 'IN_PROGRESS' && (
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Truck className="text-purple-600" /> Prestataire
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                        {chantier.subcontractor?.charAt(0)}
                     </div>
                     <div>
                        <p className="font-bold text-slate-800">{chantier.subcontractor}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                           <CheckCircle size={12} className="text-green-500" />
                           Société vérifiée • 4.9/5
                        </div>
                     </div>
                     <button className="ml-auto px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">
                        Contacter
                     </button>
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                     <p className="text-sm font-bold text-slate-700 mb-2">Documents</p>
                     <button className="flex items-center gap-2 text-sm text-orange-600 hover:underline">
                        <Download size={16} /> Télécharger la Lettre de Voiture
                     </button>
                  </div>
               </div>
             )}

             {/* DETAILS RECAP */}
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="font-bold text-slate-800 mb-4">Détails du chantier</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                   <div>
                      <p className="text-slate-400 text-xs uppercase font-bold mb-1">Départ</p>
                      <p className="font-medium text-slate-700">{chantier.fromCity} ({chantier.fromZip})</p>
                   </div>
                   <div>
                      <p className="text-slate-400 text-xs uppercase font-bold mb-1">Arrivée</p>
                      <p className="font-medium text-slate-700">{chantier.toCity} ({chantier.toZip})</p>
                   </div>
                   <div>
                      <p className="text-slate-400 text-xs uppercase font-bold mb-1">Volume</p>
                      <p className="font-medium text-slate-700">{chantier.volume} m³</p>
                   </div>
                   <div>
                      <p className="text-slate-400 text-xs uppercase font-bold mb-1">Client</p>
                      <p className="font-medium text-slate-700">{chantier.clientName}</p>
                   </div>
                </div>
             </div>

          </div>

          {/* RIGHT COL: Financials */}
          <div className="space-y-6">
             <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4">Finances</h3>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between">
                      <span className="text-slate-500">Prix Initial</span>
                      <span className="font-bold text-slate-800">{chantier.initialPriceHT} € HT</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-slate-500">Commission Vendeur (5%)</span>
                      <span className="font-medium text-red-500">
                        + {Math.round(chantier.initialPriceHT * 0.05)} €
                      </span>
                   </div>
                   <div className="h-px bg-slate-100 my-2"></div>
                   <div className="flex justify-between text-base font-bold">
                      <span className="text-slate-800">Total à payer</span>
                      <span className="text-slate-900">{chantier.initialPriceHT + Math.round(chantier.initialPriceHT * 0.05)} €</span>
                   </div>
                   <p className="text-xs text-slate-400 mt-2">
                      Le débit sera effectué uniquement après validation d'une offre.
                   </p>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
};

// --- SUB-COMPONENT: OFFER CARD ---
const OfferCard: React.FC<{ offer: Offer, initialPrice: number }> = ({ offer, initialPrice }) => {
  const isHigher = offer.price > initialPrice;
  const commission = Math.round(offer.price * 0.05);
  const totalCost = offer.price + commission;

  return (
    <div className={`p-6 rounded-2xl border transition-all ${isHigher ? 'bg-orange-50 border-orange-200' : 'bg-white border-green-200 shadow-sm'}`}>
       
       <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                {offer.moverName.charAt(0)}
             </div>
             <div>
                <p className="font-bold text-slate-800">{offer.moverName}</p>
                <div className="flex text-xs text-yellow-500">★★★★☆ <span className="text-slate-400 ml-1">({offer.rating})</span></div>
             </div>
          </div>
          <div className="text-right">
             <p className={`text-xl font-bold ${isHigher ? 'text-orange-600' : 'text-green-600'}`}>{offer.price} € HT</p>
             {isHigher && <p className="text-xs text-red-500 font-bold">+ {offer.price - initialPrice} € vs budget</p>}
          </div>
       </div>

       {offer.message && (
         <div className="bg-white/50 p-3 rounded-xl text-sm text-slate-600 mb-4 italic border border-black/5">
            "{offer.message}"
         </div>
       )}

       {isHigher ? (
         // SCENARIO 2 UI
         <div className="space-y-3">
            <div className="flex items-start gap-2 text-xs text-orange-800 bg-orange-100/50 p-3 rounded-lg">
               <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
               <p>
                  Ce prestataire demande un prix supérieur à votre budget initial. 
                  Si vous acceptez, votre débit total sera ajusté à <strong>{totalCost} €</strong> (dont {commission}€ de comm).
               </p>
            </div>
            <div className="flex gap-2">
               <button className="flex-1 py-2 bg-white border border-slate-300 text-slate-600 font-bold rounded-lg hover:bg-slate-50">
                  Refuser / Négocier
               </button>
               <button className="flex-1 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 shadow-sm">
                  Accepter la hausse
               </button>
            </div>
         </div>
       ) : (
         // SCENARIO 1 UI (Direct Match)
         <div>
            <button className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md shadow-green-100 flex items-center justify-center gap-2">
               <CheckCircle size={18} />
               Valider cette offre
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
               En validant, le montant sera débité et les coordonnées échangées.
            </p>
         </div>
       )}

    </div>
  );
};

export default MesChantiers;