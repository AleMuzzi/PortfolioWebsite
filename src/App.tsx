import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { projects } from './projectsData';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showVibeModal, setShowVibeModal] = useState(false);
  const [clickCount, setClickCount] = useState(0);

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

  const selected = projects.find((p) => p.id === selectedId);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleSelect = (id: string | null) => {
    setSelectedId(id);
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
            A curated collection of hardware builds, mobile apps, games, and tools. Browse the
            projects on the left to explore how each one was built and the technologies involved.
          </p>
        </div>
      </header>

      <main className="layout">
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar} />}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`} aria-label="Project list">
          <div className="sidebar-header">
            <button 
              className={`home-button ${selectedId === null ? 'active' : ''}`}
              onClick={() => handleSelect(null)}
            >
              Profile & Skills
            </button>
          </div>
          <h2 className="sidebar-title">Projects</h2>
          <ul className="project-list">
            {projects.map((project: Project) => (
              <li key={project.id}>
                <button
                  className={`project-item ${selectedId === project.id ? 'active' : ''}`}
                  onClick={() => handleSelect(project.id)}
                >
                  <span className="project-name">{project.name}</span>
                  <span className="project-tagline">{project.summary || project.overview.split('\n')[0].replace(/[#*`[\]]/g, '')}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="details" aria-label="Content details">
          {!selected ? (
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
              </div>
            </article>
          ) : (
            <article className="project-details">
              <h2>{selected.name}</h2>

              <section>
                <h3>Overview</h3>
                <ReactMarkdown>{selected.overview}</ReactMarkdown>
              </section>

              <section>
                <h3>How it was done</h3>
                <ReactMarkdown>{selected.how}</ReactMarkdown>
              </section>

              <section>
                <h3>Technologies &amp; tools</h3>
                <ul className="tech-list">
                  {selected.technologies.map((tech: string) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </section>
            </article>
          )}
        </section>
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
                I much prefer debugging firmware or optimizing state machines.
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
