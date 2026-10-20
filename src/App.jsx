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
  const [playerTelemetry, setPlayerTelemetry] = useState({
    x: 0,
    z: 8,
    stepCount: 0,
    isNearStation: true,
    distanceToStation: 0,
    activeStationIndex: 0,
  });

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
        </div>

        <div className="header-actions">
          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              setIsMuted(muted);
            }}
            className="tva-btn"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
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
            <span className="btn-label-desktop">User Guide</span>
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
            <span>Resume</span>
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
      />

      {/* 4. On-Screen Virtual D-Pad & Waypoint Quest Tracker */}
      <OpenWorldController
        onStep={handleStep}
        playerTelemetry={playerTelemetry}
        currentStationIndex={currentStationIndex}
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
              <span className="card-badge">OPEN-WORLD GAME NAVIGATION GUIDE</span>
              <h3>How To Explore Navas Moosa's 3D World</h3>
            </div>
            <ul className="help-list">
              <li><strong>Arrow Keys (↑, ↓, ←, →) or (W, A, S, D):</strong> Click once to move 1 step forward, backward, left, or right! Hold down for continuous walking.</li>
              <li><strong>Virtual D-Pad Controls:</strong> Click the on-screen Directional buttons in the bottom right to step in any direction.</li>
              <li><strong>7 Station Destinations:</strong> Walk along the corridor to discover Scene 1 (Welcome), Scene 2 (About Me), Scene 3 (Experience), Scene 4 (Projects), Scene 5 (Skills), Scene 6 (Contact), and Scene 7 (Thank You)!</li>
              <li><strong>Arrival Checkpoint Pads:</strong> Step onto the glowing circular waypoint pads on the floor at each station to unlock details.</li>
              <li><strong>Miss Minutes Companion:</strong> Hovers alongside you as you walk, and explains each station when you arrive!</li>
              <li><strong>Interactive 3D Demos:</strong> Click directly on the floating device consoles in Scene 4 to test the interactive <em>Disaster Management System</em> demo.</li>
              <li><strong>Resume Button:</strong> View and print Navas's complete resume PDF anytime.</li>
              <li><strong>'T' Key:</strong> Toggle Auto-Tour mode for a hands-free cinematic walkthrough.</li>
              <li><strong>'M' Key:</strong> Toggle ambient sound and footsteps.</li>
            </ul>
            <button
              onClick={() => setShowHelpGuide(false)}
              className="tva-btn tva-btn-primary full-btn"
            >
              Understood, Start Exploring
            </button>
          </div>
        </div>
      )}

      <style>{`
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
          width: 520px;
          max-width: 100%;
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
      `}</style>
    </main>
  );
}
