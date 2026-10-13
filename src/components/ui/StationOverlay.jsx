import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  GraduationCap,
  Code,
  Database,
  Layers,
  Terminal,
  Clock,
  Sparkles,
  ShieldAlert,
  Award,
  BookOpen,
  FileText,
  Download,
  CheckCircle,
  RotateCw,
  Maximize2,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  STATIONS,
  EDUCATION_DATA,
  SKILLS_DATA,
  APPS_DATA,
} from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';
import AvatarViewer from '../avatar/AvatarViewer';

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function StationOverlay({
  currentStationIndex,
  onAppSelect,
  onOpenCaseFile,
  playerTelemetry,
}) {
  const currentStation = STATIONS[currentStationIndex] || STATIONS[0];

  // 3D Model interactive state
  const [modelView, setModelView] = useState('float'); // 'float' | 'bust' | 'rear' | 'sheet'
  const [inspectorMode, setInspectorMode] = useState('studio'); // 'studio' | 'reference'
  const [cardTilt, setCardTilt] = useState({ x: 0, y: 0 });
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFrameMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setCardTilt({ x, y });
  };

  const handleFrameMouseLeave = () => {
    setCardTilt({ x: 0, y: 0 });
  };

  return (
    <div className="station-overlay-container">
      {isCollapsed ? (
        <div
          className="station-overlay-collapsed tva-panel animate-scaleUp"
          onClick={() => {
            soundEngine.playTemPadClick();
            setIsCollapsed(false);
          }}
          title="Click to view section details"
        >
          <div className="collapsed-left">
            <span className="collapsed-badge">{currentStation.title.toUpperCase()}</span>
            <span className="collapsed-sub">Click to View Section Details</span>
          </div>
          <ChevronUp size={16} className="text-amber-400" />
        </div>
      ) : (
        <div className="overlay-content-wrapper">
          <div className="overlay-dock-bar">
            <span className="dock-checkpoint-tag">
              {playerTelemetry?.isNearStation ? '📍 ARRIVED AT CHECKPOINT' : '🚶 APPROACHING CHECKPOINT'}
            </span>
            <button
              type="button"
              className="card-minimize-btn"
              onClick={() => {
                soundEngine.playTemPadClick();
                setIsCollapsed(true);
              }}
              title="Minimize to explore 3D world"
            >
              <ChevronDown size={14} />
              <span>Minimize</span>
            </button>
          </div>
          {/* ========================================================
          SCENE 1: WELCOME & IDENTIFICATION
      ======================================================== */}
          {currentStation.id === 'welcome' && (
            <div className="tva-panel station-card animate-fadeIn">
              <div className="card-badge">WEB DEVELOPER PORTFOLIO // WELCOME</div>
              <h1 className="hero-name tva-gold-text">{PERSONAL_INFO.name}</h1>
              <p className="hero-role">{PERSONAL_INFO.title}</p>

              <div className="meta-list">
                <div className="meta-item">
                  <MapPin size={14} className="text-amber-400" />
                  <span>{PERSONAL_INFO.address}</span>
                </div>
                <div className="meta-item">
                  <Phone size={14} className="text-amber-400" />
                  <span>{PERSONAL_INFO.phone}</span>
                </div>
                <div className="meta-item">
                  <Mail size={14} className="text-amber-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </div>
              </div>

              <div className="quote-box">
                <span className="quote-badge">WELCOME MESSAGE:</span>
                <p>"{currentStation.quote}"</p>
              </div>

              <button
                onClick={onOpenCaseFile}
                className="tva-btn tva-btn-primary full-btn"
              >
                <FileText size={16} />
                <span>View & Download Resume</span>
              </button>
            </div>
          )}

          {/* ========================================================
          SCENE 2: ABOUT ME (DISPLAY NAVAS MOOSA 3D IMAGE ON LEFT)
      ======================================================== */}
          {currentStation.id === 'aboutme' && (
            <div className="tva-panel station-card aboutme-card wide-card animate-fadeIn">
              <div className="card-badge crt-badge">ABOUT ME // PROFESSIONAL PROFILE</div>
              <h2 className="section-title">About Navas Moosa K P</h2>

              <div className="aboutme-layout">
                {/* 3D Model Interactive Showcase on Left Side */}
                <div className="navas-3d-showcase">
                  {/* Telemetry Header */}
                  <div className="showcase-telemetry-bar">
                    <span className="telemetry-live-dot" />
                    <span className="telemetry-title">3D AVATAR // 360° ORBIT</span>
                    <button
                      type="button"
                      className="telemetry-cycle-btn"
                      title="Expand to Full 360° Studio Modal"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundEngine.playChronoChime();
                        setIs3DModalOpen(true);
                      }}
                    >
                      <Maximize2 size={11} />
                    </button>
                  </div>

                  {/* Live Interactive 3D Avatar Viewport */}
                  <div className="navas-avatar-embedded-wrap">
                    <AvatarViewer
                      isCompact={true}
                      onExpand={() => setIs3DModalOpen(true)}
                      initialView="front"
                    />
                  </div>

                  {/* Caption & Specs */}
                  <div className="navas-photo-caption">
                    <div className="caption-tag-row">
                      <span className="caption-tag">3D HUMAN AVATAR</span>
                      <span className="caption-subtag">REAL-TIME 360°</span>
                    </div>
                    <span className="caption-title">NAVAS MOOSA • BESPOKE SUIT</span>
                    <span className="caption-meta">PRESERVED REAL FACE • INTERACTIVE 3D</span>
                    <button
                      type="button"
                      className="caption-inspect-btn"
                      onClick={() => {
                        soundEngine.playChronoChime();
                        setIs3DModalOpen(true);
                      }}
                    >
                      <Eye size={12} />
                      <span>Inspect Full 360° Studio Asset</span>
                    </button>
                  </div>
                </div>

                {/* Profile Content on Right Side */}
                <div className="aboutme-details">
                  <p className="section-description">
                    {PERSONAL_INFO.summary}
                  </p>

                  <div className="stats-grid">
                    <div className="stat-pill">
                      <span className="stat-label">ROLE  </span>
                      <span className="stat-val text-green-400">{PERSONAL_INFO.classification}</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">Pursuing</span>
                      <span className="stat-val text-amber-400">MCA (KTU University)</span>
                    </div>
                    <div className="stat-pill">
                      <span className="stat-label">GRADUATED IN Calicut University</span>
                      <span className="stat-val text-cyan-400"> BCA Degree with Distinction</span>
                    </div>
                  </div>

                  <div className="highlights-row">
                    <span className="highlight-tag">✓ Clean React Architectures</span>
                    <span className="highlight-tag">✓ Full-Stack REST Pipelines</span>
                    <span className="highlight-tag">✓ Bug Fixing & Optimization</span>
                  </div>

                  <button
                    onClick={onOpenCaseFile}
                    className="tva-btn tva-btn-primary full-btn"
                  >
                    <FileText size={16} />
                    <span>View Complete Resume</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
          SCENE 3: EXPERIENCE (FIELD WORK)
      ======================================================== */}
          {currentStation.id === 'experience' && (
            <div className="tva-panel station-card animate-fadeIn">
              <div className="card-badge">WORK EXPERIENCE // PRACTICAL WORK</div>
              <h2 className="section-title">Engineering & Industry Experience</h2>

              <div className="timeline-items">
                <div className="experience-item">
                  <div className="exp-dot" />
                  <div className="exp-content">
                    <span className="exp-role">Software Developer & Trainee</span>
                    <span className="exp-company">Modern Web & Systems Engineering</span>
                    <p className="exp-desc">
                      Architected scalable frontends with React.js, structured clean database models, and integrated resilient RESTful APIs that keep user interactions glitch-free.
                    </p>
                  </div>
                </div>

                <div className="experience-item">
                  <div className="exp-dot" />
                  <div className="exp-content">
                    <span className="exp-role">Smart System Engineering</span>
                    <span className="exp-company">Booking & Facility Management Workflows</span>
                    <p className="exp-desc">
                      Engineered automated dormitory and resource booking systems reducing manual triage time by 70% with real-time status syncing.
                    </p>
                  </div>
                </div>

                <div className="experience-item">
                  <div className="exp-dot" />
                  <div className="exp-content">
                    <span className="exp-role">Industrial Exposure & Study</span>
                    <span className="exp-company">Cyberpark Calicut Techne Industry Visit</span>
                    <p className="exp-desc">
                      Conducted on-site evaluation of enterprise IT practices, cloud workflows, agile software pipelines, and software best practices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
          SCENE 4: PROJECTS (SACRED CASE-FILES)
      ======================================================== */}
          {currentStation.id === 'projects' && (
            <div className="tva-panel station-card wide-card animate-fadeIn">
              <div className="card-badge text-amber-400">FEATURED PROJECTS // PORTFOLIO</div>
              <h2 className="section-title">Flagship Applications & Projects</h2>
              <p className="section-description">
                High-impact web and mobile engineering solutions for real-time crisis coordination, resource logistics, and mapping.
              </p>

              <div className="projects-grid">
                {/* Project 1: Disaster Management System */}
                {APPS_DATA?.disaster && (
                  <div className="project-highlight-card flagship">
                    <div className="proj-header">
                      <span className="proj-badge flagship-badge">FLAGSHIP ACADEMIC PROJECT</span>
                      <span className="proj-badge" style={{ color: '#fbbf24', borderColor: 'rgba(251,191,36,0.35)' }}>
                        {APPS_DATA.disaster.category}
                      </span>
                    </div>
                    <h3 className="proj-title" style={{ fontSize: '15px', color: '#fef3c7', margin: '2px 0' }}>
                      {APPS_DATA.disaster.title}
                    </h3>
                    <p style={{ fontSize: '11px', color: '#f59e0b', fontStyle: 'italic', margin: 0 }}>
                      {APPS_DATA.disaster.tagline}
                    </p>
                    <p className="proj-desc">{APPS_DATA.disaster.description}</p>

                    {/* System Metrics */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: '2px 0' }}>
                      {APPS_DATA.disaster.metrics?.map((m, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '9.5px',
                            padding: '2px 7px',
                            background: 'rgba(239, 68, 68, 0.18)',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            borderRadius: '4px',
                            color: '#fca5a5',
                            fontWeight: 600,
                          }}
                        >
                          ⚡ {m}
                        </span>
                      ))}
                    </div>

                    {/* Core Architecture Modules */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '6px', margin: '4px 0' }}>
                      {APPS_DATA.disaster.tabs?.map((tab) => (
                        <div
                          key={tab.id}
                          style={{
                            background: 'rgba(22, 17, 13, 0.75)',
                            border: '1px solid rgba(229, 179, 66, 0.22)',
                            borderRadius: '6px',
                            padding: '6px 8px',
                          }}
                        >
                          <strong style={{ color: '#fbbf24', fontSize: '10.5px', display: 'block', marginBottom: '2px' }}>
                            {tab.label}
                          </strong>
                          <span style={{ color: '#d6c7b2', fontSize: '9.5px', lineHeight: '1.3', display: 'block' }}>
                            {tab.summary}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="proj-tags">
                      {APPS_DATA.disaster.techStack?.map((tech, idx) => (
                        <span key={idx}>{tech}</span>
                      ))}
                    </div>

                    <button
                      onClick={() => onAppSelect('disaster')}
                      className="tva-btn tva-btn-primary full-btn"
                      style={{ marginTop: '4px' }}
                    >
                      <Sparkles size={15} />
                      <span>Launch Interactive Disaster System Demo</span>
                    </button>
                  </div>
                )}

                {/* Optional Project 2: CampusFix (if defined in APPS_DATA) */}
                {APPS_DATA?.campusfix && (
                  <div className="project-highlight-card">
                    <div className="proj-header">
                      <span className="proj-badge">MOBILE & WEB</span>
                      <h3 className="proj-title">{APPS_DATA.campusfix.title}</h3>
                    </div>
                    <p className="proj-desc">{APPS_DATA.campusfix.description}</p>
                    <div className="proj-tags">
                      <span>Incident Reporting</span>
                      <span>Technician Dispatch</span>
                      <span>99.4% Uptime</span>
                    </div>
                    <button
                      onClick={() => onAppSelect('campusfix')}
                      className="tva-btn full-btn"
                    >
                      <Sparkles size={15} />
                      <span>Launch CampusFix Demo</span>
                    </button>
                  </div>
                )}

                {/* Optional Project 3: PocketTask (if defined in APPS_DATA) */}
                {APPS_DATA?.pockettask && (
                  <div className="project-highlight-card">
                    <div className="proj-header">
                      <span className="proj-badge">MICRO-TASK PLATFORM</span>
                      <h3 className="proj-title">{APPS_DATA.pockettask.title}</h3>
                    </div>
                    <p className="proj-desc">{APPS_DATA.pockettask.description}</p>
                    <div className="proj-tags">
                      <span>Adaptive Surveys</span>
                      <span>Fast QA Testing</span>
                      <span>Micro-Ledger</span>
                    </div>
                    <button
                      onClick={() => onAppSelect('pockettask')}
                      className="tva-btn full-btn"
                    >
                      <Sparkles size={15} />
                      <span>Launch PocketTask Demo</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
          SCENE 5: TECHNICAL SKILLS & QUALIFICATIONS
      ======================================================== */}
          {currentStation.id === 'qualifications' && (
            <div className="tva-panel station-card wide-card animate-fadeIn">
              <div className="card-badge">SKILLS & QUALIFICATIONS // EXPERTISE</div>
              <h2 className="section-title">Technical Skills & Educational Hierarchy</h2>

              <div className="qual-cols">
                {/* Education Column */}
                <div className="qual-col">
                  <h3 className="qual-col-title">
                    <GraduationCap size={16} className="text-amber-400" />
                    <span>Certified Education</span>
                  </h3>
                  {EDUCATION_DATA.map((edu, idx) => (
                    <div key={idx} className="edu-card">
                      <div className="edu-header">
                        <span className="edu-deg">{edu.degree}</span>
                        <span className="edu-period">{edu.period}</span>
                      </div>
                      <span className="edu-inst">{edu.institution}</span>
                      <span className="edu-badge">{edu.status}</span>
                    </div>
                  ))}
                </div>

                {/* Technical Skills Column */}
                <div className="qual-col">
                  <h3 className="qual-col-title">
                    <Code size={16} className="text-green-400" />
                    <span>Technical Skills</span>
                  </h3>
                  <div className="skills-tags-wrap">
                    {SKILLS_DATA.languagesAndFrameworks.map((skill, idx) => (
                      <span key={idx} className="skill-pill">
                        {skill.name} <strong className="text-amber-400">{skill.level}%</strong>
                      </span>
                    ))}
                    {SKILLS_DATA.databases.map((db, idx) => (
                      <span key={idx} className="skill-pill db-pill">
                        {db.name}
                      </span>
                    ))}
                  </div>

                  <div className="specialties-box">
                    <span className="spec-title">CORE PROFICIENCIES:</span>
                    <ul>
                      {SKILLS_DATA.specialties.slice(0, 4).map((s, idx) => (
                        <li key={idx}>✓ {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
          SCENE 6: LET'S WORK TOGETHER (CONTACT)
      ======================================================== */}
          {currentStation.id === 'contact' && (
            <div className="tva-panel station-card wide-card animate-fadeIn">
              <div className="card-badge text-cyan-400">GET IN TOUCH // CONTACT</div>
              <h2 className="section-title tva-gold-text">Let's Work Together</h2>
              <p className="section-description">
                Ready to collaborate or hire Navas for your engineering team? Connect using the official channels below:
              </p>

              <div className="nexus-links-grid">
                {/* GitHub */}
                <a
                  href="https://github.com/Navasmoosa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tva-btn nexus-btn github-btn"
                >
                  <GithubIcon size={20} />
                  <div className="btn-text">
                    <span className="btn-sup">SOURCE CODE & REPOSITORIES</span>
                    <span className="btn-main">github.com/Navasmoosa</span>
                  </div>
                  <ExternalLink size={14} className="link-arrow" />
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/in/navasmoosa-kp-743b25281/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tva-btn nexus-btn linkedin-btn"
                >
                  <LinkedinIcon size={20} />
                  <div className="btn-text">
                    <span className="btn-sup">PROFESSIONAL PROFILE</span>
                    <span className="btn-main">linkedin.com/in/navasmoosa-kp</span>
                  </div>
                  <ExternalLink size={14} className="link-arrow" />
                </a>

                {/* Email */}
                <a
                  href="mailto:kpnavasmoosa@gmail.com"
                  className="tva-btn nexus-btn email-btn"
                >
                  <Mail size={20} />
                  <div className="btn-text">
                    <span className="btn-sup">DIRECT EMAIL</span>
                    <span className="btn-main">kpnavasmoosa@gmail.com</span>
                  </div>
                  <ExternalLink size={14} className="link-arrow" />
                </a>

                {/* Official Resume PDF */}
                <button
                  onClick={onOpenCaseFile}
                  className="tva-btn nexus-btn resume-btn"
                >
                  <FileText size={20} />
                  <div className="btn-text">
                    <span className="btn-sup">RESUME / CV</span>
                    <span className="btn-main">Download Resume (PDF)</span>
                  </div>
                  <Download size={14} className="link-arrow" />
                </button>
              </div>

              <div className="nexus-meta-row">
                <div className="nexus-meta-box">
                  <span className="box-title">LOCATION:</span>
                  <p>Odupara, Kozhikode, Kerala 673572</p>
                </div>
                <div className="nexus-meta-box">
                  <span className="box-title">LANGUAGES FLUENCY:</span>
                  <p>English, Malayalam, Hindi, Arabic</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
          SCENE 7: THANK YOU (CONCLUSION)
      ======================================================== */}
          {currentStation.id === 'thankyou' && (
            <div className="tva-panel station-card animate-fadeIn text-center">
              <div className="card-badge text-amber-400">THANK YOU FOR VISITING</div>
              <h2 className="section-title tva-gold-text">THANK YOU FOR WATCHING!</h2>
              <p className="sign-off">NAVAS MOOSA K P ♡</p>
              <p className="section-description">
                "Thank you for exploring my interactive portfolio! Feel free to connect, collaborate, or download my comprehensive resume."
              </p>

              <button
                onClick={onOpenCaseFile}
                className="tva-btn tva-btn-primary full-btn"
              >
                <Award size={18} />
                <span>Download Full Resume (PDF)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          3D CHARACTER MODEL INSPECTOR MODAL
      ======================================================== */}
      {is3DModalOpen && (
        <div
          className="model-inspector-backdrop"
          onClick={() => {
            soundEngine.playTemPadClick();
            setIs3DModalOpen(false);
          }}
        >
          <div
            className="model-inspector-window tva-panel animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="inspector-header">
              <div className="inspector-title-group">
                <span className="inspector-badge">
                  3D CHARACTER ASSET // REAL-TIME 360° STUDIO
                </span>
                <h3 className="inspector-title">
                  NAVAS MOOSA — 360° 3D AVATAR STUDIO
                </h3>
                <span className="inspector-subtitle">
                  Interactive 3D Human Model • Preserving Real Face Identity & Bespoke Black Suit
                </span>
              </div>

              {/* View Mode Tabs (3D Studio vs Reference Sheet) */}
              <div className="modal-mode-tabs">
                <button
                  type="button"
                  className={`modal-mode-btn ${inspectorMode === 'studio' ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playTemPadClick();
                    setInspectorMode('studio');
                  }}
                >
                  <Sparkles size={13} />
                  <span>3D Orbit Studio</span>
                </button>
                <button
                  type="button"
                  className={`modal-mode-btn ${inspectorMode === 'reference' ? 'active' : ''}`}
                  onClick={() => {
                    soundEngine.playTemPadClick();
                    setInspectorMode('reference');
                  }}
                >
                  <FileText size={13} />
                  <span>Reference Sheet</span>
                </button>
              </div>

              <button
                type="button"
                className="tva-btn inspector-close-btn"
                onClick={() => {
                  soundEngine.playTemPadClick();
                  setIs3DModalOpen(false);
                }}
                title="Close 3D Inspector"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="inspector-body">
              {inspectorMode === 'studio' ? (
                /* Full Interactive 360 Studio */
                <div className="inspector-studio-viewport">
                  <AvatarViewer isCompact={false} initialView="front" />
                </div>
              ) : (
                /* Multi-View Character Reference Sheet & Face Photo */
                <div className="inspector-reference-display">
                  <div className="reference-grid">
                    <div className="ref-panel sheet-panel">
                      <div className="ref-panel-header">
                        <span className="ref-badge">4-VIEW CHARACTER SHEET</span>
                        <h4>Front • Side / Three-Quarter • Back • Head Close-Up</h4>
                      </div>
                      <div className="ref-img-wrap">
                        <img
                          src="/assets/navas_moosa_character_sheet.png"
                          alt="Navas Moosa 4-View Character Reference Sheet"
                          className="ref-img"
                        />
                      </div>
                    </div>
                    <div className="ref-panel face-panel">
                      <div className="ref-panel-header">
                        <span className="ref-badge">ORIGINAL PORTRAIT</span>
                        <h4>Real Face Identity & South Asian Skin Tone Reference</h4>
                      </div>
                      <div className="ref-img-wrap">
                        <img
                          src="/assets/navas_moosa_face.jpg"
                          alt="Navas Moosa Real Face Portrait Reference"
                          className="ref-face-img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Specifications Dossier */}
              <div className="inspector-specs-grid">
                <div className="spec-card">
                  <span className="spec-label">CHARACTER IDENTITY</span>
                  <span className="spec-val tva-gold-text">NAVAS MOOSA K P</span>
                  <span className="spec-sub">Preserved Natural Face, Hairline & South Asian Skin Tone</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label">OUTFIT / WARDROBE</span>
                  <span className="spec-val text-amber-300">Tailored Obsidian Black Suit</span>
                  <span className="spec-sub">Black Shirt Unbuttoned at Collar, Creased Trousers, Oxford Shoes</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label">HAIR & ANATOMY</span>
                  <span className="spec-val text-green-400">Natural Dark Wavy Hair</span>
                  <span className="spec-sub">Thick Curly Volume, Chiseled Jawline, Defined Eyes</span>
                </div>
                <div className="spec-card">
                  <span className="spec-label">3D ORBIT CONTROLS</span>
                  <span className="spec-val text-cyan-400">Full 360° Drag & Zoom</span>
                  <span className="spec-sub">Front, Back, Left, Right, 3/4 & Face Close-Up Camera Presets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .station-overlay-container {
          position: absolute;
          bottom: 95px;
          left: 24px;
          max-width: 540px;
          z-index: 30;
          pointer-events: auto;
        }

        .station-overlay-collapsed {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-radius: 10px;
          border: 1px solid rgba(229, 179, 66, 0.45);
          background: rgba(22, 17, 13, 0.92);
          backdrop-filter: blur(14px);
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.7), 0 0 15px rgba(229, 179, 66, 0.2);
          width: 320px;
        }

        .station-overlay-collapsed:hover {
          border-color: #ffd868;
          transform: translateY(-2px);
          box-shadow: 0 14px 30px rgba(0,0,0,0.8), 0 0 20px rgba(229, 179, 66, 0.4);
        }

        .collapsed-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .collapsed-badge {
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 1px;
        }

        .collapsed-sub {
          font-size: 10.5px;
          color: #94a3b8;
        }

        .overlay-dock-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
          padding: 0 4px;
        }

        .dock-checkpoint-tag {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          color: #34d399;
          letter-spacing: 0.8px;
        }

        .card-minimize-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 4px;
          padding: 3px 8px;
          color: #ffd868;
          font-family: var(--font-mono);
          font-size: 9.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .card-minimize-btn:hover {
          background: rgba(245, 158, 11, 0.3);
          border-color: #ffd868;
          color: #fff;
        }

        .station-card {
          padding: 22px;
          border-radius: 14px;
          max-height: calc(100vh - 195px);
          overflow-y: auto;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(229, 179, 66, 0.15);
        }

        .wide-card {
          max-width: 580px;
          width: 580px;
        }

        .hero-name {
          font-family: var(--font-display);
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-top: 8px;
        }

        .hero-role {
          font-size: 13px;
          color: #d6c7b2;
          font-family: var(--font-mono);
          margin-bottom: 14px;
        }

        .meta-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 14px;
          font-size: 12px;
          color: #fed7aa;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quote-box {
          background: rgba(36, 28, 20, 0.8);
          border-left: 3px solid var(--tva-amber);
          padding: 10px 14px;
          border-radius: 0 6px 6px 0;
          margin-bottom: 16px;
        }

        .quote-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #fb923c;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 4px;
        }

        .quote-box p {
          font-size: 12px;
          font-style: italic;
          color: #fed7aa;
          line-height: 1.5;
        }

        /* Scene 2: About Me with Interactive 3D Model on Left */
        .aboutme-layout {
          display: flex;
          gap: 18px;
          margin-top: 12px;
        }

        .navas-3d-showcase {
          width: 260px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .navas-avatar-embedded-wrap {
          position: relative;
          width: 100%;
          height: 310px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.6);
        }

        .showcase-telemetry-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: #fbbf24;
          padding: 0 2px;
        }

        .telemetry-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          display: inline-block;
          margin-right: 4px;
        }

        .telemetry-title {
          font-weight: 700;
          letter-spacing: 0.8px;
          flex: 1;
        }

        .telemetry-cycle-btn {
          background: rgba(245, 158, 11, 0.15);
          border: 1px solid rgba(245, 158, 11, 0.35);
          color: #fef08a;
          border-radius: 4px;
          padding: 2px 5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .telemetry-cycle-btn:hover {
          background: rgba(245, 158, 11, 0.3);
          border-color: #f59e0b;
          transform: rotate(45deg);
        }

        .navas-img-frame.interactive-frame {
          position: relative;
          width: 100%;
          height: 245px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(229, 179, 66, 0.55);
          box-shadow: 0 0 20px rgba(229, 179, 66, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.6);
          background: #0d0a08;
          cursor: pointer;
          transition: transform 0.15s ease-out, box-shadow 0.3s ease;
          animation: zeroGFloat 5s ease-in-out infinite;
        }

        @keyframes zeroGFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }

        .navas-img-frame.interactive-frame:hover {
          box-shadow: 0 0 25px rgba(229, 179, 66, 0.4), inset 0 0 15px rgba(245, 158, 11, 0.15);
        }

        .navas-3d-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navas-3d-photo.view-float {
          object-position: 21% center;
          transform: scale(1.16);
        }

        .navas-3d-photo.view-bust {
          object-position: 84% 42%;
          transform: scale(1.18);
        }

        .navas-3d-photo.view-rear {
          object-position: 53.5% center;
          transform: scale(1.16);
        }

        .navas-3d-photo.view-sheet {
          object-fit: contain;
          object-position: center center;
          background: #090b0e;
          transform: scale(1.0);
        }

        .frame-reticle-cross {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, 0.25) 85%);
        }

        .frame-orbit-rings-deco {
          position: absolute;
          width: 110px;
          height: 110px;
          border: 1px dashed rgba(56, 189, 248, 0.2);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .frame-hud-coords {
          position: absolute;
          bottom: 8px;
          left: 8px;
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 600;
          color: #38bdf8;
          background: rgba(8, 12, 16, 0.85);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.35);
          pointer-events: none;
          backdrop-filter: blur(4px);
        }

        .frame-inspect-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-family: var(--font-mono);
          font-size: 8px;
          font-weight: 700;
          color: #fbbf24;
          background: rgba(18, 12, 8, 0.85);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(245, 158, 11, 0.4);
          display: flex;
          align-items: center;
          gap: 4px;
          pointer-events: none;
          backdrop-filter: blur(4px);
        }

        .model-view-tabs {
          display: flex;
          gap: 3px;
          margin-top: 2px;
        }

        .view-tab-btn {
          flex: 1;
          padding: 5px 2px;
          font-size: 8.5px;
          font-family: var(--font-mono);
          font-weight: 600;
          color: #fed7aa;
          background: rgba(30, 22, 16, 0.7);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }

        .view-tab-btn:hover {
          background: rgba(245, 158, 11, 0.15);
          border-color: rgba(245, 158, 11, 0.45);
          color: #fff;
        }

        .view-tab-btn.active {
          background: rgba(245, 158, 11, 0.25);
          border-color: #f59e0b;
          color: #fef08a;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.25);
        }

        .frame-scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.15),
            rgba(0, 0, 0, 0.15) 2px,
            transparent 2px,
            transparent 4px
          );
          pointer-events: none;
        }

        .frame-corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border-color: #ffd868;
          border-style: solid;
        }

        .frame-corner.top-left { top: 2px; left: 2px; border-width: 2px 0 0 2px; }
        .frame-corner.top-right { top: 2px; right: 2px; border-width: 2px 2px 0 0; }
        .frame-corner.bottom-left { bottom: 2px; left: 2px; border-width: 0 0 2px 2px; }
        .frame-corner.bottom-right { bottom: 2px; right: 2px; border-width: 0 2px 2px 0; }

        .navas-photo-caption {
          display: flex;
          flex-direction: column;
          gap: 3px;
          background: rgba(30, 22, 16, 0.85);
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .caption-tag-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 4px;
        }

        .caption-tag {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #fb923c;
          letter-spacing: 0.8px;
        }

        .caption-subtag {
          font-family: var(--font-mono);
          font-size: 7.5px;
          color: #34d399;
          font-weight: 600;
          background: rgba(52, 211, 153, 0.1);
          padding: 1px 4px;
          border-radius: 3px;
          border: 1px solid rgba(52, 211, 153, 0.25);
        }

        .caption-title {
          font-family: var(--font-mono);
          font-size: 10px;
          font-weight: 700;
          color: #fed7aa;
        }

        .caption-meta {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #94a3b8;
          letter-spacing: 0.5px;
        }

        .caption-inspect-btn {
          margin-top: 5px;
          width: 100%;
          padding: 4px 6px;
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 600;
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
          border: 1px solid rgba(245, 158, 11, 0.35);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: all 0.2s;
        }

        .caption-inspect-btn:hover {
          background: rgba(245, 158, 11, 0.25);
          border-color: #f59e0b;
          color: #fff;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.3);
        }

        /* 3D Character Model Inspector Modal Styles */
        .model-inspector-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(10px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .model-inspector-window {
          max-width: 880px;
          width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          background: #120e0b;
          border: 1px solid rgba(245, 158, 11, 0.45);
          border-radius: 14px;
          box-shadow: 0 0 50px rgba(0, 0, 0, 0.95), 0 0 30px rgba(245, 158, 11, 0.25);
          padding: 22px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
        }

        .inspector-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(245, 158, 11, 0.2);
          padding-bottom: 14px;
        }

        .inspector-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          color: #fbbf24;
          letter-spacing: 1.2px;
          font-weight: 700;
          display: block;
          margin-bottom: 4px;
        }

        .inspector-title {
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 700;
          color: #fed7aa;
          margin: 0;
          letter-spacing: 1px;
        }

        .inspector-subtitle {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #94a3b8;
          margin-top: 4px;
          display: block;
        }

        .inspector-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.3);
          color: #fed7aa;
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .inspector-close-btn:hover {
          background: rgba(245, 158, 11, 0.2);
          border-color: #f59e0b;
          color: #fff;
        }

        .inspector-body {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .modal-mode-tabs {
          display: flex;
          gap: 6px;
        }

        .modal-mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 600;
          color: #d6c7b2;
          background: rgba(36, 28, 22, 0.8);
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-mode-btn:hover {
          color: #fff;
          border-color: rgba(229, 179, 66, 0.5);
          background: rgba(48, 38, 30, 0.95);
        }

        .modal-mode-btn.active {
          background: rgba(229, 179, 66, 0.25);
          border-color: #f59e0b;
          color: #fbbf24;
          box-shadow: 0 0 12px rgba(229, 179, 66, 0.3);
        }

        .inspector-studio-viewport {
          width: 100%;
          height: 480px;
          border-radius: 10px;
          overflow: hidden;
          background: #080706;
          border: 1px solid rgba(229, 179, 66, 0.3);
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
        }

        .inspector-reference-display {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .reference-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 14px;
        }

        @media (max-width: 768px) {
          .reference-grid {
            grid-template-columns: 1fr;
          }
        }

        .ref-panel {
          background: rgba(20, 16, 12, 0.9);
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ref-panel-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ref-badge {
          font-family: var(--font-mono);
          font-size: 8.5px;
          font-weight: 700;
          color: #f59e0b;
          letter-spacing: 0.08em;
        }

        .ref-panel-header h4 {
          font-size: 11px;
          color: #d6c7b2;
          margin: 0;
          font-weight: 500;
        }

        .ref-img-wrap {
          border-radius: 6px;
          overflow: hidden;
          background: #0d0a08;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 380px;
        }

        .ref-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .ref-face-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
        }

        .inspector-specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
        }

        .spec-card {
          background: rgba(24, 18, 14, 0.85);
          border: 1px solid rgba(245, 158, 11, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .spec-label {
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: #fb923c;
          letter-spacing: 0.8px;
        }

        .spec-val {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
        }

        .spec-sub {
          font-size: 10px;
          color: #94a3b8;
          line-height: 1.35;
        }

        .aboutme-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .highlights-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .highlight-tag {
          font-family: var(--font-mono);
          font-size: 10px;
          background: rgba(34, 197, 94, 0.15);
          color: #86efac;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        /* Projects Grid */
        .projects-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .project-highlight-card {
          background: rgba(30, 24, 18, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.25);
          border-radius: 8px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .project-highlight-card.flagship {
          border-color: rgba(239, 68, 68, 0.45);
          background: linear-gradient(135deg, rgba(69, 26, 3, 0.5) 0%, rgba(30, 24, 18, 0.9) 100%);
        }

        .proj-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .proj-badge {
          font-family: var(--font-mono);
          font-size: 8.5px;
          background: rgba(56, 189, 248, 0.2);
          color: #38bdf8;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.35);
        }

        .flagship-badge {
          background: rgba(239, 68, 68, 0.25);
          color: #fca5a5;
          border-color: rgba(239, 68, 68, 0.45);
        }

        .proj-title {
          font-family: var(--font-display);
          font-size: 14px;
          color: #fff;
        }

        .proj-desc {
          font-size: 11.5px;
          color: #d6c7b2;
          line-height: 1.45;
        }

        .proj-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .proj-tags span {
          font-size: 9.5px;
          font-family: var(--font-mono);
          background: rgba(255, 255, 255, 0.05);
          color: #fed7aa;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Qualifications */
        .qual-cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 10px;
        }

        .qual-col-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-family: var(--font-display);
          color: #fff;
          margin-bottom: 8px;
        }

        .edu-card {
          background: rgba(30, 24, 18, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          margin-bottom: 8px;
        }

        .edu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2px;
        }

        .edu-deg {
          font-size: 11px;
          font-weight: 700;
          color: #fed7aa;
        }

        .edu-period {
          font-size: 9px;
          font-family: var(--font-mono);
          color: #f59e0b;
        }

        .edu-inst {
          font-size: 10px;
          color: #94a3b8;
          display: block;
        }

        .edu-badge {
          font-size: 8.5px;
          font-family: var(--font-mono);
          color: #34d399;
          margin-top: 3px;
          display: inline-block;
        }

        .skills-tags-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 10px;
        }

        .skill-pill {
          font-family: var(--font-mono);
          font-size: 10px;
          background: rgba(30, 25, 20, 0.8);
          border: 1px solid rgba(229, 179, 66, 0.3);
          color: #e2e8f0;
          padding: 3px 7px;
          border-radius: 4px;
        }

        .db-pill {
          border-color: rgba(56, 189, 248, 0.35);
          color: #7dd3fc;
        }

        .specialties-box {
          background: rgba(20, 16, 12, 0.7);
          border-radius: 6px;
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .spec-title {
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: #fb923c;
          letter-spacing: 0.8px;
          display: block;
          margin-bottom: 4px;
        }

        .specialties-box ul {
          list-style: none;
          font-size: 10.5px;
          color: #cbd5e1;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        /* Scene 6: Contact Grid */
        .nexus-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 14px;
          margin-bottom: 14px;
        }

        .nexus-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          text-align: left;
          background: rgba(30, 24, 18, 0.85);
          border: 1px solid rgba(229, 179, 66, 0.3);
          border-radius: 8px;
          color: #f1f5f9;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .nexus-btn:hover {
          border-color: var(--tva-gold);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), 0 0 12px rgba(229, 179, 66, 0.3);
        }

        .github-btn {
          border-color: rgba(255, 255, 255, 0.2);
        }

        .github-btn:hover {
          border-color: #ffffff;
          box-shadow: 0 0 12px rgba(255, 255, 255, 0.3);
        }

        .linkedin-btn {
          border-color: rgba(56, 189, 248, 0.35);
        }

        .linkedin-btn:hover {
          border-color: #38bdf8;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.4);
        }

        .email-btn {
          border-color: rgba(245, 158, 11, 0.35);
        }

        .email-btn:hover {
          border-color: #f59e0b;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.4);
        }

        .resume-btn {
          border-color: rgba(239, 68, 68, 0.4);
          background: linear-gradient(135deg, rgba(69, 26, 3, 0.6) 0%, rgba(30, 24, 18, 0.9) 100%);
        }

        .resume-btn:hover {
          border-color: #ef4444;
          box-shadow: 0 0 14px rgba(239, 68, 68, 0.5);
        }

        .btn-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .btn-sup {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #94a3b8;
          letter-spacing: 0.5px;
        }

        .btn-main {
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 600;
          color: #fff;
        }

        .link-arrow {
          color: #64748b;
        }

        .nexus-meta-row {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }

        .nexus-meta-box {
          flex: 1;
          background: rgba(20, 16, 12, 0.7);
          padding: 8px 10px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .box-title {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #fb923c;
          display: block;
          margin-bottom: 2px;
        }

        .nexus-meta-box p {
          font-size: 10.5px;
          color: #cbd5e1;
        }

        /* Scene 7: Conclusion */
        .sign-off {
          font-family: var(--font-display);
          font-size: 18px;
          color: #ffd868;
          margin: 6px 0 12px 0;
          letter-spacing: 1px;
        }

        @media (max-width: 768px) {
          .station-overlay-container {
            bottom: 85px;
            left: 12px;
            width: calc(100vw - 24px);
            max-width: none;
          }

          .wide-card {
            width: 100%;
          }

          .aboutme-layout {
            flex-direction: column;
          }

          .navas-3d-showcase {
            width: 100%;
            max-width: 240px;
            align-items: center;
          }

          .navas-img-frame.interactive-frame {
            height: 220px;
            width: 100%;
          }

          .qual-cols {
            grid-template-columns: 1fr;
          }

          .nexus-links-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
