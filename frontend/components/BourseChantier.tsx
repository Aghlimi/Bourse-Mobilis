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
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

// Types for our data
interface Mission {
  id: string;
  fromCity: string;
  fromZip: string;
  toCity: string;
  toZip: string;
  volume: number; // m3
  distance: number; // km
  date: string;
  priceHT: number;
  tags: string[];
  isUrgent?: boolean;
  accessStart: string; // e.g., "RDC"
  accessEnd: string; // e.g., "3ème sans ascenseur"
  elevatorStart: boolean;
  elevatorEnd: boolean;
  furnitureLiftStart: boolean;
  furnitureLiftEnd: boolean;
}

const MOCK_MISSIONS: Mission[] = [
  {
    id: 'M-24501',
    fromCity: 'Paris',
    fromZip: '75015',
    toCity: 'Lyon',
    toZip: '69002',
    volume: 30,
    distance: 465,
    date: '12/01/2026',
    priceHT: 1200,
    tags: ['Standard', 'Meubles fragiles'],
    isUrgent: true,
    accessStart: '2ème étage',
    accessEnd: 'RDC',
    elevatorStart: true,
    elevatorEnd: false,
    furnitureLiftStart: false,
    furnitureLiftEnd: false
  },
  {
    id: 'M-24502',
    fromCity: 'Bordeaux',
    fromZip: '33000',
    toCity: 'Nantes',
    toZip: '44000',
    volume: 15,
    distance: 350,
    date: '14/01/2026',
    priceHT: 650,
    tags: ['Petit volume', 'Retour à vide'],
    accessStart: 'Maison',
    accessEnd: '1er étage',
    elevatorStart: false,
    elevatorEnd: false,
    furnitureLiftStart: false,
    furnitureLiftEnd: false
  },
  {
    id: 'M-24503',
    fromCity: 'Marseille',
    fromZip: '13008',
    toCity: 'Lille',
    toZip: '59000',
    volume: 50,
    distance: 1000,
    date: '15/01/2026',
    priceHT: 2100,
    tags: ['Gros volume', 'Equipe requise'],
    accessStart: '4ème étage',
    accessEnd: 'Maison',
    elevatorStart: false,
    elevatorEnd: false,
    furnitureLiftStart: true,
    furnitureLiftEnd: false
  },
  {
    id: 'M-24504',
    fromCity: 'Strasbourg',
    fromZip: '67000',
    toCity: 'Paris',
    toZip: '75012',
    volume: 22,
    distance: 490,
    date: '18/01/2026',
    priceHT: 950,
    tags: ['Standard'],
    accessStart: 'RDC',
    accessEnd: '5ème étage',
    elevatorStart: false,
    elevatorEnd: true,
    furnitureLiftStart: false,
    furnitureLiftEnd: false
  }
];

const BourseChantier: React.FC = () => {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  // Handle viewing a mission
  const handleViewMission = (mission: Mission) => {
    setSelectedMission(mission);
    setView('detail');
  };

  // Handle going back to list
  const handleBack = () => {
    setView('list');
    setSelectedMission(null);
  };

  return (
    <div className="flex flex-col min-h-full animate-in fade-in duration-300">
      {view === 'list' ? (
        <MissionList onSelect={handleViewMission} />
      ) : (
        selectedMission && <MissionDetail mission={selectedMission} onBack={handleBack} />
      )}
    </div>
  );
};

// --- SUB-COMPONENT: LIST VIEW ---

