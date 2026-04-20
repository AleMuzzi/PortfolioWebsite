import { useState, useMemo, useEffect, useRef } from 'react';
import { projects, experiences } from './projectsData';
import { translations, Language } from './i18n';
import { DetailsView } from './components/DetailsView';
import { ExperienceView } from './components/ExperienceView';
import { ProjectsGridView } from './components/ProjectsGridView';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/about_me/AboutView';
import { TagModal } from './components/TagModal';
import { DigitalTwin } from './components/DigitalTwin.tsx';
import { AnimatePresence, motion } from 'framer-motion';

import './App.css';

import laptop from './assets/laptop.png';
import dji_m300 from './assets/DJI_M300.png';
import active_inference_brain from './assets/active_inference_brain.png';
import text_embeddings_visualization from './assets/text_embeddings_visualization.png';
import ptz_camera from './assets/ptz_camera.png';
import iot from './assets/iot.png';
import verses_logo from './assets/verses_logo.png';

import { init } from '@plausible-analytics/tracker'
import {
  trackSection,
  trackDigitalTwinOpen,
  trackLanguageToggle,
  trackMobileWarningDismissed,
  trackScrollDepth,
  trackSessionEnd,
} from './utils/analytics';

init({
  domain: 'alessandromuzzi.icu',
  endpoint: 'https://plausible-tracker.casabrignuzzi.com.es/api/event',
  hashBasedRouting: true,
  captureOnLocalhost: true, // Useful for testing if your dev env is localhost
})

