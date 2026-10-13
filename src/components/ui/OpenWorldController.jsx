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
} from 'lucide-react';
import { STATIONS } from '../../data/portfolioData';

export default function OpenWorldController({
  onStep,
  onWalkStart,
  onWalkStop,
  playerTelemetry,
  currentStationIndex,
}) {
  const [activeDirection, setActiveDirection] = useState(null);
  const holdTimerRef = useRef(null);
  const holdIntervalRef = useRef(null);

  // Handle single click (one step) vs continuous hold
  const handleDirectionPress = (dir) => {
    setActiveDirection(dir);
    // Execute one immediate step on click
    if (onStep) onStep(dir);

    // If held for more than 280ms, begin continuous walk
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
      {/* Top Floating Mini Quest / Waypoint Banner */}
      <div className="waypoint-tracker-pill animate-fadeIn">
        <div className="waypoint-main">
          <MapPin size={13} className="text-amber-400" />
          <span className="waypoint-zone-tag">
            {isNear ? 'CURRENT LOCATION' : 'IN TRANSIT'}
          </span>
          <span className="waypoint-title">
            {isNear ? currentStation.title : `Walking to ${nextStation.title}`}
          </span>
        </div>

        <div className="waypoint-stats">
          <span className="step-counter-tag">
            <Footprints size={12} className="text-cyan-400" />
            <span>{stepCount} Steps</span>
          </span>
          {!isNear && distanceToNext > 0 && (
            <span className="distance-tag">
              <Compass size={11} className="text-green-400" />
              <span>{distanceToNext}m</span>
            </span>
          )}
        </div>
      </div>

      {/* 4-Direction Virtual D-Pad / Controller Console */}
      <div className="dpad-console tva-panel animate-slideUp">
        <div className="dpad-header">
          <span className="dpad-label">WALK CONTROLS</span>
          <span className="dpad-hint">1 CLICK = 1 STEP</span>
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
          <div className="dpad-center-core">
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

        @media (max-width: 768px) {
          .dpad-console {
            bottom: 85px;
            right: 12px;
            width: 145px;
          }
          .dpad-cross-grid {
            grid-template-columns: 38px 38px 38px;
            grid-template-rows: 38px 38px 38px;
          }
          .waypoint-tracker-pill {
            top: 65px;
            font-size: 11px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </div>
  );
}
