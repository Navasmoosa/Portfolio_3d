import React from 'react';
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
} from 'lucide-react';
import {
  PERSONAL_INFO,
  STATIONS,
  EDUCATION_DATA,
  SKILLS_DATA,
  APPS_DATA,
} from '../../data/portfolioData';

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
}) {
  const currentStation = STATIONS[currentStationIndex] || STATIONS[0];

  return (
    <div className="station-overlay-container">
      {/* ========================================================
          SCENE 1: WELCOME & IDENTIFICATION
      ======================================================== */}
      {currentStation.id === 'welcome' && (
        <div className="tva-panel station-card animate-fadeIn">
          <div className="card-badge">NAVAS VARIANCE AUTHORITY // DOSSIER #88019-KP</div>
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
            <span className="quote-badge">MISS MINUTES BRIEF:</span>
            <p>"{currentStation.quote}"</p>
          </div>

          <button
            onClick={onOpenCaseFile}
            className="tva-btn tva-btn-primary full-btn"
          >
            <FileText size={16} />
            <span>Open Confidential TVA Case-File</span>
          </button>
        </div>
      )}

      {/* ========================================================
          SCENE 2: ABOUT ME (DISPLAY NAVAS MOOSA 3D IMAGE ON LEFT)
      ======================================================== */}
      {currentStation.id === 'aboutme' && (
        <div className="tva-panel station-card aboutme-card wide-card animate-fadeIn">
          <div className="card-badge crt-badge">ALPHA VARIANT PROFILE // MASTER OF TIMELINE</div>
          <h2 className="section-title">About Navas Moosa K P</h2>

          <div className="aboutme-layout">
            {/* 3D Image Display on Left Side */}
            <div className="navas-3d-showcase">
              <div className="navas-img-frame">
                <img
                  src="/assets/navas_moosa_3d.jpg"
                  alt="Navas Moosa 3D Character Reference Sheet"
                  className="navas-3d-photo"
                />
                <div className="frame-scanline" />
                <span className="frame-corner top-left" />
                <span className="frame-corner top-right" />
                <span className="frame-corner bottom-left" />
                <span className="frame-corner bottom-right" />
              </div>
              <div className="navas-photo-caption">
                <span className="caption-tag">3D CHARACTER MODEL</span>
                <span className="caption-title">NAVAS MOOSA • ALL-BLACK SUIT</span>
              </div>
            </div>

            {/* Profile Content on Right Side */}
            <div className="aboutme-details">
              <p className="section-description">
                {PERSONAL_INFO.summary}
              </p>

              <div className="stats-grid">
                <div className="stat-pill">
                  <span className="stat-label">CLASSIFICATION</span>
                  <span className="stat-val text-green-400">{PERSONAL_INFO.classification}</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">CURRENT STUDY</span>
                  <span className="stat-val text-amber-400">MCA Scholar (Calicut Univ)</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-label">GRADUATION</span>
                  <span className="stat-val text-cyan-400">BCA Degree with Distinction</span>
                </div>
              </div>

              <div className="highlights-row">
                <span className="highlight-tag">✓ Clean React Architectures</span>
                <span className="highlight-tag">✓ Full-Stack REST Pipelines</span>
                <span className="highlight-tag">✓ Bug & Glitch Pruning</span>
              </div>

              <button
                onClick={onOpenCaseFile}
                className="tva-btn tva-btn-primary full-btn"
              >
                <FileText size={16} />
                <span>Inspect Full Archival Dossier</span>
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
          <div className="card-badge">FIELD WORK // PRUNING CODE VARIANTS</div>
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
                  Conducted on-site evaluation of enterprise IT practices, cloud workflows, agile software pipelines, and modern timeline maintenance.
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
          <div className="card-badge text-red-400">SACRED ARCHIVES // CASE-FILES</div>
          <h2 className="section-title">Flagship Applications & Projects</h2>
          <p className="section-description">
            High-impact solutions engineered for crisis relief, student campus safety, and crowdsourced tasks.
          </p>

          <div className="projects-grid">
            {/* Project 1: Disaster Management System */}
            <div className="project-highlight-card flagship">
              <div className="proj-header">
                <span className="proj-badge flagship-badge">FLAGSHIP ACADEMIC PROJECT</span>
                <h3 className="proj-title">Disaster Management System</h3>
              </div>
              <p className="proj-desc">{APPS_DATA.disaster.description}</p>
              <div className="proj-tags">
                <span>SOS Geolocation Beacon</span>
                <span>Boat & Supply Inventory</span>
                <span>Interactive Risk Map</span>
              </div>
              <button
                onClick={() => onAppSelect('disaster')}
                className="tva-btn tva-btn-primary full-btn"
              >
                <Sparkles size={15} />
                <span>Launch Disaster System Demo</span>
              </button>
            </div>

            {/* Project 2: CampusFix */}
            <div className="project-highlight-card">
              <div className="proj-header">
                <span className="proj-badge">MOBILE & WEB</span>
                <h3 className="proj-title">CampusFix</h3>
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

            {/* Project 3: PocketTask */}
            <div className="project-highlight-card">
              <div className="proj-header">
                <span className="proj-badge">MICRO-TASK PLATFORM</span>
                <h3 className="proj-title">PocketTask</h3>
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
          </div>
        </div>
      )}

      {/* ========================================================
          SCENE 5: TECHNICAL SKILLS & QUALIFICATIONS
      ======================================================== */}
      {currentStation.id === 'qualifications' && (
        <div className="tva-panel station-card wide-card animate-fadeIn">
          <div className="card-badge">TVA MINUTEMEN REGISTRY // QUALIFICATIONS</div>
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
                <span>Technical Weaponry</span>
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
          <div className="card-badge text-cyan-400">THE SACRED TIMELINE LOOM // CONTACT</div>
          <h2 className="section-title tva-gold-text">Let's Work Together</h2>
          <p className="section-description">
            Ready to collaborate or hire Navas for your engineering team? Connect across the digital multiverse using the official channels below:
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
                <span className="btn-sup">PROFESSIONAL MULTIVERSE</span>
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
                <span className="btn-sup">DIRECT DISPATCH / INBOX</span>
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
                <span className="btn-sup">TVA DOSSIER / CV</span>
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
          <div className="card-badge text-amber-400">THE TIME DOOR IS OPEN</div>
          <h2 className="section-title tva-gold-text">THANK YOU FOR WATCHING!</h2>
          <p className="sign-off">NAVAS MOOSA K P ♡</p>
          <p className="section-description">
            "For all time. Always. You are now authorized to step through the Timedoor or download Navas Moosa's confidential case-file resume."
          </p>

          <button
            onClick={onOpenCaseFile}
            className="tva-btn tva-btn-primary full-btn"
          >
            <Award size={18} />
            <span>Open & Download TVA Case-File Dossier</span>
          </button>
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

        /* Scene 2: About Me with 3D Image on Left */
        .aboutme-layout {
          display: flex;
          gap: 18px;
          margin-top: 12px;
        }

        .navas-3d-showcase {
          width: 175px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .navas-img-frame {
          position: relative;
          width: 100%;
          height: 235px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(229, 179, 66, 0.5);
          box-shadow: 0 0 16px rgba(229, 179, 66, 0.25);
          background: #110e0b;
        }

        .navas-3d-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 15% top;
          transition: transform 0.4s ease;
        }

        .navas-3d-photo:hover {
          transform: scale(1.05);
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
          gap: 2px;
          background: rgba(30, 22, 16, 0.85);
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid rgba(245, 158, 11, 0.25);
        }

        .caption-tag {
          font-family: var(--font-mono);
          font-size: 8px;
          color: #fb923c;
          letter-spacing: 0.8px;
        }

        .caption-title {
          font-family: var(--font-mono);
          font-size: 9.5px;
          font-weight: 700;
          color: #fed7aa;
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
            align-items: center;
          }

          .navas-img-frame {
            height: 180px;
            width: 180px;
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
