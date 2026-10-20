import React from 'react';
import {
  X,
  Printer,
  Download,
  Award,
  Shield,
  FileCheck,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import {
  PERSONAL_INFO,
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  SKILLS_DATA,
  APPS_DATA,
} from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

export default function TVACaseFileModal({ onClose }) {
  const handlePrint = () => {
    soundEngine.playChronoChime();
    window.print();
  };

  return (
    <div className="casefile-modal-backdrop" onClick={onClose}>
      <div
        className="casefile-modal-window tva-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Actions */}
        <div className="casefile-header no-print">
          <div className="header-tag">
            <span className="wax-badge" />
            <span>PROFESSIONAL RESUME // CURRICULUM VITAE</span>
          </div>

          <div className="header-actions">
            <button
              onClick={handlePrint}
              className="tva-btn tva-btn-primary"
              title="Print / Save PDF Resume"
            >
              <Printer size={15} />
              <span>Print / Save Resume</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playTemPadClick();
                onClose();
              }}
              className="tva-btn"
              title="Close Resume"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Dossier Sheet */}
        <div className="dossier-paper" id="printable-resume">
          {/* Top Folder Banner */}
          <div className="folder-top-banner">
            <div className="folder-stamps">
              <span className="stamp green-stamp">VERIFIED RESUME</span>
              <span className="stamp black-stamp">PORTFOLIO CV</span>
              <span className="stamp red-stamp">OPEN FOR HIRE</span>
            </div>
            <div className="file-number">
              CANDIDATE: <strong>NAVAS MOOSA K P</strong> • LOCATION: <strong>KOZHIKODE, KERALA</strong>
            </div>
          </div>

          {/* Dossier Title Header */}
          <div className="dossier-candidate-header">
            <div className="candidate-info">
              <h1 className="candidate-name">{PERSONAL_INFO.name}</h1>
              <p className="candidate-role">{PERSONAL_INFO.title}</p>

              <div className="candidate-contacts">
                <span><MapPin size={12} /> {PERSONAL_INFO.address}</span>
                <span><Phone size={12} /> {PERSONAL_INFO.phone}</span>
                <a href={`mailto:${PERSONAL_INFO.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <span><Mail size={12} /> {PERSONAL_INFO.email}</span>
                </a>
                <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer" style={{ color: '#b45309', fontWeight: 600 }}>
                  <span>GitHub: Navasmoosa</span>
                </a>
                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#0369a1', fontWeight: 600 }}>
                  <span>LinkedIn Profile</span>
                </a>
              </div>
            </div>

            <div className="tva-seal-emblem">
              <img
                src="/assets/tva_case_file.jpg"
                alt="TVA Seal"
                className="tva-seal-photo"
              />
            </div>
          </div>

          <hr className="dossier-divider" />

          {/* Professional Summary */}
          <section className="dossier-section">
            <h3 className="section-heading">I. PROFESSIONAL SUMMARY</h3>
            <p className="summary-paragraph">
              {PERSONAL_INFO.summary}
            </p>
          </section>

          {/* Education */}
          <section className="dossier-section">
            <h3 className="section-heading">II. EDUCATION & ACADEMIC BACKGROUND</h3>
            <div className="edu-list">
              {EDUCATION_DATA.map((item, idx) => (
                <div key={idx} className="edu-entry">
                  <div className="edu-row">
                    <span className="entry-title">{item.degree}</span>
                    <span className="entry-period">{item.period}</span>
                  </div>
                  <div className="edu-sub">
                    <span>{item.institution}</span>
                    <span className="entry-status">• {item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Technical Skills */}
          <section className="dossier-section">
            <h3 className="section-heading">III. TECHNICAL SKILLS & COMPETENCIES</h3>
            <div className="skills-grid">
              <div>
                <strong>Languages & Frameworks:</strong>
                <p>JavaScript (ES6+), React.js, Python, Node.js, HTML5, Modern CSS, Express.js</p>
              </div>
              <div>
                <strong>Databases & Storage:</strong>
                <p>PostgreSQL, MongoDB, MySQL, Modern Relational & Document Schema Modeling</p>
              </div>
              <div>
                <strong>Core Specialties:</strong>
                <p>Full-Stack Web Engineering, REST API Design & Integration, Responsive UI/UX, Performance Optimization</p>
              </div>
              <div>
                <strong>Soft Skills & Languages:</strong>
                <p>Critical Thinking, Agile Collaboration, Problem Solving • English, Malayalam, Hindi, Arabic</p>
              </div>
            </div>
          </section>

          {/* Featured Projects */}
          <section className="dossier-section">
            <h3 className="section-heading">IV. FEATURED PROJECTS & APPLICATIONS</h3>





            {/* Disaster Management System */}
            <div className="project-entry">
              <div className="project-head">
                <span className="entry-title">Disaster Management System (Academic Project)</span>
                <span className="tech-badge">React.js, Leaflet Maps, Node.js, PostgreSQL</span>
              </div>
              <p className="project-desc">
                Centralized emergency SOS coordination platform with live danger zone heatmaps, supply inventory tracking, and volunteer fleet allocation.
              </p>
            </div>
          </section>

          {/* Work Experience */}
          <section className="dossier-section">
            <h3 className="section-heading">V. WORK EXPERIENCE</h3>
            <div className="experience-dossier-list">
              {EXPERIENCE_DATA.map((exp, idx) => (
                <div key={idx} className="exp-dossier-entry">
                  <div className="exp-dossier-head">
                    <span className="entry-title">{exp.role} – {exp.company}</span>
                    <span className="tech-badge">{exp.badge}</span>
                  </div>
                  <div className="exp-dossier-sub">
                    <span className="exp-program-name">{exp.program}</span>
                  </div>
                  <div className="exp-project-name">
                    <strong>Project:</strong> {exp.projectTitle}
                  </div>
                  <ul className="exp-bullet-points">
                    {exp.highlights.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Official Sign-off */}
          <div className="dossier-footer">
            <div className="seal-signature">
              <span className="approved-text">VERIFIED PROFESSIONAL RESUME • NAVAS MOOSA K P</span>
              <span className="sacred-motto">"FULL-STACK DEVELOPER • READY FOR COLLABORATION"</span>
            </div>
          </div>
        </div>
      </div >

      <style>{`
        .casefile-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(10, 8, 6, 0.9);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 70;
          padding: 20px;
          animation: fadeIn 0.25s ease-out;
        }

        .casefile-modal-window {
          width: 860px;
          max-width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          border: 1px solid var(--tva-gold);
          box-shadow: 0 20px 50px rgba(0,0,0,0.9), 0 0 30px rgba(212, 175, 55, 0.2);
        }

        .casefile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          border-bottom: 1px solid var(--tva-border);
          background: rgba(22, 18, 14, 0.95);
        }

        .header-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: #ffd868;
          letter-spacing: 1px;
        }

        .wax-badge {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #dc2626;
          box-shadow: 0 0 8px #ef4444;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Dossier Paper Texture */
        .dossier-paper {
          background: #fbf7ee;
          color: #1e1b18;
          padding: 36px 44px;
          font-family: 'Inter', sans-serif;
          position: relative;
        }

        .folder-top-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px dashed #9c8e7e;
          padding-bottom: 12px;
          margin-bottom: 20px;
        }

        .folder-stamps {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .stamp {
          font-family: 'Share Tech Mono', monospace;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 1px;
          padding: 3px 8px;
          border: 2px solid currentColor;
          border-radius: 2px;
          text-transform: uppercase;
        }

        .red-stamp {
          color: #b91c1c;
          border-color: #b91c1c;
          transform: rotate(-2deg);
        }

        .black-stamp {
          color: #292524;
          border-color: #292524;
        }

        .green-stamp {
          color: #15803d;
          border-color: #15803d;
          transform: rotate(2deg);
        }

        .file-number {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #57534e;
        }

        .dossier-candidate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .candidate-name {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 2px;
          color: #1c1917;
          margin-bottom: 4px;
        }

        .candidate-role {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #854d0e;
          margin-bottom: 10px;
        }

        .candidate-contacts {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          font-size: 12px;
          color: #44403c;
          font-family: 'Share Tech Mono', monospace;
        }

        .candidate-contacts span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .tva-seal-emblem {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          border: 2px solid #b45309;
        }

        .tva-seal-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dossier-divider {
          border: none;
          height: 2px;
          background: #78350f;
          margin-bottom: 20px;
        }

        .dossier-section {
          margin-bottom: 20px;
        }

        .section-heading {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1px;
          color: #78350f;
          border-bottom: 1px solid #d6d3d1;
          padding-bottom: 4px;
          margin-bottom: 10px;
        }

        .summary-paragraph {
          font-size: 12.5px;
          line-height: 1.6;
          color: #292524;
        }

        .edu-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .edu-entry {
          display: flex;
          flex-direction: column;
        }

        .edu-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .entry-title {
          font-size: 13px;
          font-weight: 700;
          color: #1c1917;
        }

        .entry-period {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #57534e;
        }

        .edu-sub {
          font-size: 12px;
          color: #44403c;
          display: flex;
          gap: 6px;
        }

        .entry-status {
          color: #15803d;
          font-weight: 500;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          font-size: 12px;
          color: #292524;
        }

        .skills-grid strong {
          display: block;
          color: #1c1917;
          margin-bottom: 2px;
        }

        .skills-grid p {
          color: #44403c;
          line-height: 1.5;
        }

        .project-entry {
          margin-bottom: 12px;
        }

        .project-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
        }

        .tech-badge {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          background: #e7e5e4;
          padding: 2px 6px;
          border-radius: 4px;
          color: #44403c;
        }

        .project-desc {
          font-size: 12px;
          color: #44403c;
          line-height: 1.5;
        }

        .experience-dossier-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .exp-dossier-entry {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .exp-dossier-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .exp-dossier-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          color: #854d0e;
          font-weight: 600;
        }

        .exp-project-name {
          font-size: 12px;
          color: #1c1917;
          margin-top: 2px;
        }

        .exp-bullet-points {
          margin-top: 4px;
          padding-left: 18px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #44403c;
          line-height: 1.5;
        }

        .exp-bullet-points li {
          list-style-type: disc;
        }

        .dossier-footer {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #d6d3d1;
          padding-top: 14px;
        }

        .seal-signature {
          display: flex;
          flex-direction: column;
        }

        .approved-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 10px;
          letter-spacing: 1px;
          color: #78716c;
        }

        .sacred-motto {
          font-family: 'Cinzel', serif;
          font-size: 12px;
          font-weight: bold;
          color: #b45309;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .casefile-modal-backdrop {
            position: static;
            background: none;
            padding: 0;
          }
          .casefile-modal-window {
            box-shadow: none;
            border: none;
            max-height: none;
            width: 100%;
          }
          .dossier-paper {
            padding: 0;
            background: none;
          }
        }

        @media (max-width: 640px) {
          .casefile-modal-backdrop {
            padding: 8px;
          }
          .casefile-modal-window {
            max-height: 94dvh;
            border-radius: 8px;
          }
          .casefile-header {
            padding: 10px 12px;
          }
          .header-tag span {
            font-size: 9.5px;
          }
          .dossier-paper {
            padding: 16px 14px;
          }
          .skills-grid {
            grid-template-columns: 1fr;
          }
          .dossier-candidate-header {
            flex-direction: column-reverse;
            align-items: flex-start;
            gap: 10px;
          }
          .candidate-name {
            font-size: 20px;
          }
          .candidate-contacts {
            font-size: 11px;
            gap: 8px;
          }
          .tva-seal-emblem {
            width: 60px;
            height: 60px;
          }
        }
      `}</style>
    </div >
  );
}
