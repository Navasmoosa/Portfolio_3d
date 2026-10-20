import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Compass,
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  ExternalLink,
  Eye,
  BookOpen,
} from 'lucide-react';
import TVAWorld from './components/canvas/TVAWorld';
import TemPadHUD from './components/ui/TemPadHUD';
import MissMinutesDialogue from './components/ui/MissMinutesDialogue';
import StationOverlay from './components/ui/StationOverlay';
import AppShowcaseModal from './components/ui/AppShowcaseModal';
import TVACaseFileModal from './components/ui/TVACaseFileModal';
import OpenWorldController from './components/ui/OpenWorldController';
import { STATIONS, PERSONAL_INFO } from './data/portfolioData';
import { soundEngine } from './utils/SoundEffects';

export default function App() {
  const worldRef = useRef(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showCaseFile, setShowCaseFile] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [orientation, setOrientation] = useState('portrait');
  const [playerTelemetry, setPlayerTelemetry] = useState({
    x: 0,
    z: 8,
    stepCount: 0,
    isNearStation: true,
    distanceToStation: 0,
    activeStationIndex: 0,
  });

  // Track orientation dynamically
  useEffect(() => {
    const checkOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      setOrientation(isLandscape ? 'landscape' : 'portrait');
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  // Trigger celebration confetti at Nexus or Closing
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e5b342', '#f59e0b', '#38bdf8', '#ff7700'],
      });
    } catch (err) {
      // Confetti fallback
    }
  }, []);

  // Station Change handler (invoked when walking into a station or clicking HUD)
  const handleStationChange = useCallback(
    (newIndex) => {
      if (newIndex >= 0 && newIndex < STATIONS.length) {
        setCurrentStationIndex(newIndex);
        setIsTalking(true);

        // Guide speech chime
        setTimeout(() => setIsTalking(false), 3000);

        if (newIndex === 5 || newIndex === 6) {
          triggerCelebration();
        }
      }
    },
    [triggerCelebration]
  );

  // Manual Quick Travel via HUD dots, Revisit button, or Prev/Next
  const handleManualStationSelect = useCallback(
    (newIndex) => {
      setIsAutoTour(false);
      if (worldRef.current) {
        worldRef.current.teleportToStation(newIndex);
      }
      handleStationChange(newIndex);
    },
    [handleStationChange]
  );

  // Step movement dispatcher
  const handleStep = useCallback((direction) => {
    if (worldRef.current) {
      worldRef.current.step(direction);
    }
  }, []);

  // Auto Tour Timer (Walks character from station to station)
  useEffect(() => {
    let timer;
    if (isAutoTour) {
      timer = setInterval(() => {
        setCurrentStationIndex((prev) => {
          if (prev >= STATIONS.length - 1) {
            setIsAutoTour(false);
            return prev;
          }
          const next = prev + 1;
          if (worldRef.current) {
            worldRef.current.teleportToStation(next);
          }
          return next;
        });
      }, 7500);
    }
    return () => clearInterval(timer);
  }, [isAutoTour]);

  // Keyboard navigation & Wheel Scroll controls (Arrow Keys / WASD = Walking)
  useEffect(() => {
    let lastWheelTime = 0;

    const handleKeyDown = (e) => {
      // Don't intercept if typing in modal input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleStep('forward');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleStep('backward');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleStep('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleStep('right');
      } else if (e.key.toLowerCase() === 'm') {
        const muted = soundEngine.toggleMute();
        setIsMuted(muted);
      } else if (e.key.toLowerCase() === 't') {
        setIsAutoTour((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        setIsFreeMode((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSelectedApp(null);
        setShowCaseFile(false);
        setShowHelpGuide(false);
      }
    };

    const handleWheel = (e) => {
      // Throttle wheel scroll into steps
      const now = Date.now();
      if (now - lastWheelTime < 240) return;

      if (Math.abs(e.deltaY) > 25) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          handleStep('forward');
        } else {
          handleStep('backward');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [handleStep]);

  return (
    <main className="app-container">
      {/* 1. CRT Scanlines & Vignette */}
      <div className="crt-overlay" />
      <div className="tva-vignette" />

      {/* 2. Top Header Bar */}
      <header className="tva-header-bar">
        <div className="tva-logo-wrap">
          <div className="tva-logo-badge">NM</div>
          <div className="tva-title-info">
            <h1 className="tva-main-title">{PERSONAL_INFO.name}</h1>
            <span className="tva-sub-title">
              OPEN-WORLD 3D PORTFOLIO • {PERSONAL_INFO.title}
            </span>
          </div>

          {/* Dynamic Media Mode & Orientation Pill */}
          <div
            className="media-mode-pill"
            onClick={() => {
              soundEngine.playTemPadClick();
              setIsFreeMode((prev) => !prev);
            }}
            style={{ cursor: 'pointer' }}
            title={`Active Display: ${orientation.toUpperCase()} • ${isFreeMode ? '360° Free Roam' : 'Guided Story'} (Tap to Toggle)`}
          >
            <span className="dot-indicator" />
            <span className="orientation-text">{orientation === 'landscape' ? 'LAND' : 'PORT'}</span>
            <span className="mode-text">{isFreeMode ? 'FREE' : 'STORY'}</span>
          </div>
        </div>

        <div className="header-actions">
          {/* Free Mode / Story Mode Switcher */}
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              setIsFreeMode((prev) => !prev);
            }}
            className={`tva-btn mode-header-btn ${isFreeMode ? 'tva-btn-primary' : ''}`}
            title={isFreeMode ? 'Switch to Guided Story Mode' : 'Switch to 360° Free Roam Mode (F key)'}
          >
            {isFreeMode ? <BookOpen size={15} /> : <Eye size={15} />}
            <span className="btn-label-desktop">
              {isFreeMode ? 'Story' : 'Free'}
            </span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setIsMuted(muted);
            }}
            className="tva-btn"
            title={isMuted ? 'Unmute Audio (M key)' : 'Mute Audio (M key)'}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-amber-400" />}
          </button>

          {/* Quick Help Guide Button */}
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              setShowHelpGuide(!showHelpGuide);
            }}
            className="tva-btn"
            title="Navigation Guide"
          >
            <HelpCircle size={15} />
            <span className="btn-label-desktop">Guide</span>
          </button>

          {/* Open Resume */}
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              setShowCaseFile(true);
            }}
            className="tva-btn tva-btn-primary"
            title="View and Download Resume"
          >
            <FileText size={15} />
            <span className="btn-label-desktop">Resume</span>
          </button>
        </div>
      </header>

      {/* 3. 3D WebGL Canvas TVA World with Open-World Walking Locomotion */}
      <TVAWorld
        ref={worldRef}
        currentStationIndex={currentStationIndex}
        onStationChange={handleStationChange}
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        isTalking={isTalking}
        onPlayerTelemetry={setPlayerTelemetry}
        isFreeMode={isFreeMode}
      />

      {/* 4. On-Screen Virtual D-Pad & Waypoint Quest Tracker */}
      <OpenWorldController
        onStep={handleStep}
        playerTelemetry={playerTelemetry}
        currentStationIndex={currentStationIndex}
        isFreeMode={isFreeMode}
        onToggleFreeMode={setIsFreeMode}
        onResetCamera={() => worldRef.current?.resetCamera?.()}
        onStationSelect={handleManualStationSelect}
      />

      {/* 5. Miss Minutes Floating Companion Dialogue Card */}
      <MissMinutesDialogue
        currentStationIndex={currentStationIndex}
        onNextStation={() =>
          handleManualStationSelect(Math.min(currentStationIndex + 1, STATIONS.length - 1))
        }
        onStationSelect={handleManualStationSelect}
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        onOpenCaseFile={() => {
          soundEngine.playTemPadClick();
          setShowCaseFile(true);
        }}
        isFreeMode={isFreeMode}
      />

      {/* 6. Contextual Station Information Overlay (Left / Bottom-Left) */}
      <StationOverlay
        currentStationIndex={currentStationIndex}
        onStationSelect={handleManualStationSelect}
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        onOpenCaseFile={() => {
          soundEngine.playTemPadClick();
          setShowCaseFile(true);
        }}
        playerTelemetry={playerTelemetry}
        isFreeMode={isFreeMode}
        onToggleFreeMode={setIsFreeMode}
      />

      {/* 7. Bottom Floating HUD Controller (With Quick Travel & Audio) */}
      <TemPadHUD
        currentStationIndex={currentStationIndex}
        onStationSelect={handleManualStationSelect}
        isAutoTour={isAutoTour}
        onToggleAutoTour={() => setIsAutoTour(!isAutoTour)}
        isMuted={isMuted}
        onToggleMute={setIsMuted}
        onOpenCaseFile={() => setShowCaseFile(true)}
        isFreeMode={isFreeMode}
        onToggleFreeMode={setIsFreeMode}
      />

      {/* 8. App Showcase Modal (Disaster Management) */}
      {selectedApp && (
        <AppShowcaseModal
          appId={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* 9. Resume / Curriculum Vitae Modal */}
      {showCaseFile && (
        <TVACaseFileModal onClose={() => setShowCaseFile(false)} />
      )}

      {/* 10. Help / Keyboard Guide Modal */}
      {showHelpGuide && (
        <div className="help-modal-backdrop" onClick={() => setShowHelpGuide(false)}>
          <div className="tva-panel help-card" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <span className="card-badge">OPEN-WORLD NAVIGATION & VIEW MODES</span>
              <h3>How To Explore Navas Moosa's 3D World</h3>
            </div>
            <ul className="help-list">
              <li><strong>Mobile Free Mode / Orbit View:</strong> Tap the <em>Free Mode</em> button, tap the Media Mode pill, or press 'F' key! In Free Mode, cards dock away so you have a 360° unobstructed view of the 3D TVA hall. Drag on the screen to rotate your view around your character, pinch to zoom in/out, and tap 'Reset Cam' to center.</li>
              <li><strong>Landscape & Portrait Adaptation:</strong> In landscape (held horizontally), cards dock neatly to the left half with virtual D-Pad thumb controls on the right, keeping your character visible. In portrait, cards expand into a full-width bottom sheet or collapse to a compact walking pill.</li>
              <li><strong>Movement Controls (Arrow Keys / WASD):</strong> Press once to move 1 step forward, backward, left, or right, or hold down for continuous open-world walking!</li>
              <li><strong>Virtual D-Pad Controls:</strong> Click or hold the on-screen Directional buttons in the bottom right corner.</li>
              <li><strong>7 Timeline Stations:</strong> Walk down the golden corridor to unlock Scene 1 (Welcome), Scene 2 (About Me), Scene 3 (Experience), Scene 4 (Projects), Scene 5 (Skills), Scene 6 (Contact), and Scene 7 (Thank You)!</li>
              <li><strong>Waypoint Checkpoint Pads:</strong> Step onto glowing circular waypoint rings to automatically trigger station records.</li>
              <li><strong>Miss Minutes Guide:</strong> Flies alongside you down the timeline, explaining each milestone.</li>
              <li><strong>'F' Key:</strong> Toggle between 360° Free Mode and Guided Story Mode.</li>
              <li><strong>'T' Key:</strong> Toggle Auto-Tour for a hands-free cinematic walkthrough.</li>
              <li><strong>'M' Key:</strong> Mute or unmute footsteps and ambient audio.</li>
            </ul>
            <button
              onClick={() => setShowHelpGuide(false)}
              className="tva-btn tva-btn-primary full-btn"
            >
              Got It, Start Exploring
            </button>
          </div>
        </div>
      )}

      <style>{`
        .media-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(26, 23, 20, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.4);
          font-family: var(--font-mono);
          font-size: 10px;
          color: #d6c7b2;
          letter-spacing: 0.5px;
          user-select: none;
          transition: all 0.2s ease;
        }

        .media-mode-pill:hover {
          border-color: #ffd868;
          transform: scale(1.03);
        }

        .media-mode-pill .dot-indicator {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 6px rgba(52, 211, 153, 0.8);
          animation: pulseDot 2s infinite ease-in-out;
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        .media-mode-pill .orientation-text {
          color: #ffd868;
          font-weight: 700;
        }

        .media-mode-pill .mode-text {
          padding: 1px 5px;
          background: rgba(245, 158, 11, 0.25);
          border-radius: 4px;
          color: #f59e0b;
          font-weight: 700;
        }

        .mode-header-btn {
          border-color: rgba(56, 189, 248, 0.4);
          color: #38bdf8;
        }

        .mode-header-btn:hover {
          border-color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
        }

        .help-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 6, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 80;
          padding: 20px;
        }

        .help-card {
          width: 560px;
          max-width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid var(--tva-gold);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .help-header h3 {
          font-family: var(--font-display);
          font-size: 18px;
          color: #fff;
          margin-top: 4px;
        }

        .help-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 12px;
          color: #d6c7b2;
          line-height: 1.5;
        }

        .help-list strong {
          color: #ffd868;
        }

        @media (max-width: 768px) {
          .tva-header-bar {
            height: 48px;
            padding: 0 10px;
          }
          .tva-logo-wrap {
            gap: 6px;
          }
          .tva-logo-badge {
            width: 28px;
            height: 28px;
            font-size: 11px;
          }
          .tva-main-title {
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          .tva-sub-title {
            display: none;
          }
          .media-mode-pill {
            display: inline-flex;
            padding: 2px 6px;
            gap: 4px;
            font-size: 8.5px;
          }
          .media-mode-pill .mode-text {
            padding: 0 3px;
            font-size: 8px;
          }
          .header-actions {
            gap: 5px;
          }
          .tva-btn {
            width: 30px;
            height: 30px;
            padding: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
          }
          .btn-label-desktop {
            display: none !important;
          }
        }

        @media (orientation: landscape) and (max-height: 520px) {
          .tva-header-bar {
            height: 38px;
            padding: 0 10px;
          }
          .tva-logo-badge {
            width: 24px;
            height: 24px;
            font-size: 10px;
          }
          .tva-main-title {
            font-size: 11px;
          }
          .tva-sub-title {
            display: none;
          }
          .media-mode-pill {
            display: inline-flex;
            padding: 1px 5px;
            font-size: 8px;
          }
          .header-actions {
            gap: 4px;
          }
          .tva-btn {
            width: 26px;
            height: 26px;
            padding: 0;
          }
          .btn-label-desktop {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
