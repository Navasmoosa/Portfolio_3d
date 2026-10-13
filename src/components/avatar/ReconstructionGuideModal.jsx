import React from 'react';
import {
  X,
  FileCode,
  Layers,
  Sparkles,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../../utils/SoundEffects';

export default function ReconstructionGuideModal({
  isOpen,
  onClose,
  isGlbLoaded,
  onGlbFileUploaded,
}) {
  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      soundEngine.playChronoChime();
      if (onGlbFileUploaded) {
        onGlbFileUploaded(file);
      }
    }
  };

  return (
    <div className="guide-modal-backdrop" onClick={onClose}>
      <div className="guide-modal-window tva-panel animate-scaleUp" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="guide-header">
          <div className="guide-title-wrap">
            <span className="card-badge crt-badge">TECHNICAL RECONSTRUCTION PIPELINE</span>
            <h3 className="guide-title">Navas Moosa 3D Avatar Architecture</h3>
            <span className="guide-subtitle">
              Photorealistic 360° Real-Time Human Model • Spec & Reconstruction Workflow
            </span>
          </div>
          <button
            type="button"
            className="tva-btn guide-close-btn"
            onClick={() => {
              soundEngine.playTemPadClick();
              onClose();
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="guide-body">
          {/* Current Engine Status */}
          <div className={`status-banner ${isGlbLoaded ? 'success' : 'procedural'}`}>
            <div className="status-icon">
              {isGlbLoaded ? <CheckCircle size={20} /> : <Layers size={20} />}
            </div>
            <div className="status-text">
              <strong>
                {isGlbLoaded
                  ? 'ACTIVE: Photogrammetry GLB Mesh (/models/navas-moosa.glb)'
                  : 'ACTIVE: Realistic 3D Human Avatar (Procedural Geometry + Real Face Texture)'}
              </strong>
              <p>
                {isGlbLoaded
                  ? 'High-density polygonal GLB mesh loaded and rendered in WebGL with studio shaders, reflections, and shadow contact.'
                  : 'Preserving real face identity via high-res photograph mapping on curved facial geometry, sculpted wavy hair, bespoke suit structure, trousers, and polished shoes.'}
              </p>
            </div>
          </div>

          {/* Reconstruction Steps */}
          <div className="steps-container">
            <h4 className="steps-heading">Production Image-to-3D GLB Workflow:</h4>

            <div className="step-card">
              <span className="step-num">01</span>
              <div className="step-info">
                <strong>Source Multi-View Asset Preparation</strong>
                <p>
                  The character reference sheet (<code>public/assets/navas_moosa_character_sheet.png</code>)
                  and raw portrait photo (<code>public/assets/navas_moosa_face.jpg</code>)
                  provide 4 coordinated orthogonal views: Front, 3/4 Side, Back, and Head Close-up.
                </p>
              </div>
            </div>

            <div className="step-card">
              <span className="step-num">02</span>
              <div className="step-info">
                <strong>AI Photogrammetry / Neural Mesh Reconstruction</strong>
                <p>
                  To synthesize a monolithic raw GLB with full UV unwrapping and displacement:
                  upload the reference sheet to an image-to-3D reconstruction engine such as
                  <strong> Tripo3D</strong>, <strong>Meshy.ai</strong>, <strong>Hyper3D Rodin</strong>, or <strong>CSM Cube</strong>.
                </p>
              </div>
            </div>

            <div className="step-card">
              <span className="step-num">03</span>
              <div className="step-info">
                <strong>Deployment to Portfolio WebGL Engine</strong>
                <p>
                  Save the generated file to <code>d:\portfoliio\public\models\navas-moosa.glb</code>.
                  The 3D viewer will automatically load, scale, center, and cast shadows with zero configuration!
                </p>
              </div>
            </div>
          </div>

          {/* Instant Drag-and-Drop Local Test */}
          <div
            className="drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            <Upload size={24} className="text-amber-400 mb-2" />
            <strong className="drop-title">Instant Local .GLB Preview</strong>
            <p className="drop-hint">
              Drag & drop any <code>navas-moosa.glb</code> file here to test it immediately in the 360° studio viewer.
            </p>
            <label className="tva-btn tva-btn-primary file-input-label">
              <span>Select Local GLB File</span>
              <input
                type="file"
                accept=".glb,.gltf"
                onChange={handleFileDrop}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="guide-footer">
          <button
            type="button"
            className="tva-btn tva-btn-primary"
            onClick={() => {
              soundEngine.playTemPadClick();
              onClose();
            }}
          >
            Close Guide
          </button>
        </div>
      </div>

      <style>{`
        .guide-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .guide-modal-window {
          background: rgba(26, 20, 16, 0.98);
          border: 1px solid rgba(229, 179, 66, 0.4);
          border-radius: 12px;
          max-width: 640px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
        }
        .guide-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid rgba(229, 179, 66, 0.2);
        }
        .guide-title {
          font-family: var(--font-display, 'Orbitron', sans-serif);
          font-size: 16px;
          color: #fbbf24;
          margin: 4px 0 2px 0;
        }
        .guide-subtitle {
          font-size: 11px;
          color: #d6c7b2;
        }
        .guide-close-btn {
          padding: 6px;
        }
        .guide-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .status-banner {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid;
        }
        .status-banner.success {
          background: rgba(34, 197, 94, 0.12);
          border-color: rgba(34, 197, 94, 0.35);
          color: #86efac;
        }
        .status-banner.procedural {
          background: rgba(229, 179, 66, 0.12);
          border-color: rgba(229, 179, 66, 0.35);
          color: #fde047;
        }
        .status-text strong {
          display: block;
          font-size: 12px;
          margin-bottom: 3px;
        }
        .status-text p {
          font-size: 11px;
          color: #d6c7b2;
          margin: 0;
          line-height: 1.4;
        }
        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .steps-heading {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #fbbf24;
          margin: 0;
        }
        .step-card {
          display: flex;
          gap: 12px;
          background: rgba(36, 28, 22, 0.6);
          border: 1px solid rgba(229, 179, 66, 0.18);
          border-radius: 8px;
          padding: 10px 14px;
        }
        .step-num {
          font-family: var(--font-display, monospace);
          font-size: 14px;
          font-weight: 700;
          color: #f59e0b;
        }
        .step-info strong {
          font-size: 12px;
          color: #fff;
          display: block;
          margin-bottom: 2px;
        }
        .step-info p {
          font-size: 11px;
          color: #d6c7b2;
          line-height: 1.4;
          margin: 0;
        }
        .drop-zone {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
          background: rgba(20, 16, 12, 0.8);
          border: 2px dashed rgba(229, 179, 66, 0.35);
          border-radius: 8px;
        }
        .drop-title {
          font-size: 13px;
          color: #fff;
          margin-bottom: 4px;
        }
        .drop-hint {
          font-size: 11px;
          color: #a89a87;
          margin-bottom: 12px;
        }
        .file-input-label {
          cursor: pointer;
          font-size: 11px;
        }
        .guide-footer {
          padding: 16px 20px;
          border-top: 1px solid rgba(229, 179, 66, 0.2);
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}
