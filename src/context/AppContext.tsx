// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  AppMode, 
  DeviceViewport, 
  GuestStep, 
  ExperienceType, 
  StudioSection, 
  EventConfig, 
  GuestProfile, 
  CapturedPhoto,
  ActiveEvent,
  MemoryItem
} from '../types/app';
import { 
  DEFAULT_EVENT_CONFIG, 
  MOCK_GUEST_PROFILE, 
  CANDID_SAMPLE_SHOTS 
} from '../utils/appConstants';
import { soundEngine } from '../utils/audio';
import { generateEventTheme, applyThemeToDom, DEFAULT_LUMABOOTH_THEME } from '../utils/themeEngine';

interface AppContextType {
  // Mode & Automatic Device Viewport
  mode: AppMode;
  switchMode: (mode: AppMode) => void;
  deviceViewport: DeviceViewport;
  isPhone: boolean;
  isTablet: boolean;

  // Guest Flow State
  guestStep: GuestStep;
  goToGuestStep: (step: GuestStep) => void;
  guestProfile: GuestProfile;
  setGuestProfile: React.Dispatch<React.SetStateAction<GuestProfile>>;
  updateGuestProfile: (updates: Partial<GuestProfile>) => void;
  selectedExperience: ExperienceType;
  selectExperience: (exp: ExperienceType) => void;
  resetGuestSession: () => void;

  // Event State & Theme Engine
  activeEvent: ActiveEvent | null;
  allEvents: ActiveEvent[];
  setActiveEvent: React.Dispatch<React.SetStateAction<ActiveEvent | null>>;
  createEvent: (eventData: Omit<ActiveEvent, 'id' | 'createdAt' | 'theme'>) => void;
  switchActiveEvent: (id: string) => void;
  deleteEvent: (id: string) => void;
  updateActiveEvent: (updates: Partial<ActiveEvent>) => void;

  // Memories State
  memories: MemoryItem[];
  addMemory: (item: Omit<MemoryItem, 'id' | 'createdAt'>) => void;
  deleteMemory: (id: string) => void;
  clearEventMemories: (eventId: string) => void;

  // Studio Flow State
  studioSection: StudioSection;
  setStudioSection: (sec: StudioSection) => void;
  eventConfig: EventConfig;
  updateEventConfig: (updates: Partial<EventConfig>) => void;

  // Capture & Media State
  capturedPhotos: CapturedPhoto[];
  setCapturedPhotos: React.Dispatch<React.SetStateAction<CapturedPhoto[]>>;
  isCapturing: boolean;
  countdown: number | null;
  isFlashing: boolean;
  currentShotIndex: number;
  startCaptureSequence: () => void;
  retakeShot: (index: number) => void;
  selectedLayout: 'strip_2x6' | 'postcard_4x6' | 'grid_1x1' | 'polaroid';
  setSelectedLayout: (layout: 'strip_2x6' | 'postcard_4x6' | 'grid_1x1' | 'polaroid') => void;
  activeFilter: string;
  setActiveFilter: (filterId: string) => void;
  photoFilters: Record<number, string>;
  setPhotoFilters: React.Dispatch<React.SetStateAction<Record<number, string>>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Real Device Viewport Automatic Detection
  const getDetectedViewport = (): DeviceViewport => {
    if (typeof window === 'undefined') return 'phone';
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isLandscape = w > h;

    if (w < 600) return 'phone';
    if (isLandscape && w >= 900) return 'tablet_landscape';
    return 'tablet_portrait';
  };

  const [deviceViewport, setDeviceViewport] = useState<DeviceViewport>(getDetectedViewport());

