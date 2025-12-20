import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Package, 
  ArrowRight, 
  Upload, 
  Euro, 
  Info, 
  CheckCircle,
  AlertTriangle,
  FileText,
  User,
  Truck,
  Database,
  Search,
  X,
  Calculator,
  ArrowLeftRight,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

// Mock CRM Data
const MOCK_CRM_CLIENTS = [
  { 
    id: 1, 
    name: 'Jean Dupont', 
    phone: '06 12 34 56 78', 
    email: 'jean.dupont@email.com',
    address: '12 Rue de la Convention',
    city: 'Paris',
    zip: '75015',
    floor: '4',
    elevator: true,
    volume: 30 
  },
  { 
    id: 2, 
    name: 'Marie Curie', 
    phone: '07 98 76 54 32', 
    email: 'marie.curie@science.fr',
    address: '5 Place Bellecour',
    city: 'Lyon',
    zip: '69002',
    floor: '2',
    elevator: false,
    volume: 45 
  },
  { 
    id: 3, 
    name: 'Arthur Vandelay', 
    phone: '06 88 12 34 56', 
    email: 'arthur.v@impexp.com',
    address: '15 Rue de la Paix',
    city: 'Bordeaux',
    zip: '33000',
    floor: 'RDC',
    elevator: false,
    volume: 20 
  },
];