const MissionList: React.FC<{ onSelect: (m: Mission) => void }> = ({ onSelect }) => {
  return (
    <div className="space-y-6 pb-20">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Bourse de Chantiers</h1>
          <p className="text-slate-500 mt-1">
            Trouvez des lots à sous-traiter ou comblez vos retours à vide.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-200">
             {MOCK_MISSIONS.length} offres disponibles
           </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ville de départ, arrivée..." 
            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap">
            <Calendar size={16} /> Date
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 whitespace-nowrap">
            <Box size={16} /> Volume
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-600 text-white border border-orange-600 rounded-xl text-sm font-medium hover:bg-orange-700 shadow-sm whitespace-nowrap">
            <Filter size={16} /> Tous les filtres
          </button>
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {MOCK_MISSIONS.map((mission) => (
          <div 
            key={mission.id}
            className="group bg-white rounded-3xl p-6 border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
            onClick={() => onSelect(mission)}
          >
            {/* Top Badge */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-2">
                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                  {mission.id}
                </span>
                {mission.isUrgent && (
                  <span className="bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-lg text-xs font-bold animate-pulse">
                    URGENT
                  </span>
                )}
              </div>
              <div className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                 <ShieldCheck size={12} /> Vérifié
              </div>
            </div>

            {/* Route Visual */}
            <div className="flex flex-col gap-4 mb-6 relative">
              {/* Vertical Line */}
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-slate-100 group-hover:bg-orange-100 transition-colors"></div>
              
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-orange-400 group-hover:text-orange-500 transition-colors bg-white">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-none">{mission.fromCity}</p>
                  <p className="text-slate-400 text-sm mt-1">{mission.fromZip}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-orange-600 group-hover:text-orange-600 transition-colors bg-white">
                   <MapPin size={14} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg leading-none">{mission.toCity}</p>
                  <p className="text-slate-400 text-sm mt-1">{mission.toZip}</p>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50">
              <div className="text-center p-2 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Volume</p>
                <p className="text-slate-700 font-bold">{mission.volume} m³</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Distance</p>
                <p className="text-slate-700 font-bold">{mission.distance} km</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-slate-50/50">
                <p className="text-xs text-slate-400 font-medium uppercase mb-1">Date</p>
                <p className="text-slate-700 font-bold">{mission.date.split('/')[0]}/{mission.date.split('/')[1]}</p>
              </div>
            </div>

            {/* Footer Price & Action */}
            <div className="flex items-center justify-between mt-4">
               <div>
                 <p className="text-xs text-slate-400 font-medium">Budget estimé</p>
                 <p className="text-xl font-bold text-orange-600">{mission.priceHT} € <span className="text-xs text-slate-400 font-normal">HT</span></p>
               </div>
               <button className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-md group-hover:scale-110">
                 <ArrowRight size={18} />
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: DETAIL VIEW ---

const MissionDetail: React.FC<{ mission: Mission; onBack: () => void }> = ({ mission, onBack }) => {
  const [negotiationMode, setNegotiationMode] = useState(false);
  const [offerPrice, setOfferPrice] = useState<number>(mission.priceHT);
  
  const commission = Math.round(offerPrice * 0.05); // 5%
  const totalReceived = offerPrice - commission; // What the mover gets

  return (
    <div className="max-w-5xl mx-auto pb-20">
      
      {/* Top Navigation */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 font-medium"
      >
        <ArrowLeft size={20} />
        Retour à la liste
      </button>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex justify-between items-start mb-8">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                   <h1 className="text-2xl font-bold text-slate-800">Mission {mission.id}</h1>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200 flex items-center gap-1">
                      <ShieldCheck size={14} /> Vérifiée par Mobilis
                   </span>
                 </div>
                 <p className="text-slate-500">Publiée le 01/01/2026 par <span className="font-semibold text-slate-700">Déménageur Parisien SAS</span></p>
               </div>
               <div className="text-right">
                  <p className="text-3xl font-bold text-orange-600">{mission.priceHT} €</p>
                  <p className="text-sm text-slate-400">Montant proposé (HT)</p>
               </div>
             </div>

             {/* Route Display */}
             <div className="flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center justify-between bg-slate-50 p-6 rounded-2xl border border-slate-100">
                
                {/* Depart */}
                <div className="flex gap-4">
                   <div className="mt-1 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center font-bold text-slate-700">D</div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Départ</p>
                      <p className="text-lg font-bold text-slate-800">{mission.fromCity} ({mission.fromZip})</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                         <Calendar size={14} /> {mission.date}
                      </p>
                   </div>
                </div>

                {/* Arrow / Distance */}
                <div className="hidden md:flex flex-col items-center flex-1 px-8">
                   <p className="text-xs font-bold text-slate-400 mb-2">{mission.distance} km</p>
                   <div className="w-full h-0.5 bg-slate-300 relative">
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-300 rounded-full"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-2 h-2 border-t-2 border-r-2 border-slate-300 rotate-45"></div>
                   </div>
                   <div className="mt-2 bg-white border border-slate-200 px-2 py-1 rounded text-xs font-medium text-slate-600 shadow-sm">
                      {mission.volume} m³
                   </div>
                </div>

                {/* Arrivee */}
                <div className="flex gap-4 text-right md:text-left">
                   <div className="mt-1 w-10 h-10 rounded-full bg-orange-100 border border-orange-200 shadow-sm flex items-center justify-center font-bold text-orange-600 md:order-last">A</div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Arrivée</p>
                      <p className="text-lg font-bold text-slate-800">{mission.toCity} ({mission.toZip})</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                         <Info size={14} /> Livraison directe
                      </p>
                   </div>
                </div>
             </div>
          </div>

          {/* Details & Accessibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Access Depart */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full"></div> Accès Départ
               </h3>
               <div className="space-y-3">
                  <DetailRow label="Type" value="Appartement" />
                  <DetailRow label="Étage" value={mission.accessStart} />
                  <DetailRow label="Ascenseur" value={mission.elevatorStart ? "Oui" : "Non"} highlight={!mission.elevatorStart} />
                  <DetailRow label="Monte-meuble" value={mission.furnitureLiftStart ? "Requis" : "Non requis"} />
               </div>
            </div>

            {/* Access Arrivee */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div> Accès Arrivée
               </h3>
               <div className="space-y-3">
                  <DetailRow label="Type" value="Maison / RDC" />
                  <DetailRow label="Étage" value={mission.accessEnd} />
                  <DetailRow label="Ascenseur" value={mission.elevatorEnd ? "Oui" : "Non"} />
                  <DetailRow label="Monte-meuble" value={mission.furnitureLiftEnd ? "Requis" : "Non requis"} />
               </div>
            </div>

          </div>

          {/* Inventory Summary (Mock) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-800 mb-4">Inventaire Sommaire</h3>
             <div className="flex flex-wrap gap-2">
                {mission.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                    {tag}
                  </span>
                ))}
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">Cartons standard x20</span>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">Cartons livres x15</span>
                <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">Penderies x3</span>
             </div>
             <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                <p className="text-sm text-yellow-800">
                  <span className="font-bold">Note du client :</span> "Attention au piano droit (RDC vers RDC), nécessite sangles et plateau roulant."
                </p>
             </div>
          </div>

        </div>

        {/* Right Column: Negotiation & Actions */}
        <div className="space-y-6">
           
           <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">
              <h3 className="font-bold text-lg text-slate-800 mb-6">Répondre à l'offre</h3>
              
              {!negotiationMode ? (
                // Scenario 1: Default View
                <div className="space-y-4">
                   <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-500 text-sm">Prix proposé</span>
                         <span className="font-bold text-slate-800">{mission.priceHT} € HT</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-500 text-sm">Commission (5%)</span>
                         <span className="font-bold text-red-500">- {Math.round(mission.priceHT * 0.05)} €</span>
                      </div>
                      <div className="h-px bg-slate-200 my-2"></div>
                      <div className="flex justify-between items-center">
                         <span className="text-slate-700 font-bold">Net pour vous</span>
                         <span className="font-bold text-green-600 text-lg">{mission.priceHT - Math.round(mission.priceHT * 0.05)} €</span>
                      </div>
                   </div>
                   
                   <button className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
                      <CheckCircle size={20} />
                      Accepter le prix
                   </button>
                   
                   <button 
                     onClick={() => setNegotiationMode(true)}
                     className="w-full py-3 bg-white border-2 border-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition-colors"
                   >
                      Négocier / Contre-offre
                   </button>

                   <p className="text-xs text-center text-slate-400 mt-2">
                     En acceptant, vous vous engagez à réaliser la prestation selon les conditions de Mobilis.
                   </p>
                </div>
              ) : (
                // Scenario 2: Negotiation Mode
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                   <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-4">
                      <h4 className="font-bold text-orange-800 text-sm mb-1">Négociation</h4>
                      <p className="text-xs text-orange-600">Le donneur d'ordre recevra votre contre-offre et pourra l'accepter ou la refuser.</p>
                   </div>
                   
                   <div>
                     <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Votre nouveau prix (HT)</label>
                     <div className="relative">
                       <input 
                         type="number" 
                         value={offerPrice}
                         onChange={(e) => setOfferPrice(Number(e.target.value))}
                         className="w-full p-3 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
                       />
                       <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                     </div>
                   </div>

                   {/* Live Calc */}
                   <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm space-y-1">
                      <div className="flex justify-between">
                         <span className="text-slate-500">Comm. (5%)</span>
                         <span className="text-red-500 font-medium">-{commission} €</span>
                      </div>
                      <div className="flex justify-between font-bold">
                         <span className="text-slate-700">Net estimé</span>
                         <span className="text-green-600">{totalReceived} €</span>
                      </div>
                   </div>

                   <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => setNegotiationMode(false)}
                        className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                      >
                         Annuler
                      </button>
                      <button className="flex-1 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md shadow-orange-200 transition-colors">
                         Envoyer
                      </button>
                   </div>
                </div>
              )}

           </div>

           {/* Helper Info */}
           <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200/50">
              <h4 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <ShieldCheck size={16} className="text-orange-500" />
                Garantie Mobilis
              </h4>
              <ul className="space-y-3">
                 <li className="text-xs text-slate-500 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                    Paiement sécurisé sur compte séquestre.
                 </li>
                 <li className="text-xs text-slate-500 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                    Coordonnées client transmises après validation.
                 </li>
                 <li className="text-xs text-slate-500 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5"></div>
                    Support litige inclus (Loi Loterie).
                 </li>
              </ul>
           </div>

        </div>

      </div>
    </div>
  );
};

// Helper for detail rows
const DetailRow: React.FC<{ label: string, value: string, highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
    <span className="text-sm text-slate-400">{label}</span>
    <span className={`text-sm font-bold ${highlight ? 'text-orange-600' : 'text-slate-700'}`}>{value}</span>
  </div>
);

export default BourseChantier;