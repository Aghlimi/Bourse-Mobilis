import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  MapPin, 
  Box, 
  Euro, 
  Truck,
  ArrowRight
} from 'lucide-react';

// --- Types ---

type MessageType = 'TEXT' | 'OFFER' | 'SYSTEM' | 'ACTION';
type Sender = 'ME' | 'PARTNER';

interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string;
  timestamp: string;
  price?: number; // Only for OFFER type
  status?: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}

interface Conversation {
  id: string;
  partnerName: string;
  partnerAvatar: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  status: 'NEGOTIATION' | 'ACCEPTED' | 'COMPLETED';
  missionId: string;
  missionRoute: string;
  missionVolume: number;
  missionPrice: number;
  messages: Message[];
}

// --- Mock Data ---

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    partnerName: 'Transport Express',
    partnerAvatar: 'T',
    lastMessage: 'Je vous fais une contre-offre.',
    lastTime: '10:30',
    unreadCount: 2,
    status: 'NEGOTIATION',
    missionId: 'M-24501',
    missionRoute: 'Paris (75) ➔ Lyon (69)',
    missionVolume: 30,
    missionPrice: 1200,
    messages: [
      { id: 'm1', sender: 'ME', type: 'SYSTEM', content: 'Vous avez invité Transport Express à négocier sur la mission M-24501.', timestamp: '09:00' },
      { id: 'm2', sender: 'PARTNER', type: 'TEXT', content: 'Bonjour, je suis intéressé par ce lot mais le tarif est un peu juste compte tenu de l\'étage au départ.', timestamp: '09:15' },
      { id: 'm3', sender: 'ME', type: 'TEXT', content: 'Bonjour. Il y a un ascenseur pourtant. Quel prix proposez-vous ?', timestamp: '09:20' },
      { id: 'm4', sender: 'PARTNER', type: 'OFFER', content: 'Nouvelle proposition reçue', price: 1350, timestamp: '10:30', status: 'PENDING' }
    ]
  },
  {
    id: 'c2',
    partnerName: 'Démé-Pro 33',
    partnerAvatar: 'D',
    lastMessage: 'Parfait, on valide ça.',
    lastTime: 'Hier',
    unreadCount: 0,
    status: 'ACCEPTED',
    missionId: 'M-24490',
    missionRoute: 'Bordeaux (33) ➔ Nantes (44)',
    missionVolume: 15,
    missionPrice: 650,
    messages: [
      { id: 'm1', sender: 'ME', type: 'TEXT', content: 'Le chantier est toujours dispo ?', timestamp: 'Hier 14:00' },
      { id: 'm2', sender: 'PARTNER', type: 'TEXT', content: 'Oui tout à fait.', timestamp: 'Hier 14:05' },
      { id: 'm3', sender: 'PARTNER', type: 'OFFER', content: 'Proposition au prix affiché', price: 650, timestamp: 'Hier 14:10', status: 'ACCEPTED' },
      { id: 'm4', sender: 'ME', type: 'SYSTEM', content: 'Offre acceptée. La mission est validée.', timestamp: 'Hier 14:15' }
    ]
  }
];

