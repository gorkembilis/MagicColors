import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playColorSelect: () => void;
  playBrushStroke: () => void;
  playCelebration: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const createBeep = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  return () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not supported');
    }
  };
};

const playColorSelectSound = createBeep(523, 0.1, 'sine');
const playBrushStrokeSound = createBeep(349, 0.05, 'triangle');
const playCelebrationSound = () => {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => createBeep(freq, 0.15, 'sine')(), i * 100);
  });
};
const playClickSound = createBeep(440, 0.05, 'square');

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundEnabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const updateSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
    localStorage.setItem('soundEnabled', String(enabled));
  }, []);

  const playColorSelect = useCallback(() => {
    if (soundEnabled) playColorSelectSound();
  }, [soundEnabled]);

  const playBrushStroke = useCallback(() => {
    if (soundEnabled) playBrushStrokeSound();
  }, [soundEnabled]);

  const playCelebration = useCallback(() => {
    if (soundEnabled) playCelebrationSound();
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (soundEnabled) playClickSound();
  }, [soundEnabled]);

  return (
    <SoundContext.Provider value={{
      soundEnabled,
      setSoundEnabled: updateSoundEnabled,
      playColorSelect,
      playBrushStroke,
      playCelebration,
      playClick
    }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
