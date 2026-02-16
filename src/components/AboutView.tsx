import React, {useRef, useMemo} from 'react';
import { trackEvent } from '../utils/analytics';
import {translations, Language} from '../i18n';
import {projects, experiences} from '../projectsData';
import './AboutView.css';

// Parse period end date to timestamp (higher = more recent)
const parseEndDate = (period: string): number => {
  // Handle "Present" / "Presente" as current date
  if (period.toLowerCase().includes('present') || period.toLowerCase().includes('presente')) {
    return Date.now();
  }
  // Extract end date from "Month Year — Month Year" format
  const parts = period.split(/[—–-]/);
  const endPart = parts[parts.length - 1].trim();
  const date = new Date(endPart);
  return isNaN(date.getTime()) ? 0 : date.getTime();
};

type TagCategory = 'software' | 'hardware' | 'data' | 'framework' | 'management';

// Map MD file categories to AboutView categories
const categoryMapping: Record<string, TagCategory> = {
  // Software Development
  'Languages': 'software',
  'Linguaggi': 'software',
  'Frameworks': 'framework',
  'Framework': 'framework',
  'Frameworks & UI': 'framework',
  'Framework e UI': 'framework',
  'Backend & APIs': 'software',
  'Backend e APIs': 'software',
  'Frontend': 'software',
  'Platforms': 'framework',
  'Piattaforme': 'framework',
  'Management & Versioning': 'framework',
  'Gestione e Versionamento': 'framework',
  'Management': 'management',
  'Core Skills': 'software',
  'Core Competencies': 'software',
  'Competenze Chiave': 'software',
  'Communication': 'framework',
  'Comunicazione': 'framework',
  'Communication Protocols': 'framework',
  'Protocolli di Comunicazione': 'framework',
  'Supported OS': 'software',
  'OS Supportati': 'software',
  'Design Patterns': 'software',
  'Design Pattern': 'software',
  // Hardware & Embedded
  'Hardware': 'hardware',
  'Firmware': 'hardware',
  'User Interface': 'hardware',
  'Interfaccia utente': 'hardware',
  'Slicers': 'hardware',
  'Design': 'hardware',
  'Prototyping Tools': 'hardware',
  'Strumenti di Prototipazione': 'hardware',
  'Circuit Design Software': 'hardware',
  'Software di Progettazione Circuiti': 'hardware',
  'Image Editing': 'hardware',
  'Editing Immagini': 'hardware',
  '3D Modeling': 'hardware',
  'Modellazione 3D': 'hardware',
  '3D Printing': 'hardware',
  'Stampa 3D': 'hardware',
  'Robotics': 'hardware',
  'Robotica': 'hardware',
  // Data & AI
  'Data & AI': 'data',
  'Dati e AI': 'data',
  'Infrastructure': 'framework',
  'Infrastruttura': 'framework',
};

interface AboutViewProps {
  lang: Language;
  handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
  onTagClick?: (tagName: string) => void;
}

