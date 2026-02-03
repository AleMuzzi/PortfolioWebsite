import { useState, useEffect } from 'react';
import printerWithRobot from '../assets/printer_with_robot.png';
import printerControlPanel0 from '../assets/printer_control_panel_0.png';
import printerControlPanel25 from '../assets/printer_control_panel_25.png';
import printerControlPanel50 from '../assets/printer_control_panel_50.png';
import printerControlPanel75 from '../assets/printer_control_panel_75.png';
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
    const [isGlowing, setIsGlowing] = useState(false);
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
        }, 2000);
        return () => clearInterval(interval);
    }, [panelImages.length]);

    const triggerGlow = () => {
        if (isGlowing) return;
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 2000);
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
                    <p className="home-description">{t.heroDesc}</p>
                    <div className="home-cta" onClick={triggerGlow}>
                        <span className="cta-hint">Explore by clicking on the items</span>
                    </div>
                </div>

                <div className="interactive-landing">
                    <div className="printer-container">
                        <img src={printerWithRobot} alt="Printer with robot" className="printer-robot-img" />
                        
                        <div className="printer-panel-item-easter-egg" onClick={() => setIsTerminalOpen(true)}>
                            <img src={panelImages[currentPanelIndex]} alt="Printer Control Panel" />
                        </div>

                        <div className={`clickable-item laptop-item ${isGlowing ? 'glowing' : ''}`} onClick={() => handleSelect(null, 'experience')}>
                            <img src={laptop} alt="Laptop" />
                            <span className="tooltip">{t.workTitle}</span>
                        </div>
                        <div className="non-clickable-item laptop-cables-item">
                            <img src={laptopCables} alt="Laptop Cables" />
                        </div>
                        <div className={`clickable-item soldering-iron-item ${isGlowing ? 'glowing' : ''}`} onClick={() => handleSelect(null, 'project')}>
                            <img src={solderingIron} alt="Soldering Iron" />
                            <span className="tooltip">{t.personalTitle}</span>
                        </div>
                        <div className={`clickable-item book-item ${isGlowing ? 'glowing' : ''}`} onClick={() => handleSelect(null, 'about')}>
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
