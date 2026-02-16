import { useState, useMemo, useEffect, useRef } from 'react';
import { projects, experiences } from './projectsData';
import { translations, Language } from './i18n';
import { DetailsView } from './components/DetailsView';
import { ExperienceView } from './components/ExperienceView';
import { ProjectsGridView } from './components/ProjectsGridView';
import { HomeView } from './components/HomeView';
import { AboutView } from './components/AboutView';
import { TagModal } from './components/TagModal';

import './App.css';

import laptop from './assets/laptop.png';
import dji_m300 from './assets/DJI_M300.png';
import active_inference_brain from './assets/active_inference_brain.png';
import text_embeddings_visualization from './assets/text_embeddings_visualization.png';
import ptz_camera from './assets/ptz_camera.png';
import iot from './assets/iot.png';
import verses_logo from './assets/verses_logo.png';

import { init, track } from '@plausible-analytics/tracker'

init({
  domain: 'portfolio-dev.casabrignuzzi.com.es',
  endpoint: 'https://plausible-tracker.casabrignuzzi.com.es/api/event',
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
    const experienceScrollPos = useRef(0);

    const t = translations[lang];

    const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
    const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);

    const [showMobileModal, setShowMobileModal] = useState<boolean>(false);
    const [showSmallScreenModal, setShowSmallScreenModal] = useState<boolean>(false);

    useEffect(() => {
        // Check screen width
      if (isMobileDevice()) {
        setShowMobileModal(true);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        track('uses_mobile', { props: { tier: 'startup' } })
        console.log("Passed here!")
      }

      if(window.innerWidth <= 1024) {
        setShowSmallScreenModal(true);
        document.body.style.overflow = 'hidden';
        track('uses_small_screen', { props: { tier: 'startup' } })
      }

      // Cleanup: re-enable scrolling if component unmounts
      return () => {
        document.body.style.overflow = 'unset';
      };
    }, []);

    const handleCloseModal = () => {
      setShowMobileModal(false);
      setShowSmallScreenModal(false);
      track('proceeds_anyway', { props: { tier: 'startup' } })
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
                manualTop: 86,    // Where the branch starts on the spine (top Y)
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
                manualTop: 55,
                manualBottom: 86
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
                bottomOffset: -45,
                width: 313,
                height: 100,
                manualTop: 35,
                manualBottom: 55
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
            svgHeight: 2370
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

        if (pushState) {
            window.history.pushState({ id, type }, '');
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

    useEffect(() => {
        // Initial state
        window.history.replaceState({ id: selectedId, type: selectedType }, '');

        const handlePopState = (event: PopStateEvent) => {
            if (event.state) {
                handleSelect(event.state.id, event.state.type, false);
            } else {
                // Default to home if no state
                handleSelect(null, 'home', false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const toggleLanguage = () => {
        setLang(prev => prev === 'en' ? 'it' : 'en');
    };

    return (
        <div className={`app-root ${selectedType === 'home' ? 'is-home' : ''}`}>

            {/* --- MOBILE MODAL --- */}
            {(showMobileModal || showSmallScreenModal) && (
              <div className="mobile-modal-overlay">
                <div className="mobile-modal-content">
                  <div className="mobile-modal-icon">🖥️</div>
                  <h2>{showMobileModal? t.mobileWarningTitle : t.smallScreenTitle}</h2>
                  <p dangerouslySetInnerHTML={{ __html: showMobileModal? t.mobileWarningText : t.smallScreenText }}></p>
                  <button
                    className="mobile-modal-btn"
                    onClick={handleCloseModal}
                  >
                    {t.mobileWarningButton}
                  </button>
                </div>
              </div>
            )}

            <div className="header-actions-floating">
                <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
                    {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
                </button>
            </div>

            <main className="layout">
                <div className="details-wrapper">
                    <section className="details" aria-label="Content details">
                        {selectedType === 'home' ? (
                            <HomeView t={t} handleSelect={handleSelect} />
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
                                    onProjectSelected={(id) => setLastProjectId(id)}
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