import React, { useState } from 'react';
import printerWithRobot from '../assets/printer_with_robot.png';
import printerControlPanel from '../assets/printer_control_panel.png';
import laptop from '../assets/laptop.png';
import book from '../assets/book.png';
import solderingIron from '../assets/soldering_iron.png';
import laptopCables from '../assets/laptop_cables.png';
import './HomeView.css';
import { TerminalModal } from './TerminalModal';

interface HomeViewProps {
    t: any;
    handleSelect: (id: string | null, type: 'project' | 'experience' | 'about' | 'home' | null) => void;
}

export const HomeView = ({ t, handleSelect }: HomeViewProps) => {
    const [isTerminalOpen, setIsTerminalOpen] = useState(false);

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
                    <p className="home-description">{t.heroDesc}</p>
                    <div className="home-cta">
                        <span className="cta-hint">Explore by clicking on the items</span>
                    </div>
                </div>

                <div className="interactive-landing">
                    <div className="printer-container">
                        <img src={printerWithRobot} alt="Printer with robot" className="printer-robot-img" />
                        
                        <div className="printer-panel-item-easter-egg" onClick={() => setIsTerminalOpen(true)}>
                            <img src={printerControlPanel} alt="Printer Control Panel" />
                        </div>

                        <div className="clickable-item laptop-item" onClick={() => handleSelect(null, 'experience')}>
                            <img src={laptop} alt="Laptop" />
                            <span className="tooltip">{t.workTitle}</span>
                        </div>
                        <div className="non-clickable-item laptop-cables-item">
                            <img src={laptopCables} alt="Laptop Cables" />
                        </div>
                        <div className="clickable-item soldering-iron-item" onClick={() => handleSelect(null, 'project')}>
                            <img src={solderingIron} alt="Soldering Iron" />
                            <span className="tooltip">{t.personalTitle}</span>
                        </div>
                        <div className="clickable-item book-item" onClick={() => handleSelect(null, 'about')}>
                            <img src={book} alt="Book" />
                            <span className="tooltip">{t.profileButton}</span>
                        </div>
                    </div>
                </div>
            </div>

            <TerminalModal 
                isOpen={isTerminalOpen} 
                onClose={() => setIsTerminalOpen(false)} 
                t={t} 
            />
        </article>
    );
};
