import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects, experiences } from './projectsData';
import { translations, Language } from './i18n';

import printerWithRobot from './assets/printer_with_robot.png';
import laptop from './assets/laptop.png';
import solderingIron from './assets/soldering_iron.png';
import laptopCables from './assets/laptop_cables.png';
import dji_m300 from './assets/dji_m300.png';
import active_inference_brain from './assets/active_inference_brain.png';
import text_embeddings_visualization from './assets/text_embeddings_visualization.png';
import ptz_camera from './assets/ptz_camera.png';
import iot from './assets/iot.png';

// --- LIST FOR BACKGROUND IMAGES ---
// The code will map these images to timeline items based on their index.
// Item 0 gets the 1st image, Item 1 gets the 2nd, etc.
const workBackgrounds = [
    active_inference_brain, // Index 0
    dji_m300,     // Index 1
    text_embeddings_visualization,    // Index 2
    ptz_camera,           // Index 3
    laptop,           // Index 4
    iot            // Index 5
];

function App() {
    const [lang, setLang] = useState<Language>('en');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'project' | 'experience' | 'about' | 'home' | null>('home');
    const [showVibeModal, setShowVibeModal] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const t = translations[lang];

    const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
    const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);

    const educationPeriods = useMemo(() => {
        const schools = [
            {
                period: '2010 — 2015',
                degree: 'High School degree',
                field: 'Information Technology',
                school: 'ITIS Leonardo Da Vinci, Parma',
                grade: '100/100',
                color: '#f59e0b',
                startYear: 2010,
                endYear: 2015,
                side: 'left',
                bottomOffset: -140,
                width: 350,
                height: 100,
                // --- MANUAL OVERRIDES (0% = Top of SVG, 100% = Bottom) ---
                manualTop: 87,    // Where the branch starts on the spine (top Y)
                manualBottom: 105  // Where the branch ends on the spine (bottom Y)
            },
            {
                period: '2015 — 2019',
                degree: "Bachelor's degree",
                field: 'Computer Engineering',
                school: 'Università degli Studi di Parma',
                grade: '93/110',
                color: '#10b981',
                startYear: 2015,
                endYear: 2019,
                side: 'right',
                bottomOffset: -150,
                width: 330,
                height: 100,
                manualTop: 56,
                manualBottom: 87
            },
            {
                period: '2019 — 2022',
                degree: "Master's degree",
                field: 'Computer Engineering',
                school: 'Università degli Studi di Parma',
                grade: '110/110',
                color: '#3b82f6',
                startYear: 2019,
                endYear: 2022,
                side: 'right' as 'left' | 'right',
                bottomOffset: -45,
                width: 300,
                height: 100,
                manualTop: 36,
                manualBottom: 53
            }
        ];

        schools.sort((a, b) => a.startYear - b.startYear);
        return schools;
    }, []);

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
            svgHeight: 1900
        };
    }, [filteredExperiences, educationPeriods]);

    const getYearPosition = (year: number) => ((maxYear - year) / yearRange) * 100;

    const educationBranches = useMemo(() => {
        const svgWidth = 1000;
        const timelineX = svgWidth / 2;
        const branchOffset = 15;
        const trackToLabelMargin = 15;

        return educationPeriods.map((edu: any) => {
            // --- UPDATED LOGIC START ---
            // If manual overrides exist, use them. Otherwise, calculate based on years.
            // Values are percentages (0-100).

            // Calculate automatic positions based on years
            const autoTopPerc = getYearPosition(edu.endYear);
            const autoBottomPerc = getYearPosition(edu.startYear);

            // Use manual override if provided, otherwise use automatic
            const finalTopPerc = edu.manualTop !== undefined ? edu.manualTop : autoTopPerc;
            const finalBottomPerc = edu.manualBottom !== undefined ? edu.manualBottom : autoBottomPerc;

            // Convert percentage to pixels
            const topY = (finalTopPerc / 100) * svgHeight;
            const bottomY = (finalBottomPerc / 100) * svgHeight;
            // --- UPDATED LOGIC END ---

            const yStart = Math.min(topY, bottomY);
            const yEnd = Math.max(topY, bottomY);

            const isRight = edu.side === 'right';

            // The rest remains exactly the same to preserve UI
            const manualY = yEnd + edu.bottomOffset;
            const itemWidth = edu.width;
            const itemHeight = edu.height;

            const spineX = timelineX;
            const trackX = spineX + (isRight ? branchOffset : -branchOffset);
            const curveK = 20;

            const path = `
                M ${spineX},${yStart}
                C ${spineX},${yStart + curveK} ${trackX},${yStart + curveK} ${trackX},${yStart + curveK * 2}
                L ${trackX},${yEnd - curveK * 2}
                C ${trackX},${yEnd - curveK} ${spineX},${yEnd - curveK} ${spineX},${yEnd}
            `;

            const labelX = isRight
                ? trackX + trackToLabelMargin
                : trackX - trackToLabelMargin - itemWidth;
            const labelTop = manualY - (itemHeight / 2);

            return (
                <g key={edu.degree}>
                    <path d={path} stroke={edu.color} strokeWidth={3} fill="none" strokeLinecap="round" filter="url(#branchShadow)" />
                    <foreignObject x={labelX} y={labelTop} width={itemWidth} height={itemHeight} style={{overflow:'visible'}}>
                        <div className={`education-branch-content ${!isRight ? 'align-right' : ''}`}
                             style={{
                                 borderColor: edu.color,
                                 background: 'rgba(15,23,42,0.95)',
                                 textAlign: isRight ? 'left' : 'right',
                                 flexDirection: isRight ? 'row' : 'row-reverse',
                                 padding: '12px',
                                 display: 'flex',
                                 alignItems: 'center',
                                 height: '100%',
                                 boxSizing: 'border-box'
                             }}>
                            <div className="education-info" style={{width: '100%'}}>
                                <div className="education-branch-label" style={{color: edu.color, fontSize: '0.95em', fontWeight: 'bold', marginBottom: '4px', lineHeight: '1.2'}}>
                                    {edu.degree}, <span style={{color: '#fff', fontWeight: '500'}}>{edu.field}</span>
                                </div>
                                <div style={{color: '#94a3b8', fontSize: '0.75em', marginBottom: '6px', lineHeight: '1.2'}}>
                                    {edu.school}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '2px',
                                    width: '100%'
                                }}>
                                    <span className="education-branch-period" style={{fontSize: '0.7em', opacity: 0.8}}>{edu.period}</span>
                                    <span style={{fontSize: '0.7em', color: edu.color, border: `1px solid ${edu.color}`, padding: '1px 5px', borderRadius: '4px'}}>
                                        {edu.grade.includes('100') ? '100/100' : edu.grade.split(': ')[1] || edu.grade}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            );
        });
    }, [educationPeriods, svgHeight, maxYear, yearRange]);

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

        // Use setTimeout to ensure the element is rendered and accessible
        setTimeout(() => {
            const detailsElement = document.querySelector('.details');
            if (detailsElement) {
                detailsElement.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
            }
        }, 0);
    };

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'it' : 'en');
    };

    const renderWorkHeader = (rawName: string) => {
        const separator = lang === 'en' ? ' at ' : ' presso ';
        const parts = rawName.split(separator);
        if (parts.length >= 2) {
            const role = parts[0];
            const company = parts.slice(1).join(separator);
            return (
                <div className="timeline-header-split">
                    <h3>{role}</h3>
                    <div style={{fontSize: '0.9em', color: '#94a3b8', fontWeight: '500', marginTop: '2px', fontStyle: 'italic'}}>{company}</div>
                </div>
            );
        }
        return <h3>{rawName}</h3>;
    };

    return (
        <div className={`app-root ${selectedType === 'home' ? 'is-home' : ''}`}>
            {/* --- INJECTED STYLES FOR POP-OUT EFFECT --- */}
            <style>{`
                .timeline-item {
                    position: relative;
                    z-index: 1;
                    overflow: visible !important;
                }
                
                /* The container for the background image */
                .timeline-popout-bg {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) scale(0.5); /* Start small */
                    width: 300px;
                    height: auto;
                    opacity: 0;
                    z-index: -1; /* Behind text */
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.5));
                }

                .timeline-item-left .timeline-popout-bg {
                    left: 30%;
                }
                .timeline-item-right .timeline-popout-bg {
                    left: 70%;
                }

                /* Hover State */
                .timeline-item:hover .timeline-popout-bg {
                    opacity: 0.25; 
                    transform: translate(-50%, -50%) scale(1.5) rotate(-5deg);
                }
            `}</style>

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
                                            <div className="clickable-item laptop-item" onClick={() => handleSelect(null, 'experience')}>
                                                <img src={laptop} alt="Laptop" />
                                                <span className="tooltip">{t.workTitle}</span>
                                            </div>
                                            <div className="non-clickable-item laptop-cables-item">
                                                <img src={laptopCables} alt="Laptop Cables" />
                                            </div>
                                            <div className="clickable-item soldering-iron-item" onClick={() => handleSelect(null, 'project')}>
                                                <img src={solderingIron} alt="Soldering Iron" />
                                                <span className="tooltip">{t.personalTitle}</span>
                                            </div>
                                            <div className="clickable-item robot-head-item" onClick={() => handleSelect(null, 'about')}>
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
                                    <div className="timeline-container" style={{position: 'relative'}}>
                                        <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} style={{position:'absolute', left:0, top:0, pointerEvents:'none', zIndex:0}}>
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
                                                    onClick={() => handleSelect(exp.id, 'experience')}
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
                                                        <p className="timeline-summary">{exp.summary}</p>

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
                                                                    <span key={tech} style={{
                                                                        fontSize: '0.8em',
                                                                        fontWeight: '500',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '6px',
                                                                        background: 'rgba(139, 92, 246, 0.15)',
                                                                        border: '1px solid rgba(167, 139, 250, 0.4)',
                                                                        color: '#f3e8ff',
                                                                        fontFamily: 'monospace',
                                                                        letterSpacing: '0.02em'
                                                                    }}>
                                                                    {tech}
                                                                </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
                                                        <li><strong>{t.scraping}:</strong> Web Scraping, Data Extraction</li>
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
                            ) : null
                        ) : (
                            <article className="detail-view">
                                <div className="view-header">
                                    <button className="back-button" onClick={() => handleSelect(null, selectedType)}>←</button>
                                    <h2>{selectedType === 'project' ? t.personalTitle : t.workTitle}</h2>
                                </div>
                                <div className="detail-content">
                                    {selectedType === 'experience' && selectedExperience && (() => {
                                        // --- LOGIC FOR PARSING COMPANY & LINK ---
                                        const separator = lang === 'en' ? ' at ' : ' presso ';
                                        const parts = selectedExperience.name.split(separator);

                                        // 1. Get Role
                                        const roleName = parts[0];

                                        // 2. Get Company (Try explicit property first, then parse title)
                                        const companyName = (selectedExperience as any).company
                                            || (parts.length > 1 ? parts[1] : 'Unknown Company');

                                        // 3. Get URL (Try explicit property)
                                        const companyUrl = (selectedExperience as any).companyUrl;

                                        return (
                                            <div className="fade-in-content experience-detail-container">
                                                {/* HEADER SECTION */}
                                                <div className="exp-header">
                                                    <h3 className="exp-role">{roleName}</h3>

                                                    <div className="exp-meta-row">
                                                        {companyUrl ? (
                                                            <a
                                                                href={companyUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="exp-chip chip-company clickable-chip"
                                                            >
                                                                <span style={{marginRight:'6px'}}>🏢</span>
                                                                {companyName}
                                                                <span style={{marginLeft:'6px', fontSize:'0.8em', opacity: 0.7}}>↗</span>
                                                            </a>
                                                        ) : (
                                                            <div className="exp-chip chip-company">
                                                                <span style={{marginRight:'6px'}}>🏢</span>
                                                                {companyName}
                                                            </div>
                                                        )}

                                                        <div className="exp-chip chip-date">
                                                            <span style={{marginRight:'6px'}}>🗓</span>
                                                            {selectedExperience.period}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* BODY CONTENT */}
                                                <div className="markdown-body exp-body">
                                                    <ReactMarkdown>
                                                        {(selectedExperience as any).details || selectedExperience.summary}
                                                    </ReactMarkdown>
                                                </div>

                                                {/* TOOLS FOOTER */}
                                                <div className="tools-section">
                                                    <span className="tools-title">Techniques & Tools</span>
                                                    {selectedExperience.categorizedTech ? (
                                                        <div className="categorized-tools">
                                                            {Object.entries(selectedExperience.categorizedTech).map(([category, items]) => (
                                                                <div key={category} className="tech-category-group">
                                                                    <h4 className="tech-category-name">{category}</h4>
                                                                    <div className="tools-grid">
                                                                        {(items as string[]).map(tech => (
                                                                            <span key={tech} className="tool-badge">
                                                                            {tech}
                                                                        </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="tools-grid">
                                                            {selectedExperience.technologies.map(tech => (
                                                                <span key={tech} className="tool-badge">
                                                                {tech}
                                                            </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    {selectedType === 'project' && selectedProject && (
                                        <div className="fade-in-content">
                                            <div className="detail-title-block">
                                                <h3>{selectedProject.name}</h3>
                                                <div className="tech-stack-detail">
                                                    {selectedProject.technologies.map((tech) => (
                                                        <span key={tech} className="tech-tag">{tech}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="markdown-body">
                                                <ReactMarkdown>
                                                    {selectedProject.overview || (selectedProject as any).description}
                                                </ReactMarkdown>
                                                {(selectedProject as any).link && (
                                                    <div className="project-links" style={{marginTop:'20px'}}>
                                                        <a href={(selectedProject as any).link} target="_blank" rel="noreferrer" className="cta-button">
                                                            View Project
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        )}
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