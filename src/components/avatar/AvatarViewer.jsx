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
  MousePointer,
  Crosshair,
  Image as ImageIcon,
  User,
} from 'lucide-react';
import { soundEngine } from '../../utils/SoundEffects';
import ReconstructionGuideModal from './ReconstructionGuideModal';

/**
 * AvatarViewer.jsx
 * Photorealistic 360° 3D Interactive Human Avatar & Character Sheet Viewer for NAVAS MOOSA.
 * Supports:
 * - Real-time 360° mouse-point rotation (character or sheet rotates continuously as mouse moves)
 * - 360° click-and-drag orbit
 * - 360° auto-orbit turntable
 * - Dual Mode: 'avatar' (isolated model from character sheet) & 'sheet' (navas_moosa_character_sheet.png in 3D)
 * - 3D perspective depth, contact shadows, rotating golden TVA compass rings, and cardinal HUD
 * - 8 directional camera presets (0° Front, 45° 3/4, 90° Right, 135° Rear-Right, 180° Rear, 225° Rear-Left, 270° Left, 315° Front-Left)
 */

export default function AvatarViewer({
  isCompact = false,
  onExpand = null,
  initialView = 'front',
  initialSource = 'avatar', // 'avatar' | 'sheet' | 'face'
}) {
  // Display Mode: 'avatar' | 'sheet' | 'face'
  const [displaySource, setDisplaySource] = useState(
    initialSource === 'sheet' || initialView === 'sheet' ? 'sheet' : 'avatar'
  );

  // Rotation angle: 0 to 360 degrees
  const [rotationAngle, setRotationAngle] = useState(0);

  // Tracking Mode: 'pointer' (mouse points in 360° circle) | 'drag' (click and drag) | 'auto' (continuous spin)
  const [trackingMode, setTrackingMode] = useState('pointer');
  const [isAutoOrbit, setIsAutoOrbit] = useState(false);

  // Camera & Perspective
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [pointerCoords, setPointerCoords] = useState({ x: 0, y: 0, active: false });

  // Modals & Hooks
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

  // Sync displaySource if initialSource changes
  useEffect(() => {
    if (initialSource) {
      setDisplaySource(initialSource);
    }
  }, [initialSource]);

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

  // Pointer Handlers (Mouse & Touch)
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.view-preset-strip') || e.target.closest('.studio-bottom-ribbon')) {
      return;
    }
    isDragging.current = true;
    dragStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    startAngle.current = rotationAngle;
    setIsAutoOrbit(false);
  };

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const isInside =
      relX >= 0 && relX <= rect.width && relY >= 0 && relY <= rect.height;

    if (!isInside && !isDragging.current) {
      setPointerCoords((prev) => ({ ...prev, active: false }));
      setCardTilt({ x: 0, y: 0 });
      return;
    }

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dx = relX - centerX;
    const dy = relY - centerY;

    // 3D Parallax Gyro tilt
    const tiltX = Math.max(-10, Math.min(10, (dx / centerX) * 8));
    const tiltY = Math.max(-10, Math.min(10, (dy / centerY) * -8));
    setCardTilt({ x: tiltX, y: tiltY });

    setPointerCoords({ x: relX, y: relY, active: true });

    // 1. Dragging Mode (Active when mouse button is held down)
    if (isDragging.current) {
      const deltaX = clientX - dragStartX.current;
      const newAngle = ((startAngle.current + deltaX * 0.75) % 360 + 360) % 360;
      setRotationAngle(Math.round(newAngle));
      return;
    }

    // 2. Mouse-Point 360° Rotation Mode:
    // Calculates radial angle from viewport center to cursor:
    // Top (12 o'clock) = 0° (Front), Right (3 o'clock) = 90° (Right),
    // Bottom (6 o'clock) = 180° (Back), Left (9 o'clock) = 270° (Left)
    if (trackingMode === 'pointer' && !isAutoOrbit) {
      const rad = Math.atan2(dx, -dy);
      const deg = ((rad * 180) / Math.PI + 360) % 360;
      setRotationAngle(Math.round(deg));
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handlePointerLeave = () => {
    isDragging.current = false;
    setPointerCoords((prev) => ({ ...prev, active: false }));
    setCardTilt({ x: 0, y: 0 });
  };

  // Preset Navigation
  const handleViewPreset = (angle, source = 'avatar') => {
    soundEngine.playTemPadClick();
    setIsAutoOrbit(false);
    setDisplaySource(source);
    setRotationAngle(angle);
    if (source === 'face') {
      setZoomLevel(1.85);
    } else {
      setZoomLevel(1.0);
    }
  };

  const handleReset = () => {
    soundEngine.playTemPadClick();
    setIsAutoOrbit(false);
    setRotationAngle(0);
    setZoomLevel(1.0);
    setDisplaySource('avatar');
  };

  const handleZoom = (delta) => {
    soundEngine.playTemPadClick();
    setZoomLevel((prev) => Math.min(2.4, Math.max(0.85, prev + delta)));
  };

  // Determine Active Angle, Direction & 3D Sub-Angle
  const deg = ((rotationAngle % 360) + 360) % 360;

  // Cardinal Direction Label
  const getDirectionInfo = (angle) => {
    const a = ((angle % 360) + 360) % 360;
    if (a >= 337.5 || a < 22.5) return { name: 'FRONT', code: 'N • 0°', view: 'front' };
    if (a >= 22.5 && a < 67.5) return { name: 'FRONT-RIGHT (3/4)', code: 'NE • 45°', view: 'threeQuarter' };
    if (a >= 67.5 && a < 112.5) return { name: 'RIGHT PROFILE', code: 'E • 90°', view: 'right' };
    if (a >= 112.5 && a < 157.5) return { name: 'REAR-RIGHT (3/4)', code: 'SE • 135°', view: 'rearRight' };
    if (a >= 157.5 && a < 202.5) return { name: 'REAR / BACK', code: 'S • 180°', view: 'back' };
    if (a >= 202.5 && a < 247.5) return { name: 'REAR-LEFT (3/4)', code: 'SW • 225°', view: 'rearLeft' };
    if (a >= 247.5 && a < 292.5) return { name: 'LEFT PROFILE', code: 'W • 270°', view: 'left' };
    return { name: 'FRONT-LEFT (3/4)', code: 'NW • 315°', view: 'frontLeft' };
  };

  const dirInfo = getDirectionInfo(deg);

  // Determine Active Character Image & Sub-Angle Tilt
  let activeImageSrc = '/assets/navas_avatar_front.png';
  let isMirrored = false;
  let subAngle = 0;

  if (displaySource === 'face' || zoomLevel > 1.6) {
    activeImageSrc = '/assets/navas_avatar_face.png';
    subAngle = (deg > 180 ? deg - 360 : deg) * 0.35;
  } else if (deg >= 337.5 || deg < 22.5) {
    activeImageSrc = '/assets/navas_avatar_front.png';
    subAngle = deg > 180 ? deg - 360 : deg;
    isMirrored = false;
  } else if (deg >= 22.5 && deg < 67.5) {
    activeImageSrc = '/assets/navas_avatar_side.png';
    subAngle = deg - 45;
    isMirrored = false;
  } else if (deg >= 67.5 && deg < 112.5) {
    activeImageSrc = '/assets/navas_avatar_side.png';
    subAngle = deg - 90;
    isMirrored = false;
  } else if (deg >= 112.5 && deg < 157.5) {
    activeImageSrc = '/assets/navas_avatar_back.png';
    subAngle = deg - 135;
    isMirrored = true;
  } else if (deg >= 157.5 && deg < 202.5) {
    activeImageSrc = '/assets/navas_avatar_back.png';
    subAngle = deg - 180;
    isMirrored = false;
  } else if (deg >= 202.5 && deg < 247.5) {
    activeImageSrc = '/assets/navas_avatar_back.png';
    subAngle = deg - 225;
    isMirrored = false;
  } else if (deg >= 247.5 && deg < 292.5) {
    activeImageSrc = '/assets/navas_avatar_side.png';
    subAngle = deg - 270;
    isMirrored = true;
  } else {
    // 292.5 to 337.5
    activeImageSrc = '/assets/navas_avatar_side.png';
    subAngle = deg - 315;
    isMirrored = true;
  }

  // Contact shadow skew based on rotation
  const shadowSkew = Math.sin((deg * Math.PI) / 180) * 15;

  return (
    <div
      ref={containerRef}
      className={`avatar-turntable-root ${isCompact ? 'compact' : 'expanded'} ${
        trackingMode === 'pointer' ? 'pointer-tracking' : ''
      }`}
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
      {/* Cinematic Studio Lighting Flares */}
      <div className="studio-light-flare" />
      <div className="studio-spotlight-beam" />

      {/* Interactive Laser Reticle Beam (Points from center to mouse) */}
      {pointerCoords.active && trackingMode === 'pointer' && !isCompact && (
        <div
          className="pointer-reticle-beam"
          style={{
            transform: `rotate(${deg}deg)`,
          }}
        />
      )}

      {/* 360° Rotating Golden TVA Compass Rings on Floor */}
      <div
        className="studio-orbit-rings-3d"
        style={{
          transform: `rotateX(72deg) rotateZ(${rotationAngle}deg)`,
        }}
      >
        <div className="ring-outer" />
        <div className="ring-inner" />
        <div className="ring-needle" />
        <div className="ring-degree-ticks">
          <span className="tick-n">0° N</span>
          <span className="tick-e">90° E</span>
          <span className="tick-s">180° S</span>
          <span className="tick-w">270° W</span>
        </div>
      </div>

      {/* Dynamic Floor Contact Shadow */}
      <div
        className="shoes-contact-shadow"
        style={{
          transform: `scale(${zoomLevel}) skewX(${shadowSkew}deg)`,
        }}
      />

      {/* ========================================================
          360° MAIN PROJECTION VIEWPORT
      ======================================================== */}
      <div
        className="avatar-stage"
        style={{
          transform: `scale(${zoomLevel}) translateY(${
            displaySource === 'face' || zoomLevel > 1.5 ? '16%' : '0px'
          })`,
          transition: isDragging.current ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {displaySource === 'sheet' ? (
          /* ========================================================
             MODE A: 360° ROTATING CHARACTER SHEET (navas_moosa_character_sheet.png)
          ======================================================== */
          <div
            className="sheet-3d-turntable"
            style={{
              transform: `perspective(1100px) rotateY(${rotationAngle}deg)`,
            }}
          >
            {/* Front Face: High-Resolution 4-View Character Sheet */}
            <div className="sheet-card-face sheet-front">
              <div className="sheet-hologram-glow" />
              <img
                src="/assets/navas_moosa_character_sheet.png"
                alt="Navas Moosa 4-View Character Reference Sheet"
                className="sheet-hero-img"
                draggable={false}
              />
              <div className="sheet-badge-overlay">
                <span>navas_moosa_character_sheet.png • 360° 3D ORBIT</span>
              </div>
            </div>

            {/* Back Face: TVA Schematics Wireframe Hologram */}
            <div className="sheet-card-face sheet-back">
              <div className="sheet-back-content">
                <div className="back-tva-seal" />
                <h4 className="back-title">TVA VARIANT CHARACTER DOSSIER</h4>
                <p className="back-sub">CANONICAL TIMELINE SPECIFICATION // KOZHIKODE, KERALA</p>
                <div className="back-meta-grid">
                  <div>
                    <label>SUBJECT:</label> <span>NAVAS MOOSA K P</span>
                  </div>
                  <div>
                    <label>OUTFIT:</label> <span>OBSIDIAN BLACK BESPOKE SUIT</span>
                  </div>
                  <div>
                    <label>VIEWS:</label> <span>FRONT • 3/4 PROFILE • REAR • PORTRAIT</span>
                  </div>
                  <div>
                    <label>ASSET SOURCE:</label> <span>navas_moosa_character_sheet.png</span>
                  </div>
                </div>
                <div className="back-status-pill">AUTHENTIC REAL-TIME 360° ASSET</div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             MODE B: 360° CHARACTER AVATAR (ISOLATED MODEL)
          ======================================================== */
          <div
            className="character-3d-container"
            style={{
              transform: `perspective(1000px) rotateY(${subAngle * 0.75}deg)`,
              transition: isDragging.current ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <img
              src={activeImageSrc}
              alt={`Navas Moosa 3D Avatar - ${dirInfo.name}`}
              className={`avatar-character-img ${isMirrored ? 'mirrored' : ''}`}
              draggable={false}
            />
          </div>
        )}
      </div>

      {/* Futuristic CRT Scanlines */}
      <div className="studio-scanlines" />

      {/* Top HUD Telemetry Bar */}
      <div className="avatar-hud-bar">
        <div className="hud-badge-group">
          <span className="live-dot" />
          <span className="hud-label">
            {displaySource === 'sheet'
              ? 'CHARACTER SHEET // 360° ROTATION'
              : 'NAVAS MOOSA // 360° 3D AVATAR'}
          </span>
          <span className="hud-angle-badge">{Math.round(deg)}°</span>
          <span className="hud-direction-badge">{dirInfo.code}</span>
        </div>
        <div className="hud-meta-row">
          <span>{dirInfo.name}</span>
          <span className="meta-sep">•</span>
          <span className="text-amber-400">
            {trackingMode === 'pointer' && !isAutoOrbit
              ? 'MOUSE-POINT ROTATING 360°'
              : isAutoOrbit
              ? '360° AUTO-TURNTABLE'
              : 'CLICK & DRAG TO ORBIT'}
          </span>
        </div>
      </div>

      {/* Primary View Source Tabs (Model vs Character Sheet) */}
      <div className="view-mode-selector-strip">
        <button
          type="button"
          className={`mode-pill ${displaySource === 'avatar' ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setDisplaySource('avatar');
          }}
          title="Inspect 360° Isolated Character Model"
        >
          <User size={12} />
          <span>360° Character Model</span>
        </button>

        <button
          type="button"
          className={`mode-pill ${displaySource === 'sheet' ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setDisplaySource('sheet');
          }}
          title="Inspect navas_moosa_character_sheet.png in 3D 360° Rotation"
        >
          <ImageIcon size={12} />
          <span>360° Character Sheet</span>
        </button>

        <button
          type="button"
          className={`mode-pill ${displaySource === 'face' ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setDisplaySource('face');
            setZoomLevel(1.85);
          }}
          title="Face & Head Close-Up"
        >
          <Eye size={12} />
          <span>Face Close-Up</span>
        </button>
      </div>

      {/* 360° Cardinal Angle Presets (0°, 45°, 90°, 180°, 270°) */}
      <div className="view-preset-strip">
        <span className="strip-label">
          <Compass size={11} />
          <span>360° PRESETS:</span>
        </span>
        <div className="preset-buttons">
          <button
            type="button"
            className={`preset-btn ${deg >= 337.5 || deg < 22.5 ? 'active' : ''}`}
            onClick={() => handleViewPreset(0, displaySource)}
            title="Front (0°)"
          >
            <span>0° Front</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${deg >= 22.5 && deg < 67.5 ? 'active' : ''}`}
            onClick={() => handleViewPreset(45, displaySource)}
            title="Front-Right (45°)"
          >
            <span>45° 3/4</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${deg >= 67.5 && deg < 112.5 ? 'active' : ''}`}
            onClick={() => handleViewPreset(90, displaySource)}
            title="Right Profile (90°)"
          >
            <span>90° Side</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${deg >= 157.5 && deg < 202.5 ? 'active' : ''}`}
            onClick={() => handleViewPreset(180, displaySource)}
            title="Rear Suit View (180°)"
          >
            <span>180° Back</span>
          </button>
          <button
            type="button"
            className={`preset-btn ${deg >= 247.5 && deg < 292.5 ? 'active' : ''}`}
            onClick={() => handleViewPreset(270, displaySource)}
            title="Left Profile (270°)"
          >
            <span>270° Left</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Control Ribbon */}
      <div className="studio-bottom-ribbon">
        {/* Mouse Point 360 Follow Mode Toggle */}
        <button
          type="button"
          className={`control-btn ${trackingMode === 'pointer' && !isAutoOrbit ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setIsAutoOrbit(false);
            setTrackingMode(trackingMode === 'pointer' ? 'drag' : 'pointer');
          }}
          title={
            trackingMode === 'pointer'
              ? 'Mouse-point 360° rotation is ACTIVE (Move mouse around character)'
              : 'Click to enable Mouse-Point 360° Rotation'
          }
        >
          <MousePointer size={12} className={trackingMode === 'pointer' ? 'text-amber-400' : ''} />
          <span className="btn-text">
            {trackingMode === 'pointer' && !isAutoOrbit ? 'Pointer 360° ON' : 'Pointer 360°'}
          </span>
        </button>

        {/* 360° Auto-Orbit Turntable */}
        <button
          type="button"
          className={`control-btn ${isAutoOrbit ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            setIsAutoOrbit(!isAutoOrbit);
          }}
          title={isAutoOrbit ? 'Pause 360° Auto-Orbit' : 'Start 360° Turntable Auto-Orbit'}
        >
          <RotateCw size={12} className={isAutoOrbit ? 'spin-anim text-amber-400' : ''} />
          <span className="btn-text">360° Orbit</span>
        </button>

        {/* Zoom Controls */}
        <button
          type="button"
          className="control-btn icon-only"
          onClick={() => handleZoom(0.25)}
          title="Zoom In"
        >
          <ZoomIn size={12} />
        </button>

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

        {/* Pipeline Info */}
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
          <span className="btn-text">Specs</span>
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

      {/* Floating 360 Pointer Guide Hint */}
      <div className="turntable-drag-hint">
        {trackingMode === 'pointer' && !isAutoOrbit ? (
          <span>✦ MOVE MOUSE AROUND TO ROTATE 360° IN REAL TIME ✦</span>
        ) : (
          <span>← DRAG HORIZONTALLY TO ROTATE 360° →</span>
        )}
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
          min-height: 400px;
          background: radial-gradient(circle at 50% 35%, #241c15 0%, #110d0a 65%, #070504 100%);
          border-radius: 12px;
          overflow: hidden;
          cursor: crosshair;
          user-select: none;
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.9), 0 10px 30px rgba(0,0,0,0.5);
          transition: transform 0.15s ease-out;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-turntable-root.pointer-tracking {
          cursor: crosshair;
        }

        .avatar-turntable-root:active {
          cursor: grabbing;
        }

        .avatar-turntable-root.compact {
          min-height: 330px;
          height: 330px;
        }

        .avatar-turntable-root.expanded {
          min-height: 520px;
          height: 520px;
        }

        .studio-light-flare {
          position: absolute;
          top: -15%;
          left: 35%;
          width: 220px;
          height: 220px;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, transparent 70%);
          filter: blur(28px);
          pointer-events: none;
        }

        .studio-spotlight-beam {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 20%;
          right: 20%;
          background: linear-gradient(180deg, rgba(229, 179, 66, 0.08) 0%, transparent 80%);
          pointer-events: none;
        }

        /* Pointer Reticle Beam */
        .pointer-reticle-beam {
          position: absolute;
          bottom: 40px;
          left: 50%;
          width: 2px;
          height: 130px;
          background: linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.05) 100%);
          transform-origin: bottom center;
          pointer-events: none;
          z-index: 4;
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.6);
        }

        /* 3D Orbit Ring Turntable */
        .studio-orbit-rings-3d {
          position: absolute;
          bottom: 22px;
          width: 200px;
          height: 200px;
          pointer-events: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.04s linear;
          z-index: 3;
        }

        .ring-outer {
          position: absolute;
          inset: 0;
          border: 1.5px dashed rgba(229, 179, 66, 0.45);
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(229, 179, 66, 0.25);
        }

        .ring-inner {
          position: absolute;
          inset: 22px;
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 50%;
        }

        .ring-needle {
          position: absolute;
          top: 0;
          left: 50%;
          width: 4px;
          height: 18px;
          margin-left: -2px;
          background: #ffd868;
          border-radius: 2px;
          box-shadow: 0 0 10px #ffd868;
        }

        .ring-degree-ticks {
          position: absolute;
          inset: 0;
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          color: rgba(229, 179, 66, 0.6);
          pointer-events: none;
        }

        .tick-n { position: absolute; top: 4px; left: 50%; transform: translateX(-50%); font-weight: bold; color: #ffd868; }
        .tick-e { position: absolute; top: 50%; right: 4px; transform: translateY(-50%); }
        .tick-s { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); }
        .tick-w { position: absolute; top: 50%; left: 4px; transform: translateY(-50%); }

        .shoes-contact-shadow {
          position: absolute;
          bottom: 24px;
          width: 140px;
          height: 28px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 75%);
          border-radius: 50%;
          filter: blur(5px);
          pointer-events: none;
          z-index: 2;
          transition: transform 0.1s linear;
        }

        .avatar-stage {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 85%;
          width: 100%;
        }

        .character-3d-container {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
        }

        .avatar-character-img {
          max-height: 92%;
          max-width: 90%;
          object-fit: contain;
          filter: drop-shadow(0 16px 28px rgba(0, 0, 0, 0.75));
          pointer-events: none;
          transition: filter 0.2s ease;
        }

        .avatar-character-img.mirrored {
          transform: scaleX(-1);
        }

        /* 3D Rotating Character Sheet */
        .sheet-3d-turntable {
          position: relative;
          width: 90%;
          max-width: 580px;
          height: 380px;
          transform-style: preserve-3d;
          transition: transform 0.05s linear;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sheet-card-face {
          position: absolute;
          inset: 0;
          border-radius: 10px;
          border: 1.5px solid rgba(229, 179, 66, 0.45);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(229, 179, 66, 0.2);
          overflow: hidden;
          background: #0d0a08;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
        }

        .sheet-front {
          transform: rotateY(0deg);
        }

        .sheet-back {
          transform: rotateY(180deg);
          background: radial-gradient(circle at center, #1c1510 0%, #0d0907 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .sheet-hero-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          background: #0d0a08;
        }

        .sheet-badge-overlay {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(14, 10, 7, 0.85);
          border: 1px solid rgba(245, 158, 11, 0.4);
          color: #fde68a;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          backdrop-filter: blur(4px);
        }

        .sheet-back-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
          max-width: 440px;
        }

        .back-tva-seal {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 2px solid var(--tva-gold, #e5b342);
          background: radial-gradient(circle, #b45309 30%, #451a03 100%);
          box-shadow: 0 0 16px rgba(245, 158, 11, 0.5);
        }

        .back-title {
          font-family: var(--font-display, serif);
          font-size: 15px;
          font-weight: 700;
          color: #fef08a;
          letter-spacing: 1px;
          margin: 0;
        }

        .back-sub {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: #a89a8a;
          letter-spacing: 0.8px;
          margin: 0;
        }

        .back-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          width: 100%;
          margin: 6px 0;
          text-align: left;
          background: rgba(10, 8, 6, 0.65);
          padding: 10px;
          border-radius: 6px;
          border: 1px solid rgba(229, 179, 66, 0.2);
        }

        .back-meta-grid label {
          font-family: var(--font-mono, monospace);
          font-size: 8px;
          color: #fb923c;
          display: block;
        }

        .back-meta-grid span {
          font-family: var(--font-sans, sans-serif);
          font-size: 10px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .back-status-pill {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          font-weight: 700;
          color: #34d399;
          background: rgba(52, 211, 153, 0.15);
          padding: 3px 10px;
          border-radius: 4px;
          border: 1px solid rgba(52, 211, 153, 0.35);
        }

        .studio-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
          z-index: 6;
        }

        /* Top HUD Bar */
        .avatar-hud-bar {
          position: absolute;
          top: 10px;
          left: 14px;
          pointer-events: none;
          z-index: 10;
        }

        .hud-badge-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px #22c55e;
        }

        .hud-label {
          font-family: var(--font-display, 'Cinzel', serif);
          font-size: 10px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.08em;
        }

        .hud-angle-badge {
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 700;
          color: #fef08a;
          background: rgba(0, 0, 0, 0.7);
          border: 1px solid rgba(229, 179, 66, 0.4);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .hud-direction-badge {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.15);
          border: 1px solid rgba(56, 189, 248, 0.35);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .hud-meta-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          color: #a89a87;
          margin-top: 3px;
          letter-spacing: 0.05em;
        }

        .meta-sep {
          color: #786450;
        }

        /* Top Source Selector Strip (Model vs Sheet) */
        .view-mode-selector-strip {
          position: absolute;
          top: 38px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          background: rgba(18, 14, 11, 0.92);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(229, 179, 66, 0.35);
          border-radius: 999px;
          padding: 3px 6px;
          z-index: 10;
        }

        .mode-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: 1px solid transparent;
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mode-pill:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .mode-pill.active {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(180, 83, 9, 0.4));
          border-color: #f59e0b;
          color: #fef08a;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.35);
        }

        /* 360° Angle Presets Strip */
        .view-preset-strip {
          position: absolute;
          top: 72px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(18, 14, 11, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 999px;
          padding: 2px 7px;
          z-index: 10;
          max-width: 95%;
          overflow-x: auto;
        }

        .strip-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 8px;
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
          font-size: 9px;
          font-weight: 600;
          padding: 2px 6px;
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

        /* Bottom Floating Control Ribbon */
        .studio-bottom-ribbon {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(18, 14, 11, 0.92);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(229, 179, 66, 0.35);
          border-radius: 999px;
          padding: 4px 10px;
          z-index: 10;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        .control-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(36, 28, 22, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.22);
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          padding: 4px 9px;
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
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.3);
        }

        .control-btn.icon-only {
          padding: 5px;
        }

        .control-btn.expand-btn {
          background: linear-gradient(135deg, rgba(229, 179, 66, 0.3), rgba(239, 68, 68, 0.3));
          border-color: rgba(229, 179, 66, 0.55);
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
          bottom: 44px;
          left: 0;
          right: 0;
          text-align: center;
          pointer-events: none;
          font-family: var(--font-mono, monospace);
          font-size: 8.5px;
          color: rgba(245, 158, 11, 0.6);
          letter-spacing: 0.12em;
          z-index: 5;
        }

        @media (max-width: 640px) {
          .btn-text {
            display: none;
          }
          .control-btn {
            padding: 5px;
          }
          .view-preset-strip {
            display: none;
          }
          .view-mode-selector-strip {
            top: 42px;
          }
          .mode-pill {
            font-size: 8.5px;
            padding: 3px 6px;
          }
        }
      `}</style>
    </div>
  );
}
