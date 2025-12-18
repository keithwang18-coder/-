import React, { useState, useRef, useEffect } from 'react';
import { AppState, TreeMode } from './types';
import { Experience } from './components/Experience';
import { Intro } from './components/UI/Intro';
import { AudioControl } from './components/UI/AudioControl';

// Royalty free Christmas loop placeholder
const MUSIC_URL = "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [treeMode, setTreeMode] = useState<TreeMode>(TreeMode.TREE);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(MUSIC_URL);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleEnter = () => {
    setAppState(AppState.EXPERIENCE);
    if (audioRef.current && !isMuted) {
      audioRef.current.play().catch(e => console.log("Audio autoplay prevented", e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  const toggleTreeMode = () => {
    setTreeMode(prev => prev === TreeMode.TREE ? TreeMode.EXPLODE : TreeMode.TREE);
  };

  return (
    <div className="relative w-full h-full bg-[#050103] text-white overflow-hidden">
      {/* 3D Scene */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${appState === AppState.INTRO ? 'opacity-20 blur-sm' : 'opacity-100 blur-0'}`}>
        <Experience treeMode={treeMode} toggleMode={toggleTreeMode} />
      </div>

      {/* Intro Overlay */}
      {appState === AppState.INTRO && (
        <Intro onEnter={handleEnter} visible={true} />
      )}

      {/* Persistent UI */}
      {appState === AppState.EXPERIENCE && (
        <>
          <AudioControl isMuted={isMuted} toggleMute={toggleMute} />
          
          <div className="fixed bottom-8 left-0 right-0 text-center pointer-events-none opacity-50 text-xs tracking-widest font-light">
             CLICK ANYWHERE TO {treeMode === TreeMode.TREE ? 'EXPLODE' : 'ASSEMBLE'}
          </div>
        </>
      )}
    </div>
  );
};

export default App;