const Messagerie: React.FC = () => {
  const [activeConvId, setActiveConvId] = useState<string>(MOCK_CONVERSATIONS[0].id);
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);
  const [showCounterOfferInput, setShowCounterOfferInput] = useState(false);
  const [counterPrice, setCounterPrice] = useState<string>('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeConv.messages]);

  const handleSendCounterOffer = () => {
    if (!counterPrice) return;
    const price = parseInt(counterPrice);
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'ME',
      type: 'OFFER',
      content: 'Contre-offre envoyée',
      price: price,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'PENDING'
    };

    setConversations(prev => prev.map(c => 
      c.id === activeConvId 
        ? { ...c, messages: [...c.messages, newMessage], lastMessage: `Contre-offre : ${price}€`, lastTime: 'À l\'instant' }
        : c
    ));
    setShowCounterOfferInput(false);
    setCounterPrice('');
  };

  const handleOfferAction = (msgId: string, action: 'ACCEPT' | 'DECLINE') => {
    setConversations(prev => prev.map(c => {
      if (c.id !== activeConvId) return c;
      
      const updatedMessages = c.messages.map(m => {
        if (m.id === msgId) {
          return { ...m, status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED' } as Message;
        }
        return m;
      });

      // If accepted, add system message
      if (action === 'ACCEPT') {
        updatedMessages.push({
          id: Date.now().toString(),
          sender: 'ME',
          type: 'SYSTEM',
          content: 'Vous avez accepté l\'offre. Le montant a été bloqué et la mission est validée.',
          timestamp: 'À l\'instant'
        });
      } else if (action === 'DECLINE') {
        updatedMessages.push({
          id: Date.now().toString(),
          sender: 'ME',
          type: 'TEXT',
          content: 'Je refuse cette offre.',
          timestamp: 'À l\'instant'
        });
      }

      return { ...c, messages: updatedMessages };
    }));
  };

  const handleGlobalAction = (action: 'ACCEPT' | 'DECLINE') => {
    // Find last pending offer from partner
    const lastOffer = activeConv.messages
      .slice()
      .reverse()
      .find(m => m.sender === 'PARTNER' && m.type === 'OFFER' && m.status === 'PENDING');

    if (lastOffer) {
      handleOfferAction(lastOffer.id, action);
    } else {
      // Fallback if no specific offer is pending
      const text = action === 'ACCEPT' 
        ? "J'accepte votre proposition." 
        : "Je ne peux pas accepter cette proposition.";
      
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'ME',
        type: 'TEXT',
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversations(prev => prev.map(c => 
        c.id === activeConvId 
          ? { ...c, messages: [...c.messages, newMessage], lastMessage: text, lastTime: 'À l\'instant' }
          : c
      ));
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-300">
      
      {/* LEFT: Conversation List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        
        {/* Header Search */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer transition-colors hover:bg-white ${activeConvId === conv.id ? 'bg-white border-l-4 border-l-orange-500 shadow-sm' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold flex items-center justify-center">
                      {conv.partnerAvatar}
                   </div>
                   <div>
                      <h4 className={`text-sm font-bold ${activeConvId === conv.id ? 'text-slate-900' : 'text-slate-700'}`}>
                        {conv.partnerName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-mono">Mission #{conv.missionId}</p>
                   </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{conv.lastTime}</span>
              </div>
              
              <p className="text-xs text-slate-500 mt-2 line-clamp-1 pr-2">
                 {conv.lastMessage}
              </p>

              {conv.status === 'NEGOTIATION' && (
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-100">
                  <AlertCircle size={10} /> En Négociation
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT: Chat Area */}
      <div className="flex-1 flex flex-col bg-white relative">
        
        {/* 1. Context Header (Sticky Hint) */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white z-10 shadow-sm">
          <div className="flex items-center gap-4">
             <div className="flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                   Mission #{activeConv.missionId}
                   <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-100 rounded-full">
                      {activeConv.status === 'NEGOTIATION' ? 'Négociation en cours' : 'Validée'}
                   </span>
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                   <span className="flex items-center gap-1"><MapPin size={12}/> {activeConv.missionRoute}</span>
                   <span className="flex items-center gap-1"><Box size={12}/> {activeConv.missionVolume}m³</span>
                </div>
             </div>
          </div>
          <div className="text-right">
             <p className="text-xs text-slate-400">Budget Initial</p>
             <p className="font-bold text-slate-800">{activeConv.missionPrice} € HT</p>
          </div>
        </div>

        {/* 2. Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
           
           {activeConv.messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'ME' ? 'justify-end' : 'justify-start'}`}>
                
                {/* Message Bubble Container */}
                <div className={`max-w-[80%] md:max-w-[60%] ${msg.type === 'SYSTEM' ? 'w-full !max-w-full flex justify-center' : ''}`}>
                   
                   {/* SYSTEM MESSAGE */}
                   {msg.type === 'SYSTEM' && (
                      <div className="bg-slate-100 text-slate-500 text-xs px-4 py-2 rounded-full border border-slate-200 flex items-center gap-2 shadow-sm">
                         <CheckCircle size={12} className="text-slate-400" />
                         {msg.content}
                      </div>
                   )}

                   {/* TEXT MESSAGE */}
                   {msg.type === 'TEXT' && (
                      <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                        msg.sender === 'ME' 
                          ? 'bg-orange-600 text-white rounded-tr-none' 
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}>
                         {msg.content}
                         <div className={`text-[10px] mt-1 text-right ${msg.sender === 'ME' ? 'text-orange-200' : 'text-slate-400'}`}>
                            {msg.timestamp}
                         </div>
                      </div>
                   )}

                   {/* OFFER MESSAGE (Scenario 2 Logic) */}
                   {msg.type === 'OFFER' && msg.price && (
                      <div className={`p-1 rounded-2xl border-2 overflow-hidden ${
                         msg.sender === 'ME' 
                           ? 'bg-white border-orange-100 rounded-tr-none' 
                           : 'bg-white border-blue-100 rounded-tl-none shadow-md'
                      }`}>
                         {/* Offer Header */}
                         <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex justify-between items-center ${
                            msg.sender === 'ME' ? 'bg-slate-50 text-slate-500' : 'bg-blue-50 text-blue-600'
                         }`}>
                            <span>{msg.sender === 'ME' ? 'Vous avez proposé' : 'Proposition reçue'}</span>
                            <Euro size={14} />
                         </div>
                         
                         {/* Offer Content */}
                         <div className="p-5 text-center">
                            <p className="text-3xl font-bold text-slate-800 mb-1">{msg.price} € <span className="text-sm font-normal text-slate-400">HT</span></p>
                            <p className="text-xs text-slate-400 mb-4">Commission (5%) incluse</p>
                            
                            {/* Status or Actions */}
                            {msg.status === 'ACCEPTED' ? (
                               <div className="bg-green-50 text-green-700 px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-green-100">
                                  <CheckCircle size={16} /> Offre Acceptée
                               </div>
                            ) : msg.status === 'DECLINED' ? (
                               <div className="bg-red-50 text-red-700 px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border border-red-100">
                                  <XCircle size={16} /> Offre Refusée
                               </div>
                            ) : (
                               // Pending - Informational for history
                               <div className="text-xs text-slate-400 italic mt-2">
                                  {msg.sender === 'ME' ? 'En attente de réponse...' : 'Action requise ci-dessous'}
                               </div>
                            )}
                         </div>
                         <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                            <span className="text-[10px] font-bold text-slate-600">Net vendeur: {Math.round(msg.price * 1.05)} €</span>
                         </div>
                      </div>
                   )}

                </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* 3. Action Bar (Replaces Input) */}
        <div className="p-4 bg-white border-t border-slate-100 relative z-20">
          
          {/* Popover for Counter Offer */}
          {showCounterOfferInput && (
             <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 animate-in slide-in-from-bottom-2 z-30">
                <div className="flex justify-between items-center mb-4">
                   <h4 className="font-bold text-slate-800">Votre contre-offre</h4>
                   <button onClick={() => setShowCounterOfferInput(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20}/></button>
                </div>
                <div className="flex gap-4">
                   <div className="relative flex-1">
                      <input 
                        type="number" 
                        placeholder="Montant HT"
                        className="w-full pl-4 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-orange-500"
                        value={counterPrice}
                        onChange={(e) => setCounterPrice(e.target.value)}
                        autoFocus
                      />
                      <Euro className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   </div>
                   <button 
                     onClick={handleSendCounterOffer}
                     className="bg-orange-600 text-white font-bold px-6 rounded-xl hover:bg-orange-700 shadow-lg shadow-orange-100 transition-colors"
                   >
                     Envoyer
                   </button>
                </div>
             </div>
          )}

          <div className="grid grid-cols-3 gap-3">
             <button 
               onClick={() => handleGlobalAction('DECLINE')}
               className="py-4 flex flex-col items-center justify-center gap-1 rounded-xl bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-all font-bold group"
             >
                <XCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-wide">Refuser</span>
             </button>

             <button 
               onClick={() => setShowCounterOfferInput(true)}
               className="py-4 flex flex-col items-center justify-center gap-1 rounded-xl bg-white text-slate-700 border-2 border-slate-100 hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50 transition-all font-bold group"
             >
                <Euro size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-wide">Contre-offre</span>
             </button>

             <button 
               onClick={() => handleGlobalAction('ACCEPT')}
               className="py-4 flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 text-white hover:bg-green-600 transition-all shadow-lg font-bold group"
             >
                <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-wide">Accepter</span>
             </button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Messagerie;