export function AboutView({lang, handleSelect, onTagClick}: AboutViewProps) {
  const t = translations[lang];
  const aboutMeRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);

  // Collect tags from projects and experiences based on current language
  // Sort by usage count (desc), then by recency (desc)
  const {softwareTags, hardwareTags, dataTags, frameworkTags, managementTags} = useMemo(() => {
    // Track count and most recent date for each tag
    const tagStats: Record<string, { count: number; latestDate: number; category: TagCategory }> = {};

    const addTag = (tech: string, category: TagCategory, date: number) => {
      if (!tagStats[tech]) {
        tagStats[tech] = { count: 0, latestDate: 0, category };
      }
      tagStats[tech].count++;
      tagStats[tech].latestDate = Math.max(tagStats[tech].latestDate, date);
    };

    const processItem = (categorizedTech: Record<string, string[]> | undefined, date: number) => {
      if (!categorizedTech) return;
      Object.entries(categorizedTech).forEach(([category, techs]) => {
        const targetCategory = categoryMapping[category];
        if (targetCategory) {
          techs.forEach(tech => addTag(tech, targetCategory, date));
        }
      });
    };

    // Process projects (use order as recency proxy - lower order = more recent/important)
    const filteredProjects = projects.filter(p => p.lang === lang);
    const maxOrder = Math.max(...filteredProjects.map(p => p.order ?? 0), 1);
    filteredProjects.forEach(p => {
      const date = (maxOrder - (p.order ?? maxOrder) + 1) * 1000; // Convert to pseudo-timestamp
      processItem(p.categorizedTech, date);
    });

    // Process experiences (parse period for actual dates)
    experiences
      .filter(e => e.lang === lang)
      .forEach(e => {
        const date = parseEndDate(e.period);
        processItem(e.categorizedTech, date);
      });

    // Sort tags by count (desc), then by latestDate (desc)
    const sortTags = (category: TagCategory): string[] => {
      return Object.entries(tagStats)
        .filter(([_, stats]) => stats.category === category)
        .sort((a, b) => {
          if (b[1].count !== a[1].count) return b[1].count - a[1].count;
          return b[1].latestDate - a[1].latestDate;
        })
        .map(([tag]) => tag);
    };

    return {
      softwareTags: sortTags('software'),
      hardwareTags: sortTags('hardware'),
      dataTags: sortTags('data'),
      frameworkTags: sortTags('framework'),
      managementTags: sortTags('management'),
    };
  }, [lang]);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const heading = ref.current.querySelector('h3');
      if (heading) {
        heading.scrollIntoView({behavior: 'smooth'});
      } else {
        ref.current.scrollIntoView({behavior: 'smooth'});
      }
    }
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
      <div ref={aboutMeRef} className="view-header">
        <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
        <h2>{t.aboutMeTitle}</h2>
      </div>

      <div className="about-container">
        <aside className="about-side-menu">
          <nav>
            <ul>
              <li onClick={() => scrollToSection(aboutMeRef)}>
                <span className="menu-icon">👨‍💻</span>
                <span className="menu-text">{t.aboutMeTitle}</span>
              </li>
              <li onClick={() => scrollToSection(educationRef)}>
                <span className="menu-icon">🎓</span>
                <span className="menu-text">{t.education}</span>
              </li>
              <li onClick={() => scrollToSection(interestsRef)}>
                <span className="menu-icon">🌟</span>
                <span className="menu-text">{t.interests}</span>
              </li>
              <li onClick={() => scrollToSection(skillsRef)}>
                <span className="menu-icon">🛠️</span>
                <span className="menu-text">{t.techSkills}</span>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="about-main-content">
          <section className="about-intro-panel">
            <p className="bio">{t.bio}</p>
            <div className="about-contact-explicit">
              <a 
                href="mailto:alessandromuzzi17@gmail.com" 
                className="contact-item"
                onClick={() => trackEvent('contact_click', { type: 'email' })}
              >
                <span className="contact-icon">✉️</span>
                <span className="contact-text">alessandromuzzi17@gmail.com</span>
              </a>
              <a 
                href="https://www.linkedin.com/in/alessandro-muzzi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-item"
                onClick={() => trackEvent('contact_click', { type: 'linkedin' })}
              >
                <svg className="contact-icon-svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <span className="contact-text">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/AleMuzzi" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="contact-item"
                onClick={() => trackEvent('contact_click', { type: 'github' })}
              >
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

          <section ref={interestsRef} className="about-section">
            <h3><span className="section-icon">🌟</span>{t.interests}</h3>
            <ul className="interests-list">
              <li><strong>{t.interest1Title}</strong> {t.interest1Desc}</li>
              <li><strong>{t.interest4Title}</strong> {t.interest4Desc}</li>
              <li><strong>{t.interest2Title}</strong> {t.interest2Desc}</li>
              <li><strong>{t.interest3Title}</strong> {t.interest3Desc}</li>
            </ul>
          </section>

          <div className="profile-sections">
            <section ref={skillsRef} className="about-section">
              <h3><span className="section-icon">🛠️</span>{t.techSkills}</h3>
              <div className="skills-container">
                {softwareTags.length > 0 && (
                  <div className="skill-category">
                    <h4>{t.softwareDev}</h4>
                    <div className="skill-tags">
                      {softwareTags.map(renderTag)}
                    </div>
                  </div>
                )}
                {frameworkTags.length > 0 && (
                  <div className="skill-category">
                    <h4>{t.frameworkInfrastructure}</h4>
                    <div className="skill-tags">
                      {frameworkTags.map(renderTag)}
                    </div>
                  </div>
                )}
                {hardwareTags.length > 0 && (
                  <div className="skill-category">
                    <h4>{t.hardwareEmbedded}</h4>
                    <div className="skill-tags">
                      {hardwareTags.map(renderTag)}
                    </div>
                  </div>
                )}
                {dataTags.length > 0 && (
                  <div className="skill-category">
                    <h4>{t.dataAI}</h4>
                    <div className="skill-tags">
                      {dataTags.map(renderTag)}
                    </div>
                  </div>
                )}
                {managementTags.length > 0 && (
                  <div className="skill-category">
                    <h4>{t.management}</h4>
                    <div className="skill-tags">
                      {managementTags.map(renderTag)}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </article>
  );
}
