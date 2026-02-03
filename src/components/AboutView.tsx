import React, {useRef} from 'react';
import {translations, Language} from '../i18n';
import './AboutView.css';

interface AboutViewProps {
  lang: Language;
  handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
  onTagClick?: (tagName: string) => void;
}

export function AboutView({lang, handleSelect, onTagClick}: AboutViewProps) {
  const t = translations[lang];
  const skillsRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  };

  const renderTag = (tag: string) => (
    <span
      key={tag}
      className="clickable-tag"
      onClick={(e) => {
        e.stopPropagation();
        onTagClick?.(tag);
      }}
    >
            {tag}
        </span>
  );

  return (
    <article className="profile-view">
      <div className="view-header">
        <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
        <h2>{t.aboutMeTitle}</h2>
      </div>

      <div className="about-container">
        <aside className="about-side-menu">
          <nav>
            <ul>
              <li onClick={() => scrollToSection(educationRef)}>
                <span className="menu-icon">🎓</span>
                <span className="menu-text">{t.education}</span>
              </li>
              <li onClick={() => scrollToSection(skillsRef)}>
                <span className="menu-icon">🛠️</span>
                <span className="menu-text">{t.techSkills}</span>
              </li>
              <li onClick={() => scrollToSection(interestsRef)}>
                <span className="menu-icon">🌟</span>
                <span className="menu-text">{t.interests}</span>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="about-main-content">
          <section className="about-intro-panel">
            <p className="bio">{t.bio}</p>
            <div className="about-contact-explicit">
              <a href="mailto:alessandromuzzi17@gmail.com" className="contact-item">
                <span className="contact-icon">✉️</span>
                <span className="contact-text">alessandromuzzi17@gmail.com</span>
              </a>
              <a href="https://www.linkedin.com/in/alessandro-muzzi" target="_blank" rel="noopener noreferrer" className="contact-item">
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="contact-text">LinkedIn</span>
              </a>
              <a href="https://github.com/AleMuzzi" target="_blank" rel="noopener noreferrer" className="contact-item">
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="contact-text">GitHub</span>
              </a>
            </div>
          </section>

          <section ref={educationRef} className="about-section">
            <h3><span className="section-icon">🎓</span>{t.education}</h3>
            <div className="education-container">
              <div className="education-item">
                <div className="edu-top">
                  <div className="edu-header">
                    <h4>
                      {t.highSchool}
                      <span className="edu-spec">{t.itField}</span>
                    </h4>
                    <span className="edu-period">2010 — 2015</span>
                  </div>
                </div>
                <div className="edu-bottom">
                  <p className="edu-org">ITIS Leonardo Da Vinci, Parma</p>
                  <p className="edu-grade">{t.grade}: 100/100</p>
                </div>
              </div>
              <div className="education-item">
                <div className="edu-top">
                  <div className="edu-header">
                    <h4>
                      {t.bachelorsDegree}
                      <span className="edu-spec">{t.compEngField}</span>
                    </h4>
                    <span className="edu-period">2015 — 2018</span>
                  </div>
                </div>
                <div className="edu-bottom">
                  <p className="edu-org">Università degli Studi di Parma</p>
                  <p className="edu-grade">{t.grade}: 93/110</p>
                </div>
              </div>
              <div className="education-item">
                <div className="edu-top">
                  <div className="edu-header">
                    <h4>
                      {t.mastersDegree}
                      <span className="edu-spec">{t.compEngField}</span>
                    </h4>
                    <span className="edu-period">2019 — 2022</span>
                  </div>
                </div>
                <div className="edu-bottom">
                  <p className="edu-org">Università degli Studi di Parma</p>
                  <p className="edu-grade">{t.grade}: 110/110</p>
                </div>
              </div>
            </div>
          </section>

          <div className="profile-sections">
            <section ref={skillsRef} className="about-section">
              <h3><span className="section-icon">🛠️</span>{t.techSkills}</h3>
              <div className="skills-container">
                <div className="skill-category">
                  <h4>{t.softwareDev}</h4>
                  <div className="skill-tags">
                    {["Python", "Kotlin", "C++", "C#", "Java", "Dart", "TypeScript", "Lua", "Swift", "React", "Node.js", "Flutter", "Unity", "Android SDK", "Spring", ".NET", "Architecture", "System Design", "Infrastructure", "Team Management", "Web Scraping"].map(renderTag)}
                  </div>
                </div>
                <div className="skill-category">
                  <h4>{t.hardwareEmbedded}</h4>
                  <div className="skill-tags">
                    {["Arduino", "ESP32", "STM32", "OpenWRT", "Marlin", "State Machines", "Custom C++", "DJI SDK", "PID", "Motion Control", "Telemetry", "PTZ", "3D Printing", "Slicing", "3D Modeling", "Fusion 360", "Blender"].map(renderTag)}
                  </div>
                </div>
                <div className="skill-category">
                  <h4>{t.dataAI}</h4>
                  <div className="skill-tags">
                    {["Pandas", "NumPy", "Scikit-learn", "BERT", "Elasticsearch", "DepthAI", "Active Inference", "Semantic Search", "Financial Engineering", "Computer Vision"].map(renderTag)}
                  </div>
                </div>
              </div>
            </section>

            <section ref={interestsRef} className="about-section">
              <h3><span className="section-icon">🌟</span>{t.interests}</h3>
              <ul className="interests-list">
                <li><strong>{t.interest1Title}</strong> {t.interest1Desc}</li>
                <li><strong>{t.interest4Title}</strong> {t.interest4Desc}</li>
                <li><strong>{t.interest2Title}</strong> {t.interest2Desc}</li>
                <li><strong>{t.interest3Title}</strong> {t.interest3Desc}</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
