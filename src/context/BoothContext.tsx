import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  ExperienceId, 
  ScreenStep, 
  PhotoExperience, 
  CapturedShot, 
  TemplateLayoutId, 
  DigitalSticker, 
  EventConfig 
} from '../types/booth';
import { 
  PHOTO_EXPERIENCES, 
  DEFAULT_EVENT_CONFIG, 
  MOCK_CANDID_POSES,
  POSE_BATTLE_PROMPTS,
  AROUND_WORLD_DESTINATIONS,
  TIME_CAPSULE_DECADES
} from '../utils/constants';
import { soundEngine } from '../utils/audio';

interface BoothContextType {
  // Navigation
  currentStep: ScreenStep;
  goToStep: (step: ScreenStep) => void;
  resetToWelcome: () => void;

  // Experiences
  selectedExperience: PhotoExperience;
  selectExperience: (id: ExperienceId) => void;

  // Capture State
  capturedShots: CapturedShot[];
  currentShotIndex: number;
  totalShotsNeeded: number;
  isCapturing: boolean;
  countdownValue: number | null;
  isFlashing: boolean;
  startCaptureSequence: () => void;
  retakeSingleShot: (index: number) => void;
  retakeAllShots: () => void;

  // Editing & Personalization
  activeFilterId: string;
  setFilterId: (id: string) => void;
  selectedTemplateId: TemplateLayoutId;
  setTemplateId: (id: TemplateLayoutId) => void;
  activeColorwayId: string;
  setColorwayId: (id: string) => void;
  customOverlayText: string;
  setCustomOverlayText: (text: string) => void;
  stickers: DigitalSticker[];
  addSticker: (emoji: string, label: string) => void;
  updateSticker: (id: string, updates: Partial<DigitalSticker>) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;

  // Configuration & Operator Admin
  eventConfig: EventConfig;
  updateEventConfig: (updates: Partial<EventConfig>) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Sub-experience specific states
  activeBattlePrompt: { p1: string; p2: string } | null;
  activeDestination: typeof AROUND_WORLD_DESTINATIONS[0] | null;
  setActiveDestination: (dest: typeof AROUND_WORLD_DESTINATIONS[0]) => void;
  activeDecade: typeof TIME_CAPSULE_DECADES[0] | null;
  setActiveDecade: (decade: typeof TIME_CAPSULE_DECADES[0]) => void;
}

const BoothContext = createContext<BoothContextType | undefined>(undefined);

