import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Footprints,
  Compass,
  MapPin,
  ChevronRight,
  RotateCcw,
  Eye,
  BookOpen,
} from 'lucide-react';
import { STATIONS } from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

export default function OpenWorldController({
  onStep,
  onWalkStart,
  onWalkStop,
  playerTelemetry,
  currentStationIndex,
  isFreeMode = false,
  onToggleFreeMode,
  onResetCamera,
  onStationSelect,
}) {
  const [activeDirection, setActiveDirection] = useState(null);
  const holdTimerRef = useRef(null);
  const holdIntervalRef = useRef(null);

  // Handle single click (one step) vs continuous hold
  const handleDirectionPress = (dir) => {
    setActiveDirection(dir);
    if (onStep) onStep(dir);

    holdTimerRef.current = setTimeout(() => {
      if (onWalkStart) onWalkStart(dir);
      holdIntervalRef.current = setInterval(() => {
        if (onStep) onStep(dir);
      }, 180);
    }, 280);
  };

  const handleDirectionRelease = (dir) => {
    setActiveDirection(null);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (onWalkStop) onWalkStop(dir);
  };

  // Keyboard active indicator sync
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') setActiveDirection('forward');
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') setActiveDirection('backward');
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') setActiveDirection('left');
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') setActiveDirection('right');
    };

    const handleKeyUp = () => {
      setActiveDirection(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const currentStation = STATIONS[currentStationIndex] || STATIONS[0];
  const nextStation = STATIONS[Math.min(currentStationIndex + 1, STATIONS.length - 1)];
  const isNear = playerTelemetry?.isNearStation ?? true;
  const stepCount = playerTelemetry?.stepCount ?? 0;
  const distanceToNext = playerTelemetry?.distanceToStation
    ? Math.max(0, Math.round(playerTelemetry.distanceToStation * 10) / 10)
    : 0;

  return (
    <div className="openworld-controller-root">
      {/* Top Floating Waypoint / Mode Tracker Bar */}
      <div className={`waypoint-tracker-pill animate-fadeIn ${isFreeMode ? 'free-mode-pill' : ''}`}>
        <div className="waypoint-main">
          {isFreeMode ? (
            <>
              <Eye size={14} className="text-cyan-400 animate-pulse" />
              <span className="waypoint-zone-tag free-tag">FREE VIEW MODE</span>
              <span className="waypoint-title">360° Open Exploration</span>
            </>
          ) : (
            <>
              <MapPin size={13} className="text-amber-400" />
              <span className="waypoint-zone-tag">
                {isNear ? 'CURRENT LOCATION' : 'IN TRANSIT'}
              </span>
              <span className="waypoint-title">
                {isNear ? currentStation.title : `Walking to ${nextStation.title}`}
              </span>
            </>
          )}
        </div>

        <div className="waypoint-stats">
          <span className="step-counter-tag">
            <Footprints size={12} className="text-cyan-400" />
            <span>{stepCount} Steps</span>
          </span>
          {!isFreeMode && !isNear && distanceToNext > 0 && (
            <span className="distance-tag">
              <Compass size={11} className="text-green-400" />
              <span>{distanceToNext}m</span>
            </span>
          )}
          {isFreeMode && (
            <button
              onClick={() => {
                soundEngine.playTemPadClick();
                if (onResetCamera) onResetCamera();
              }}
              className="ctrl-cam-reset-btn"
              title="Reset 360° camera behind character"
            >
              <RotateCcw size={11} />
              <span>Reset Cam</span>
            </button>
          )}
        </div>
      </div>

      {/* Free Mode Gesture Hint (Fades out gently) */}
      {isFreeMode && (
        <div className="free-mode-drag-hint animate-fadeIn">
          <span>🖐️ Drag anywhere to look around 360° • Pinch to zoom</span>
        </div>
      )}

      {/* 4-Direction Virtual D-Pad / Controller Console */}
      <div className={`dpad-console tva-panel animate-slideUp ${isFreeMode ? 'dpad-free' : ''}`}>
        <div className="dpad-header">
          <span className="dpad-label">{isFreeMode ? 'FREE ROAM' : 'WALK'}</span>
          {onResetCamera && (
            <button
              onClick={() => {
                soundEngine.playTemPadClick();
                onResetCamera();
              }}
              className="dpad-reset-link"
              title="Reset Camera Behind Character"
            >
              <RotateCcw size={10} />
            </button>
          )}
        </div>

        <div className="dpad-cross-grid">
          {/* UP / FORWARD */}
          <button
            type="button"
            className={`dpad-btn dpad-up ${activeDirection === 'forward' ? 'active' : ''}`}
            onMouseDown={() => handleDirectionPress('forward')}
            onMouseUp={() => handleDirectionRelease('forward')}
            onMouseLeave={() => handleDirectionRelease('forward')}
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('forward'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDirectionRelease('forward'); }}
            title="Step Forward (Up Arrow / W)"
          >
            <ArrowUp size={18} />
            <span className="key-hint">W / ↑</span>
          </button>

          {/* LEFT */}
          <button
            type="button"
            className={`dpad-btn dpad-left ${activeDirection === 'left' ? 'active' : ''}`}
            onMouseDown={() => handleDirectionPress('left')}
            onMouseUp={() => handleDirectionRelease('left')}
            onMouseLeave={() => handleDirectionRelease('left')}
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDirectionRelease('left'); }}
            title="Step Left (Left Arrow / A)"
          >
            <ArrowLeft size={18} />
            <span className="key-hint">A / ←</span>
          </button>

          {/* CENTER COMPASS CORE */}
          <div
            className="dpad-center-core"
            onClick={() => {
              if (onResetCamera) onResetCamera();
            }}
            title="Click to center camera"
          >
            <Compass size={16} className="text-amber-400 animate-spin-slow" />
          </div>

          {/* RIGHT */}
          <button
            type="button"
            className={`dpad-btn dpad-right ${activeDirection === 'right' ? 'active' : ''}`}
            onMouseDown={() => handleDirectionPress('right')}
            onMouseUp={() => handleDirectionRelease('right')}
            onMouseLeave={() => handleDirectionRelease('right')}
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDirectionRelease('right'); }}
            title="Step Right (Right Arrow / D)"
          >
            <ArrowRight size={18} />
            <span className="key-hint">D / →</span>
          </button>

          {/* DOWN / BACKWARD */}
          <button
            type="button"
            className={`dpad-btn dpad-down ${activeDirection === 'backward' ? 'active' : ''}`}
            onMouseDown={() => handleDirectionPress('backward')}
            onMouseUp={() => handleDirectionRelease('backward')}
            onMouseLeave={() => handleDirectionRelease('backward')}
            onTouchStart={(e) => { e.preventDefault(); handleDirectionPress('backward'); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDirectionRelease('backward'); }}
            title="Step Backward (Down Arrow / S)"
          >
            <ArrowDown size={18} />
            <span className="key-hint">S / ↓</span>
          </button>
        </div>
      </div>

      <style>{`
        .openworld-controller-root {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 38;
        }

        /* Top Waypoint / Quest Tracker Bar */
        .waypoint-tracker-pill {
          position: absolute;
          top: 75px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(18, 14, 11, 0.92);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(229, 179, 66, 0.4);
          padding: 8px 18px;
          border-radius: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(229, 179, 66, 0.15);
          pointer-events: auto;
          white-space: nowrap;
        }

        .waypoint-main {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .waypoint-zone-tag {
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: #fbbf24;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .waypoint-title {
          font-size: 13px;
          font-weight: 600;
          color: #f8fafc;
        }

        .waypoint-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          border-left: 1px solid rgba(229, 179, 66, 0.25);
          padding-left: 12px;
        }

        .step-counter-tag,
        .distance-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #cbd5e1;
        }

        /* D-Pad Console */
        .dpad-console {
          position: absolute;
          bottom: 95px;
          right: 24px;
          width: 170px;
          padding: 12px;
          border-radius: 16px;
          background: rgba(20, 16, 13, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(229, 179, 66, 0.4);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 179, 66, 0.2);
          pointer-events: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .dpad-header {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: #fbbf24;
          letter-spacing: 0.8px;
          padding: 0 2px;
        }

        .dpad-hint {
          color: #94a3b8;
        }

        .dpad-cross-grid {
          display: grid;
          grid-template-columns: 46px 46px 46px;
          grid-template-rows: 46px 46px 46px;
          gap: 4px;
          justify-content: center;
          align-items: center;
        }

        .dpad-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(40, 32, 24, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.35);
          border-radius: 8px;
          color: #ffd868;
          cursor: pointer;
          transition: all 0.15s ease;
          width: 100%;
          height: 100%;
          user-select: none;
          -webkit-user-select: none;
        }

        .dpad-btn:hover {
          background: rgba(245, 158, 11, 0.25);
          border-color: #ffd868;
          color: #fff;
          transform: scale(1.06);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }

        .dpad-btn.active,
        .dpad-btn:active {
          background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
          border-color: #fef08a;
          color: #1a140f;
          transform: scale(0.95);
          box-shadow: 0 0 18px rgba(245, 158, 11, 0.8);
        }

        .key-hint {
          font-family: var(--font-mono);
          font-size: 7.5px;
          opacity: 0.75;
          margin-top: 1px;
        }

        .dpad-up {
          grid-column: 2;
          grid-row: 1;
        }

        .dpad-left {
          grid-column: 1;
          grid-row: 2;
        }

        .dpad-center-core {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(15, 12, 10, 0.8);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          margin: auto;
          border: 1px solid rgba(229, 179, 66, 0.2);
        }

        .dpad-right {
          grid-column: 3;
          grid-row: 2;
        }

        .dpad-down {
          grid-column: 2;
          grid-row: 3;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spinSlow 12s linear infinite;
        }

        /* Free Mode Styles */
        .free-mode-pill {
          border-color: rgba(56, 189, 248, 0.55);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 25px rgba(56, 189, 248, 0.25);
        }

        .free-tag {
          color: #38bdf8 !important;
        }

        .ctrl-cam-reset-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #7dd3fc;
          font-family: var(--font-mono);
          font-size: 9.5px;
          padding: 2px 7px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ctrl-cam-reset-btn:hover {
          background: rgba(56, 189, 248, 0.3);
          color: #fff;
          border-color: #38bdf8;
        }

        .dpad-reset-link {
          background: transparent;
          border: none;
          color: #fbbf24;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          border-radius: 3px;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .dpad-reset-link:hover {
          opacity: 1;
          color: #fff;
        }

        .dpad-free {
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, 0.2);
        }

        .free-mode-drag-hint {
          position: absolute;
          top: 118px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 12, 10, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 20px;
          padding: 5px 14px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #bae6fd;
          letter-spacing: 0.5px;
          pointer-events: none;
          z-index: 37;
          white-space: nowrap;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
          animation: floatBob 3s ease-in-out infinite;
        }

        /* Responsive Media Modes: Portrait & Landscape */
        @media (max-width: 768px) {
          .dpad-console {
            bottom: 56px;
            right: 10px;
            width: 130px;
            padding: 6px;
            gap: 4px;
            border-radius: 14px;
            z-index: 42;
          }
          .dpad-header {
            font-size: 8px;
            padding: 0;
          }
          .dpad-cross-grid {
            grid-template-columns: 34px 34px 34px;
            grid-template-rows: 34px 34px 34px;
            gap: 3px;
          }
          .key-hint {
            display: none;
          }
          .waypoint-tracker-pill {
            top: 52px;
            left: 10px;
            right: auto;
            transform: none;
            font-size: 10px;
            padding: 4px 10px;
            gap: 6px;
            max-width: calc(100vw - 64px);
            z-index: 38;
          }
          .waypoint-title {
            font-size: 11px;
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .free-mode-drag-hint {
            top: 86px;
            font-size: 9px;
            padding: 3px 10px;
            white-space: normal;
            text-align: center;
            max-width: 90vw;
          }
        }

        /* Mobile Landscape Media Mode */
        @media (orientation: landscape) and (max-height: 520px) {
          .waypoint-tracker-pill {
            top: 40px;
            left: 10px;
            transform: none;
            padding: 3px 8px;
            gap: 6px;
            font-size: 9.5px;
            border-radius: 14px;
            max-width: 40vw;
          }
          .waypoint-title {
            font-size: 10px;
            max-width: 130px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .waypoint-stats {
            gap: 4px;
            padding-left: 6px;
          }
          .step-counter-tag {
            font-size: 9px;
          }
          .free-mode-drag-hint {
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 9px;
            padding: 2px 8px;
          }
          .dpad-console {
            bottom: 6px;
            right: 8px;
            width: 114px;
            padding: 4px;
            gap: 2px;
            border-radius: 10px;
            z-index: 42;
          }
          .dpad-cross-grid {
            grid-template-columns: 30px 30px 30px;
            grid-template-rows: 30px 30px 30px;
            gap: 2px;
          }
          .dpad-center-core {
            width: 22px;
            height: 22px;
          }
          .key-hint {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
