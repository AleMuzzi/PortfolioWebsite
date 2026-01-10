import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects, experiences } from './projectsData';
import { translations, Language } from './i18n';

import printerWithRobot from './assets/printer_with_robot.png';
import laptop from './assets/laptop.png';
import solderingIron from './assets/soldering_iron.png';
import laptopCables from './assets/laptop_cables.png';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'experience' | 'about' | 'home' | null>('home');
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const t = translations[lang];

  const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
  const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);
  
  // Ordina le scuole in modo coerente con le esperienze lavorative
  const filteredExperiencesSorted = useMemo(() => {
    return [...filteredExperiences].sort((a, b) => {
      // Ordina per anno di inizio decrescente (più recente in alto)
      const ay = a.period.match(/\d{4}/g);
      const by = b.period.match(/\d{4}/g);
      const aStart = ay ? Number.parseInt(ay[0]) : 0;
      const bStart = by ? Number.parseInt(by[0]) : 0;
      return bStart - aStart;
    });
  }, [filteredExperiences]);

  // Ordina le scuole in base all'ordine temporale delle esperienze lavorative
  const educationPeriods = useMemo(() => {
    // Array scuole
    const schools = [
      { period: '2010 — 2015', label: t.highschool.split('\n')[0], color: '#f59e0b', startYear: 2010, endYear: 2015 },
      { period: '2015 — 2018', label: t.bachelors.split('\n')[0], color: '#10b981', startYear: 2015, endYear: 2018 },
      { period: '2019 — 2022', label: t.masters.split('\n')[0], color: '#3b82f6', startYear: 2019, endYear: 2022 }
    ];
    // Ordina per startYear coerente con le esperienze lavorative
    const allYears = filteredExperiencesSorted.map(exp => {
      const years = exp.period.match(/\d{4}/g);
      return years ? Number.parseInt(years[0]) : 0;
    });
    // Ordina le scuole in modo che la loro sequenza sia coerente con la timeline delle esperienze
    schools.sort((a, b) => {
      // Trova la distanza temporale minima tra la scuola e le esperienze
      const aDist = Math.min(...allYears.map(y => Math.abs(a.startYear - y)));
      const bDist = Math.min(...allYears.map(y => Math.abs(b.startYear - y)));
      // Se la scuola inizia dopo la maggior parte delle esperienze, va più in alto
      return a.startYear - b.startYear;
    });
    return schools;
  }, [t, filteredExperiencesSorted]);

  const handleFooterClick = () => {
    const newCount = clickCount + 1;
    if (newCount === 5) {
      setShowVibeModal(true);
      setClickCount(0);
    } else {
      setClickCount(newCount);
      // Reset count after 2 seconds of inactivity
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  const selectedProject = selectedType === 'project' ? filteredProjects.find((p) => p.id === selectedId) : null;
  const selectedExperience = selectedType === 'experience' ? filteredExperiences.find((e) => e.id === selectedId) : null;

  const handleSelect = (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => {
    setSelectedId(id);
    setSelectedType(type);
    
    // Smooth scroll to top when changing views
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
                      >
                        <img src={solderingIron} alt="Soldering Iron" />
                        <span className="tooltip">{t.personalTitle}</span>
                      </div>

                      <div 
                        className="clickable-item robot-head-item" 
                        onClick={() => handleSelect(null, 'about')}
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
                  <div className="timeline-container" style={{position: 'relative'}}>
                    {/* Calcolo posizioni per tutti gli item e branch SVG */}
                    {(() => {
                      // Ottieni tutti gli anni da esperienze e periodi educativi
                      const allYears: number[] = [];
                      filteredExperiences.forEach(exp => {
                        const years = exp.period.match(/\d{4}/g);
                        if (years) {
                          allYears.push(parseInt(years[0]));
                          if (years[1]) allYears.push(parseInt(years[1]));
                        }
                      });
                      educationPeriods.forEach(edu => {
                        allYears.push(edu.startYear, edu.endYear);
                      });
                      const minYear = Math.min(...allYears, 2010);
                      const maxYear = Math.max(...allYears, new Date().getFullYear());
                      const yearRange = maxYear - minYear;
                      // Funzione per calcolare la posizione verticale in percentuale
                      const getYearPosition = (year: number) => ((year - minYear) / yearRange) * 100;

                      // Calcola le posizioni delle esperienze lavorative
                      const workItems = filteredExperiences.map((exp, index) => {
                        const years = exp.period.match(/\d{4}/g);
                        const expStartYear = years ? parseInt(years[0]) : 2020;
                        const topPos = getYearPosition(expStartYear);
                        return {
                          ...exp,
                          index,
                          topPos,
                          side: index % 2 === 0 ? 'left' : 'right',
                        };
                      });

                      // Calcola le branch SVG per ogni periodo educativo
                      const svgWidth = 1000; // px, come max-width della timeline
                      const svgHeight = 1200; // px, arbitrario, sarà scalato in base al contenuto
                      const timelineX = svgWidth / 2;
                      // Offset orizzontale massimo per le branch (ancora più vicino)
                      const branchMaxOffset = 24;
                      // Spessore branch più sottile
                      const branchStroke = 2;
                      // Funzione per trovare la card esperienza più vicina a un certo anno
                      function findClosestWorkItem(year: number) {
                        let minDiff = Infinity;
                        let closest = workItems[0];
                        for (const item of workItems) {
                          const years = item.period.match(/\d{4}/g);
                          const expStartYear = years ? parseInt(years[0]) : 2020;
                          const diff = Math.abs(expStartYear - year);
                          if (diff < minDiff) {
                            minDiff = diff;
                            closest = item;
                          }
                        }
                        return closest;
                      }
                      // Disegna le branch SVG
                      const educationBranches = educationPeriods.map((edu) => {
                        const startY = (getYearPosition(edu.startYear) / 100) * svgHeight;
                        const endY = (getYearPosition(edu.endYear) / 100) * svgHeight;
                        // Trova la card esperienza più vicina all'inizio e alla fine
                        const closestStart = findClosestWorkItem(edu.startYear);
                        const closestEnd = findClosestWorkItem(edu.endYear);
                        // Offset orizzontale: tra main branch e card esperienza (più vicino al centro)
                        const offsetXStart = timelineX + (closestStart.side === 'right' ? branchMaxOffset : -branchMaxOffset);
                        const offsetXEnd = timelineX + (closestEnd.side === 'right' ? branchMaxOffset : -branchMaxOffset);
                        // Colore branch
                        const color = edu.color;
                        // Path SVG: curva Bezier dal centro verso offset, parallelo, poi rientra
                        const path = `M${timelineX},${startY}
                          C${timelineX},${startY+20} ${offsetXStart},${startY+20} ${offsetXStart},${startY+40}
                          L${offsetXStart},${endY-40}
                          C${offsetXStart},${endY-20} ${timelineX},${endY-20} ${timelineX},${endY}`;
                        // Etichetta a lato del ramo (non sopra la curva)
                        const labelY = (startY + endY) / 2;
                        const labelX = offsetXStart + (offsetXStart > timelineX ? 18 : -178); // a destra o sinistra del branch
                        return (
                          <g key={edu.label}>
                            <path d={path} stroke={color} strokeWidth={branchStroke} fill="none" filter="url(#branchShadow)" />
                            {/* Etichetta a lato */}
                            <foreignObject x={labelX} y={labelY - 24} width={160} height={48} style={{overflow:'visible'}}>
                              <div className="education-branch-content" style={{borderColor: color, minWidth: 120, background: 'rgba(15,23,42,0.95)'}}>
                                <div className="education-branch-label" style={{color}}>{edu.label}</div>
                                <div className="education-branch-period">{edu.period}</div>
                              </div>
                            </foreignObject>
                          </g>
                        );
                      });

                      // SVG per le branch educative
                      // La height viene scalata in base al contenuto della timeline
                      return (
                        <>
                          <svg width="100%" height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{position:'absolute', left:0, top:0, pointerEvents:'none', zIndex:0}}>
                            <defs>
                              <filter id="branchShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
                              </filter>
                            </defs>
                            {educationBranches}
                          </svg>
                          {/* Work experience items */}
                          {workItems.map((exp, index) => (
                            <div
                              key={exp.id}
                              className={`timeline-item ${exp.side === 'left' ? 'timeline-item-left' : 'timeline-item-right'}`}
                              style={{ top: `${exp.topPos}%` }}
                              onClick={() => handleSelect(exp.id, 'experience')}
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
                        </>
                      );
                    })()}
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
