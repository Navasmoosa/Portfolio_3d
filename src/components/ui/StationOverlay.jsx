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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  STATIONS,
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  SKILLS_DATA,
  APPS_DATA,
} from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

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

  const [isCollapsed, setIsCollapsed] = useState(false);

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
                {/* Navas Moosa Avatar Face on Left Side */}
                <div className="navas-3d-showcase">
                  <div className="navas-avatar-frame">
                    <img
                      src="/assets/navas_avatar_face.png"
                      alt="Navas Moosa"
                      className="navas-avatar-face-img"
                    />
                    <div className="frame-scanline" />
                    <span className="frame-corner top-left" />
                    <span className="frame-corner top-right" />
                    <span className="frame-corner bottom-left" />
                    <span className="frame-corner bottom-right" />
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
            <div className="tva-panel station-card wide-card animate-fadeIn">
              <div className="card-badge text-amber-400">WORK EXPERIENCE // PRACTICAL WORK</div>
              <h2 className="section-title">Professional Experience</h2>
              <p className="section-description">
                Hands-on Research & Development training and system architecture.
              </p>

              <div className="experience-container">
                {EXPERIENCE_DATA.map((exp, idx) => (
                  <div key={idx} className="experience-card">
                    <div className="exp-card-header">
                      <div className="exp-role-group">
                        <span className="exp-role">{exp.role}</span>
                        <span className="exp-company">@ {exp.company}</span>
                      </div>
                      <span className="exp-badge">{exp.badge}</span>
                    </div>

                    <div className="exp-program-tag">
                      {exp.program}
                    </div>

                    <div className="exp-project-box">
                      <span className="exp-project-label">CORE SYSTEM ARCHITECTURE:</span>
                      <h4 className="exp-project-title">{exp.projectTitle}</h4>
                    </div>

                    <div className="exp-highlights-list">
                      {exp.highlights.map((point, pIdx) => (
                        <div key={pIdx} className="exp-highlight-item">
                          <span className="exp-bullet-glow">▸</span>
                          <p className="exp-highlight-text">{point}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
          width: 220px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .navas-avatar-frame {
          position: relative;
          width: 100%;
          height: 290px;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(229, 179, 66, 0.45);
          box-shadow: 0 0 20px rgba(229, 179, 66, 0.2), inset 0 0 25px rgba(0, 0, 0, 0.8);
          background: radial-gradient(circle at 50% 32%, rgba(229, 179, 66, 0.12) 0%, rgba(24, 18, 14, 0.95) 75%);
          display: flex;
          align-items: flex-end;
          justify-content: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .navas-avatar-frame:hover {
          box-shadow: 0 0 25px rgba(229, 179, 66, 0.35), inset 0 0 20px rgba(0, 0, 0, 0.7);
        }

        .navas-avatar-face-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.75));
          transition: transform 0.35s ease;
        }

        .navas-avatar-frame:hover .navas-avatar-face-img {
          transform: scale(1.04);
        }

        .frame-scanline {
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

        /* Experience Card Styles */
        .experience-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 10px;
        }

        .experience-card {
          background: rgba(30, 24, 18, 0.88);
          border: 1px solid rgba(229, 179, 66, 0.35);
          border-radius: 10px;
          padding: 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 16px rgba(229, 179, 66, 0.05);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }

        .experience-card:hover {
          border-color: rgba(245, 158, 11, 0.65);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.6), 0 0 18px rgba(245, 158, 11, 0.2);
        }

        .exp-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          flex-wrap: wrap;
        }

        .exp-role-group {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
        }

        .exp-role {
          font-family: var(--font-display);
          font-size: 15px;
          font-weight: 700;
          color: #fef08a;
          letter-spacing: 0.5px;
        }

        .exp-company {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 700;
          color: #fb923c;
          letter-spacing: 0.5px;
        }

        .exp-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          font-weight: 700;
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid rgba(245, 158, 11, 0.4);
          letter-spacing: 0.5px;
        }

        .exp-program-tag {
          font-family: var(--font-mono);
          font-size: 11px;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(56, 189, 248, 0.25);
          display: inline-block;
          width: fit-content;
        }

        .exp-project-box {
          background: rgba(18, 14, 10, 0.75);
          border-left: 3px solid #f59e0b;
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
          margin: 2px 0;
        }

        .exp-project-label {
          font-family: var(--font-mono);
          font-size: 8.5px;
          color: #a89a8a;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 2px;
        }

        .exp-project-title {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .exp-highlights-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 2px;
        }

        .exp-highlight-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .exp-bullet-glow {
          color: #f59e0b;
          font-size: 13px;
          line-height: 1.4;
          text-shadow: 0 0 6px rgba(245, 158, 11, 0.8);
          flex-shrink: 0;
        }

        .exp-highlight-text {
          font-size: 11.5px;
          color: #d6c7b2;
          line-height: 1.5;
          margin: 0;
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

          .navas-avatar-frame {
            height: 240px;
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
