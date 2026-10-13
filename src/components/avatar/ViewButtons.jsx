import React from 'react';
import {
  RotateCw,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  HelpCircle,
  Sun,
  Eye,
  Layers,
} from 'lucide-react';
import { soundEngine } from '../../utils/SoundEffects';

export default function ViewButtons({
  currentView,
  onViewSelect,
  autoRotate,
  onToggleAutoRotate,
  onResetCamera,
  onZoomIn,
  onZoomOut,
  onOpenGuide,
  isCompact = false,
  onExpand,
}) {
  const views = [
    { id: 'front', label: 'Front', tip: 'Default Full-Body Front View (0°)' },
    { id: 'threeQuarter', label: '3/4', tip: 'Three-Quarter Angle (45°)' },
    { id: 'left', label: 'Left', tip: 'Left Profile View (90°)' },
    { id: 'right', label: 'Right', tip: 'Right Profile View (-90°)' },
    { id: 'back', label: 'Back', tip: 'Rear Suit View (180°)' },
    { id: 'closeUp', label: 'Face', tip: 'Face & Hair Portrait Zoom' },
  ];

  const handleSelect = (viewId) => {
    soundEngine.playTemPadClick();
    onViewSelect(viewId);
  };

  return (
    <div className={`avatar-controls-panel ${isCompact ? 'compact' : ''}`}>
      {/* Top Floating View Angle Pills */}
      <div className="view-preset-strip">
        <span className="strip-label">
          <Compass size={11} />
          <span>VIEW:</span>
        </span>
        <div className="preset-buttons">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              className={`preset-btn ${currentView === v.id ? 'active' : ''}`}
              onClick={() => handleSelect(v.id)}
              title={v.tip}
            >
              <span>{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Ribbon */}
      <div className="quick-action-ribbon">
        {/* Auto Rotate Toggle */}
        <button
          type="button"
          className={`action-btn ${autoRotate ? 'active' : ''}`}
          onClick={() => {
            soundEngine.playTemPadClick();
            onToggleAutoRotate();
          }}
          title={autoRotate ? 'Stop 360° Auto-Rotation' : 'Start 360° Continuous Auto-Rotation'}
        >
          <RotateCw size={13} className={autoRotate ? 'spin-slow' : ''} />
          <span className="btn-text">360° Orbit</span>
        </button>

        {/* Zoom In */}
        {onZoomIn && (
          <button
            type="button"
            className="action-btn icon-only"
            onClick={() => {
              soundEngine.playTemPadClick();
              onZoomIn();
            }}
            title="Zoom In"
          >
            <ZoomIn size={13} />
          </button>
        )}

        {/* Zoom Out */}
        {onZoomOut && (
          <button
            type="button"
            className="action-btn icon-only"
            onClick={() => {
              soundEngine.playTemPadClick();
              onZoomOut();
            }}
            title="Zoom Out"
          >
            <ZoomOut size={13} />
          </button>
        )}

        {/* Reset View */}
        <button
          type="button"
          className="action-btn"
          onClick={() => {
            soundEngine.playTemPadClick();
            onResetCamera();
          }}
          title="Reset Camera Framing"
        >
          <span className="btn-text">Reset</span>
        </button>

        {/* Pipeline Info Guide */}
        {onOpenGuide && (
          <button
            type="button"
            className="action-btn"
            onClick={() => {
              soundEngine.playTemPadClick();
              onOpenGuide();
            }}
            title="View 3D Model Pipeline & Reconstruction Details"
          >
            <HelpCircle size={13} />
            <span className="btn-text">Model Info</span>
          </button>
        )}

        {/* Expand to Fullscreen Modal */}
        {isCompact && onExpand && (
          <button
            type="button"
            className="action-btn expand-btn"
            onClick={() => {
              soundEngine.playChronoChime();
              onExpand();
            }}
            title="Expand Full 360° Studio Modal"
          >
            <Maximize2 size={13} />
            <span className="btn-text">Full 3D Studio</span>
          </button>
        )}
      </div>

      <style>{`
        .avatar-controls-panel {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 12px;
          z-index: 10;
        }
        .avatar-controls-panel.compact {
          padding: 8px;
        }

        .view-preset-strip {
          pointer-events: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(18, 14, 11, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 179, 66, 0.3);
          border-radius: 999px;
          padding: 4px 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
          align-self: center;
          max-width: 95%;
          overflow-x: auto;
        }
        .strip-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 9.5px;
          color: #fbbf24;
          letter-spacing: 0.08em;
          padding-left: 4px;
        }
        .preset-buttons {
          display: flex;
          gap: 4px;
        }
        .preset-btn {
          background: transparent;
          border: 1px solid transparent;
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .preset-btn:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }
        .preset-btn.active {
          background: rgba(229, 179, 66, 0.25);
          border-color: rgba(229, 179, 66, 0.6);
          color: #fef08a;
          box-shadow: 0 0 10px rgba(229, 179, 66, 0.3);
        }

        .quick-action-ribbon {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: rgba(18, 14, 11, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 999px;
          padding: 5px 10px;
          align-self: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(36, 28, 22, 0.8);
          border: 1px solid rgba(229, 179, 66, 0.2);
          color: #d6c7b2;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          padding: 4px 9px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          color: #fff;
          border-color: rgba(229, 179, 66, 0.5);
          background: rgba(48, 38, 30, 0.95);
        }
        .action-btn.active {
          background: rgba(229, 179, 66, 0.3);
          border-color: #f59e0b;
          color: #fbbf24;
        }
        .action-btn.icon-only {
          padding: 5px;
        }
        .action-btn.expand-btn {
          background: linear-gradient(135deg, rgba(229, 179, 66, 0.3), rgba(239, 68, 68, 0.3));
          border-color: rgba(229, 179, 66, 0.5);
          color: #fef08a;
        }
        .action-btn.expand-btn:hover {
          background: linear-gradient(135deg, rgba(229, 179, 66, 0.45), rgba(239, 68, 68, 0.45));
        }

        .spin-slow {
          animation: spin 4s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .btn-text {
            display: none;
          }
          .action-btn {
            padding: 5px;
          }
        }
      `}</style>
    </div>
  );
}
