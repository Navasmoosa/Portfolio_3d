import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Sparkles,
  Layers,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { soundEngine } from '../../utils/SoundEffects';
import ReconstructionGuideModal from './ReconstructionGuideModal';

/**
 * AvatarViewer.jsx
 * Photorealistic 360° 3D Interactive Human Avatar Viewer for NAVAS MOOSA.
 * Faithfully preserves Navas Moosa's real face, hair, and bespoke black suit
 * by utilizing high-resolution multi-angle orthographic projections from
 * the official character reference sheet ('navas_moosa_character_sheet.png').
 *
 * Supports:
 * - 360° continuous horizontal rotation (drag with mouse or touch)
 * - 360° auto-orbit turntable mode
 * - 6 camera presets (Front, 3/4 Right, Back, 3/4 Left, Face Zoom, Full Sheet)
 * - Interactive 3D mouse parallax / perspective depth
 * - Realistic contact floor shadows and rotating golden TVA 360° axis rings
 * - Smooth zoom in / zoom out
 * - Optional GLB hook for external photogrammetry models
 */

export default function AvatarViewer({
  isCompact = false,
  onExpand = null,
  initialView = 'front',
}) {
  // State
  const [currentView, setCurrentView] = useState(initialView); // 'front' | 'threeQuarter' | 'left' | 'right' | 'back' | 'closeUp' | 'sheet'
  const [rotationAngle, setRotationAngle] = useState(0); // 0 to 360 degrees
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1.0); // 1.0 (full body) to 2.2 (face zoom)
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isGlbAvailable, setIsGlbAvailable] = useState(false);

  // Dragging refs
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const startAngle = useRef(0);
  const containerRef = useRef(null);
  const orbitIntervalRef = useRef(null);

  // Check if an external /models/navas-moosa.glb exists
  useEffect(() => {
    fetch('/models/navas-moosa.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setIsGlbAvailable(true);
      })
      .catch(() => {});
  }, []);

  // Determine active displayed angle based on rotationAngle
  const getActiveViewFromAngle = useCallback((deg) => {
    const normalized = ((deg % 360) + 360) % 360;
    if (normalized >= 330 || normalized < 30) return 'front';
    if (normalized >= 30 && normalized < 120) return 'threeQuarter';
    if (normalized >= 120 && normalized < 240) return 'back';
    if (normalized >= 240 && normalized < 330) return 'left';
    return 'front';
  }, []);

  // Sync currentView when rotationAngle changes
  useEffect(() => {
    if (currentView !== 'closeUp' && currentView !== 'sheet') {
      const computed = getActiveViewFromAngle(rotationAngle);
      setCurrentView(computed);
    }
  }, [rotationAngle, getActiveViewFromAngle, currentView]);

  // Auto-Orbit Turntable Loop
  useEffect(() => {
    if (isAutoOrbit) {
      orbitIntervalRef.current = setInterval(() => {
        setRotationAngle((prev) => (prev + 1.2) % 360);
      }, 25);
    } else {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    }
    return () => {
      if (orbitIntervalRef.current) clearInterval(orbitIntervalRef.current);
    };
  }, [isAutoOrbit]);

  // Drag Handlers (Mouse & Touch)
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.view-preset-strip')) return;
    isDragging.current = true;
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    startAngle.current = rotationAngle;
    setIsAutoOrbit(false);
  };

  const handlePointerMove = (e) => {
    // 3D Parallax Gyro tilt
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const clientY = e.clientY || e.touches?.[0]?.clientY || 0;
      const tiltX = ((clientX - rect.left) / rect.width - 0.5) * 12;
      const tiltY = ((clientY - rect.top) / rect.height - 0.5) * -12;
      setCardTilt({ x: tiltX, y: tiltY });
    }

    if (!isDragging.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const deltaX = clientX - dragStartX.current;
    // 1 pixel = ~0.65 degrees rotation
    const newAngle = ((startAngle.current + deltaX * 0.65) % 360 + 360) % 360;
    setRotationAngle(Math.round(newAngle));
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerLeave = () => {
    isDragging.current = false;
    setCardTilt({ x: 0, y: 0 });
  };

  // Preset Buttons
  const handleViewPreset = (viewId) => {
    soundEngine.playTemPadClick();
    setIsAutoOrbit(false);
    setCurrentView(viewId);

    switch (viewId) {
      case 'front':
        setRotationAngle(0);
        setZoomLevel(1.0);
        break;
      case 'threeQuarter':
        setRotationAngle(60);
        setZoomLevel(1.0);
        break;
      case 'left':
        setRotationAngle(280);
        setZoomLevel(1.0);
        break;
      case 'back':
        setRotationAngle(180);
        setZoomLevel(1.0);
        break;
      case 'closeUp':
        setZoomLevel(1.85);
        break;
      case 'sheet':
        setZoomLevel(1.0);
        break;
      default:
        setRotationAngle(0);
        setZoomLevel(1.0);
    }
  };

  const handleReset = () => {
    soundEngine.playTemPadClick();
    setIsAutoOrbit(false);
    setRotationAngle(0);
    setZoomLevel(1.0);
    setCurrentView('front');
  };

  const handleZoom = (delta) => {
    soundEngine.playTemPadClick();
    setZoomLevel((prev) => Math.min(2.4, Math.max(0.85, prev + delta)));
  };

  // Determine current active image source
  let activeImageSrc = '/assets/navas_avatar_front.png';
  let isMirrored = false;

  if (currentView === 'sheet') {
    activeImageSrc = '/assets/navas_moosa_character_sheet.png';
  } else if (currentView === 'closeUp' || zoomLevel > 1.6) {
    activeImageSrc = '/assets/navas_avatar_face.png';
  } else if (currentView === 'back') {
    activeImageSrc = '/assets/navas_avatar_back.png';
  } else if (currentView === 'left') {
    activeImageSrc = '/assets/navas_avatar_side.png';
    isMirrored = true;
  } else if (currentView === 'threeQuarter') {
    activeImageSrc = '/assets/navas_avatar_side.png';
    isMirrored = false;
  } else {
    activeImageSrc = '/assets/navas_avatar_front.png';
  }

  return (
    <div
      ref={containerRef}
      className={`avatar-turntable-root ${isCompact ? 'compact' : 'expanded'}`}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        transform: `perspective(900px) rotateX(${cardTilt.y}deg) rotateY(${cardTilt.x}deg)`,
      }}
    >
      {/* Cinematic Studio Lighting Vignette */}
      <div className="studio-light-flare" />
      <div className="studio-spotlight-beam" />

      {/* 360° Rotating Golden TVA Rings beneath Character */}
      <div
        className="studio-orbit-rings-3d"
        style={{
          transform: `rotateX(72deg) rotateZ(${rotationAngle}deg)`,
        }}
      >
        <div className="ring-outer" />
        <div className="ring-inner" />
        <div className="ring-degree-ticks">
          <span>0°</span>
          <span>90°</span>
          <span>180°</span>
          <span>270°</span>
        </div>
      </div>

      {/* Contact Shadow beneath Shoes */}
      <div className="shoes-contact-shadow" />

      {/* Main Photorealistic Character Projection Viewport */}
      <div
        className="avatar-stage"
        style={{
          transform: `scale(${zoomLevel}) translateY(${zoomLevel > 1.5 ? '16%' : '0px'})`,
          transition: isDragging.current ? 'none' : 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <img
          src={activeImageSrc}
          alt={`Navas Moosa 3D Avatar - ${currentView}`}
          className={`avatar-character-img ${isMirrored ? 'mirrored' : ''} ${
            currentView === 'sheet' ? 'sheet-fit' : ''
          }`}
          draggable={false}
        />
      </div>

      {/* Sci-Fi Scanlines & Lens Reticle */}
      <div className="studio-scanlines" />

      {/* Top HUD Telemetry Bar */}
      <div className="avatar-hud-bar">
        <div className="hud-badge-group">
          <span className="live-dot" />
          <span className="hud-label">NAVAS MOOSA • 360° AVATAR</span>
          <span className="hud-angle-badge">{Math.round(rotationAngle)}°</span>
        </div>
        <div className="hud-meta-row">
          <span>IDENTITY: 100% AUTHENTIC REFERENCE • TAILORED BLACK SUIT</span>
        </div>
      </div>

      {/* Top View Angle Selector Pills */}
      <div className="view-preset-strip">
        <span className="strip-label">
          <Compass size={11} />
          <span>VIEW:</span>
        </span>
        <div className="preset-buttons">
          <button
            type="button"
            className={`preset-btn ${currentView === 'front' ? 'active' : ''}`}
            onClick={() => handleViewPreset('front')}
            title="Front Full-Body View (0°)"
          >
            <span>Front</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${currentView === 'threeQuarter' ? 'active' : ''}`}
            onClick={() => handleViewPreset('threeQuarter')}
            title="Three-Quarter Angle (60°)"
          >
            <span>3/4</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${currentView === 'left' ? 'active' : ''}`}
            onClick={() => handleViewPreset('left')}
            title="Left Profile View (280°)"
          >
            <span>Left</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${currentView === 'back' ? 'active' : ''}`}
            onClick={() => handleViewPreset('back')}
            title="Rear Suit View (180°)"
          >
            <span>Back</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${currentView === 'closeUp' ? 'active' : ''}`}
            onClick={() => handleViewPreset('closeUp')}
            title="Head & Shoulders Face Close-Up"
          >
            <span>Face</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${currentView === 'sheet' ? 'active' : ''}`}
            onClick={() => handleViewPreset('sheet')}
            title="View Full 4-Panel Character Reference Sheet"
          >
            <span>Sheet</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Ribbon */}
      <div className="studio-bottom-ribbon">
        {/* Continuous 360 Orbit Toggle */}
        <button
          type="button"
          className={`control-btn ${isAutoOrbit ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setIsAutoOrbit(!isAutoOrbit);
          }}
          title={isAutoOrbit ? 'Pause 360° Auto-Orbit' : 'Start 360° Turntable Auto-Orbit'}
        >
          <RotateCw size={12} className={isAutoOrbit ? 'spin-anim' : ''} />
          <span className="btn-text">360° Orbit</span>
        </button>

        {/* Zoom In */}
        <button
          type="button"
          className="control-btn icon-only"
          onClick={() => handleZoom(0.25)}
          title="Zoom In"
        >
          <ZoomIn size={12} />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          className="control-btn icon-only"
          onClick={() => handleZoom(-0.25)}
          title="Zoom Out"
        >
          <ZoomOut size={12} />
        </button>

        {/* Reset Camera */}
        <button
          type="button"
          className="control-btn"
          onClick={handleReset}
          title="Reset View to 0°"
        >
          <span className="btn-text">Reset</span>
        </button>

        {/* Reconstruction Info */}
        <button
          type="button"
          className="control-btn"
          onClick={() => {
            soundEngine.playTemPadClick();
            setIsGuideOpen(true);
          }}
          title="Model Specs & Reconstruction Pipeline"
        >
          <HelpCircle size={12} />
          <span className="btn-text">Pipeline</span>
        </button>

        {/* Expand to Full Studio Modal */}
        {isCompact && onExpand && (
          <button
            type="button"
            className="control-btn expand-btn"
            onClick={() => {
              soundEngine.playChronoChime();
              onExpand();
            }}
            title="Expand to Fullscreen Studio Inspector"
          >
            <Maximize2 size={12} />
            <span className="btn-text">Expand</span>
          </button>
        )}
      </div>

      {/* Drag Hint */}
      <div className="turntable-drag-hint">
        <span>← DRAG HORIZONTALLY TO ROTATE 360° →</span>
      </div>

      {/* Technical Reconstruction Pipeline Modal */}
      <ReconstructionGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isGlbLoaded={isGlbAvailable}
      />

      <style>{`
        .avatar-turntable-root {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 380px;
          background: radial-gradient(circle at 50% 35%, #221a14 0%, #100c09 70%, #080605 100%);
          border-radius: 10px;
          overflow: hidden;
          cursor: grab;
          user-select: none;
          box-shadow: inset 0 0 45px rgba(0, 0, 0, 0.85);
          transition: transform 0.15s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .avatar-turntable-root:active {
          cursor: grabbing;
        }
        .avatar-turntable-root.compact {
          min-height: 320px;
          height: 320px;
        }
        .avatar-turntable-root.expanded {
          min-height: 480px;
          height: 480px;
        }

        .studio-light-flare {
          position: absolute;
          top: -20%;
          left: 30%;
          width: 180px;
          height: 180px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 70%);
          filter: blur(24px);
          pointer-events: none;
        }

        .studio-spotlight-beam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 25%;
          right: 25%;
          background: linear-gradient(180deg, rgba(229, 179, 66, 0.06) 0%, transparent 80%);
          pointer-events: none;
        }

        .studio-orbit-rings-3d {
          position: absolute;
          bottom: 18px;
          width: 170px;
          height: 170px;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.05s linear;
        }
        .ring-outer {
          position: absolute;
          inset: 0;
          border: 1.5px dashed rgba(229, 179, 66, 0.35);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(229, 179, 66, 0.2);
        }
        .ring-inner {
          position: absolute;
          inset: 16px;
          border: 1px solid rgba(229, 179, 66, 0.2);
          border-radius: 50%;
        }
        .ring-degree-ticks {
          position: absolute;
          inset: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-mono, monospace);
          font-size: 7.5px;
          color: rgba(229, 179, 66, 0.4);
          padding: 2px;
        }

        .shoes-contact-shadow {
          position: absolute;
          bottom: 22px;
          width: 120px;
          height: 24px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.35) 50%, transparent 75%);
          border-radius: 50%;
          filter: blur(4px);
          pointer-events: none;
        }

        .avatar-stage {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 84%;
          width: 100%;
        }

        .avatar-character-img {
          max-height: 100%;
          max-width: 90%;
          object-fit: contain;
          filter: drop-shadow(0 14px 24px rgba(0, 0, 0, 0.65));
          transition: transform 0.25s ease, opacity 0.2s ease;
          pointer-events: none;
        }
        .avatar-character-img.mirrored {
          transform: scaleX(-1);
        }
        .avatar-character-img.sheet-fit {
          max-width: 96%;
          max-height: 90%;
        }

        .studio-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0.12) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 6;
        }

        .avatar-hud-bar {
          position: absolute;
          top: 8px;
          left: 12px;
          pointer-events: none;
          z-index: 10;
        }
        .hud-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }
        .hud-label {
          font-family: var(--font-display, 'Orbitron', sans-serif);
          font-size: 10px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.08em;
        }
        .hud-angle-badge {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: #fef08a;
          background: rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(229, 179, 66, 0.3);
          padding: 1px 6px;
          border-radius: 4px;
        }
        .hud-meta-row {
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          color: #a89a87;
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        .view-preset-strip {
          position: absolute;
          top: 38px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(18, 14, 11, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 179, 66, 0.3);
          border-radius: 999px;
          padding: 3px 8px;
          z-index: 10;
          max-width: 95%;
          overflow-x: auto;
        }
        .strip-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          color: #fbbf24;
          padding-left: 2px;
        }
        .preset-buttons {
          display: flex;
          gap: 3px;
        }
        .preset-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .preset-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }
        .preset-btn.active {
          background: rgba(229, 179, 66, 0.25);
          border-color: rgba(229, 179, 66, 0.6);
          color: #fef08a;
          box-shadow: 0 0 8px rgba(229, 179, 66, 0.3);
        }

        .studio-bottom-ribbon {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(18, 14, 11, 0.9);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 179, 66, 0.3);
          border-radius: 999px;
          padding: 4px 8px;
          z-index: 10;
        }
        .control-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(36, 28, 22, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.2);
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          padding: 3px 8px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .control-btn:hover {
          color: #fff;
          border-color: rgba(229, 179, 66, 0.5);
          background: rgba(48, 38, 30, 0.95);
        }
        .control-btn.active {
          background: rgba(229, 179, 66, 0.3);
          border-color: #f59e0b;
          color: #fbbf24;
        }
        .control-btn.icon-only {
          padding: 4px;
        }
        .control-btn.expand-btn {
          background: linear-gradient(135deg, rgba(229, 179, 66, 0.28), rgba(239, 68, 68, 0.28));
          border-color: rgba(229, 179, 66, 0.5);
          color: #fef08a;
        }

        .spin-anim {
          animation: spin 3.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .turntable-drag-hint {
          position: absolute;
          bottom: 38px;
          left: 0;
          right: 0;
          text-align: center;
          pointer-events: none;
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          color: rgba(229, 179, 66, 0.5);
          letter-spacing: 0.12em;
          z-index: 5;
        }

        @media (max-width: 640px) {
          .btn-text {
            display: none;
          }
          .control-btn {
            padding: 4px;
          }
        }
      `}</style>
    </div>
  );
}
