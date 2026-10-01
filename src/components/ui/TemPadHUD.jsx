import React from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  FileText,
  Compass,
  Sparkles,
} from 'lucide-react';
import { STATIONS } from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

export default function TemPadHUD({
  currentStationIndex,
  onStationSelect,
  isAutoTour,
  onToggleAutoTour,
  isMuted,
  onToggleMute,
  onOpenCaseFile,
}) {
  const currentStation = STATIONS[currentStationIndex] || STATIONS[0];

  const handlePrev = () => {
    soundEngine.playTemPadClick();
    if (currentStationIndex > 0) {
      onStationSelect(currentStationIndex - 1);
    }
  };

  const handleNext = () => {
    soundEngine.playTemPadClick();
    if (currentStationIndex < STATIONS.length - 1) {
      onStationSelect(currentStationIndex + 1);
    }
  };

  const handleSelect = (idx) => {
    soundEngine.playTemPadClick();
    onStationSelect(idx);
  };

  return (
    <div className="tempad-hud-container">
      {/* Station Progress Bar & Step Indicator */}
      <div className="tempad-top-strip">
        <div className="tempad-sector-badge">
          <Compass size={14} className="text-amber-400" />
          <span>SECTOR {currentStation.stepNumber} OF {STATIONS.length}</span>
          <span className="separator">•</span>
          <span className="station-name-glow">{currentStation.title}</span>
        </div>

        {/* Station Navigation Quick Dots */}
        <div className="station-dots-track">
          {STATIONS.map((station, idx) => {
            const isActive = idx === currentStationIndex;
            return (
              <button
                key={station.id}
                onClick={() => handleSelect(idx)}
                className={`station-dot-btn ${isActive ? 'active' : ''}`}
                title={`Sector ${station.stepNumber}: ${station.title}`}
              >
                <span className="dot-number">{station.stepNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bottom TemPad Control Console */}
      <div className="tempad-main-bar">
        {/* Left: Step Steppers */}
        <div className="tempad-nav-group">
          <button
            onClick={handlePrev}
            disabled={currentStationIndex === 0}
            className="tva-btn tempad-step-btn"
            title="Previous Timeline Station"
          >
            <ChevronLeft size={18} />
            <span className="btn-label-desktop">PREV</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStationIndex === STATIONS.length - 1}
            className="tva-btn tva-btn-primary tempad-step-btn"
            title="Next Timeline Station"
          >
            <span className="btn-label-desktop">NEXT</span>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Center: Auto Tour Controller */}
        <div className="tempad-center-group">
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              onToggleAutoTour();
            }}
            className={`tva-btn tour-toggle-btn ${isAutoTour ? 'active-tour' : ''}`}
          >
            {isAutoTour ? <Pause size={16} /> : <Play size={16} />}
            <span>{isAutoTour ? 'PAUSE AUTO-TOUR' : 'PLAY TIMELINE TOUR'}</span>
            {isAutoTour && <span className="pulsing-recording-dot" />}
          </button>
        </div>

        {/* Right: Audio & Confidential Case-File */}
        <div className="tempad-actions-group">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = soundEngine.toggleMute();
              onToggleMute(muted);
            }}
            className="tva-btn audio-btn"
            title={isMuted ? 'Unmute TVA Sounds' : 'Mute Sounds'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-amber-400" />}
          </button>

          {/* Confidential Dossier Button */}
          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              onOpenCaseFile();
            }}
            className="tva-btn casefile-btn"
            title="Open TVA Confidential Dossier & Resume"
          >
            <div className="wax-seal-mini" />
            <span className="casefile-text">CASE-FILE: N. MOOSA</span>
            <FileText size={16} className="text-amber-300" />
          </button>
        </div>
      </div>

      <style>{`
        .tempad-hud-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - 40px);
          max-width: 960px;
          z-index: 40;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: auto;
        }

        .tempad-top-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(20, 17, 14, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid var(--tva-border);
          border-radius: 6px;
          padding: 6px 14px;
        }

        .tempad-sector-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 1px;
          color: #d4af37;
        }

        .separator {
          color: #786450;
        }

        .station-name-glow {
          color: #f5f0e6;
          font-weight: 600;
        }

        .station-dots-track {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .station-dot-btn {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid rgba(229, 179, 66, 0.3);
          background: rgba(30, 25, 20, 0.8);
          color: #9a8874;
          font-family: var(--font-mono);
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .station-dot-btn:hover {
          border-color: var(--tva-gold);
          color: #fff;
          transform: scale(1.1);
        }

        .station-dot-btn.active {
          background: var(--tva-amber);
          border-color: #ffd868;
          color: #1a1614;
          font-weight: bold;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.7);
        }

        .tempad-main-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(24, 20, 16, 0.92);
          backdrop-filter: blur(16px);
          border: 1px solid var(--tva-border);
          border-radius: 8px;
          padding: 10px 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.7), 0 0 20px rgba(229, 179, 66, 0.15);
        }

        .tempad-nav-group,
        .tempad-center-group,
        .tempad-actions-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tempad-step-btn {
          padding: 8px 14px;
        }

        .tour-toggle-btn {
          background: rgba(45, 36, 28, 0.8);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #ffd868;
          font-weight: 600;
        }

        .tour-toggle-btn.active-tour {
          background: linear-gradient(135deg, #b45309 0%, #78350f 100%);
          border-color: #f59e0b;
          color: #fff;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
        }

        .pulsing-recording-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          box-shadow: 0 0 8px #ef4444;
          animation: pulseGlow 1s infinite alternate;
        }

        .casefile-btn {
          background: linear-gradient(135deg, #451a03 0%, #291205 100%);
          border-color: #b45309;
          color: #fed7aa;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .casefile-btn:hover {
          border-color: #f97316;
          box-shadow: 0 0 15px rgba(249, 115, 22, 0.5);
        }

        .wax-seal-mini {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: radial-gradient(circle, #dc2626 40%, #7f1d1d 100%);
          border: 1px solid #ef4444;
          box-shadow: 0 0 6px rgba(220, 38, 38, 0.8);
        }

        @media (max-width: 768px) {
          .tempad-hud-container {
            bottom: 10px;
            width: calc(100% - 16px);
          }
          .station-dots-track {
            display: none;
          }
          .btn-label-desktop {
            display: none;
          }
          .casefile-text {
            font-size: 10px;
          }
          .tour-toggle-btn span {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
}