// --- LIST FOR BACKGROUND IMAGES ---
// The code will map these images to timeline items based on their index.
// Item 0 gets the 1st image, Item 1 gets the 2nd, etc.
const workBackgrounds = [
    verses_logo, // Index 0
    active_inference_brain, // Index 0
    dji_m300,     // Index 1
    text_embeddings_visualization,    // Index 2
    ptz_camera,           // Index 3
    iot,            // Index 4
    laptop,           // Index 5
];

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function App() {
    const [lang, setLang] = useState<Language>('en');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'project' | 'experience' | 'about' | 'home' | null>('home');
    const [lastProjectId, setLastProjectId] = useState<string | null>(null);
    const [activeTagName, setActiveTagName] = useState<string | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const experienceScrollPos = useRef(0);

    const t = translations[lang];

    const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
    const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);

    const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
    const [showSmallScreenModal, setShowSmallScreenModal] = useState<boolean>(false);
    const [showDigitalTwin, setShowDigitalTwin] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [chatOnlyMobile, setChatOnlyMobile] = useState<boolean>(false);

    useEffect(() => {
        // Check screen width
      const mobile = isMobileDevice();
      const small = window.innerWidth <= 1024;
      setIsMobile(mobile);

      if (mobile) {
        setShowMobileModal(true);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

      } else if (small) {
        setShowSmallScreenModal(true);
        document.body.style.overflow = 'hidden';

      }

      // Cleanup: re-enable scrolling if component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    const handleCloseModal = () => {
      setShowMobileModal(false);
      setShowSmallScreenModal(false);
      setChatOnlyMobile(false);
      trackMobileWarningDismissed();
      // Re-enable scrolling when dismissed
      document.body.style.overflow = 'unset';
    };

    // Ensure lastProjectId always points to a valid project for the current language
    useEffect(() => {
        if (filteredProjects.length === 0) {
            if (lastProjectId !== null) {
                setLastProjectId(null);
            }
            return;
        }

        const exists = lastProjectId && filteredProjects.some(p => p.id === lastProjectId);
        if (!exists) {
            setLastProjectId(filteredProjects[0].id);
        }
    }, [filteredProjects, lastProjectId]);

    const educationPeriods = useMemo(() => {
        const schools = [
            {
                period: '2010 — 2015',
                degree: t.highSchool,
                field: t.itField,
                school: 'ITIS Leonardo Da Vinci, Parma',
                grade: '100/100',
                color: '#f59e0b',
                startYear: 2010,
                endYear: 2015,
                side: 'right',
                bottomOffset: -210,
                width: 360,
                height: 100,
                // --- MANUAL OVERRIDES (0% = Top of SVG, 100% = Bottom) ---
                manualTop: 89,    // Where the branch starts on the spine (top Y)
                manualBottom: 105  // Where the branch ends on the spine (bottom Y)
            },
            {
                period: '2015 — 2019',
                degree: t.bachelorsDegree,
                field: t.compEngField,
                school: 'Università degli Studi di Parma',
                grade: '93/110',
                color: '#10b981',
                startYear: 2015,
                endYear: 2019,
                side: 'left',
                bottomOffset: -70,
                width: 328,
                height: 100,
                manualTop: 64,
                manualBottom: 89
            },
            {
                period: '2019 — 2022',
                degree: t.mastersDegree,
                field: t.compEngField,
                school: 'Università degli Studi di Parma',
                grade: '110/110',
                color: '#3b82f6',
                startYear: 2019,
                endYear: 2022,
                side: 'left',
                bottomOffset: -70,
                width: 313,
                height: 100,
                manualTop: 46,
                manualBottom: 63
            }
        ];

        schools.sort((a, b) => a.startYear - b.startYear);
        return schools;
    }, [t]);

    const { workItems, maxYear, yearRange, svgHeight } = useMemo(() => {
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
            svgHeight: 2800
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
                                        {edu.grade.includes('100') ? '100/100' : (edu.grade.includes(':') ? edu.grade.split(':')[1].trim() : edu.grade)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </foreignObject>
                </g>
            );
        });
    }, [educationPeriods, svgHeight, maxYear, yearRange]);

    const selectedProject = selectedType === 'project' ? filteredProjects.find((p) => p.id === selectedId) : null;
    const selectedExperience = selectedType === 'experience' ? filteredExperiences.find((e) => e.id === selectedId) : null;

    const handleSelect = (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null, pushState = true) => {
        if (type !== 'home') {
            setHasInteracted(true);
        }

        // Save scroll position if we are in experience view and about to leave it
        if (selectedType === 'experience' && !selectedId) {
            const detailsElement = document.querySelector('.details');
            if (detailsElement) {
                experienceScrollPos.current = detailsElement.scrollTop;
            }
        }

        setSelectedId(id);
        setSelectedType(type);
        setActiveTagName(null);

        // Track first section seen in this session
        const sectionMap: Record<string, string> = {
          experience: 'work_experiences',
          project: 'projects',
          about: 'about_me',
          home: 'home',
        };
        if (type && sectionMap[type]) {
          trackSection(id ? `${sectionMap[type]}_detail` : sectionMap[type]);
        }

        if (pushState) {
            const hash = sectionMap[type ?? 'home'] ?? 'home';
            const path = `#/${id ? `${hash}/${id}` : hash}`;
            window.history.pushState({ id, type }, '', path);
        }

        // We reset scroll for other views immediately.
        // Restoration for experience is handled by useEffect.
        if (type !== 'experience' || id) {
            setTimeout(() => {
                const detailsElement = document.querySelector('.details');
                if (detailsElement) {
                    detailsElement.scrollTo({ top: 0, behavior: 'auto' as ScrollBehavior });
                }
            }, 0);
        }
    };

    useEffect(() => {
        if (selectedType === 'experience' && !selectedId) {
            // Use a small delay to ensure the DOM is ready for scrolling
            const timer = setTimeout(() => {
                const detailsElement = document.querySelector('.details');
                if (detailsElement) {
                    detailsElement.scrollTo({ top: experienceScrollPos.current, behavior: 'auto' });
                }
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [selectedType, selectedId]);

    // ─── Mount: parse hash, set initial state & history, set up back/forward ──
    useEffect(() => {
        const sectionMap: Record<string, string> = {
            experience: 'work_experiences',
            project: 'projects',
            about: 'about_me',
            home: 'home',
        };
        const reverseMap: Record<string, { type: 'project' | 'experience' | 'about' | 'home'; id: string | null }> = {
            'projects':          { type: 'project',   id: null },
            'work_experiences': { type: 'experience', id: null },
            'about_me':         { type: 'about',      id: null },
            'home':             { type: 'home',        id: null },
        };

        // Parse hash from URL directly (avoids stale closure)
        const rawHash = window.location.hash.replace('#', '').replace('/', ''); // "#/work_experiences" → "work_experiences"
        const parts = rawHash.split('/');
        const section = parts[0];
        const detailId = parts[1] ?? null;
        const mapped = reverseMap[section];

        const initType = mapped?.type ?? 'home';
        const initId = mapped?.id ?? detailId;

        // Set React state to match URL
        setSelectedId(initId);
        setSelectedType(initType);

        // Set browser history to match
        const initHash = sectionMap[initType];
        const initPath = `#/${initId ? `${initHash}/${initId}` : initHash}`;
        window.history.replaceState({ id: initId, type: initType }, '', initPath);

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                const t = event.state.type as string;
                const i = event.state.id as string | null;
                const h = sectionMap[t ?? 'home'] ?? 'home';
                window.history.replaceState({ id: i, type: t }, '', `#/${i ? `${h}/${i}` : h}`);
                handleSelect(event.state.id, event.state.type, false);
            } else {
                handleSelect(null, 'home', false);
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally empty — run once on mount only

    // ─── Session tracking (scroll + unload) ────────────────────────────────────
    useEffect(() => {
        const onUnload = () => trackSessionEnd();
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') trackSessionEnd();
        });
        window.addEventListener('beforeunload', onUnload);

        const onScroll = () => {
            const scrolled = document.documentElement.scrollTop + window.innerHeight;
            const total = document.documentElement.scrollHeight;
            const pct = Math.round((scrolled / total) * 100);
            trackScrollDepth(pct);
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            window.removeEventListener('beforeunload', onUnload);
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    const toggleLanguage = () => {
        const newLang = lang === 'en' ? 'it' : 'en';
        trackLanguageToggle(lang, newLang);
        setLang(prev => prev === 'en' ? 'it' : 'en');
    };

    return (
        <div className={`app-root ${selectedType === 'home' ? 'is-home' : ''}`}>

            {/* --- MOBILE FULL-CHAT WITH SANDRO --- */}
            {(showMobileModal || chatOnlyMobile) && !showSmallScreenModal && (
              <div className="mobile-dt-root">
                <div className="mobile-dt-topbar">
                  <div className="dt-header">
                    <div className="dt-avatar">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                      </svg>
                    </div>
                    <div className="dt-title">
                      <span className="dt-name">Sandro</span>
                      <span className="dt-subtitle">Alessandro's Digital Twin</span>
                    </div>
                  </div>
                  <button className="mobile-dt-back" onClick={handleCloseModal}>
                    ← Full Site
                  </button>
                  <button type="button" className="mobile-dt-lang" onClick={e => { e.stopPropagation(); toggleLanguage(); }}>
                    {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
                  </button>
                </div>
                <div className="mobile-dt-body">
                  <DigitalTwin hideHeader isMobile={isMobile} lang={lang} />
                </div>
              </div>
            )}

            {/* --- SMALL SCREEN WARNING MODAL --- */}
            {showSmallScreenModal && !chatOnlyMobile && (
              <div className="mobile-modal-overlay">
                <div className="mobile-modal-content">
                  <div className="mobile-modal-icon">🖥️</div>
                  <h2>{t.smallScreenTitle}</h2>
                  <p dangerouslySetInnerHTML={{ __html: t.smallScreenText }}></p>
                  <button className="mobile-modal-btn" onClick={handleCloseModal}>
                    {t.mobileWarningButton}
                  </button>
                </div>
              </div>
            )}

            <div className="header-actions-floating">
                {!isMobile && (
                  <button
                    className="robot-btn"
                    onClick={() => { setShowDigitalTwin(prev => !prev); trackDigitalTwinOpen('desktop_overlay'); }}
                    aria-label="Chat with Sandro"
                    title="Chat with Sandro"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                  </button>
                )}
                {isMobile && !(showMobileModal || chatOnlyMobile) && (
                    <button
                        className="robot-btn"
                        onClick={() => {
                            setChatOnlyMobile(true);
                            document.body.style.overflow = 'hidden';
                        }}
                        aria-label="Chat with Sandro"
                        title="Chat with Sandro"
                    >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                    </button>
                )}
                {!(showMobileModal || chatOnlyMobile) && (
                  <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
                      {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
                  </button>
                )}
            </div>

            {/* --- DESKTOP DIGITAL TWIN OVERLAY --- */}
            {!isMobile && (
              <AnimatePresence>
                {showDigitalTwin && (
                  <motion.div
                    className="dt-overlay"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <DigitalTwin onClose={() => setShowDigitalTwin(false)} lang={lang} />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            <main className="layout">
                <div className="details-wrapper">
                    <section className="details" aria-label="Content details">
                        {selectedType === 'home' ? (
                            <HomeView t={t} handleSelect={handleSelect} hasInteracted={hasInteracted} setHasInteracted={setHasInteracted} />
                        ) : !selectedId ? (
                            selectedType === 'experience' ? (
                                <ExperienceView
                                    lang={lang}
                                    svgHeight={svgHeight}
                                    educationBranches={educationBranches}
                                    workItems={workItems}
                                    workBackgrounds={workBackgrounds}
                                    handleSelect={handleSelect}
                                    onTagClick={(tagName) => setActiveTagName(tagName)}
                                />
                            ) : selectedType === 'project' ? (
                                <ProjectsGridView
                                    lang={lang}
                                    filteredProjects={filteredProjects}
                                    handleSelect={handleSelect}
                                    onTagClick={(tagName) => setActiveTagName(tagName)}
                                    initialSelectedId={lastProjectId}
                                    onProjectSelected={(id) => { setLastProjectId(id); handleSelect(id, 'project', true); }}
                                />
                            ) : selectedType === 'about' ? (
                                <AboutView 
                                    lang={lang} 
                                    handleSelect={handleSelect} 
                                    onTagClick={(tagName) => setActiveTagName(tagName)}
                                />
                            ) : null
                        ) : (
                            <DetailsView
                                selectedType={selectedType}
                                selectedProject={selectedProject}
                                selectedExperience={selectedExperience}
                                lang={lang}
                                handleSelect={handleSelect}
                                handleSelectExternal={(id, type) => handleSelect(id, type)}
                                onTagClick={(tagName) => setActiveTagName(tagName)}
                            />
                        )}
                    </section>
                </div>
            </main>

            {activeTagName && (
                <div className="tag-modal-portal">
                    <TagModal
                        tagName={activeTagName}
                        projects={projects.filter(p => p.lang === lang)}
                        experiences={experiences.filter(e => e.lang === lang)}
                        onClose={() => setActiveTagName(null)}
                        onItemClick={(id, type) => handleSelect(id, type)}
                        t={t}
                    />
                </div>
            )}
        </div>
    );
}

export default App;