const VendreChantier: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    date: '',
    volume: '',
    fromAddress: '',
    fromCity: '',
    fromZip: '',
    fromFloor: '',
    fromElevator: false,
    toAddress: '',
    toCity: '',
    toZip: '',
    toFloor: '',
    toElevator: false,
    inventory: '',
    visiblePrice: '', // Net Déménageur
    clientPrice: ''   // Initial Price (Client pays)
  });

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter clients based on search
  const filteredClients = searchTerm.length > 0 
    ? MOCK_CRM_CLIENTS.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSelectClient = (client: any) => {
    setFormData({
      ...formData,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      fromAddress: client.address,
      fromCity: client.city,
      fromZip: client.zip,
      fromFloor: client.floor,
      fromElevator: client.elevator,
      volume: client.volume.toString(),
    });
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  // --- PRICING LOGIC (10% Commission) ---
  const COMMISSION_RATE = 0.10;

  const handleVisiblePriceChange = (val: string) => {
    const vPrice = parseFloat(val);
    if (isNaN(vPrice) || val === '') {
      setFormData({ ...formData, visiblePrice: val, clientPrice: '' });
      return;
    }
    // Formula: Initial = Visible + (Visible * 0.10) = Visible * 1.10
    const cPrice = vPrice * (1 + COMMISSION_RATE);
    setFormData({
      ...formData,
      visiblePrice: val,
      clientPrice: cPrice.toFixed(0) // Rounding to integer for cleaner UX
    });
  };

  const handleClientPriceChange = (val: string) => {
    const cPrice = parseFloat(val);
    if (isNaN(cPrice) || val === '') {
      setFormData({ ...formData, clientPrice: val, visiblePrice: '' });
      return;
    }
    // Formula: Visible = Initial / 1.10
    const vPrice = cPrice / (1 + COMMISSION_RATE);
    setFormData({
      ...formData,
      clientPrice: val,
      visiblePrice: vPrice.toFixed(0)
    });
  };

  // Derived Values for Display
  const visiblePriceNum = parseFloat(formData.visiblePrice) || 0;
  const clientPriceNum = parseFloat(formData.clientPrice) || 0;
  const commissionAmount = clientPriceNum - visiblePriceNum;

  const handleSubmit = () => {
    setShowConfirmation(true);
  };

  const confirmPublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(false);
      // Reset or redirect logic here
      alert("Chantier publié avec succès sur la bourse !");
      setStep(1); 
      setFormData({ ...formData, clientName: '', visiblePrice: '', clientPrice: '' }); 
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Vendre un Chantier</h1>
          <p className="text-slate-500 mt-1">
            Publiez une mission sur la bourse pour trouver un sous-traitant qualifié.
          </p>
        </div>
        
        {/* Client Search Bar */}
        <div className="relative w-full md:w-80" ref={searchRef}>
           <div className="relative">
             <input 
               type="text" 
               placeholder="Rechercher un client CRM..." 
               className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all"
               value={searchTerm}
               onChange={(e) => {
                 setSearchTerm(e.target.value);
                 setIsSearchOpen(true);
               }}
               onFocus={() => setIsSearchOpen(true)}
             />
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             {searchTerm && (
               <button 
                 onClick={() => { setSearchTerm(''); setIsSearchOpen(false); }}
                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
               >
                 <X size={14} />
               </button>
             )}
           </div>

           {/* Dropdown Results */}
           {isSearchOpen && searchTerm.length > 0 && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="max-h-60 overflow-y-auto">
                   {filteredClients.length === 0 ? (
                     <div className="p-4 text-center text-slate-500 text-xs">
                        Aucun client trouvé pour "{searchTerm}"
                     </div>
                   ) : (
                     <>
                        <div className="px-3 py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Résultats CRM</div>
                        {filteredClients.map(client => (
                          <button 
                            key={client.id}
                            onClick={() => handleSelectClient(client)}
                            className="w-full text-left p-3 hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-slate-50 last:border-0"
                          >
                             <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {client.name.charAt(0)}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-slate-800">{client.name}</p>
                                <p className="text-xs text-slate-500">{client.city} • {client.phone}</p>
                             </div>
                          </button>
                        ))}
                     </>
                   )}
                </div>
             </div>
           )}
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Form Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Privacy Notice Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
             <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                <ShieldCheck size={20} />
             </div>
             <div>
                <h3 className="font-bold text-blue-800 text-sm">Confidentialité garantie</h3>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                   Les informations sensibles (Nom, Téléphone, Email, Adresses précises) ne seront <strong>pas visibles publiquement</strong>. 
                   Seules la ville et le code postal seront affichés aux autres professionnels avant validation d'une offre.
                </p>
             </div>
          </div>

          {/* Section 1: Client & Logistics */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                <User size={18} />
              </div>
              Informations Client & Mission
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="relative">
                  <Input 
                    label="Nom du Client" 
                    placeholder="ex: Jean Dupont" 
                    value={formData.clientName}
                    onChange={v => setFormData({...formData, clientName: v})}
                    icon={<EyeOff size={16} className="text-slate-300" />}
                  />
                  <span className="absolute right-3 top-[38px] text-[10px] text-slate-400 flex items-center gap-1">
                     <EyeOff size={10} /> Masqué
                  </span>
               </div>
               
               <div className="relative">
                  <Input 
                    label="Téléphone" 
                    placeholder="06..." 
                    value={formData.clientPhone}
                    onChange={v => setFormData({...formData, clientPhone: v})}
                    icon={<EyeOff size={16} className="text-slate-300" />}
                  />
                  <span className="absolute right-3 top-[38px] text-[10px] text-slate-400 flex items-center gap-1">
                     <EyeOff size={10} /> Masqué
                  </span>
               </div>

               <Input 
                 label="Date prévue" 
                 type="date"
                 value={formData.date}
                 onChange={v => setFormData({...formData, date: v})}
               />
               <Input 
                 label="Volume estimé (m³)" 
                 placeholder="ex: 30"
                 type="number"
                 value={formData.volume}
                 onChange={v => setFormData({...formData, volume: v})}
                 icon={<Package size={16} className="text-slate-400"/>}
               />
            </div>
          </div>

          {/* Section 2: Route */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <MapPin size={18} />
              </div>
              Détails du Trajet
            </h3>

            {/* DEPART */}
            <div className="mb-8 relative">
               <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-slate-100"></div>
               <div className="flex items-start gap-4">
                  <div className="mt-2 w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold z-10">D</div>
                  <div className="flex-1 space-y-4">
                     <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Adresse de Départ</h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                           <EyeOff size={10} /> Visible après validation
                        </span>
                     </div>
                     <Input 
                       placeholder="Adresse complète (Masquée)" 
                       value={formData.fromAddress}
                       onChange={v => setFormData({...formData, fromAddress: v})}
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Ville (Visible)" 
                          value={formData.fromCity}
                          onChange={v => setFormData({...formData, fromCity: v})}
                        />
                        <Input 
                          placeholder="Code Postal (Visible)" 
                          value={formData.fromZip}
                          onChange={v => setFormData({...formData, fromZip: v})}
                        />
                     </div>
                     <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="w-24">
                           <Input 
                              label="Étage" 
                              placeholder="0" 
                              value={formData.fromFloor}
                              onChange={v => setFormData({...formData, fromFloor: v})}
                              noMb 
                           />
                        </div>
                        <div className="flex-1 flex items-center gap-2 pt-6">
                           <input 
                              type="checkbox" 
                              id="fromElevator"
                              checked={formData.fromElevator}
                              onChange={e => setFormData({...formData, fromElevator: e.target.checked})}
                              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                           />
                           <label htmlFor="fromElevator" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Ascenseur utilisable</label>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* ARRIVEE */}
            <div className="flex items-start gap-4">
                  <div className="mt-2 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold z-10">A</div>
                  <div className="flex-1 space-y-4">
                     <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Adresse d'Arrivée</h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                           <EyeOff size={10} /> Visible après validation
                        </span>
                     </div>
                     <Input 
                       placeholder="Adresse complète (Masquée)" 
                       value={formData.toAddress}
                       onChange={v => setFormData({...formData, toAddress: v})}
                     />
                     <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Ville (Visible)" 
                          value={formData.toCity}
                          onChange={v => setFormData({...formData, toCity: v})}
                        />
                        <Input 
                          placeholder="Code Postal (Visible)" 
                          value={formData.toZip}
                          onChange={v => setFormData({...formData, toZip: v})}
                        />
                     </div>
                     <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <div className="w-24">
                           <Input 
                              label="Étage" 
                              placeholder="0" 
                              value={formData.toFloor}
                              onChange={v => setFormData({...formData, toFloor: v})}
                              noMb 
                           />
                        </div>
                        <div className="flex-1 flex items-center gap-2 pt-6">
                           <input 
                              type="checkbox" 
                              id="toElevator"
                              checked={formData.toElevator}
                              onChange={e => setFormData({...formData, toElevator: e.target.checked})}
                              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                           />
                           <label htmlFor="toElevator" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Ascenseur utilisable</label>
                        </div>
                     </div>
                  </div>
               </div>

          </div>

          {/* Section 3: Inventory */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <FileText size={18} />
              </div>
              Inventaire & Spécificités
            </h3>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Commentaires / Inventaire Sommaire</label>
                 <textarea 
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all min-h-[120px]"
                    placeholder="Listez les gros meubles, les accès difficiles, ou collez l'inventaire ici..."
                    value={formData.inventory}
                    onChange={e => setFormData({...formData, inventory: e.target.value})}
                 ></textarea>
               </div>
               
               <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                     <Upload size={20} className="text-slate-400 group-hover:text-orange-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Importer un inventaire PDF</p>
                  <p className="text-xs text-slate-400 mt-1">Glissez-déposez ou cliquez pour parcourir</p>
               </div>
            </div>
          </div>

        </div>

        {/* Right: Price & Validation */}
        <div className="space-y-6">
           
           <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-orange-600"/>
                Offre Financière
              </h3>
              
              <div className="space-y-6 mb-6">
                 
                 {/* Input A: Client Price (Initial) */}
                 <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-orange-100 focus-within:border-orange-400 transition-all relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Prix Initial (Payé par Client)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         placeholder="0"
                         className="w-full pl-0 pr-8 py-1 text-2xl font-bold text-slate-800 bg-transparent border-none focus:ring-0 placeholder:text-slate-300"
                         value={formData.clientPrice}
                         onChange={e => handleClientPriceChange(e.target.value)}
                       />
                       <Euro className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                 </div>

                 {/* Divider / Link */}
                 <div className="flex items-center justify-center -my-3 z-10 relative">
                    <div className="bg-white p-1.5 rounded-full border border-slate-200 text-slate-400 shadow-sm" title="Prix lié (Commission 10%)">
                       <ArrowLeftRight size={14} className="rotate-90" />
                    </div>
                 </div>

                 {/* Input B: Visible Price (Net Mover) */}
                 <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-500 transition-all">
                    <label className="block text-xs font-bold text-orange-700 uppercase mb-2">Prix Visible (Net Déménageur)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         placeholder="0"
                         className="w-full pl-0 pr-8 py-1 text-2xl font-bold text-orange-600 bg-transparent border-none focus:ring-0 placeholder:text-orange-200"
                         value={formData.visiblePrice}
                         onChange={e => handleVisiblePriceChange(e.target.value)}
                       />
                       <Euro className="absolute right-0 top-1/2 -translate-y-1/2 text-orange-400" size={20} />
                    </div>
                 </div>

              </div>

              {/* Calculation Summary */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 mb-6">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Prix Visible</span>
                    <span className="font-bold text-slate-700">{Math.round(visiblePriceNum)} €</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Commission Plateforme (10%)</span>
                    <span className="font-bold text-orange-600">+ {Math.round(commissionAmount)} €</span>
                 </div>
                 <div className="h-px bg-slate-200 my-1"></div>
                 <div className="flex justify-between items-center text-base">
                    <span className="font-bold text-slate-800">Total Client</span>
                    <span className="font-bold text-slate-900">{Math.round(clientPriceNum)} € HT</span>
                 </div>
                 
                 <div className="bg-blue-50 rounded-lg p-2 mt-2">
                    <p className="text-[10px] text-blue-700 leading-snug text-center">
                       Le système calcule automatiquement le prix manquant.
                       <br/>
                       <strong>Prix Initial = Prix Visible x 1.10</strong>
                    </p>
                 </div>
              </div>

              <button 
                 onClick={handleSubmit}
                 disabled={!visiblePriceNum || !formData.fromCity || !formData.toCity}
                 className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
              >
                 Publier l'offre
                 <ArrowRight size={20} />
              </button>
              
              <div className="mt-4 text-center">
                 <button className="text-sm font-medium text-slate-500 hover:text-slate-800">
                    Enregistrer comme brouillon
                 </button>
              </div>

           </div>
           
           <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-800 text-sm mb-2 flex items-center gap-2">
                 <Info size={16} /> Tarification Plateforme
              </h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                 La tarification intègre une commission de plateforme fixée à <strong>10%</strong>.
                 <br/><br/>
                 Le <strong>Prix Visible</strong> est le montant perçu par le déménageur.
                 Le <strong>Prix Initial</strong> est le montant payé par le client.
              </p>
           </div>

        </div>

      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmation(false)}></div>
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
              
              <div className="bg-slate-50 p-6 border-b border-slate-100 text-center">
                 <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
                    <AlertTriangle size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800">Confirmer la publication</h3>
              </div>
              
              <div className="p-8 space-y-4">
                 <p className="text-center text-slate-600 text-sm mb-6">
                    Vous allez publier une mission de <strong>{formData.fromCity}</strong> vers <strong>{formData.toCity}</strong>.
                 </p>
                 
                 <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-sm text-slate-600">Prix Initial (Client)</span>
                       <span className="text-sm font-bold text-slate-800">{Math.round(clientPriceNum)} €</span>
                    </div>
                    <div className="flex justify-between items-center text-orange-700 text-xs">
                       <span>Dont Commission (10%)</span>
                       <span>- {Math.round(commissionAmount)} €</span>
                    </div>
                    <div className="h-px bg-orange-200/50 my-2"></div>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-orange-800">Net Déménageur (Visible)</span>
                       <span className="text-lg font-bold text-orange-600">{Math.round(visiblePriceNum)} € HT</span>
                    </div>
                 </div>

                 <p className="text-xs text-slate-400 text-center px-4">
                    Le montant total sera débité à l'acceptation de l'offre par un prestataire.
                 </p>

                 <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                       onClick={() => setShowConfirmation(false)}
                       className="py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                       Annuler
                    </button>
                    <button 
                       onClick={confirmPublish}
                       disabled={isSubmitting}
                       className="py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                       {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                       ) : (
                          <>Valider & Publier</>
                       )}
                    </button>
                 </div>
              </div>

           </div>
        </div>
      )}

    </div>
  );
};

// Input Helper
const Input: React.FC<{ 
  label?: string, 
  placeholder?: string, 
  value?: string | number, 
  onChange?: (val: string) => void,
  type?: string,
  icon?: React.ReactNode,
  noMb?: boolean
}> = ({ label, placeholder, value, onChange, type = "text", icon, noMb }) => (
  <div className={noMb ? '' : ''}>
    {label && <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>}
    <div className="relative">
       <input 
         type={type}
         className={`w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all ${icon ? 'pl-10' : ''}`}
         placeholder={placeholder}
         value={value}
         onChange={e => onChange?.(e.target.value)}
       />
       {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
    </div>
  </div>
);

export default VendreChantier;