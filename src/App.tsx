import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects, experiences, Experience } from './projectsData';

interface Project {
  id: string;
  name: string;
  summary: string;
  overview: string;
  how: string;
  technologies: string[];
}

function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'project' | 'experience' | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    experience: true,
    project: false
  });

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

  const selectedProject = selectedType === 'project' ? projects.find((p) => p.id === selectedId) : null;
  const selectedExperience = selectedType === 'experience' ? experiences.find((e: { id: string | null; }) => e.id === selectedId) : null;

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

  return (
    <div className={`app-root ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <header className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-header">
            <h1>Alessandro&apos;s Portfolio</h1>
            <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle menu">
              {isSidebarOpen ? '✕' : '☰'}
            </button>
          </div>
          <p>
            A curated collection of professional experiences, hardware builds, mobile apps, and tools. 
            Explore the sections on the left to learn more about my journey and technical background.
          </p>
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
              Profile & Skills
            </button>
          </div>

          <div className={`sidebar-section ${expandedSections.experience ? 'expanded' : ''}`}>
            <h2 className="sidebar-title" onClick={() => toggleSection('experience')}>
              <span className="title-text">
                <span className="section-icon">💼</span>
                Work Experience
              </span>
              <span className="section-chevron">{expandedSections.experience ? '▾' : '▸'}</span>
            </h2>
            <ul className="project-list">
              {experiences.map((experience: Experience) => (
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
                Personal Projects
              </span>
              <span className="section-chevron">{expandedSections.project ? '▾' : '▸'}</span>
            </h2>
            <ul className="project-list">
              {projects.map((project: Project) => (
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
                <h2>About Me</h2>
                <p className="bio">
                  I am a versatile developer and maker with a passion for bridging the gap between hardware and software. 
                  I thrive on complex, multi-disciplinary projects that require a mix of programming, electronics, 
                  and digital fabrication. Whether it's building a custom 3D printer or developing a real-time 
                  robotic control system, I enjoy the challenge of making different technologies work together seamlessly. 
                  I am also highly mobile and enjoy traveling for work-related projects and collaborations.
                </p>

                <div className="profile-grid">
                  <section>
                    <h3>Technical Skills</h3>
                    <div className="skills-container">
                      <div className="skill-category">
                        <h4>Software Development</h4>
                        <ul>
                          <li><strong>Languages:</strong> Kotlin, Java, Python, C#, Dart, TypeScript, C++</li>
                          <li><strong>Frameworks:</strong> React, Flutter, Android SDK, .NET, Unity Engine</li>
                          <li><strong>Backend:</strong> Dedicated Servers (TCP/Sockets), REST APIs</li>
                        </ul>
                      </div>
                      <div className="skill-category">
                        <h4>Hardware & Embedded</h4>
                        <ul>
                          <li><strong>Microcontrollers:</strong> Arduino, ESP32, STM32</li>
                          <li><strong>Firmware:</strong> Marlin 2.x, Custom State Machines</li>
                          <li><strong>Robotics:</strong> PID Tuning, Motion Control, Telemetry Systems</li>
                          <li><strong>Digital Fabrication:</strong> 3D Printing (FDM), Slicing, 3D Modeling (Blender, 3ds Max)</li>
                        </ul>
                      </div>
                      <div className="skill-category">
                        <h4>Data & AI</h4>
                        <ul>
                          <li><strong>Libraries:</strong> Pandas, NumPy, Scikit-learn, DepthAI</li>
                          <li><strong>Domains:</strong> Financial Market Analysis, AI-assisted Investing, Computer Vision</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3>Interests</h3>
                    <ul className="interests-list">
                      <li><strong>3D Printing & Fabrication</strong> Pushing the limits of FDM technology and custom machine builds.</li>
                      <li><strong>Multi-disciplinary Engineering</strong> Integrating software, electronics, and mechanics into cohesive systems.</li>
                      <li><strong>Robotics & Automation</strong> Building autonomous systems and real-time control interfaces.</li>
                      <li><strong>Professional Mobility</strong> I enjoy traveling for work, exploring new environments and collaborating on-site.</li>
                    </ul>
                  </section>

                  <section className="education-section">
                    <h3>Education</h3>
                    <div className="education-container">
                      <div className="education-item">
                        <div className="edu-header">
                          <h4>Master&apos;s degree, Computer Engineering</h4>
                          <span className="edu-period">2019 — 2022</span>
                        </div>
                        <p className="edu-org">Università degli Studi di Parma</p>
                        <p className="edu-grade">Grade: 110/110</p>
                      </div>
                      <div className="education-item">
                        <div className="edu-header">
                          <h4>Bachelor&apos;s degree, Computer Engineering</h4>
                          <span className="edu-period">2015 — 2018</span>
                        </div>
                        <p className="edu-org">Università degli Studi di Parma</p>
                        <p className="edu-grade">Grade: 93/110</p>
                        <p className="edu-activity">Activities: Arrampicata (Climbing)</p>
                      </div>
                      <div className="education-item">
                        <div className="edu-header">
                          <h4>High School degree, Information Technology</h4>
                          <span className="edu-period">2010 — 2015</span>
                        </div>
                        <p className="edu-org">ITIS Leonardo Da Vinci, Parma</p>
                        <p className="edu-grade">Grade: 100/100</p>
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
                  <h3>What I did</h3>
                  <ReactMarkdown>{selectedExperience.details}</ReactMarkdown>
                </section>

                <section>
                  <h3>Technologies &amp; tools</h3>
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
                  <h3>Overview</h3>
                  <ReactMarkdown>{selectedProject.overview}</ReactMarkdown>
                </section>

                <section>
                  <h3>How it was done</h3>
                  <ReactMarkdown>{selectedProject.how}</ReactMarkdown>
                </section>

                <section>
                  <h3>Technologies &amp; tools</h3>
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
        <span>Built with React · Vite</span>
      </footer>

      {showVibeModal && (
        <div className="vibe-overlay">
          <div className="vibe-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vibe-content">
              <h3>✨ Confession Time</h3>
              <p>
                I don&apos;t actually like building websites.
                I much prefer doing backend work, building engines or creating complex yet fast algorithms.
              </p>
              <p>
                So, even though I always focus on <strong>code quality</strong> and <strong>optimization</strong>,
                this entire website was <strong>vibe-coded</strong> into existence.
              </p>
              <p className="vibe-meta">
                Vibe Level: 100% · Bugs: Hopefully 0 · Fun: Infinite
              </p>
              <button className="vibe-close" onClick={() => setShowVibeModal(false)}>
                Stay Chill ✌️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
