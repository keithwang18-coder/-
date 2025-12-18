import React from 'react';

interface IntroProps {
  onEnter: () => void;
  visible: boolean;
}

export const Intro: React.FC<IntroProps> = ({ onEnter, visible }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl transition-opacity duration-1000">
      <div className="flex flex-col items-center max-w-md p-8 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        
        {/* Matcha Christmas Tree Cookie Image */}
        <div className="relative w-auto h-64 aspect-[3/4] rounded-2xl overflow-hidden border border-pink-500/30 shadow-[0_0_30px_rgba(230,57,104,0.4)]">
           <img 
             src="https://images.unsplash.com/photo-1607262807149-dfd4c39320a6?auto=format&fit=crop&w=600&q=80" 
             alt="Christmas Tree Cookie" 
             className="w-full h-full object-cover bg-black/20"
           />
        </div>

        <h1 className="text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-white to-pink-200 font-serif tracking-wide drop-shadow-lg" style={{ fontFamily: '"Playfair Display", serif' }}>
          Happy Christmas <br/>
          <span className="text-4xl md:text-5xl italic text-pink-400">姜丝</span>
        </h1>

        <button
          onClick={onEnter}
          className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-full border border-pink-500/50 text-white shadow-[0_0_20px_rgba(255,105,180,0.3)] transition-all hover:shadow-[0_0_40px_rgba(255,105,180,0.6)] hover:border-pink-400"
        >
          <div className="absolute inset-0 w-0 bg-gradient-to-r from-pink-600 to-purple-600 transition-all duration-[250ms] ease-out group-hover:w-full opacity-20"></div>
          <span className="relative tracking-[0.2em] font-light">ENTER</span>
        </button>
      </div>
    </div>
  );
};