export const BoothProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation state
  const [currentStep, setCurrentStep] = useState<ScreenStep>('welcome');

  // Experience state
  const [selectedExperience, setSelectedExperience] = useState<PhotoExperience>(PHOTO_EXPERIENCES[0]);

  // Capture state
  const [capturedShots, setCapturedShots] = useState<CapturedShot[]>([]);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Edit / Layout state
  const [activeFilterId, setActiveFilterId] = useState<string>('normal');
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateLayoutId>('strip_2x6');
  const [activeColorwayId, setActiveColorwayId] = useState<string>('obsidian_dark');
  const [customOverlayText, setCustomOverlayText] = useState<string>('');
  const [stickers, setStickers] = useState<DigitalSticker[]>([]);

  // Config & Admin
  const [eventConfig, setEventConfig] = useState<EventConfig>(DEFAULT_EVENT_CONFIG);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Sub-experience states
  const [activeBattlePrompt, setActiveBattlePrompt] = useState<{ p1: string; p2: string } | null>(null);
  const [activeDestination, setActiveDestination] = useState<typeof AROUND_WORLD_DESTINATIONS[0] | null>(AROUND_WORLD_DESTINATIONS[0]);
  const [activeDecade, setActiveDecade] = useState<typeof TIME_CAPSULE_DECADES[0] | null>(TIME_CAPSULE_DECADES[0]);

  const totalShotsNeeded = selectedExperience.shotCount;

  // Sound sync
  useEffect(() => {
    soundEngine.setEnabled(eventConfig.soundEnabled);
  }, [eventConfig.soundEnabled]);

  const goToStep = useCallback((step: ScreenStep) => {
    soundEngine.playTap();
    setCurrentStep(step);
  }, []);

  const selectExperience = useCallback((id: ExperienceId) => {
    const exp = PHOTO_EXPERIENCES.find(e => e.id === id) || PHOTO_EXPERIENCES[0];
    soundEngine.playTap();
    setSelectedExperience(exp);
    setCapturedShots([]);
    setCurrentShotIndex(0);

    // Setup sub-experience specific metadata
    if (id === 'pose_battle') {
      const randomPrompt = POSE_BATTLE_PROMPTS[Math.floor(Math.random() * POSE_BATTLE_PROMPTS.length)];
      setActiveBattlePrompt(randomPrompt);
    } else if (id === 'around_world') {
      setActiveDestination(AROUND_WORLD_DESTINATIONS[0]);
    } else if (id === 'time_capsule') {
      setActiveDecade(TIME_CAPSULE_DECADES[0]);
    }

    setCurrentStep('capture');
  }, []);

  const resetToWelcome = useCallback(() => {
    soundEngine.playTap();
    setCapturedShots([]);
    setCurrentShotIndex(0);
    setIsCapturing(false);
    setCountdownValue(null);
    setStickers([]);
    setActiveFilterId('normal');
    setCurrentStep('welcome');
  }, []);

  const updateEventConfig = useCallback((updates: Partial<EventConfig>) => {
    setEventConfig(prev => ({ ...prev, ...updates }));
  }, []);

  // Capture execution loop
  const executeSingleShot = useCallback((shotIdx: number, onShotComplete: (newShot: CapturedShot) => void) => {
    let count = eventConfig.countdownSeconds;
    setCountdownValue(count);
    soundEngine.playCountdownBeep(false);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownValue(count);
        soundEngine.playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdownValue(null);

        // Flash & Shutter
        soundEngine.playCountdownBeep(true);
        soundEngine.playShutter();
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 350);

        // Capture mock photo with realistic candid image
        const photoUrl = MOCK_CANDID_POSES[shotIdx % MOCK_CANDID_POSES.length];
        const newShot: CapturedShot = {
          id: `shot_${Date.now()}_${shotIdx}`,
          index: shotIdx,
          url: photoUrl,
          timestamp: Date.now()
        };
        onShotComplete(newShot);
      }
    }, 1000);
  }, [eventConfig.countdownSeconds]);

  const startCaptureSequence = useCallback(() => {
    setIsCapturing(true);
    setCurrentShotIndex(0);
    setCapturedShots([]);
    const needed = totalShotsNeeded;
    const collected: CapturedShot[] = [];

    const runNext = (idx: number) => {
      setCurrentShotIndex(idx);
      executeSingleShot(idx, (newShot) => {
        collected.push(newShot);
        setCapturedShots([...collected]);

        if (idx + 1 < needed) {
          setTimeout(() => {
            runNext(idx + 1);
          }, 1200); // 1.2s pause between shots to change pose
        } else {
          // Finished all shots
          setIsCapturing(false);
          soundEngine.playSuccessChime();
          setTimeout(() => {
            setCurrentStep('review');
          }, 800);
        }
      });
    };

    runNext(0);
  }, [totalShotsNeeded, executeSingleShot]);

  const retakeSingleShot = useCallback((indexToRetake: number) => {
    setCurrentStep('capture');
    setIsCapturing(true);
    setCurrentShotIndex(indexToRetake);

    executeSingleShot(indexToRetake, (newShot) => {
      setCapturedShots(prev => {
        const next = [...prev];
        next[indexToRetake] = newShot;
        return next;
      });
      setIsCapturing(false);
      soundEngine.playSuccessChime();
      setTimeout(() => {
        setCurrentStep('review');
      }, 700);
    });
  }, [executeSingleShot]);

  const retakeAllShots = useCallback(() => {
    setCapturedShots([]);
    setCurrentShotIndex(0);
    setCurrentStep('capture');
    startCaptureSequence();
  }, [startCaptureSequence]);

  // Digital Stickers
  const addSticker = useCallback((emoji: string, label: string) => {
    soundEngine.playTap();
    const newStk: DigitalSticker = {
      id: `stk_${Date.now()}`,
      emoji,
      label,
      x: 35 + Math.random() * 30,
      y: 35 + Math.random() * 30,
      scale: 1.2,
      rotation: Math.round(Math.random() * 20 - 10)
    };
    setStickers(prev => [...prev, newStk]);
  }, []);

  const updateSticker = useCallback((id: string, updates: Partial<DigitalSticker>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const removeSticker = useCallback((id: string) => {
    soundEngine.playTap();
    setStickers(prev => prev.filter(s => s.id !== id));
  }, []);

  const clearStickers = useCallback(() => {
    soundEngine.playTap();
    setStickers([]);
  }, []);

  return (
    <BoothContext.Provider
      value={{
        currentStep,
        goToStep,
        resetToWelcome,
        selectedExperience,
        selectExperience,
        capturedShots,
        currentShotIndex,
        totalShotsNeeded,
        isCapturing,
        countdownValue,
        isFlashing,
        startCaptureSequence,
        retakeSingleShot,
        retakeAllShots,
        activeFilterId,
        setFilterId: (id) => { soundEngine.playTap(); setActiveFilterId(id); },
        selectedTemplateId,
        setTemplateId: (id) => { soundEngine.playTap(); setSelectedTemplateId(id); },
        activeColorwayId,
        setColorwayId: (id) => { soundEngine.playTap(); setActiveColorwayId(id); },
        customOverlayText,
        setCustomOverlayText,
        stickers,
        addSticker,
        updateSticker,
        removeSticker,
        clearStickers,
        eventConfig,
        updateEventConfig,
        isAdminOpen,
        setIsAdminOpen,
        activeBattlePrompt,
        activeDestination,
        setActiveDestination,
        activeDecade,
        setActiveDecade
      }}
    >
      {children}
    </BoothContext.Provider>
  );
};

export const useBooth = () => {
  const context = useContext(BoothContext);
  if (!context) throw new Error('useBooth must be used within a BoothProvider');
  return context;
};
