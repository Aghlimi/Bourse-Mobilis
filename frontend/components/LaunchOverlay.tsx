import React from 'react';
import { Calendar, Lock, ArrowRight } from 'lucide-react';

const LaunchOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Heavy Blur Background Layer */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>
      
      {/* Custom Styles for 3D Animation */}
      <style>{`
        .scene-3d {
          perspective: 1000px;
        }
        .truck-3d-group {
          transform-style: preserve-3d;
          transform: rotateY(-15deg) rotateX(2deg);
        }
        .face {
          position: absolute;
          backface-visibility: hidden;
        }
        /* Animation Keyframes */
        @keyframes drive-bounce {
          0%, 100% { transform: translateY(0) rotateZ(0deg); }
          50% { transform: translateY(-3px) rotateZ(0.5deg); }
        }
        @keyframes road-scroll {
          0% { background-position: 0px 0px; }
          100% { background-position: -60px 0px; }
        }
        @keyframes wheel-spin-3d {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-360deg); }
        }
        @keyframes wind-streak {
          0% { transform: translateX(200px) translateZ(50px) scaleX(0.5); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateX(-300px) translateZ(50px) scaleX(1.5); opacity: 0; }
        }
        @keyframes wave-arm {
          0%, 100% { transform: rotate(0deg); }
          5%, 25% { transform: rotate(-25deg); }
          15%, 35% { transform: rotate(-5deg); }
          45% { transform: rotate(0deg); }
        }
        
        /* Utility Classes */
        .animate-truck-physics { animation: drive-bounce 2s ease-in-out infinite; }
        .animate-road-3d { animation: road-scroll 0.6s linear infinite; }
        .animate-wheel { animation: wheel-spin-3d 0.6s linear infinite; }
        .animate-wind { animation: wind-streak 2s linear infinite; }
        .animate-wave-hand { animation: wave-arm 3s ease-in-out infinite; }

        /* Cube Faces Helper */
        .cube-side { transform: rotateY(0deg) translateZ(20px); }
        .cube-front { transform: rotateY(90deg) translateZ(60px); } /* width/2 */
        .cube-top { transform: rotateX(90deg) translateZ(20px); }
        .cube-back { transform: rotateY(180deg) translateZ(20px); }
        .cube-left { transform: rotateY(-90deg) translateZ(20px); }
      `}</style>
      
      {/* Premium Card */}
      <div className="relative bg-white/80 backdrop-blur-md border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 max-w-lg w-full text-center transform transition-all hover:scale-[1.01] duration-500 group visible overflow-visible">
        
        {/* Decorative Floating Lock */}
        <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shadow-sm transform rotate-12 border border-orange-100/50 z-20">
           <Lock className="text-orange-300" size={28} />
        </div>
        
        {/* 3D TRUCK SCENE */}
        <div className="relative h-48 w-full mb-6 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-blue-50/80 to-slate-100 border border-white/60 scene-3d">
          
          {/* 3D Moving Road Floor */}
          <div className="absolute bottom-0 w-[150%] h-32 bg-slate-300 origin-bottom transform -rotate-x-12 translate-y-10 scale-125" style={{ transform: 'rotateX(70deg) translateY(20px) scale(1.5)' }}>
             <div className="w-full h-full animate-road-3d bg-[repeating-linear-gradient(90deg,transparent,transparent_40px,#cbd5e1_40px,#cbd5e1_80px)] opacity-50"></div>
             {/* Asphalt Texture */}
             <div className="absolute inset-0 bg-slate-300 opacity-30"></div>
          </div>

          {/* Wind Lines (Atmosphere) */}
          <div className="absolute top-10 right-0 w-24 h-0.5 bg-slate-400/30 rounded-full animate-wind" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-24 right-0 w-16 h-0.5 bg-slate-400/30 rounded-full animate-wind" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-32 right-0 w-32 h-0.5 bg-slate-400/30 rounded-full animate-wind" style={{ animationDelay: '0.2s' }}></div>

          {/* Truck Group */}
          <div className="relative truck-3d-group animate-truck-physics z-10">
             
            {/* Speech Bubble (Floating above in 3D space) */}
            <div className="absolute -top-24 left-10 transform translate-z-20 animate-bounce">
                <div className="bg-white px-3 py-1.5 rounded-xl rounded-bl-none shadow-lg border border-slate-100 relative">
                  <span className="text-xs font-bold text-slate-800 whitespace-nowrap">À bientôt 👋</span>
                  <div className="absolute -bottom-1 left-0 w-3 h-3 bg-white border-b border-l border-slate-100 transform rotate-45"></div>
                </div>
            </div>

            {/* --- TRAILER (Box) --- */}
            {/* Width: 140px, Height: 80px, Depth: 50px */}
            <div className="absolute top-0 left-0 w-[140px] h-[80px] -translate-x-16 -translate-y-10 transform-style-3d">
               {/* Side Face (Main) */}
               <div className="face w-full h-full bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center border border-orange-400/50" style={{ transform: 'translateZ(25px)' }}>
                  {/* Logo */}
                  <div className="w-16 h-8 border-2 border-white/20 rounded flex items-center justify-center">
                    <div className="w-3 h-3 bg-white/30 rotate-45"></div>
                  </div>
                  <div className="absolute bottom-2 w-full h-1 bg-orange-700/20"></div>
               </div>
               {/* Front Face (Connection) */}
               <div className="face w-[50px] h-full bg-orange-700 rounded-r-sm" style={{ transform: 'rotateY(90deg) translateZ(115px)' }}></div>
               {/* Top Face */}
               <div className="face w-full h-[50px] bg-orange-400 rounded-t-sm" style={{ transform: 'rotateX(90deg) translateZ(25px)' }}></div>
               {/* Back Face */}
               <div className="face w-[50px] h-full bg-orange-700 rounded-l-sm" style={{ transform: 'rotateY(-90deg) translateZ(25px)' }}></div>
            </div>

            {/* --- CAB (Box) --- */}
            <div className="absolute top-[20px] left-[150px] w-[60px] h-[60px] -translate-x-16 -translate-y-10 transform-style-3d">
                {/* Cab Side */}
                <div className="face w-full h-full bg-slate-800 rounded-tr-xl rounded-br-md border-t border-slate-700" style={{ transform: 'translateZ(25px)' }}>
                   {/* Window */}
                   <div className="absolute top-1 right-0 w-8 h-6 bg-sky-200 border-l border-slate-900 opacity-90 overflow-hidden rounded-bl-md">
                      {/* Mover inside */}
                      <div className="absolute -bottom-2 -right-1 w-6 h-6 bg-orange-500 rounded-full"></div>
                      <div className="absolute top-1 right-1 w-3 h-3 bg-orange-200 rounded-full"></div>
                      <div className="absolute top-1 right-1 w-3 h-1 bg-orange-600 rounded-full"></div>
                   </div>
                   {/* Waving Arm */}
                   <div className="absolute top-3 -right-2 w-4 h-1.5 bg-orange-500 origin-left animate-wave-hand z-20 rounded-full shadow-sm">
                      <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-orange-200 rounded-full"></div>
                   </div>
                </div>
                {/* Cab Front */}
                <div className="face w-[50px] h-full bg-slate-700 rounded-r-md" style={{ transform: 'rotateY(90deg) translateZ(35px)' }}>
                    {/* Headlights */}
                    <div className="absolute bottom-2 left-1 w-2 h-4 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                    <div className="absolute bottom-2 right-1 w-2 h-4 bg-yellow-400 rounded-sm shadow-[0_0_10px_rgba(250,204,21,0.6)]"></div>
                    {/* Grill */}
                    <div className="absolute bottom-2 left-4 right-4 h-6 bg-slate-900 flex flex-col gap-0.5 p-0.5">
                       <div className="w-full h-0.5 bg-slate-600"></div>
                       <div className="w-full h-0.5 bg-slate-600"></div>
                       <div className="w-full h-0.5 bg-slate-600"></div>
                    </div>
                </div>
                {/* Cab Top */}
                <div className="face w-full h-[50px] bg-slate-700 rounded-t-sm" style={{ transform: 'rotateX(90deg) translateZ(25px)' }}></div>
            </div>

            {/* --- WHEELS (3D Cylinders simplified as thick discs) --- */}
            {[
              { x: -50, z: 28 }, // Rear Left
              { x: 20, z: 28 },  // Mid Left
              { x: 120, z: 28 }, // Front Left
              // We simulate right-side wheels slightly offset in depth/x due to perspective if needed, but for this angle hidden is fine.
            ].map((pos, i) => (
              <div key={i} className="absolute top-[50px] w-10 h-10 bg-slate-800 rounded-full border-4 border-slate-600 shadow-xl flex items-center justify-center -translate-x-16"
                   style={{ transform: `translateX(${pos.x}px) translateZ(${pos.z}px)` }}>
                 {/* Hubcap */}
                 <div className="w-2 h-2 bg-slate-400 rounded-full z-10"></div>
                 {/* Spokes Spin */}
                 <div className="absolute w-full h-full animate-wheel flex items-center justify-center">
                    <div className="w-full h-1 bg-slate-500/50"></div>
                    <div className="h-full w-1 bg-slate-500/50 absolute"></div>
                 </div>
              </div>
            ))}

            {/* Shadow Blob */}
            <div className="absolute top-[85px] left-[-60px] w-[240px] h-[20px] bg-black/20 blur-md rounded-[100%] animate-pulse" style={{ transform: 'rotateX(90deg)' }}></div>

          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 tracking-tight">
          Mobilis <span className="text-orange-500">Bourse</span>
        </h1>
        <div className="h-1 w-12 bg-orange-500 rounded-full mx-auto mb-4"></div>

        <p className="text-lg text-slate-600 font-medium mb-6">
          La plateforme est en préparation.
        </p>

        {/* Date Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-50 text-slate-600 px-4 py-2 rounded-xl border border-slate-200 mb-8 shadow-sm">
          <Calendar size={18} className="text-orange-500" />
          <span className="font-semibold text-sm">Lancement officiel : 01/01/2026</span>
        </div>

        <p className="text-slate-500 leading-relaxed mb-8 text-sm md:text-base">
          Préparez-vous à découvrir la meilleure plateforme <br className="hidden md:block" /> dédiée aux professionnels du déménagement.
        </p>

        {/* Footer / CTA */}
        <a 
          href="https://client.mobilisapp.fr/dashboard"
          className="group relative w-full bg-slate-900 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
        >
          <span className="relative z-10">Retour vers le CRM</span>
          <ArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" size={18} />
          
          {/* Button Hover Effect */}
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        </a>

        <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
          Bientôt disponible
        </p>
      </div>
    </div>
  );
};

export default LaunchOverlay;