  useEffect(() => {
    const handleResize = () => setDeviceViewport(getDetectedViewport());
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

const DEFAULT_SAVED_EVENTS: ActiveEvent[] = [
  {
    id: 'evt_muskan_karan',
    eventName: 'Muskan & Karan',
    eventDate: '2026-11-20',
    eventType: 'Wedding',
    hostName: 'Muskan & Karan',
    eventCode: 'MK2026',
    createdAt: Date.now() - 86400000 * 1,
    theme: generateEventTheme({ eventName: 'Muskan & Karan', eventType: 'Wedding' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 50,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: false,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: false,
        slowmo360: false,
        video: true
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: false
      }
    }
  },
  {
    id: 'evt_abc',
    eventName: 'abc',
    eventDate: '2026-10-12',
    eventType: 'Other',
    hostName: 'Luma Team',
    eventCode: 'ABC26',
    createdAt: Date.now() - 86400000 * 2,
    theme: generateEventTheme({ eventName: 'abc', eventType: 'Other' }),
    settings: {
      layout: 'postcard_4x6',
      countdownSeconds: 5,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 30,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: false,
        video: false
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: false,
        email: true,
        sms: false
      }
    }
  },
  {
    id: 'evt_krish_2',
    eventName: 'krish 2',
    eventDate: '2026-09-18',
    eventType: 'Birthday',
    hostName: 'Krish',
    eventCode: 'KRISH2',
    createdAt: Date.now() - 86400000 * 3,
    theme: generateEventTheme({ eventName: 'krish 2', eventType: 'Birthday' }),
    settings: {
      layout: 'polaroid',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: false,
      beautyFilterIntensity: 40,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: false,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: false,
        slowmo360: true,
        video: true
      },
      printToLumaBooth: false,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: false,
        sms: true
      }
    }
  },
  {
    id: 'evt_krish_thakur',
    eventName: 'krish Thakur',
    eventDate: '2026-09-25',
    eventType: 'Party',
    hostName: 'Krish Thakur',
    eventCode: 'KT2026',
    createdAt: Date.now() - 86400000 * 4,
    theme: generateEventTheme({ eventName: 'krish Thakur', eventType: 'Party' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 5,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 45,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: true,
        video: true
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: true
      }
    }
  },
  {
    id: 'evt_bollywood_evening',
    eventName: 'Bollywood evening',
    eventDate: '2026-10-05',
    eventType: 'Party',
    hostName: 'Club Luma',
    eventCode: 'BOLLY26',
    createdAt: Date.now() - 86400000 * 5,
    theme: generateEventTheme({ eventName: 'Bollywood evening', eventType: 'Party' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 60,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: false,
        video: true
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: false
      }
    }
  },
  {
    id: 'evt_blue_tokai',
    eventName: 'Blue Tokai Coffee Ro...',
    eventDate: '2026-08-30',
    eventType: 'Corporate',
    hostName: 'Blue Tokai',
    eventCode: 'BTCR26',
    createdAt: Date.now() - 86400000 * 6,
    theme: generateEventTheme({ eventName: 'Blue Tokai Coffee', eventType: 'Corporate' }),
    settings: {
      layout: 'postcard_4x6',
      countdownSeconds: 5,
      soundEnabled: false,
      mirrorCamera: true,
      beautyFilterIntensity: 20,
      stickersEnabled: false,
      aiPortraitsEnabled: false,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: false,
        slowmo360: false,
        video: false
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: false,
        email: true,
        sms: false
      }
    }
  },
  {
    id: 'evt_minimomo',
    eventName: 'Minimomo',
    eventDate: '2026-09-02',
    eventType: 'Other',
    hostName: 'Momo & Co',
    eventCode: 'MINI26',
    createdAt: Date.now() - 86400000 * 7,
    theme: generateEventTheme({ eventName: 'Minimomo', eventType: 'Other' }),
    settings: {
      layout: 'polaroid',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 35,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: false,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: false,
        video: false
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: false,
        sms: false
      }
    }
  },
  {
    id: 'evt_miraya_bd',
    eventName: "MIRAYA's bd",
    eventDate: '2026-09-14',
    eventType: 'Birthday',
    hostName: 'Miraya',
    eventCode: 'MBD2026',
    createdAt: Date.now() - 86400000 * 8,
    theme: generateEventTheme({ eventName: "MIRAYA's bd", eventType: 'Birthday' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 5,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 50,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: false,
        video: true
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: true
      }
    }
  },
  {
    id: 'evt_anuj_nishita_1',
    eventName: 'Anuj & Nishita 1',
    eventDate: '2026-11-08',
    eventType: 'Wedding',
    hostName: 'Anuj & Nishita',
    eventCode: 'AN2026A',
    createdAt: Date.now() - 86400000 * 9,
    theme: generateEventTheme({ eventName: 'Anuj & Nishita 1', eventType: 'Wedding' }),
    settings: {
      layout: 'strip_2x6',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 55,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: false,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: false,
        slowmo360: false,
        video: false
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: false
      }
    }
  },
  {
    id: 'evt_anuj_nishita_2',
    eventName: 'Anuj & Nishita 2',
    eventDate: '2026-11-09',
    eventType: 'Wedding',
    hostName: 'Anuj & Nishita',
    eventCode: 'AN2026B',
    createdAt: Date.now() - 86400000 * 10,
    theme: generateEventTheme({ eventName: 'Anuj & Nishita 2', eventType: 'Wedding' }),
    settings: {
      layout: 'postcard_4x6',
      countdownSeconds: 3,
      soundEnabled: true,
      mirrorCamera: true,
      beautyFilterIntensity: 55,
      stickersEnabled: true,
      aiPortraitsEnabled: true,
      bgRemovalEnabled: true,
      watermarkEnabled: false,
      captureModes: {
        photo: true,
        gif: true,
        slowmo360: true,
        video: true
      },
      printToLumaBooth: true,
      sharingOptions: {
        airdrop: true,
        qr: true,
        whatsapp: true,
        email: true,
        sms: true
      }
    }
  }
];

  // Mode (Default is Guest Mode)
  const [mode, setMode] = useState<AppMode>('guest');

  // Multi-Event State with localStorage persistence
  const [allEvents, setAllEvents] = useState<ActiveEvent[]>(() => {
    try {
      const saved = localStorage.getItem('lumabooth_all_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const single = localStorage.getItem('lumabooth_active_event');
      if (single) return [JSON.parse(single)];
      return DEFAULT_SAVED_EVENTS;
    } catch {
      return DEFAULT_SAVED_EVENTS;
    }
  });

  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(() => {
    try {
      const saved = localStorage.getItem('lumabooth_active_event');
      if (saved) {
        const parsed: ActiveEvent = JSON.parse(saved);
        if (!parsed.theme) {
          parsed.theme = generateEventTheme(parsed);
        }
        return parsed;
      }
      return DEFAULT_SAVED_EVENTS[0];
    } catch {
      return DEFAULT_SAVED_EVENTS[0];
    }
  });

  // Guest State - Default is 'welcome' (the existing LumaBooth home page)
  const [guestStep, setGuestStep] = useState<GuestStep>('welcome');
  const [guestProfile, setGuestProfile] = useState<GuestProfile>(MOCK_GUEST_PROFILE);
  const [selectedExperience, setSelectedExperience] = useState<ExperienceType>('classic');

  // Studio State
  const [studioSection, setStudioSection] = useState<StudioSection>('camera');
  const [eventConfig, setEventConfig] = useState<EventConfig>(() => {
    try {
      const saved = localStorage.getItem('lumabooth_active_event');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_EVENT_CONFIG,
          eventName: parsed.eventName || DEFAULT_EVENT_CONFIG.eventName,
          eventDate: parsed.eventDate || DEFAULT_EVENT_CONFIG.eventDate,
          hostName: parsed.hostName || DEFAULT_EVENT_CONFIG.hostName,
          countdownSeconds: parsed.settings?.countdownSeconds || DEFAULT_EVENT_CONFIG.countdownSeconds,
          soundEnabled: parsed.settings?.soundEnabled !== undefined ? parsed.settings.soundEnabled : DEFAULT_EVENT_CONFIG.soundEnabled,
          mirrorCamera: parsed.settings?.mirrorCamera !== undefined ? parsed.settings.mirrorCamera : DEFAULT_EVENT_CONFIG.mirrorCamera
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_EVENT_CONFIG;
  });

  // Apply Theme to DOM whenever activeEvent changes
  useEffect(() => {
    if (activeEvent?.theme) {
      applyThemeToDom(activeEvent.theme);
    } else {
      applyThemeToDom(DEFAULT_LUMABOOTH_THEME);
    }
  }, [activeEvent]);

  // Create Event with Theme Generation
  const createEvent = useCallback((eventData: Omit<ActiveEvent, 'id' | 'createdAt' | 'theme'>) => {
    const generatedTheme = generateEventTheme(eventData);
    const newEvent: ActiveEvent = {
      ...eventData,
      id: `evt_${Date.now()}`,
      createdAt: Date.now(),
      theme: generatedTheme,
      settings: {
        layout: 'strip_2x6',
        countdownSeconds: 5,
        soundEnabled: true,
        mirrorCamera: true,
        beautyFilterIntensity: 45,
        stickersEnabled: true,
        aiPortraitsEnabled: true,
        bgRemovalEnabled: true,
        watermarkEnabled: false
      }
    };

    setActiveEvent(newEvent);
    setAllEvents(prev => {
      const next = [newEvent, ...prev.filter(e => e.id !== newEvent.id)];
      try {
        localStorage.setItem('lumabooth_all_events', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      localStorage.setItem('lumabooth_active_event', JSON.stringify(newEvent));
    } catch {
      // ignore
    }

    applyThemeToDom(generatedTheme);

    setEventConfig(prev => ({
      ...prev,
      eventName: newEvent.eventName,
      eventDate: newEvent.eventDate,
      hostName: newEvent.hostName || prev.hostName
    }));

    soundEngine.playSuccessChime();
  }, []);

  // Switch Active Event
  const switchActiveEvent = useCallback((eventId: string) => {
    const found = allEvents.find(e => e.id === eventId);
    if (found) {
      if (!found.theme) {
        found.theme = generateEventTheme(found);
      }
      setActiveEvent(found);
      try {
        localStorage.setItem('lumabooth_active_event', JSON.stringify(found));
      } catch {
        // ignore
      }
      applyThemeToDom(found.theme);
      
      // Sync per-event settings into eventConfig
      setEventConfig(prev => ({
        ...prev,
        eventName: found.eventName,
        eventDate: found.eventDate,
        hostName: found.hostName || prev.hostName,
        countdownSeconds: found.settings?.countdownSeconds || prev.countdownSeconds,
        soundEnabled: found.settings?.soundEnabled !== undefined ? found.settings.soundEnabled : prev.soundEnabled,
        mirrorCamera: found.settings?.mirrorCamera !== undefined ? found.settings.mirrorCamera : prev.mirrorCamera,
        beautyFilterIntensity: found.settings?.beautyFilterIntensity !== undefined ? found.settings.beautyFilterIntensity : prev.beautyFilterIntensity
      }));

      // Sync layout if set
      if (found.settings?.layout) {
        setSelectedLayout(found.settings.layout);
      }

      soundEngine.playSuccessChime();
    }
  }, [allEvents]);

  // Delete Event
  const deleteEvent = useCallback((eventId: string) => {
    setAllEvents(prev => {
      const next = prev.filter(e => e.id !== eventId);
      try {
        localStorage.setItem('lumabooth_all_events', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    if (activeEvent?.id === eventId) {
      setActiveEvent(null);
      try {
        localStorage.removeItem('lumabooth_active_event');
      } catch {
        // ignore
      }
      applyThemeToDom(DEFAULT_LUMABOOTH_THEME);
    }
  }, [activeEvent]);

  // Update Active Event
  const updateActiveEvent = useCallback((updates: Partial<ActiveEvent>) => {
    if (!activeEvent) return;
    const merged: ActiveEvent = {
      ...activeEvent,
      ...updates
    };
    merged.theme = generateEventTheme(merged);

    setActiveEvent(merged);
    setAllEvents(prev => {
      const next = prev.map(e => e.id === merged.id ? merged : e);
      try {
        localStorage.setItem('lumabooth_all_events', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    try {
      localStorage.setItem('lumabooth_active_event', JSON.stringify(merged));
    } catch {
      // ignore
    }

    applyThemeToDom(merged.theme);
  }, [activeEvent]);

  // Memories State with localStorage persistence
  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('lumabooth_memories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addMemory = useCallback((item: Omit<MemoryItem, 'id' | 'createdAt'>) => {
    const newMemory: MemoryItem = {
      ...item,
      id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now()
    };
    setMemories(prev => {
      const next = [newMemory, ...prev.filter(m => m.id !== newMemory.id)];
      try {
        localStorage.setItem('lumabooth_memories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const deleteMemory = useCallback((id: string) => {
    setMemories(prev => {
      const next = prev.filter(m => m.id !== id);
      try {
        localStorage.setItem('lumabooth_memories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const clearEventMemories = useCallback((eventId: string) => {
    setMemories(prev => {
      const next = prev.filter(m => m.eventId !== eventId);
      try {
        localStorage.setItem('lumabooth_memories', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Capture & Media
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const [currentShotIndex, setCurrentShotIndex] = useState<number>(0);
  const [selectedLayout, setSelectedLayout] = useState<'strip_2x6' | 'postcard_4x6' | 'grid_1x1' | 'polaroid'>('strip_2x6');
  const [activeFilter, setActiveFilter] = useState<string>('original');
  const [photoFilters, setPhotoFilters] = useState<Record<number, string>>({
    0: 'original',
    1: 'original',
    2: 'original'
  });

  // Audio Sync
  useEffect(() => {
    soundEngine.setEnabled(eventConfig.soundEnabled);
  }, [eventConfig.soundEnabled]);

  const switchMode = useCallback((newMode: AppMode) => {
    soundEngine.playTap();
    setMode(newMode);
  }, []);

  const goToGuestStep = useCallback((step: GuestStep) => {
    soundEngine.playTap();
    setGuestStep(step);
  }, []);

  const updateGuestProfile = useCallback((updates: Partial<GuestProfile>) => {
    setGuestProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const selectExperience = useCallback((exp: ExperienceType) => {
    soundEngine.playTap();
    setSelectedExperience(exp);
    if (exp === 'pose_battle') {
      setGuestStep('pose_battle');
    } else if (exp === 'photo_roulette') {
      setGuestStep('photo_roulette');
    } else if (exp === 'future_you') {
      setGuestStep('future_you');
    } else if (exp === 'ai_morph') {
      setGuestStep('ai_morph');
    } else if (exp === 'ai_synthesis') {
      setGuestStep('ai_synthesis');
    } else {
      setGuestStep('capture');
    }
  }, []);

  const updateEventConfig = useCallback((updates: Partial<EventConfig>) => {
    setEventConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const resetGuestSession = useCallback(() => {
    soundEngine.playTap();
    setCapturedPhotos([]);
    setPhotoFilters({ 0: 'original', 1: 'original', 2: 'original' });
    setGuestStep('welcome');
  }, []);

  const startCaptureSequence = useCallback(() => {
    setIsCapturing(true);
    setCurrentShotIndex(0);
    setCapturedPhotos([]);

    const totalShots = 3;

    const takeShot = (idx: number) => {
      setCurrentShotIndex(idx);
      let count = eventConfig.countdownSeconds;
      setCountdown(count);
      soundEngine.playCountdownBeep(false);

      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          soundEngine.playCountdownBeep(false);
        } else {
          clearInterval(timer);
          setCountdown(null);
          soundEngine.playCountdownBeep(true);
          soundEngine.playShutter();
          setIsFlashing(true);
          setTimeout(() => setIsFlashing(false), 250);

          const samplePhoto = CANDID_SAMPLE_SHOTS[idx % CANDID_SAMPLE_SHOTS.length];
          setCapturedPhotos(prev => [
            ...prev,
            {
              id: `shot_${Date.now()}_${idx}`,
              index: idx,
              url: samplePhoto,
              timestamp: Date.now()
            }
          ]);

          if (idx + 1 < totalShots) {
            setTimeout(() => takeShot(idx + 1), 1000);
          } else {
            setIsCapturing(false);
            soundEngine.playSuccessChime();
            setTimeout(() => setGuestStep('edit'), 600);
          }
        }
      }, 1000);
    };

    takeShot(0);
  }, [eventConfig.countdownSeconds]);

  const retakeShot = useCallback((indexToRetake: number) => {
    setIsCapturing(true);
    let count = 3;
    setCountdown(count);
    soundEngine.playCountdownBeep(false);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
        soundEngine.playCountdownBeep(false);
      } else {
        clearInterval(timer);
        setCountdown(null);
        soundEngine.playCountdownBeep(true);
        soundEngine.playShutter();
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 300);

        const samplePhoto = CANDID_SAMPLE_SHOTS[(indexToRetake + 2) % CANDID_SAMPLE_SHOTS.length];
        setCapturedPhotos(prev => {
          const next = [...prev];
          next[indexToRetake] = {
            id: `shot_${Date.now()}_${indexToRetake}`,
            index: indexToRetake,
            url: samplePhoto,
            timestamp: Date.now()
          };
          return next;
        });

        setIsCapturing(false);
        soundEngine.playSuccessChime();
      }
    }, 1000);
  }, []);

  const isPhone = deviceViewport === 'phone';
  const isTablet = deviceViewport === 'tablet_portrait' || deviceViewport === 'tablet_landscape';

  return (
    <AppContext.Provider
      value={{
        mode,
        switchMode,
        deviceViewport,
        isPhone,
        isTablet,
        guestStep,
        goToGuestStep,
        guestProfile,
        setGuestProfile,
        updateGuestProfile,
        selectedExperience,
        selectExperience,
        resetGuestSession,
        activeEvent,
        allEvents,
        setActiveEvent,
        createEvent,
        switchActiveEvent,
        deleteEvent,
        updateActiveEvent,
        memories,
        addMemory,
        deleteMemory,
        clearEventMemories,
        studioSection,
        setStudioSection,
        eventConfig,
        updateEventConfig,
        capturedPhotos,
        setCapturedPhotos,
        isCapturing,
        countdown,
        isFlashing,
        currentShotIndex,
        startCaptureSequence,
        retakeShot,
        selectedLayout,
        setSelectedLayout,
        activeFilter,
        setActiveFilter,
        photoFilters,
        setPhotoFilters
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
