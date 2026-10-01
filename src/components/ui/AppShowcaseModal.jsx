import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Wrench,
  FileText,
  Database,
  Cpu,
  Award,
  Radio,
  Truck,
  MapPin,
  ExternalLink,
  Send,
  Layers,
} from 'lucide-react';
import { APPS_DATA } from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

export default function AppShowcaseModal({ appId, onClose }) {
  if (!appId || !APPS_DATA[appId]) return null;
  const app = APPS_DATA[appId];

  const [activeTab, setActiveTab] = useState(app.tabs[0]?.id || '');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Wi-Fi / Network Glitch');
  const [surveyAnswered, setSurveyAnswered] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const handleTabChange = (tabId) => {
    soundEngine.playTemPadClick();
    setActiveTab(tabId);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    soundEngine.playChronoChime();
    setTicketSubmitted(true);
    setTimeout(() => setTicketSubmitted(false), 4000);
  };

  const handleSosSubmit = () => {
    soundEngine.playWarpPortal();
    setSosSent(true);
    setTimeout(() => setSosSent(false), 4500);
  };

  return (
    <div className="app-modal-backdrop" onClick={onClose}>
      <div className="app-modal-window tva-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-case-tag">TVA MISSION ARCHIVE // LIVE SHOWCASE</span>
            <h2 className="modal-app-title">{app.title}</h2>
            <span className="modal-app-tagline">{app.tagline}</span>
          </div>

          <button
            onClick={() => {
              soundEngine.playTemPadClick();
              onClose();
            }}
            className="tva-btn modal-close-btn"
            title="Close Showcase"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="modal-content-grid">
          {/* Interactive Simulated Device Display */}
          <div className="device-simulator">
            <div className="device-frame">
              {/* Device Status Bar */}
              <div className="device-status-bar">
                <span>TVA SIMULATOR 5G</span>
                <span>10:10</span>
                <span>100%</span>
              </div>

              {/* Device App Header */}
              <div className="device-app-header">
                <h3>{app.title}</h3>
                <span className="device-badge">LIVE INTERACTIVE MOCKUP</span>
              </div>

              {/* Module Navigation Tabs */}
              <div className="device-tabs-bar">
                {app.tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`device-tab-btn ${isActive ? 'active' : ''}`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Device Interactive Screen Area */}
              <div className="device-screen-content">
                {/* CAMPUSFIX SCREENS */}
                {appId === 'campusfix' && (
                  <div className="screen-inner">
                    {activeTab === 'report' && (
                      <div className="demo-flow">
                        <h4>Submit Campus Incident</h4>
                        <p className="flow-desc">Log facility faults, lab issues, or security concerns directly.</p>
                        
                        {ticketSubmitted ? (
                          <div className="success-alert">
                            <CheckCircle size={24} className="text-green-400" />
                            <strong>Ticket #CF-9042 Created!</strong>
                            <span>Dispatched to Electrical & IT Maintenance Team.</span>
                          </div>
                        ) : (
                          <form onSubmit={handleFormSubmit} className="demo-form">
                            <label>Incident Category</label>
                            <select
                              value={selectedCategory}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="demo-input"
                            >
                              <option>Wi-Fi / Network Glitch</option>
                              <option>Lab Equipment Breakdown</option>
                              <option>Power & AC Fault</option>
                              <option>Plumbing & Hygiene</option>
                            </select>

                            <label>Location / Room</label>
                            <input
                              type="text"
                              defaultValue="Block C - Computer Lab 402"
                              className="demo-input"
                            />

                            <label>Description</label>
                            <textarea
                              defaultValue="Switch port 12 packet drops causing delay during practical exam."
                              rows={2}
                              className="demo-input"
                            />

                            <button type="submit" className="tva-btn tva-btn-primary form-submit-btn">
                              <Send size={14} />
                              <span>Submit Priority Ticket</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {activeTab === 'management' && (
                      <div className="demo-flow">
                        <h4>Admin Triage Dashboard</h4>
                        <div className="triage-list">
                          <div className="triage-card urgent">
                            <div className="triage-head">
                              <span className="triage-id">#CF-9041</span>
                              <span className="badge-urgent">URGENT</span>
                            </div>
                            <span className="triage-title">Server Room AC Unit Overheating</span>
                            <span className="triage-meta">Assigned: Tech Rahul V. • 12m ago</span>
                          </div>

                          <div className="triage-card in-progress">
                            <div className="triage-head">
                              <span className="triage-id">#CF-9040</span>
                              <span className="badge-progress">IN PROGRESS</span>
                            </div>
                            <span className="triage-title">Seminar Hall Projector HDMI Port Damaged</span>
                            <span className="triage-meta">Assigned: Tech Niyas K. • 45m ago</span>
                          </div>

                          <div className="triage-card resolved">
                            <div className="triage-head">
                              <span className="triage-id">#CF-9038</span>
                              <span className="badge-resolved">RESOLVED</span>
                            </div>
                            <span className="triage-title">Library Wi-Fi Mesh AP 3 Reboot</span>
                            <span className="triage-meta">Verified by Admin • 2h ago</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'technician' && (
                      <div className="demo-flow">
                        <h4>Technician Field Dispatch</h4>
                        <div className="tech-job-card">
                          <div className="job-badge">ASSIGNED TO YOU</div>
                          <h5>Lab 402 Network Gateway Repair</h5>
                          <div className="job-details">
                            <div><strong>Priority:</strong> High (Class in session)</div>
                            <div><strong>Target ETA:</strong> Under 15 Minutes</div>
                            <div><strong>Required Tools:</strong> Cat6 Cable, Crimper, Fluke Tester</div>
                          </div>
                          <button
                            onClick={() => soundEngine.playTemPadClick()}
                            className="tva-btn tva-btn-primary full-btn"
                          >
                            <CheckCircle size={14} />
                            <span>Acknowledge & Mark On-Site</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* POCKETTASK SCREENS */}
                {appId === 'pockettask' && (
                  <div className="screen-inner">
                    {activeTab === 'survey' && (
                      <div className="demo-flow">
                        <h4>Micro-Survey Verification</h4>
                        <p className="flow-desc">Earn tokens by validating AI model outputs and datasets.</p>

                        {surveyAnswered ? (
                          <div className="success-alert">
                            <Award size={24} className="text-purple-400" />
                            <strong>Task Validated! +50 Credits</strong>
                            <span>Credited to user ledger instantly.</span>
                          </div>
                        ) : (
                          <div className="survey-card">
                            <p className="survey-question">
                              "Does this web design layout adhere to TVA aesthetic guidelines?"
                            </p>
                            <div className="survey-options">
                              <button
                                onClick={() => {
                                  soundEngine.playChronoChime();
                                  setSurveyAnswered(true);
                                  setTimeout(() => setSurveyAnswered(false), 3500);
                                }}
                                className="survey-opt-btn"
                              >
                                <span>A. Absolutely, perfect bronze & amber tones</span>
                              </button>
                              <button
                                onClick={() => {
                                  soundEngine.playChronoChime();
                                  setSurveyAnswered(true);
                                  setTimeout(() => setSurveyAnswered(false), 3500);
                                }}
                                className="survey-opt-btn"
                              >
                                <span>B. Exceeds Sacred Timeline standards</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'data_entry' && (
                      <div className="demo-flow">
                        <h4>OCR Data Label Validation</h4>
                        <div className="data-check-box">
                          <span className="raw-text">SCANNED RECEIPT: #TVA-10928</span>
                          <div className="extracted-fields">
                            <div>Amount: $1,420.00</div>
                            <div>Vendor: Chrono Dynamics Ltd.</div>
                            <div>Status: Verification Passed</div>
                          </div>
                          <button
                            onClick={() => soundEngine.playTemPadClick()}
                            className="tva-btn full-btn"
                          >
                            <span>Confirm & Approve Data</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'app_training' && (
                      <div className="demo-flow">
                        <h4>QA App Regression Suite</h4>
                        <div className="qa-check-list">
                          <div className="qa-row checked">✓ Viewport resize responsive check</div>
                          <div className="qa-row checked">✓ Three.js WebGL canvas context recovery</div>
                          <div className="qa-row checked">✓ Zero console memory leaks</div>
                          <div className="qa-row checked">✓ Accessible navigation landmarks</div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'micro_earners' && (
                      <div className="demo-flow">
                        <h4>Micro Earners Leaderboard</h4>
                        <div className="earner-list">
                          <div className="earner-row">
                            <span>1. Variant_Loki_9</span>
                            <span className="text-amber-400">4,920 Pts (12 Streak)</span>
                          </div>
                          <div className="earner-row">
                            <span>2. Navas_Moosa</span>
                            <span className="text-amber-400">4,850 Pts (Top Dev)</span>
                          </div>
                          <div className="earner-row">
                            <span>3. Mobius_M</span>
                            <span className="text-amber-400">3,400 Pts (JetSki Fund)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* DISASTER MANAGEMENT SCREENS */}
                {appId === 'disaster' && (
                  <div className="screen-inner">
                    {activeTab === 'sos' && (
                      <div className="demo-flow">
                        <h4>Emergency SOS Dispatch Beacon</h4>
                        <p className="flow-desc">High-priority distress transmitter for real-time emergency routing.</p>

                        {sosSent ? (
                          <div className="success-alert sos-alert">
                            <Radio size={24} className="text-red-400 animate-pulse" />
                            <strong>SOS BEACON BROADCASTING!</strong>
                            <span>Nearest rescue boat unit dispatched (ETA 8 mins).</span>
                          </div>
                        ) : (
                          <div className="sos-panel">
                            <div className="sos-gps">
                              <span>CURRENT GPS: 11.2588° N, 75.7804° E (Kozhikode)</span>
                            </div>
                            <div className="urgency-levels">
                              <span className="urgency-tag critical">CRITICAL: Medical / Flood Surge</span>
                            </div>
                            <button
                              onClick={handleSosSubmit}
                              className="sos-broadcast-btn"
                            >
                              <Radio size={20} />
                              <span>BROADCAST EMERGENCY SOS</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'resources' && (
                      <div className="demo-flow">
                        <h4>Relief Supply & Fleet Allocator</h4>
                        <div className="resource-list">
                          <div className="res-row">
                            <span>Motorized Rescue Boats</span>
                            <span className="text-green-400">14 Deployed / 6 Standby</span>
                          </div>
                          <div className="res-row">
                            <span>Emergency Food & Water Kits</span>
                            <span className="text-amber-400">1,200 Packets Ready</span>
                          </div>
                          <div className="res-row">
                            <span>Medical First Responder Teams</span>
                            <span className="text-cyan-400">8 Units Active</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'analytics' && (
                      <div className="demo-flow">
                        <h4>Live Incident Heatmap Status</h4>
                        <div className="heatmap-box">
                          <div className="map-zone danger">
                            <MapPin size={16} />
                            <span>River Basin North — Rising Water Level Alert</span>
                          </div>
                          <div className="map-zone safe">
                            <ShieldCheck size={16} />
                            <span>Higher Secondary Relief Camp — Safe Zone (Cap: 450)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Overview & Tech Stack */}
          <div className="modal-info-column">
            <div className="info-block">
              <h4 className="info-title">
                <Layers size={16} className="text-amber-400" />
                <span>Architecture & Engineering Highlights</span>
              </h4>
              <p className="info-desc">{app.description}</p>
            </div>

            <div className="info-block">
              <h4 className="info-title">
                <Cpu size={16} className="text-green-400" />
                <span>Technology Stack</span>
              </h4>
              <div className="tech-tags-wrap">
                {app.techStack.map((tech, idx) => (
                  <span key={idx} className="tech-pill">{tech}</span>
                ))}
              </div>
            </div>

            <div className="info-block">
              <h4 className="info-title">
                <Award size={16} className="text-purple-400" />
                <span>Performance & Verification Metrics</span>
              </h4>
              <div className="metrics-list">
                {app.metrics.map((m, idx) => (
                  <div key={idx} className="metric-row">
                    <CheckCircle size={14} className="text-green-400" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-cta-wrap">
              <button
                onClick={() => {
                  soundEngine.playTemPadClick();
                  onClose();
                }}
                className="tva-btn full-btn"
              >
                <span>Return To TVA Walking Tour</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .app-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 6, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        .app-modal-window {
          width: 920px;
          max-width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--tva-border-bright);
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 18px 24px;
          border-bottom: 1px solid var(--tva-border);
          background: rgba(18, 15, 12, 0.9);
        }

        .modal-case-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--tva-gold);
          letter-spacing: 1.5px;
          display: block;
          margin-bottom: 4px;
        }

        .modal-app-title {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 2px;
        }

        .modal-app-tagline {
          font-size: 12px;
          color: #f59e0b;
          font-style: italic;
        }

        .modal-close-btn {
          padding: 6px;
        }

        .modal-content-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
          padding: 24px;
        }

        /* Device Simulator Frame */
        .device-simulator {
          display: flex;
          justify-content: center;
        }

        .device-frame {
          width: 100%;
          max-width: 340px;
          background: #0f172a;
          border-radius: 28px;
          border: 4px solid #334155;
          box-shadow: 0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(56, 189, 248, 0.2);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 480px;
        }

        .device-status-bar {
          display: flex;
          justify-content: space-between;
          padding: 8px 16px;
          font-family: var(--font-mono);
          font-size: 9px;
          color: #94a3b8;
          border-bottom: 1px solid #1e293b;
          background: #090e1a;
        }

        .device-app-header {
          padding: 12px 16px;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .device-app-header h3 {
          font-size: 14px;
          color: #fff;
        }

        .device-badge {
          font-size: 8px;
          background: rgba(56, 189, 248, 0.2);
          border: 1px solid rgba(56, 189, 248, 0.4);
          color: #7dd3fc;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .device-tabs-bar {
          display: flex;
          background: #0f172a;
          border-bottom: 1px solid #1e293b;
          padding: 4px;
          gap: 4px;
        }

        .device-tab-btn {
          flex: 1;
          padding: 6px 4px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 11px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .device-tab-btn.active {
          background: #1e293b;
          color: #38bdf8;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }

        .device-screen-content {
          padding: 14px;
          flex: 1;
          background: #0b1320;
          color: #f1f5f9;
        }

        .demo-flow h4 {
          font-size: 13px;
          margin-bottom: 4px;
          color: #f8fafc;
        }

        .flow-desc {
          font-size: 11px;
          color: #94a3b8;
          margin-bottom: 12px;
        }

        .demo-form {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .demo-form label {
          font-size: 10px;
          color: #cbd5e1;
          font-family: var(--font-mono);
        }

        .demo-input {
          background: #1e293b;
          border: 1px solid #334155;
          color: #fff;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-family: var(--font-sans);
        }

        .demo-input:focus {
          outline: none;
          border-color: #38bdf8;
        }

        .form-submit-btn {
          margin-top: 6px;
          justify-content: center;
          padding: 8px;
        }

        .success-alert {
          background: rgba(34, 197, 94, 0.15);
          border: 1px solid rgba(34, 197, 94, 0.4);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #86efac;
          font-size: 11px;
        }

        .triage-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .triage-card {
          background: #1e293b;
          border-radius: 6px;
          padding: 8px 10px;
          border-left: 3px solid #38bdf8;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .triage-card.urgent {
          border-left-color: #ef4444;
        }

        .triage-card.resolved {
          border-left-color: #22c55e;
        }

        .triage-head {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          font-family: var(--font-mono);
        }

        .badge-urgent {
          color: #ef4444;
          font-weight: bold;
        }

        .badge-progress {
          color: #f59e0b;
        }

        .badge-resolved {
          color: #22c55e;
        }

        .triage-title {
          font-size: 11px;
          font-weight: 600;
          color: #f1f5f9;
        }

        .triage-meta {
          font-size: 9.5px;
          color: #94a3b8;
        }

        .tech-job-card {
          background: #1e293b;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .job-badge {
          font-size: 9px;
          color: #38bdf8;
          font-family: var(--font-mono);
        }

        .job-details {
          font-size: 10.5px;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .survey-card {
          background: #1e293b;
          border-radius: 8px;
          padding: 12px;
        }

        .survey-question {
          font-size: 12px;
          color: #f1f5f9;
          margin-bottom: 12px;
        }

        .survey-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .survey-opt-btn {
          background: #0f172a;
          border: 1px solid #334155;
          color: #e2e8f0;
          padding: 8px 10px;
          border-radius: 6px;
          text-align: left;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .survey-opt-btn:hover {
          border-color: #a855f7;
          background: #1e1b4b;
        }

        .data-check-box, .qa-check-list, .earner-list, .resource-list, .heatmap-box {
          background: #1e293b;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
        }

        .sos-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sos-gps {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #cbd5e1;
          background: #1e293b;
          padding: 8px;
          border-radius: 4px;
        }

        .sos-broadcast-btn {
          background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
          border: 2px solid #ef4444;
          color: #fff;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 1px;
          padding: 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
          animation: pulseGlow 1.5s infinite alternate;
        }

        .map-zone {
          padding: 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .map-zone.danger {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
        }

        .map-zone.safe {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
        }

        /* Right Column Info */
        .modal-info-column {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .info-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: #fff;
          margin-bottom: 8px;
        }

        .info-desc {
          font-size: 12.5px;
          line-height: 1.6;
          color: #d6c7b2;
        }

        .tech-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tech-pill {
          background: rgba(45, 36, 28, 0.8);
          border: 1px solid var(--tva-border);
          color: #fed7aa;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-family: var(--font-mono);
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #f5f0e6;
        }

        .modal-cta-wrap {
          margin-top: auto;
        }

        @media (max-width: 840px) {
          .modal-content-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
