import React, { useState, useEffect, useCallback } from 'react';
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
import { STATIONS, PERSONAL_INFO } from './data/portfolioData';
import { soundEngine } from './utils/SoundEffects';

export default function App() {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showCaseFile, setShowCaseFile] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [showHelpGuide, setShowHelpGuide] = useState(false);

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

  // Station Change handler
  const handleStationChange = useCallback(
    (newIndex) => {
      if (newIndex >= 0 && newIndex < STATIONS.length) {
        setCurrentStationIndex(newIndex);
        setIsTalking(true);

        // Reset talking state after initial speech burst
        setTimeout(() => setIsTalking(false), 3000);

        if (newIndex === 5 || newIndex === 6) {
          triggerCelebration();
        }
      }
    },
    [triggerCelebration]
  );

  // Auto Tour Timer
  useEffect(() => {
    let timer;
    if (isAutoTour) {
      timer = setInterval(() => {
        setCurrentStationIndex((prev) => {
          if (prev >= STATIONS.length - 1) {
            setIsAutoTour(false);
            return prev;
          }
          return prev + 1;
        });
      }, 7500);
    }
    return () => clearInterval(timer);
  }, [isAutoTour]);

  // Keyboard navigation & Wheel Scroll controls
  useEffect(() => {
    let lastWheelTime = 0;

    const handleKeyDown = (e) => {
      // Don't intercept if typing in modal input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        soundEngine.playTemPadClick();
        handleStationChange(Math.min(currentStationIndex + 1, STATIONS.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        soundEngine.playTemPadClick();
        handleStationChange(Math.max(currentStationIndex - 1, 0));
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
      // Throttle wheel scroll
      const now = Date.now();
      if (now - lastWheelTime < 600) return;

      if (Math.abs(e.deltaY) > 30) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          handleStationChange(Math.min(currentStationIndex + 1, STATIONS.length - 1));
        } else {
          handleStationChange(Math.max(currentStationIndex - 1, 0));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [currentStationIndex, handleStationChange]);

  return (
    <main className="app-container">
      {/* 1. TVA CRT Scanlines & Vignette */}
      <div className="crt-overlay" />
      <div className="tva-vignette" />

      {/* 2. TVA Top Header Bar */}
      <header className="tva-header-bar">
        <div className="tva-logo-wrap">
          <div className="tva-logo-badge">TVA</div>
          <div className="tva-title-info">
            <h1 className="tva-main-title">{PERSONAL_INFO.name}</h1>
            <span className="tva-sub-title">
              TIME VARIANCE AUTHORITY ARCHIVES • {PERSONAL_INFO.title}
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
            <span className="btn-label-desktop">TVA Guide</span>
          </button>

          {/* Open Dossier */}
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              setShowCaseFile(true);
            }}
            className="tva-btn tva-btn-primary"
            title="Open Confidential TVA Case-File"
          >
            <FileText size={15} />
            <span>Case-File</span>
          </button>
        </div>
      </header>

      {/* 3. 3D WebGL Canvas TVA World */}
      <TVAWorld
        currentStationIndex={currentStationIndex}
        onStationChange={handleStationChange}
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        isTalking={isTalking}
      />

      {/* 4. Miss Minutes Floating Interactive Dialogue Card */}
      <MissMinutesDialogue
        currentStationIndex={currentStationIndex}
        onNextStation={() =>
          handleStationChange(Math.min(currentStationIndex + 1, STATIONS.length - 1))
        }
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        onOpenCaseFile={() => {
          soundEngine.playTemPadClick();
          setShowCaseFile(true);
        }}
      />

      {/* 5. Contextual Station Information Overlay (Left / Bottom-Left) */}
      <StationOverlay
        currentStationIndex={currentStationIndex}
        onAppSelect={(appId) => {
          soundEngine.playTemPadClick();
          setSelectedApp(appId);
        }}
        onOpenCaseFile={() => {
          soundEngine.playTemPadClick();
          setShowCaseFile(true);
        }}
      />

      {/* 6. Bottom Floating TemPad HUD Controller */}
      <TemPadHUD
        currentStationIndex={currentStationIndex}
        onStationSelect={handleStationChange}
        isAutoTour={isAutoTour}
        onToggleAutoTour={() => setIsAutoTour(!isAutoTour)}
        isMuted={isMuted}
        onToggleMute={setIsMuted}
        onOpenCaseFile={() => setShowCaseFile(true)}
      />

      {/* 7. App Showcase Modal (CampusFix, PocketTask, Disaster Management) */}
      {selectedApp && (
        <AppShowcaseModal
          appId={selectedApp}
          onClose={() => setSelectedApp(null)}
        />
      )}

      {/* 8. Confidential TVA Case-File Dossier Modal */}
      {showCaseFile && (
        <TVACaseFileModal onClose={() => setShowCaseFile(false)} />
      )}

      {/* 9. Help / Keyboard Guide Modal */}
      {showHelpGuide && (
        <div className="help-modal-backdrop" onClick={() => setShowHelpGuide(false)}>
          <div className="tva-panel help-card" onClick={(e) => e.stopPropagation()}>
            <div className="help-header">
              <span className="card-badge">TVA TEMPAD FIELD MANUAL</span>
              <h3>How To Navigate Navas Moosa's 3D Timeline</h3>
            </div>
            <ul className="help-list">
              <li><strong>Scroll Wheel or Trackpad:</strong> Walk forward and backward through the TVA brutalist corridor.</li>
              <li><strong>Arrow Keys / Spacebar:</strong> Step between the 10 timeline stations.</li>
              <li><strong>Miss Minutes:</strong> Your personal TVA mentor floating on air! Listen to her voice and click her action buttons.</li>
              <li><strong>3D Holographic Phones:</strong> Click directly on the floating 3D phones to test <em>CampusFix</em> and <em>PocketTask</em>.</li>
              <li><strong>Case-File Button:</strong> Open the official confidential dossier to review and print Navas's complete resume.</li>
              <li><strong>'T' Key:</strong> Toggle Auto-Tour mode for a hands-free cinematic walkthrough.</li>
              <li><strong>'M' Key:</strong> Toggle TVA sound synthesizer effects.</li>
            </ul>
            <button
              onClick={() => setShowHelpGuide(false)}
              className="tva-btn tva-btn-primary full-btn"
            >
              Understood, Return To Timeline
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
          width: 500px;
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
