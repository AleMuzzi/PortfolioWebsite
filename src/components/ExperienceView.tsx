import React, { useRef } from 'react';
import { trackEvent } from '../utils/analytics';
import ReactMarkdown from 'react-markdown';
import { Experience } from '../projectsData';
import { translations, Language } from '../i18n';
import './ExperienceView.css';

interface ExperienceViewProps {
    lang: Language;
    svgHeight: number;
    educationBranches: React.ReactNode[];
    workItems: (Experience & { topPos: number; side: 'left' | 'right' })[];
    workBackgrounds: string[];
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
    onTagClick?: (tagName: string) => void;
}

export function ExperienceView({
    lang,
    svgHeight,
    educationBranches,
    workItems,
    workBackgrounds,
    handleSelect,
    onTagClick
}: ExperienceViewProps) {
    const t = translations[lang];
    const bottomRef = useRef<HTMLDivElement>(null);
    const topRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const scrollToTop = () => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderWorkHeader = (rawName: string) => {
        const separator = t.at;
        const parts = rawName.split(separator);
        if (parts.length >= 2) {
            const role = parts[0];
            const company = parts.slice(1).join(separator);
            return (
                <div className="timeline-header-split">
                    <h3>{role}</h3>
                    <div style={{ fontSize: '0.9em', color: '#94a3b8', fontWeight: '500', marginTop: '2px', fontStyle: 'italic' }}>{company}</div>
                </div>
            );
        }
        return <h3>{rawName}</h3>;
    };

    return (
        <article className="timeline-view">
            <div ref={topRef} style={{ height: '1px' }} />
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                <h2>{t.workTitle}</h2>
            </div>
          <button className="scroll-to-bottom-btn" onClick={scrollToBottom} style={{ position: 'absolute', top: '100px', right: '-20px', zIndex: 1000 }}>
            <span className="scroll-icon">↓</span> {t.scrollToBottom}
          </button>
          <button className="scroll-to-bottom-btn" onClick={scrollToTop} style={{ position: 'absolute', top: '2720px', right: '-20px', zIndex: 1000 }}>
            <span className="scroll-icon">↑</span> {t.scrollToTop}
          </button>
            <div className="timeline-container" style={{ position: 'relative' }}>
                <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 0 }}>
                    <defs>
                        <filter id="branchShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                        </filter>
                    </defs>
                    {educationBranches}
                </svg>

                {workItems.map((exp, index) => {
                    // Select image based on index, cycling if list is too short
                    const bgImage = workBackgrounds[index % workBackgrounds.length];

                    return (
                        <div
                            key={exp.id}
                            className={`timeline-item ${exp.side === 'left' ? 'timeline-item-left' : 'timeline-item-right'}`}
                            style={{ top: `${exp.topPos}%` }}
                            onClick={() => {
                                handleSelect(exp.id, 'experience');
                                trackEvent('work_experience_selection', { experience: exp.name });
                            }}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleSelect(exp.id, 'experience')}
                        >
                            {/* --- POP OUT IMAGE (Mapped by Index) --- */}
                            <img
                                src={bgImage}
                                alt=""
                                className="timeline-popout-bg"
                            />

                            <div className="timeline-dot">
                                <span className="timeline-period">{exp.period}</span>
                            </div>
                            <div className="timeline-content">
                                <div className="timeline-header">
                                    {renderWorkHeader(exp.name)}
                                </div>
                                <div className="timeline-summary">
                                    <ReactMarkdown>{exp.summary}</ReactMarkdown>
                                </div>

                                <div className="click-hint">
                                    <span>{t.seeDetails}</span>
                                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                        <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                                    </svg>
                                </div>

                                {/* --- UPDATED: Tech Stack Tags with Dynamic Alignment --- */}
                                {exp.technologies && exp.technologies.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '8px',
                                        marginTop: '14px',
                                        alignItems: 'center',
                                        // If item is on the left, align tags to the right (flex-end).
                                        // If item is on the right, align tags to the left (flex-start).
                                        justifyContent: exp.side === 'left' ? 'flex-end' : 'flex-start'
                                    }}>
                                        {exp.technologies.slice(0, 5).map((tech) => (
                                            <span 
                                                key={tech} 
                                                className="clickable-tag"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTagClick?.(tech);
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={bottomRef} style={{ height: '1px' }} />
            </div>
        </article>
    );
}
