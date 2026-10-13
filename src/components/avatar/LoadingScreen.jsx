import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen({ progress = 100, isLoaded = false }) {
  if (isLoaded) return null;

  return (
    <div className="avatar-loading-overlay">
      <div className="loading-card">
        <div className="loading-spinner-wrap">
          <Loader2 className="animate-spin text-amber-400" size={32} />
        </div>
        <div className="loading-title">INITIALIZING 3D AVATAR</div>
        <div className="loading-desc">
          Building Navas Moosa 3D Model • Applying Real Face & Suit Textures
        </div>
        <div className="loading-bar-track">
          <div
            className="loading-bar-fill"
            style={{ width: `${Math.min(100, Math.max(15, progress))}%` }}
          />
        </div>
        <div className="loading-percent">{Math.round(progress)}% READY</div>
      </div>

      <style>{`
        .avatar-loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(18, 15, 12, 0.88);
          backdrop-filter: blur(8px);
          z-index: 40;
          border-radius: inherit;
        }
        .loading-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 24px 32px;
          background: rgba(26, 20, 16, 0.95);
          border: 1px solid rgba(229, 179, 66, 0.35);
          border-radius: 12px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
          max-width: 320px;
        }
        .loading-spinner-wrap {
          margin-bottom: 12px;
        }
        .loading-title {
          font-family: var(--font-display, 'Orbitron', sans-serif);
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.12em;
          margin-bottom: 6px;
        }
        .loading-desc {
          font-size: 11px;
          color: #d6c7b2;
          line-height: 1.4;
          margin-bottom: 14px;
        }
        .loading-bar-track {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        .loading-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f59e0b, #ef4444);
          transition: width 0.3s ease;
        }
        .loading-percent {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
}
