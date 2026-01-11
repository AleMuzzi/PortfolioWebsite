import { useState, useMemo, useRef, useLayoutEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects, experiences } from './projectsData';
import { translations, Language } from './i18n';

import printerWithRobot from './assets/printer_with_robot.png';
import laptop from './assets/laptop.png';
import solderingIron from './assets/soldering_iron.png';
import laptopCables from './assets/laptop_cables.png';

interface Rect {
    top: number;
    bottom: number;
    left: number;
    right: number;
    type: 'card' | 'date-label' | 'edu-label';
}

function App() {
    const [lang, setLang] = useState<Language>('en');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'project' | 'experience' | 'about' | 'home' | null>('home');
    const [showVibeModal, setShowVibeModal] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const workItemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const timelineContainerRef = useRef<HTMLDivElement>(null);

    const [staticObstacles, setStaticObstacles] = useState<Rect[]>([]);

    const t = translations[lang];

    const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
    const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);

    const educationPeriods = useMemo(() => {
        const schools = [
            { period: '2010 — 2015', label: t.highschool.split('\n')[0], color: '#f59e0b', startYear: 2010, endYear: 2015 },
            { period: '2015 — 2018', label: t.bachelors.split('\n')[0], color: '#10b981', startYear: 2015, endYear: 2018 },
            { period: '2019 — 2022', label: t.masters.split('\n')[0], color: '#3b82f6', startYear: 2019, endYear: 2022 }
        ];
        schools.sort((a, b) => a.startYear - b.startYear);
        return schools;
    }, [t]);

    const { workItems, minYear, maxYear, yearRange, svgHeight } = useMemo(() => {
        const _allYears: number[] = [];
        filteredExperiences.forEach(exp => {
            const years = exp.period.match(/\d{4}/g);
            if (years) {
                _allYears.push(parseInt(years[0]));
                if (years[1]) _allYears.push(parseInt(years[1]));
            }
        });
        educationPeriods.forEach(edu => {
            _allYears.push(edu.startYear, edu.endYear);
        });

        const _minYear = Math.min(..._allYears, 2010);
        const _maxYear = Math.max(..._allYears, new Date().getFullYear() + 1);
        const _yearRange = _maxYear - _minYear;

        const getYearPosition = (year: number) => ((_maxYear - year) / _yearRange) * 100;

        const _workItems = filteredExperiences.map((exp, index) => {
            const years = exp.period.match(/\d{4}/g);
            const expStartYear = years ? Number.parseInt(years[0]) : _maxYear;
            const topPos = getYearPosition(expStartYear);
            return {
                ...exp,
                index,
                topPos,
                side: index % 2 === 0 ? 'left' : 'right' as 'left' | 'right',
                startYear: expStartYear
            };
        });

        return {
            workItems: _workItems,
            minYear: _minYear,
            maxYear: _maxYear,
            yearRange: _yearRange,
            svgHeight: 1200
        };
    }, [filteredExperiences, educationPeriods]);

    const getYearPosition = (year: number) => ((maxYear - year) / yearRange) * 100;

    useLayoutEffect(() => {
        if (selectedType !== 'experience' || !timelineContainerRef.current) return;

        const containerRect = timelineContainerRef.current.getBoundingClientRect();
        const currentObstacles: Rect[] = [];
        const BUFFER = 40;

        const scaleX = 1000 / containerRect.width;

        workItems.forEach(item => {
            const el = workItemRefs.current.get(item.id);
            if (el) {
                const rect = el.getBoundingClientRect();
                const domTop = rect.top - containerRect.top;
                const domBottom = rect.bottom - containerRect.top;
                const domLeft = rect.left - containerRect.left;
                const domRight = rect.right - containerRect.left;

                currentObstacles.push({
                    top: domTop - BUFFER,
                    bottom: domBottom + BUFFER,
                    left: domLeft * scaleX - BUFFER,
                    right: domRight * scaleX + BUFFER,
                    type: 'card'
                });

                const dateEl = el.querySelector('.timeline-period');
                if (dateEl) {
                    const dateRect = dateEl.getBoundingClientRect();
                    const dLeft = dateRect.left - containerRect.left;
                    const dRight = dateRect.right - containerRect.left;
                    const dTop = dateRect.top - containerRect.top;
                    const dBottom = dateRect.bottom - containerRect.top;

                    currentObstacles.push({
                        top: dTop - BUFFER,
                        bottom: dBottom + BUFFER,
                        left: dLeft * scaleX - BUFFER,
                        right: dRight * scaleX + BUFFER,
                        type: 'date-label'
                    });
                }
            }
        });

        // Widen the Central Spine Obstacle to prevent tight squeezes
        currentObstacles.push({
            top: 0,
            bottom: svgHeight,
            left: 450, // Widened from 480
            right: 550, // Widened from 520
            type: 'date-label'
        });

        setStaticObstacles(prev => {
            if (prev.length !== currentObstacles.length) return currentObstacles;
            return currentObstacles;
        });

    }, [workItems, selectedType, lang, svgHeight]);

    const educationBranches = useMemo(() => {
        const svgWidth = 1000;
        const timelineX = svgWidth / 2;

        // 1. TIGHTER TRACK (As requested)
        const branchOffset = 15;

        // 2. SAFETY MARGIN
        // Ensure label starts at least 70px from center to avoid hitting date labels
        const minCenterClearance = 70;
        const trackToLabelMargin = Math.max(20, minCenterClearance - branchOffset);

        const labelW = 180;
        const labelH = 90;

        const allObstacles = [...staticObstacles];

        const isOverlapping = (testRect: Rect) => {
            return allObstacles.some(obs => {
                return !(testRect.right < obs.left ||
                    testRect.left > obs.right ||
                    testRect.bottom < obs.top ||
                    testRect.top > obs.bottom);
            });
        };

        return educationPeriods.map((edu) => {
            const bottomY = (getYearPosition(edu.startYear) / 100) * svgHeight;
            const topY = (getYearPosition(edu.endYear) / 100) * svgHeight;

            // Search Start: Bottom of visual bracket (Oldest date)
            const searchStartY = Math.max(bottomY, topY);
            const searchLimitY = 0;

            let bestY = searchStartY;
            let bestSide: 'left' | 'right' = 'right';
            let found = false;

            const step = 15;

            // Bottom-Up Scan
            for (let currentY = searchStartY; currentY >= searchLimitY; currentY -= step) {
                const sides: ('right' | 'left')[] = ['right', 'left'];

                for (const side of sides) {
                    const xLeft = side === 'right'
                        ? timelineX + branchOffset + trackToLabelMargin
                        : timelineX - branchOffset - trackToLabelMargin - labelW;

                    const candidateRect: Rect = {
                        top: currentY - (labelH / 2),
                        bottom: currentY + (labelH / 2),
                        left: xLeft,
                        right: xLeft + labelW,
                        type: 'edu-label'
                    };

                    if (candidateRect.bottom > svgHeight || candidateRect.top < 0) {
                        continue;
                    }

                    if (!isOverlapping(candidateRect)) {
                        bestY = currentY;
                        bestSide = side;
                        found = true;

                        allObstacles.push({
                            ...candidateRect,
                            top: candidateRect.top - 10,
                            bottom: candidateRect.bottom + 10
                        });
                        break;
                    }
                }
                if (found) break;
            }

            const isRight = bestSide === 'right';
            const spineX = timelineX;
            const trackX = spineX + (isRight ? branchOffset : -branchOffset);

            const yStart = Math.min(topY, bottomY);
            const yEnd = Math.max(topY, bottomY);

            // Curve Logic:
            // Since the track is tighter (15px), we reduce the curve height slightly
            // so it doesn't look too stretched.
            const curveK = 20;

            const path = `
                M ${spineX},${yStart}
                C ${spineX},${yStart + curveK} ${trackX},${yStart + curveK} ${trackX},${yStart + curveK * 2}
                L ${trackX},${yEnd - curveK * 2}
                C ${trackX},${yEnd - curveK} ${spineX},${yEnd - curveK} ${spineX},${yEnd}
            `;

            const labelX = isRight
                ? trackX + trackToLabelMargin
                : trackX - trackToLabelMargin - 160;

            return (
                <g key={edu.label}>
                    <path d={path} stroke={edu.color} strokeWidth={3} fill="none" strokeLinecap="round" filter="url(#branchShadow)" />

                    <foreignObject x={labelX} y={bestY - 40} width={160} height={100} style={{overflow:'visible'}}>
                        <div className={`education-branch-content ${!isRight ? 'align-right' : ''}`}
                             style={{
                                 borderColor: edu.color,
                                 background: 'rgba(15,23,42,0.95)',
                                 textAlign: isRight ? 'left' : 'right',
                                 flexDirection: isRight ? 'row' : 'row-reverse'
                             }}>
                            <div className="education-info">
                                <div className="education-branch-label" style={{color: edu.color}}>{edu.label}</div>
                                <div className="education-branch-period">{edu.period}</div>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            );
        });
    }, [educationPeriods, staticObstacles, svgHeight, minYear, maxYear, yearRange]);

    const handleFooterClick = () => {
        const newCount = clickCount + 1;
        if (newCount === 5) {
            setShowVibeModal(true);
            setClickCount(0);
        } else {
            setClickCount(newCount);
            setTimeout(() => setClickCount(0), 2000);
        }
    };

    const selectedProject = selectedType === 'project' ? filteredProjects.find((p) => p.id === selectedId) : null;
    const selectedExperience = selectedType === 'experience' ? filteredExperiences.find((e) => e.id === selectedId) : null;

    const handleSelect = (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => {
        setSelectedId(id);
        setSelectedType(type);

        const detailsElement = document.querySelector('.details');
        if (detailsElement) {
            detailsElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'it' : 'en');
    };

    return (
        <div className={`app-root ${selectedType === 'home' ? 'is-home' : ''}`}>
            <div className="header-actions-floating">
                <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
                    {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
                </button>
            </div>

            <main className="layout">
                <div className="details-wrapper">
                    <section className="details" aria-label="Content details">
                        {selectedType === 'home' ? (
                            <article className="home-view">
                                <div className="home-visuals">
                                    <div className="blob blob-1" />
                                    <div className="blob blob-2" />
                                    <div className="blob blob-3" />
                                </div>

                                <div className="home-content-split">
                                    <div className="home-intro">
                                        <h2 className="home-title">{t.heroTitle}</h2>
                                        <p className="home-description">{t.heroDesc}</p>
                                        <div className="home-cta">
                                            <span className="cta-hint">Explore by clicking on the items</span>
                                        </div>
                                    </div>

                                    <div className="interactive-landing">
                                        <div className="printer-container">
                                            <img src={printerWithRobot} alt="Printer with robot" className="printer-robot-img" />

                                            <div
                                                className="clickable-item laptop-item"
                                                onClick={() => handleSelect(null, 'experience')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(null, 'experience')}
                                            >
                                                <img src={laptop} alt="Laptop" />
                                                <span className="tooltip">{t.workTitle}</span>
                                            </div>

                                            <div className="non-clickable-item laptop-cables-item">
                                                <img src={laptopCables} alt="Laptop Cables" />
                                            </div>

                                            <div
                                                className="clickable-item soldering-iron-item"
                                                onClick={() => handleSelect(null, 'project')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(null, 'project')}
                                            >
                                                <img src={solderingIron} alt="Soldering Iron" />
                                                <span className="tooltip">{t.personalTitle}</span>
                                            </div>

                                            <div
                                                className="clickable-item robot-head-item"
                                                onClick={() => handleSelect(null, 'about')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(null, 'about')}
                                            >
                                                <span className="tooltip">{t.profileButton}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ) : !selectedId ? (
                            selectedType === 'experience' ? (
                                <article className="timeline-view">
                                    <div className="view-header">
                                        <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                                        <h2>{t.workTitle}</h2>
                                    </div>
                                    <div className="timeline-container" ref={timelineContainerRef} style={{position: 'relative'}}>

                                        <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} style={{position:'absolute', left:0, top:0, pointerEvents:'none', zIndex:0}}>
                                            <defs>
                                                <filter id="branchShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                                                </filter>
                                            </defs>
                                            {educationBranches}
                                        </svg>

                                        {workItems.map((exp) => (
                                            <div
                                                key={exp.id}
                                                ref={(el) => {
                                                    if (el) workItemRefs.current.set(exp.id, el);
                                                    else workItemRefs.current.delete(exp.id);
                                                }}
                                                className={`timeline-item ${exp.side === 'left' ? 'timeline-item-left' : 'timeline-item-right'}`}
                                                style={{ top: `${exp.topPos}%` }}
                                                onClick={() => handleSelect(exp.id, 'experience')}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSelect(exp.id, 'experience')}
                                            >
                                                <div className="timeline-dot">
                                                    <span className="timeline-period">{exp.period}</span>
                                                </div>
                                                <div className="timeline-content">
                                                    <div className="timeline-header">
                                                        <h3>{exp.name}</h3>
                                                    </div>
                                                    <p className="timeline-summary">{exp.summary}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ) : selectedType === 'project' ? (
                                <article className="projects-grid-view">
                                    <div className="view-header">
                                        <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                                        <h2>{t.personalTitle}</h2>
                                    </div>
                                    <div className="projects-grid">
                                        {filteredProjects.map((project) => (
                                            <div key={project.id} className="project-card" onClick={() => handleSelect(project.id, 'project')}>
                                                <div className="project-card-content">
                                                    <h3>{project.name}</h3>
                                                    <p>{project.summary || project.overview.split('\n')[0].replace(/[#*`[\]]/g, '')}</p>
                                                    <div className="project-card-footer">
                                                        <span className="tech-tag">{project.technologies[0]}</span>
                                                        {project.technologies.length > 1 && <span className="tech-tag">+{project.technologies.length - 1}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            ) : selectedType === 'about' ? (
                                <article className="profile-view">
                                    <div className="view-header">
                                        <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                                        <h2>{t.aboutMeTitle}</h2>
                                    </div>
                                    <p className="bio">{t.bio}</p>
                                    <div className="profile-grid">
                                        <section>
                                            <h3>{t.techSkills}</h3>
                                            <div className="skills-container">
                                                <div className="skill-category">
                                                    <h4>{t.softwareDev}</h4>
                                                    <ul>
                                                        <li><strong>{t.languages}:</strong> Python, Kotlin, C++, C#, Java, Dart, TypeScript, Lua, Swift</li>
                                                        <li><strong>{t.frameworks}:</strong> React, Node.js, Flutter, Unity, Android SDK, Spring, .NET</li>
                                                        <li><strong>{t.backend}:</strong> Software Architecture, System Design, Infrastructure, Team Management</li>
                                                    </ul>
                                                </div>
                                                <div className="skill-category">
                                                    <h4>{t.hardwareEmbedded}</h4>
                                                    <ul>
                                                        <li><strong>{t.microcontrollers}:</strong> Arduino, ESP32, STM32, OpenWRT</li>
                                                        <li><strong>{t.firmware}:</strong> Marlin 2.x, Custom State Machines, Custom C++, DJI SDK</li>
                                                        <li><strong>{t.robotics}:</strong> PID Tuning, Motion Control, Telemetry Systems, PTZ Management</li>
                                                        <li><strong>{t.digitalFabrication}:</strong> 3D Printing (FDM), Slicing, 3D Modeling (Fusion 360, Blender)</li>
                                                    </ul>
                                                </div>
                                                <div className="skill-category">
                                                    <h4>{t.dataAI}</h4>
                                                    <ul>
                                                        <li><strong>{t.libraries}:</strong> Pandas, NumPy, Scikit-learn, BERT, Elasticsearch, DepthAI</li>
                                                        <li><strong>{t.domains}:</strong> Active Inference, Semantic Search, Financial Engineering, Computer Vision</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>
                                        <section>
                                            <h3>{t.interests}</h3>
                                            <ul className="interests-list">
                                                <li><strong>{t.interest1Title}</strong> {t.interest1Desc}</li>
                                                <li><strong>{t.interest2Title}</strong> {t.interest2Desc}</li>
                                                <li><strong>{t.interest3Title}</strong> {t.interest3Desc}</li>
                                                <li><strong>{t.interest4Title}</strong> {t.interest4Desc}</li>
                                            </ul>
                                        </section>
                                        <section className="education-section">
                                            <h3>{t.education}</h3>
                                            <div className="education-container">
                                                <div className="education-item">
                                                    <div className="edu-header">
                                                        <h4>{t.highschool}</h4>
                                                        <span className="edu-period">2010 — 2015</span>
                                                    </div>
                                                    <p className="edu-org">ITIS Leonardo Da Vinci, Parma</p>
                                                    <p className="edu-grade">{t.grade}: 100/100</p>
                                                </div>
                                                <div className="education-item">
                                                    <div className="edu-header">
                                                        <h4>{t.bachelors}</h4>
                                                        <span className="edu-period">2015 — 2018</span>
                                                    </div>
                                                    <p className="edu-org">Università degli Studi di Parma</p>
                                                    <p className="edu-grade">{t.grade}: 93/110</p>
                                                </div>
                                                <div className="education-item">
                                                    <div className="edu-header">
                                                        <h4>{t.masters}</h4>
                                                        <span className="edu-period">2019 — 2022</span>
                                                    </div>
                                                    <p className="edu-org">Università degli Studi di Parma</p>
                                                    <p className="edu-grade">{t.grade}: 110/110</p>
                                                </div>
                                            </div>
                                        </section>
                                        <section className="contact-section">
                                            <h3>{t.contactTitle}</h3>
                                            <div className="contact-grid">
                                                <a href="mailto:alessandromuzzi17@gmail.com" className="contact-card">
                                                    <span className="contact-icon">✉️</span>
                                                    <div className="contact-info">
                                                        <span className="contact-label">{t.email}</span>
                                                        <span className="contact-value">alessandromuzzi17@gmail.com</span>
                                                    </div>
                                                </a>
                                                <a href="https://www.linkedin.com/in/alessandro-muzzi" target="_blank" rel="noopener noreferrer" className="contact-card">
                                                    <span className="contact-icon">🔗</span>
                                                    <div className="contact-info">
                                                        <span className="contact-label">{t.linkedin}</span>
                                                        <span className="contact-value">linkedin.com/in/alessandro-muzzi</span>
                                                    </div>
                                                </a>
                                                <a href="https://github.com/AleMuzzi" target="_blank" rel="noopener noreferrer" className="contact-card">
                                                    <span className="contact-icon">💻</span>
                                                    <div className="contact-info">
                                                        <span className="contact-label">{t.github}</span>
                                                        <span className="contact-value">github.com/AleMuzzi</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </section>
                                    </div>
                                </article>
                            ) : (
                                <article className="profile-view">
                                    <h2>{t.aboutMeTitle}</h2>
                                    <p className="bio">{t.bio}</p>
                                    {/* Fallback duplicate content */}
                                    <div className="profile-grid">
                                        {/* ... same content ... */}
                                    </div>
                                </article>
                            )
                        ) : selectedType === 'experience' && selectedExperience ? (
                            <article className="project-details">
                                <div className="view-header">
                                    <button className="back-button" onClick={() => handleSelect(null, 'experience')}>←</button>
                                    <h2>{selectedExperience.name}</h2>
                                </div>
                                <p className="experience-period">{selectedExperience.period}</p>
                                <section>
                                    <h3>{t.whatIDid}</h3>
                                    <ReactMarkdown>{selectedExperience.details}</ReactMarkdown>
                                </section>
                                <section>
                                    <h3>{t.technologies}</h3>
                                    <ul className="tech-list">
                                        {selectedExperience.technologies.map((tech: string) => (
                                            <li key={tech}>{tech}</li>
                                        ))}
                                    </ul>
                                </section>
                            </article>
                        ) : selectedType === 'project' && selectedProject ? (
                            <article className="project-details">
                                <div className="view-header">
                                    <button className="back-button" onClick={() => handleSelect(null, 'project')}>←</button>
                                    <h2>{selectedProject.name}</h2>
                                </div>
                                <section>
                                    <h3>{t.overview}</h3>
                                    <ReactMarkdown>{selectedProject.overview}</ReactMarkdown>
                                </section>
                                <section>
                                    <h3>{t.howItWorks}</h3>
                                    <ReactMarkdown>{selectedProject.how}</ReactMarkdown>
                                </section>
                                <section>
                                    <h3>{t.technologies}</h3>
                                    <ul className="tech-list">
                                        {selectedProject.technologies.map((tech: string) => (
                                            <li key={tech}>{tech}</li>
                                        ))}
                                    </ul>
                                </section>
                            </article>
                        ) : null}
                    </section>
                </div>
            </main>

            {showVibeModal && (
                <div className="vibe-overlay">
                    <div className="vibe-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="vibe-content">
                            <h3>{t.vibeTitle}</h3>
                            <p>{t.vibeP1}</p>
                            <p>{t.vibeP2}</p>
                            <p className="vibe-meta">{t.vibeMeta}</p>
                            <button className="vibe-close" onClick={() => setShowVibeModal(false)}>
                                {t.vibeClose}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;