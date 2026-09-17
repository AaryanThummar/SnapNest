import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { GuestShell } from './GuestShell';
import { StudioShell } from './StudioShell';
import { CurtainIntro } from '../home/CurtainIntro';
import { CursorLightEffect } from './CursorLightEffect';
import { WelcomeAuthModal } from '../home/WelcomeAuthModal';
import { PublicEventGuestView } from '../../views/guest/PublicEventGuestView';
import { EventDashboardPage } from '../../views/dashboard/EventDashboardPage';

export const AppShell: React.FC = () => {
  const { mode, isPhone, goToGuestStep } = useApp();

  const getInitialPublicEventId = (): string | null => {
    if (typeof window === 'undefined') return null;
    const path = window.location.pathname;
    const match = path.match(/\/event\/([^/?#]+)/);
    if (match && match[1]) return decodeURIComponent(match[1]);

    const searchParams = new URLSearchParams(window.location.search);
    const qId = searchParams.get('event') || searchParams.get('eventId');
    if (qId) return qId;

    const hash = window.location.hash;
    const hashMatch = hash.match(/\/event\/([^/?#]+)/);
    if (hashMatch && hashMatch[1]) return decodeURIComponent(hashMatch[1]);

    return null;
  };

  const getInitialRoute = (): 'dashboard' | 'home' | 'public_event' => {
    if (typeof window === 'undefined') return 'dashboard';
    if (getInitialPublicEventId()) return 'public_event';

    const path = window.location.pathname;
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);

    if (
      path === '/home' || 
      path.startsWith('/home') || 
      hash === '#/home' || 
      hash === '#home' || 
      searchParams.get('route') === 'home' ||
      searchParams.get('page') === 'home'
    ) {
      return 'home';
    }

    return 'dashboard';
  };

  const [publicEventId, setPublicEventId] = useState<string | null>(getInitialPublicEventId);
  const [currentRoute, setCurrentRoute] = useState<'dashboard' | 'home' | 'public_event'>(getInitialRoute);

  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname;
      const match = path.match(/\/event\/([^/?#]+)/);
      if (match && match[1]) {
        setPublicEventId(decodeURIComponent(match[1]));
        setCurrentRoute('public_event');
        return;
      }

      const searchParams = new URLSearchParams(window.location.search);
      const qId = searchParams.get('event') || searchParams.get('eventId');
      if (qId) {
        setPublicEventId(qId);
        setCurrentRoute('public_event');
        return;
      }

      const hash = window.location.hash;
      const hashMatch = hash.match(/\/event\/([^/?#]+)/);
      if (hashMatch && hashMatch[1]) {
        setPublicEventId(decodeURIComponent(hashMatch[1]));
        setCurrentRoute('public_event');
        return;
      }

      setPublicEventId(null);
      if (
        path === '/home' || 
        path.startsWith('/home') || 
        hash === '#/home' || 
        hash === '#home' || 
        searchParams.get('route') === 'home' ||
        searchParams.get('page') === 'home'
      ) {
        setCurrentRoute('home');
      } else {
        setCurrentRoute('dashboard');
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Launch Event -> Navigates to existing LumaBooth home page at /home
  const handleLaunchEvent = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/home');
    }
    setCurrentRoute('home');
    goToGuestStep('welcome');
  };

  // Back to Dashboard -> Navigates to /
  const handleNavigateHome = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
    }
    setPublicEventId(null);
    setCurrentRoute('dashboard');
  };

  // ── Welcome Auth Modal (shown once, after curtains fully open on /home) ──
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Called by CurtainIntro.onOpened — fires after the 950ms curtain animation
  const onCurtainsOpened = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  // Guest: close modal, continue normally into the photobooth
  const handleModalGuest = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // Authenticated: close modal, continue normally
  const handleModalAuthenticated = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // 1. PUBLIC EVENT GUEST GALLERY VIEW (/event/:id)
  if (currentRoute === 'public_event' && publicEventId) {
    return (
      <div 
        className={`app-container ${isPhone ? 'is-phone-layout' : 'is-tablet-layout'}`}
        style={{
          width: '100vw',
          height: '100dvh',
          maxWidth: '100vw',
          maxHeight: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#070612'
        }}
      >
        <CursorLightEffect />
        <PublicEventGuestView 
          eventIdParam={publicEventId} 
          onNavigateHome={handleNavigateHome} 
        />
      </div>
    );
  }

  // 2. NEW EVENT DASHBOARD PAGE (Initial Default Screen at /)
  // CRITICAL: NO CURTAINS on this dashboard screen
  if (currentRoute === 'dashboard') {
    return (
      <div 
        className={`app-container ${isPhone ? 'is-phone-layout' : 'is-tablet-layout'}`}
        style={{
          width: '100vw',
          height: '100dvh',
          maxWidth: '100vw',
          maxHeight: '100dvh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#070612'
        }}
      >
        {/* Global Cursor Following Light & Touch Tap Feedback */}
        <CursorLightEffect />

        {/* New Event Dashboard Hub */}
        <EventDashboardPage onLaunchEvent={handleLaunchEvent} />
      </div>
    );
  }

  // 3. EXISTING LUMABOOTH HOME PAGE & PHOTOBOOTH BOOTH (at /home)
  // EXACTLY AS IT WAS: Curtains, Logo, Start Booth, Camera, AI, Sounds, Memories
  return (
    <div 
      className={`app-container ${isPhone ? 'is-phone-layout' : 'is-tablet-layout'}`}
      style={{
        width: '100vw',
        height: '100dvh',
        maxWidth: '100vw',
        maxHeight: '100dvh',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--luma-bg)'
      }}
    >
      {/* Global Cursor Following Light & Touch Tap Feedback */}
      <CursorLightEffect />

      {/* Full-screen Velvet Curtains Opening Intro — unchanged animation */}
      <CurtainIntro onOpened={onCurtainsOpened} />

      {/* Photobooth Experience Underneath */}
      {mode === 'guest' ? <GuestShell /> : <StudioShell />}

      {/* Welcome Auth Modal — appears ONLY after curtains fully open */}
      {showAuthModal && (
        <WelcomeAuthModal
          onGuest={handleModalGuest}
          onAuthenticated={handleModalAuthenticated}
        />
      )}
    </div>
  );
};

export default AppShell;
