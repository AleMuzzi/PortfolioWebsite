import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects, experiences, Experience, Project } from './projectsData';
import { translations, Language } from './i18n';

function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'experience' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    project: false
  });

  const t = translations[lang];

  const filteredProjects = useMemo(() => projects.filter(p => p.lang === lang), [lang]);
  const filteredExperiences = useMemo(() => experiences.filter(e => e.lang === lang), [lang]);

  const toggleSection = (section: 'experience' | 'project') => {
    setExpandedSections(prev => {
      const isOpening = !prev[section];
      if (isOpening) {
        return {
          experience: section === 'experience',
          project: section === 'project'
        };
      } else {
        return {
          ...prev,
          [section]: false
        };
      }
    });
  };

  const handleFooterClick = () => {
    const newCount = clickCount + 1;
    if (newCount === 2) {
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSelect = (id: string | null, type: 'project' | 'experience' | null) => {
    setSelectedId(id);
    setSelectedType(type);
    if (type) {
      setExpandedSections({
        experience: type === 'experience',
        project: type === 'project'
      });
    }
    closeSidebar();
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'it' : 'en');
  };

  return (
    <div className={`app-root ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-header">
            <h1>{t.heroTitle}</h1>
            <div className="header-actions">
              <button className="lang-toggle" onClick={toggleLanguage} aria-label="Toggle language">
                {lang === 'en' ? '🇮🇹 IT' : '🇬🇧 EN'}
              </button>
              <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
                {isSidebarOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
          <p>{t.heroDesc}</p>
        </div>
      </header>

      <main className="layout">
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} aria-label="Navigation sidebar">
          <div className="sidebar-header">
            <button 
              className={`home-button ${selectedId === null ? 'active' : ''}`}
              onClick={() => handleSelect(null, null)}
            >
              {t.profileButton}
            </button>
          </div>

          <div className={`sidebar-section ${expandedSections.experience ? 'expanded' : ''}`}>
            <h2 className="sidebar-title" onClick={() => toggleSection('experience')}>
              <span className="title-text">
                <span className="section-icon">💼</span>
                {t.workTitle}
              </span>
              <span className="section-chevron">{expandedSections.experience ? '▾' : '▸'}</span>
            </h2>
            <ul className="project-list">
              {filteredExperiences.map((experience: Experience) => (
                <li key={experience.id}>
                  <button
                    className={`project-item ${selectedId === experience.id && selectedType === 'experience' ? 'active' : ''}`}
                    onClick={() => handleSelect(experience.id, 'experience')}
                  >
                    <span className="project-name">{experience.name}</span>
                    <span className="project-tagline">{experience.summary}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={`sidebar-section ${expandedSections.project ? 'expanded' : ''}`}>
            <h2 className="sidebar-title" onClick={() => toggleSection('project')}>
              <span className="title-text">
                <span className="section-icon">🛠️</span>
                {t.personalTitle}
              </span>
              <span className="section-chevron">{expandedSections.project ? '▾' : '▸'}</span>
            </h2>
            <ul className="project-list">
              {filteredProjects.map((project: Project) => (
                <li key={project.id}>
                  <button
                    className={`project-item ${selectedId === project.id && selectedType === 'project' ? 'active' : ''}`}
                    onClick={() => handleSelect(project.id, 'project')}
                  >
                    <span className="project-name">{project.name}</span>
                    <span className="project-tagline">{project.summary || project.overview.split('\n')[0].replace(/[#*`[\]]/g, '')}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="details-wrapper">
          <section className="details" aria-label="Content details">
            {(!selectedId) ? (
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
                          <li><strong>{t.languages}:</strong> Kotlin, Java, Python, C#, Dart, TypeScript, C++</li>
                          <li><strong>{t.frameworks}:</strong> React, Flutter, Android SDK, .NET, Unity Engine</li>
                          <li><strong>{t.backend}:</strong> Dedicated Servers (TCP/Sockets), REST APIs</li>
                        </ul>
                      </div>
                      <div className="skill-category">
                        <h4>{t.hardwareEmbedded}</h4>
                        <ul>
                          <li><strong>{t.microcontrollers}:</strong> Arduino, ESP32, STM32</li>
                          <li><strong>{t.firmware}:</strong> Marlin 2.x, Custom State Machines</li>
                          <li><strong>{t.robotics}:</strong> PID Tuning, Motion Control, Telemetry Systems</li>
                          <li><strong>{t.digitalFabrication}:</strong> 3D Printing (FDM), Slicing, 3D Modeling (Blender, 3ds Max)</li>
                        </ul>
                      </div>
                      <div className="skill-category">
                        <h4>{t.dataAI}</h4>
                        <ul>
                          <li><strong>{t.libraries}:</strong> Pandas, NumPy, Scikit-learn, DepthAI</li>
                          <li><strong>{t.domains}:</strong> Financial Market Analysis, AI-assisted Investing, Computer Vision</li>
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
                          <h4>{t.masters}</h4>
                          <span className="edu-period">2019 — 2022</span>
                        </div>
                        <p className="edu-org">Università degli Studi di Parma</p>
                        <p className="edu-grade">{t.grade}: 110/110</p>
                      </div>
                      <div className="education-item">
                        <div className="edu-header">
                          <h4>{t.bachelors}</h4>
                          <span className="edu-period">2015 — 2018</span>
                        </div>
                        <p className="edu-org">Università degli Studi di Parma</p>
                        <p className="edu-grade">{t.grade}: 93/110</p>
                        <p className="edu-activity">{t.activities}: Arrampicata (Climbing)</p>
                      </div>
                      <div className="education-item">
                        <div className="edu-header">
                          <h4>{t.highschool}</h4>
                          <span className="edu-period">2010 — 2015</span>
                        </div>
                        <p className="edu-org">ITIS Leonardo Da Vinci, Parma</p>
                        <p className="edu-grade">{t.grade}: 100/100</p>
                      </div>
                    </div>
                  </section>
                </div>
              </article>
            ) : selectedType === 'experience' && selectedExperience ? (
              <article className="project-details">
                <h2>{selectedExperience.name}</h2>
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
                <h2>{selectedProject.name}</h2>

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

      <footer className="footer" onClick={handleFooterClick} style={{ cursor: 'default' }}>
        <span>{t.builtWith} React · Vite</span>
      </footer>

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
