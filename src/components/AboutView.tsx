import React from 'react';
import { translations, Language } from '../i18n';
import './AboutView.css';

interface AboutViewProps {
    lang: Language;
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
}

export function AboutView({ lang, handleSelect }: AboutViewProps) {
    const t = translations[lang];

    return (
        <article className="profile-view">
            <div className="view-header">
                <button className="back-button" onClick={() => handleSelect(null, 'home')}>←</button>
                <h2>{t.aboutMeTitle}</h2>
            </div>
            <div className="profile-grid">
              <p className="bio">{t.bio}</p>
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
    );
}
