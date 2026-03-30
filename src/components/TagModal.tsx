import React, { useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import './TagModal.css';
import { Project, Experience } from '../projectsData';

interface TagModalProps {
    tagName: string;
    projects: Project[];
    experiences: Experience[];
    onClose: () => void;
    onItemClick: (id: string, type: 'project' | 'experience') => void;
    t: any;
}

export const TagModal: React.FC<TagModalProps> = ({
    tagName,
    projects,
    experiences,
    onClose,
    onItemClick,
    t
}) => {
    const matchedProjects = projects.filter(p =>
        p.technologies.some(tech => tech.toLowerCase() === tagName.toLowerCase())
    );
    const matchedExperiences = experiences.filter(e =>
        e.technologies.some(tech => tech.toLowerCase() === tagName.toLowerCase())
    );

    useEffect(() => {
        trackEvent('tags_modal_opened', { tag: tagName });
    }, [tagName]);

    return (
        <div className="tag-modal-overlay" onClick={onClose}>
            <div className="tag-modal-content glassmorphism" onClick={e => e.stopPropagation()}>
                <header className="tag-modal-header">
                    <h3>{tagName}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </header>
                <div className="tag-modal-body">
                    {matchedExperiences.length > 0 && (
                      <section className="tag-modal-section">
                        <h4>{t.experience}</h4>
                        <div className="tag-modal-grid">
                          {matchedExperiences.map(exp => (
                            <div
                              key={exp.id}
                              className="tag-modal-card"
                              onClick={() => onItemClick(exp.id, 'experience')}
                            >
                              <h5>{exp.name}</h5>
                              <p>{exp.company}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                    {matchedProjects.length > 0 && (
                        <section className="tag-modal-section">
                            <h4>{t.projects}</h4>
                            <div className="tag-modal-grid">
                                {matchedProjects.map(project => (
                                    <div
                                        key={project.id}
                                        className="tag-modal-card"
                                        onClick={() => onItemClick(project.id, 'project')}
                                    >
                                        <h5>{project.name}</h5>
                                        <p>{project.summary}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
