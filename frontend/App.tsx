import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import DashboardSkeleton from './components/DashboardSkeleton';
import LaunchOverlay from './components/LaunchOverlay';
import { LayoutGrid, CheckCircle, AlertCircle, Info, X, Bell } from 'lucide-react';

// --- Global Types ---
export type NotificationType = 'OFFER' | 'MESSAGE' | 'ALERT' | 'INFO';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  
  // Notification System State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: 'n1', type: 'INFO', title: 'Bienvenue', message: 'Bienvenue sur la nouvelle version de Mobilis Bourse.', time: 'Hier', read: true },
    { id: 'n2', type: 'ALERT', title: 'Documents manquants', message: 'Veuillez mettre à jour votre Kbis.', time: 'Hier', read: false }
  ]);
  const [toasts, setToasts] = useState<AppNotification[]>([]);

  // Audio Ref for persistent looping sound
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio with a repeating notification sound (Digital chime)
    // Using a sound that loops well
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Mock Notification Interval for Testing (Every 30s) ---
  useEffect(() => {
    const interval = setInterval(() => {
      const templates = [
        { type: 'OFFER', title: 'Nouvelle Offre', message: 'Transport Express propose 1300€ pour le chantier Lyon.' },
        { type: 'MESSAGE', title: 'Nouveau Message', message: 'Jean Dupont: "Est-ce que l\'ascenseur est large ?"' },
        { type: 'ALERT', title: 'Action Requise', message: 'Veuillez valider le dossier #M-24501 avant ce soir.' },
        { type: 'INFO', title: 'Opportunité', message: '3 nouveaux chantiers disponibles dans votre secteur.' }
      ];
      
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
      
      addNotification(
        randomTemplate.type as NotificationType,
        randomTemplate.title,
        randomTemplate.message
      );
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Audio autoplay prevented by browser policy:", error);
        });
      }
    }
  };

  const stopNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Function to trigger a notification (History + Toast + Sound)
  const addNotification = (type: NotificationType, title: string, message: string) => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      time: 'À l\'instant',
      read: false
    };

    // Add to history
    setNotifications(prev => [newNotif, ...prev]);

    // Add to active toasts
    setToasts(prev => [...prev, newNotif]);

    // Start looping sound until opened
    playNotificationSound();

    // Browser Notification (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: message, icon: '/favicon.ico' });
    }

    // Auto-dismiss toast visual only (sound continues until 'open' via Navbar or toast click)
    setTimeout(() => {
      removeToast(newNotif.id);
    }, 8000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Unlocked: All pages are now accessible
  const isLocked = false; 

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans selection:bg-orange-200 relative overflow-hidden">
      
      {/* Top Navigation Bar with Notification Center */}
      <Navbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        notifications={notifications}
        markAsRead={markAsRead}
        markAllAsRead={markAllAsRead}
        onOpenNotifications={stopNotificationSound}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* The Locking Overlay - Only shown if locked (currently disabled) */}
        {isLocked && <LaunchOverlay />}

        {/* The Content */}
        <div 
          className={`h-full w-full overflow-y-auto scrollbar-hide transition-all duration-300 ${
            isLocked ? 'opacity-30 pointer-events-none select-none filter blur-sm' : 'opacity-100'
          }`}
        >
          <DashboardSkeleton 
            activeTab={activeTab} 
            onNotification={addNotification}
          />
        </div>
          
      </div>

      {/* Floating CRM Button */}
      <a 
        href="https://client.mobilisapp.fr/dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-40 group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
      >
        <div className="p-1 bg-white/20 rounded-lg">
          <LayoutGrid size={20} className="text-white" />
        </div>
        <span className="font-bold text-lg tracking-wide">CRM</span>
      </a>

      {/* Manual Notification Test Button */}
      <button
        onClick={() => addNotification('ALERT', 'Test Sonnerie', 'Ceci est une simulation manuelle. Le son doit boucler jusqu\'à l\'ouverture du panneau.')}
        className="fixed bottom-8 left-8 z-50 px-6 py-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105"
      >
        <Bell size={18} className="animate-wiggle" />
        Simuler Notification
      </button>

      {/* Global Toast Container */}
      <div className="fixed bottom-24 right-8 z-50 flex flex-col gap-3 pointer-events-none">
         {toasts.map(toast => (
            <div 
              key={toast.id}
              onClick={() => {
                removeToast(toast.id);
                stopNotificationSound(); // Clicking the toast stops the sound
              }}
              className="pointer-events-auto bg-white border-l-4 rounded-xl shadow-2xl p-4 flex items-start gap-3 max-w-sm animate-in slide-in-from-right-10 fade-in duration-300 cursor-pointer hover:bg-slate-50 transition-colors"
              style={{ 
                borderLeftColor: 
                  toast.type === 'OFFER' ? '#f97316' : 
                  toast.type === 'ALERT' ? '#ef4444' : 
                  toast.type === 'MESSAGE' ? '#3b82f6' : '#64748b' 
              }}
            >
              <div className={`p-2 rounded-full shrink-0 ${
                 toast.type === 'OFFER' ? 'bg-orange-100 text-orange-600' : 
                 toast.type === 'ALERT' ? 'bg-red-100 text-red-600' : 
                 toast.type === 'MESSAGE' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
              }`}>
                 {toast.type === 'OFFER' && <CheckCircle size={18} />}
                 {toast.type === 'ALERT' && <AlertCircle size={18} />}
                 {toast.type === 'MESSAGE' && <LayoutGrid size={18} />}
                 {toast.type === 'INFO' && <Info size={18} />}
              </div>
              <div className="flex-1">
                 <h4 className="font-bold text-slate-800 text-sm">{toast.title}</h4>
                 <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
                 <p className="text-[10px] text-orange-500 mt-1 font-medium animate-pulse">Sonnerie en cours... (Cliquer pour arrêter)</p>
              </div>
              <button onClick={(e) => {
                 e.stopPropagation();
                 removeToast(toast.id);
                 stopNotificationSound();
              }} className="text-slate-400 hover:text-slate-600">
                 <X size={16} />
              </button>
            </div>
         ))}
      </div>

    </div>
  );
};

export default App;