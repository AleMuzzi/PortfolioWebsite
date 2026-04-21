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
  captureOnLocalhost: true,
})

const workBackgrounds = [
    verses_logo,
    active_inference_brain,
    dji_m300,
    text_embeddings_visualization,
    ptz_camera,
    iot,
    laptop,
];

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function App() {
    const [lang, setLang] = useState<Language>('en');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'project' | 'experience' | 'about' | 'home' | null>('home');
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
      const mobile = isMobileDevice();
      const small = window.innerWidth <= 1024;
      setIsMobile(mobile);

      if (mobile) {
        setShowMobileModal(true);
        document.body.style.overflow = 'hidden';
      } else if (small) {
        setShowSmallScreenModal(true);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    const handleCloseModal = () => {
      setShowMobileModal(false);
      setShowSmallScreenModal(false);
      setChatOnlyMobile(false);
      trackMobileWarningDismissed();
      document.body.style.overflow = 'unset';
    };

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
                manualTop: 89,
                manualBottom: 105
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
            const autoTopPerc = getYearPosition(edu.endYear);
            const autoBottomPerc = getYearPosition(edu.startYear);

            const finalTopPerc = edu.manualTop !== undefined ? edu.manualTop : autoTopPerc;
            const finalBottomPerc = edu.manualBottom !== undefined ? edu.manualBottom : autoBottomPerc;

            const topY = (finalTopPerc / 100) * svgHeight;
            const bottomY = (finalBottomPerc / 100) * svgHeight;

            const yStart = Math.min(topY, bottomY);
            const yEnd = Math.max(topY, bottomY);

            const isRight = edu.side === 'right';
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

    // --- Navigation helper (no-op when same state to avoid redundant history push) ---
    const navigate = (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => {
        if (type !== 'home') setHasInteracted(true);

        // Save scroll position when leaving experience list view
        if (selectedType === 'experience' && !selectedId) {
            const detailsElement = document.querySelector('.details');
            if (detailsElement) experienceScrollPos.current = detailsElement.scrollTop;
        }

        setSelectedId(id);
        setSelectedType(type);
        setActiveTagName(null);

        const sectionMap: Record<string, string> = {
          experience: 'work_experiences',
          project: 'projects',
          about: 'about_me',
          home: 'home',
        };

        if (type && sectionMap[type]) {
          trackSection(id ? `${sectionMap[type]}_detail` : sectionMap[type]);
        }

        const hash = sectionMap[type ?? 'home'] ?? 'home';
        const path = `#/${id ? `${hash}/${id}` : hash}`;
        window.history.pushState({ id, type }, '', path);

        // Reset scroll for non-experience views
        if (type !== 'experience' || id) {
            setTimeout(() => {
                const detailsElement = document.querySelector('.details');
                if (detailsElement) detailsElement.scrollTo({ top: 0, behavior: 'auto' as ScrollBehavior });
            }, 0);
        }
    };

    useEffect(() => {
        if (selectedType === 'experience' && !selectedId) {
            const timer = setTimeout(() => {
                const detailsElement = document.querySelector('.details');
                if (detailsElement) detailsElement.scrollTo({ top: experienceScrollPos.current, behavior: 'auto' });
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [selectedType, selectedId]);

    // ─── Mount: parse hash, set initial state & history, set up hashchange listener ──
    useEffect(() => {
        const reverseMap: Record<string, { type: 'project' | 'experience' | 'about' | 'home'; id: string | null }> = {
            'projects':          { type: 'project',   id: null },
            'work_experiences': { type: 'experience', id: null },
            'about_me':         { type: 'about',      id: null },
            'home':             { type: 'home',        id: null },
        };

        const sectionMap: Record<string, string> = {
            experience: 'work_experiences',
            project: 'projects',
            about: 'about_me',
            home: 'home',
        };

        const initFromHash = () => {
            const raw = window.location.hash.replace('#', '').replace(/^\//, '');
            const segments = raw.split('/');
            const base = segments[0] || 'home';
            const detailId = segments[1] || null;
            const mapped = reverseMap[base];

            const initType = mapped?.type ?? 'home';
            const initId = mapped?.id ?? detailId;

            setSelectedId(initId);
            setSelectedType(initType);

            const initHash = sectionMap[initType];
            const initPath = `#/${initId ? `${initHash}/${initId}` : initHash}`;
            window.history.replaceState({ id: initId, type: initType }, '', initPath);
        };

        initFromHash();

        const handleHashChange = () => {
            const raw = window.location.hash.replace('#', '').replace(/^\//, '');
            const segments = raw.split('/');
            const base = segments[0] || 'home';
            const detailId = segments[1] || null;
            const mapped = reverseMap[base];

            if (!mapped) {
                setSelectedId(null);
                setSelectedType('home');
                return;
            }

            const { type } = mapped;
            const id = mapped.id ?? detailId;

            // Save/restore scroll for experience list
            if (selectedType === 'experience' && !selectedId) {
                const detailsElement = document.querySelector('.details');
                if (detailsElement) experienceScrollPos.current = detailsElement.scrollTop;
            }

            setSelectedId(id);
            setSelectedType(type);

            if (type !== 'experience' || id) {
                setTimeout(() => {
                    const detailsElement = document.querySelector('.details');
                    if (detailsElement) detailsElement.scrollTo({ top: 0, behavior: 'auto' as ScrollBehavior });
                }, 0);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        window.addEventListener('popstate', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            window.removeEventListener('popstate', handleHashChange);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0-3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
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
                            <HomeView t={t} handleSelect={navigate} hasInteracted={hasInteracted} setHasInteracted={setHasInteracted} />
                        ) : selectedType === 'project' && !selectedId ? (
                            <ProjectsGridView
                                lang={lang}
                                filteredProjects={filteredProjects}
                                onTagClick={(tagName) => setActiveTagName(tagName)}
                                onBack={() => navigate(null, 'home')}
                                onSelect={(id) => navigate(id, 'project')}
                            />
                        ) : selectedType === 'experience' && !selectedId ? (
                            <ExperienceView
                                lang={lang}
                                svgHeight={svgHeight}
                                educationBranches={educationBranches}
                                workItems={workItems}
                                workBackgrounds={workBackgrounds}
                                handleSelect={navigate}
                                onTagClick={(tagName) => setActiveTagName(tagName)}
                            />
                        ) : selectedType === 'about' && !selectedId ? (
                            <AboutView
                                lang={lang}
                                handleSelect={navigate}
                                onTagClick={(tagName) => setActiveTagName(tagName)}
                            />
                        ) : (
                            <DetailsView
                                selectedType={selectedType}
                                selectedProject={selectedProject}
                                selectedExperience={selectedExperience}
                                lang={lang}
                                handleSelect={navigate}
                                handleSelectExternal={(id, type) => navigate(id, type)}
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
                        onItemClick={(id, type) => navigate(id, type)}
                        t={t}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
