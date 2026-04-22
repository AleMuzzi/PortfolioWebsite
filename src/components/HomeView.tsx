import { useState, useEffect } from 'react';
import printerWithRobot from '../assets/printer_with_robot.webp';
import printerControlPanel0 from '../assets/printer_control_panel_0.webp';
import printerControlPanel25 from '../assets/printer_control_panel_25.webp';
import printerControlPanel50 from '../assets/printer_control_panel_50.webp';
import printerControlPanel75 from '../assets/printer_control_panel_75.webp';
import laptop from '../assets/laptop.png';
import book from '../assets/book.webp';
import solderingIron from '../assets/soldering_iron.webp';
import laptopCables from '../assets/laptop_cables.webp';
import './HomeView.css';

interface HomeViewProps {
    t: any;
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
    hasInteracted: boolean;
    setHasInteracted: (value: boolean) => void;
    isMobile?: boolean;
}

export const HomeView = ({ t, handleSelect, hasInteracted, setHasInteracted, isMobile }: HomeViewProps) => {
    const [currentPanelIndex, setCurrentPanelIndex] = useState(0);

    const panelImages = [
        printerControlPanel0,
        printerControlPanel25,
        printerControlPanel50,
        printerControlPanel75
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPanelIndex((prevIndex) => (prevIndex + 1) % panelImages.length);
        }, 1500);
        return () => clearInterval(interval);
    }, [panelImages.length]);


    const handleMouseEnter = () => {
        setHasInteracted(true);
    };

    const handleItemClick = (type: 'experience' | 'project' | 'about') => {
        setHasInteracted(true);
        handleSelect(null, type);
    };

    return (
        <article className="home-view">
            <div className="home-visuals">
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
            </div>

            <div className="home-content-split">
                <div className="home-intro">
                    <h2 className="home-title">{t.heroTitle}</h2>
                    <p className="home-description" dangerouslySetInnerHTML={{ __html: t.heroDesc }}></p>
                    <div className="citations">
                        <a href="https://www.linkedin.com/in/alessandro-muzzi/#:~:text=Lori%20Pike,%E2%80%A6%20more" target="_blank" rel="noopener noreferrer" className="citation-link">
                            <blockquote className="citation">
                                <p dangerouslySetInnerHTML={{ __html: t.citation1 }}></p>
                                <cite>
                                    <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span>{t.citation1Author}</span>
                                </cite>
                            </blockquote>
                        </a>
                        <a href="https://www.linkedin.com/in/alessandro-muzzi/#:~:text=Jeff%20Pike,and%20systems%20forward." target="_blank" rel="noopener noreferrer" className="citation-link">
                            <blockquote className="citation">
                                <p dangerouslySetInnerHTML={{ __html: t.citation2 }}></p>
                                <cite>
                                    <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                    <span>{t.citation2Author}</span>
                                </cite>
                            </blockquote>
                        </a>
                    </div>
                </div>

                <div className="interactive-landing">
                    <div className="printer-container">
                        <img src={printerWithRobot} alt="Printer with robot" className="printer-robot-img" />
                        
                        <div className="printer-panel-item-easter-egg" style={{cursor: "default"}}>
                            <img src={panelImages[currentPanelIndex]} alt="Printer Control Panel" />
                        </div>

                        <div 
                            className={`clickable-item laptop-item ${!hasInteracted || isMobile ? 'glowing' : ''}`}
                            onClick={() => handleItemClick('experience')}
                            onMouseEnter={handleMouseEnter}
                            onKeyDown={(e) => e.key === 'Enter' && handleItemClick('experience')}
                            role="button"
                            tabIndex={0}
                            aria-label={t.workTitle}
                        >
                            <img src={laptop} alt="Laptop" />
                            <span className="tooltip">{t.workTitle}</span>
                        </div>
                        <div className="non-clickable-item laptop-cables-item">
                            <img src={laptopCables} alt="Laptop Cables" />
                        </div>
                        <div 
                            className={`clickable-item soldering-iron-item ${!hasInteracted || isMobile ? 'glowing' : ''}`}
                            onClick={() => handleItemClick('project')}
                            onMouseEnter={handleMouseEnter}
                            onKeyDown={(e) => e.key === 'Enter' && handleItemClick('project')}
                            role="button"
                            tabIndex={0}
                            aria-label={t.personalTitle}
                        >
                            <img src={solderingIron} alt="Soldering Iron" />
                            <span className="tooltip">{t.personalTitle}</span>
                        </div>
                        <div 
                            className={`clickable-item book-item ${!hasInteracted || isMobile ? 'glowing' : ''}`}
                            onClick={() => handleItemClick('about')}
                            onMouseEnter={handleMouseEnter}
                            onKeyDown={(e) => e.key === 'Enter' && handleItemClick('about')}
                            role="button"
                            tabIndex={0}
                            aria-label={t.aboutTitle}
                        >
                            <img src={book} alt="Book" />
                            <span className="tooltip">{t.profileButton}</span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
};
