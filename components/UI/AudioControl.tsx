import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  isMuted: boolean;
  toggleMute: () => void;
}

export const AudioControl: React.FC<AudioControlProps> = ({ isMuted, toggleMute }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleMute();
      }}
      className="fixed top-6 right-6 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/10"
    >
      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
};