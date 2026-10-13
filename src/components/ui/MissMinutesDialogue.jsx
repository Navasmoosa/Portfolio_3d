import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, ChevronRight, X, Volume2, ExternalLink, FileText } from 'lucide-react';
import { STATIONS, PERSONAL_INFO, APPS_DATA } from '../../data/portfolioData';
import { soundEngine } from '../../utils/SoundEffects';

export default function MissMinutesDialogue({
  currentStationIndex,
  onNextStation,
  onAppSelect,
  onOpenCaseFile,
}) {
  const currentStation = STATIONS[currentStationIndex] || STATIONS[0];
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Typewriter effect when station changes
  useEffect(() => {
    const fullText = currentStation.missMinutesSpeech;
    setDisplayedText('');
    setIsTyping(true);

    let charIndex = 0;
    // Play voice chime at start of speech
    soundEngine.playMissMinutesVoice();

    const interval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.substring(0, charIndex + 1));
        // Soft audio click every 5 characters
        if (charIndex % 5 === 0) {
          soundEngine.playTypewriter();
        }
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);

    return () => clearInterval(interval);
  }, [currentStationIndex, currentStation.missMinutesSpeech]);

  return (
    <aside
      aria-label="Interactive Virtual Guide Box"
      className={`miss-minutes-card ${isMinimized ? 'minimized' : ''}`}
    >
      {/* Header with Miss Minutes Hologram Avatar */}
      <div className="mm-header">
        <div className="mm-avatar-wrap animate-float">
          <img
            src="/assets/miss_minutes_desk.jpg"
            alt="Miss Minutes Hologram"
            className="mm-avatar-img"
          />
          <span className="mm-online-dot" />
        </div>

        <div className="mm-identity">
          <div className="mm-name-row">
            <span className="mm-name">MISS MINUTES</span>
            <span className="mm-badge">PORTFOLIO GUIDE</span>
          </div>
          <span className="mm-role">Virtual Portfolio Assistant</span>
        </div>

        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="mm-toggle-btn"
          title={isMinimized ? 'Expand Guide' : 'Minimize'}
        >
          {isMinimized ? <MessageSquare size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Main Transparent Speech Box */}
      {!isMinimized && (
        <div className="mm-body">
          <div className="mm-speech-bubble">
            <div className="mm-bubble-tag">
              <span className="tag-dot" />
              <span>GUIDE MESSAGE • SECTION {currentStation.stepNumber} OF {STATIONS.length}</span>
            </div>
            <p className="mm-text">
              {displayedText}
              {isTyping && <span className="typing-cursor">█</span>}
            </p>
          </div>

          {/* Quick Context Action Buttons */}
          <div className="mm-actions">
            {currentStation.id === 'aboutme' && (
              <button
                onClick={onOpenCaseFile}
                className="tva-btn tva-btn-primary mm-action-btn"
              >
                <FileText size={14} />
                <span>View Complete Resume</span>
              </button>
            )}

            {currentStation.id === 'projects' && (
              <>
                {APPS_DATA?.disaster && (
                  <button
                    onClick={() => onAppSelect('disaster')}
                    className="tva-btn tva-btn-primary mm-action-btn"
                  >
                    <Sparkles size={14} />
                    <span>Disaster Demo</span>
                  </button>
                )}
                {APPS_DATA?.campusfix && (
                  <button
                    onClick={() => onAppSelect('campusfix')}
                    className="tva-btn mm-action-btn"
                  >
                    <span>CampusFix</span>
                  </button>
                )}
                {APPS_DATA?.pockettask && (
                  <button
                    onClick={() => onAppSelect('pockettask')}
                    className="tva-btn mm-action-btn"
                  >
                    <span>PocketTask</span>
                  </button>
                )}
              </>
            )}

            {currentStation.id === 'contact' && (
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tva-btn tva-btn-primary mm-action-btn"
              >
                <ExternalLink size={14} />
                <span>Open GitHub</span>
              </a>
            )}

            {currentStation.id === 'thankyou' && (
              <button
                onClick={onOpenCaseFile}
                className="tva-btn tva-btn-primary mm-action-btn"
              >
                <Sparkles size={14} />
                <span>Download Resume PDF</span>
              </button>
            )}

            <button
              onClick={() => {
                soundEngine.playMissMinutesVoice();
              }}
              className="tva-btn mm-voice-btn"
              title="Play Audio Chime"
            >
              <Volume2 size={14} className="text-orange-400" />
              <span>Chime</span>
            </button>

            {currentStationIndex < STATIONS.length - 1 && (
              <button
                onClick={onNextStation}
                className="tva-btn mm-next-btn"
              >
                <span>Continue Tour</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .miss-minutes-card {
          position: absolute;
          top: 75px;
          right: 24px;
          width: 400px;
          max-width: calc(100vw - 48px);
          background: rgba(22, 17, 13, 0.82);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(249, 115, 22, 0.45);
          border-radius: 14px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.8), 0 0 30px rgba(249, 115, 22, 0.25);
          z-index: 35;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .miss-minutes-card.minimized {
          width: 270px;
          border-color: rgba(229, 179, 66, 0.35);
        }

        .mm-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: linear-gradient(135deg, rgba(234, 88, 12, 0.22) 0%, rgba(20, 16, 12, 0.5) 100%);
          border-bottom: 1px solid rgba(249, 115, 22, 0.25);
        }

        .mm-avatar-wrap {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid #ff7700;
          box-shadow: 0 0 16px rgba(255, 119, 0, 0.7);
          flex-shrink: 0;
          overflow: hidden;
        }

        .mm-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .mm-online-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 11px;
          height: 11px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #1a1510;
          box-shadow: 0 0 6px #22c55e;
        }

        .mm-identity {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .mm-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .mm-name {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 14px;
          color: #ff9800;
          letter-spacing: 1.2px;
        }

        .mm-badge {
          font-family: var(--font-mono);
          font-size: 9px;
          background: rgba(249, 115, 22, 0.25);
          color: #ffb74d;
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(249, 115, 22, 0.4);
          letter-spacing: 0.5px;
        }

        .mm-role {
          font-size: 11px;
          color: #d6c7b2;
          font-family: var(--font-sans);
        }

        .mm-toggle-btn {
          background: transparent;
          border: none;
          color: #b09f8e;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .mm-toggle-btn:hover {
          color: #ffb74d;
          background: rgba(255, 255, 255, 0.08);
        }

        .mm-body {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .mm-speech-bubble {
          background: rgba(30, 22, 16, 0.72);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(249, 115, 22, 0.3);
          border-radius: 10px;
          padding: 14px 16px;
          position: relative;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .mm-bubble-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 9.5px;
          color: #fb923c;
          letter-spacing: 0.8px;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 6px #f97316;
          animation: pulseGlow 1.2s infinite alternate;
        }

        .mm-text {
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.65;
          color: #ffedd5;
          letter-spacing: 0.2px;
        }

        .typing-cursor {
          display: inline-block;
          color: #ff7700;
          animation: pulseGlow 0.6s infinite alternate;
          margin-left: 3px;
        }

        .mm-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .mm-action-btn {
          flex: 1;
          justify-content: center;
          padding: 8px 12px;
          font-size: 11.5px;
        }

        .mm-voice-btn, .mm-next-btn {
          padding: 8px 12px;
          font-size: 11.5px;
        }

        @media (max-width: 768px) {
          .miss-minutes-card {
            top: 60px;
            right: 12px;
            width: calc(100vw - 24px);
          }
          .mm-text {
            font-size: 12px;
          }
        }
      `}</style>
    </aside>
  );
}
