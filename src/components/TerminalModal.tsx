import React, { useState, useEffect, useRef } from 'react';
import './TerminalModal.css';

interface TerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, t }) => {
    const getTimestamp = () => {
        return `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}]`;
    };

    const initialLines = [
        `${getTimestamp()} [SYS] ${t.terminalInit1}`,
        `${getTimestamp()} [SYS] ${t.terminalInit2}`,
        `${getTimestamp()} [SYS] ${t.terminalInit3}`,
        `${getTimestamp()} [AUTH] ${t.terminalAuth}`,
        `${getTimestamp()} [INFO] ${t.terminalInfo}`,
        `${getTimestamp()} [HINT] ${t.terminalHint}`,
    ];

    const [lines, setLines] = useState<string[]>(initialLines);
    const [inputValue, setInputValue] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setLines(initialLines);
            setIsRevealed(false);
            setInputValue('');
        }
    }, [isOpen]);

    const scrollToBottom = () => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [lines]);

    if (!isOpen) return null;

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = inputValue.trim().toLowerCase();
        setLines(prev => [...prev, `${getTimestamp()} guest@portfolio:~$ ${inputValue}`]);

        if (cmd === 'reveal') {
            setLines(prev => [...prev, `${getTimestamp()} [PROCESS] ${t.terminalProcess}`]);
            setTimeout(() => {
                setLines(prev => [...prev, `${getTimestamp()} [SUCCESS] ${t.terminalSuccess1}: ${t.vibeP1}`]);
                setTimeout(() => {
                    setLines(prev => [...prev, `${getTimestamp()} [SUCCESS] ${t.terminalSuccess2}: ${t.vibeP2}`]);
                    setTimeout(() => {
                        setLines(prev => [...prev, `${getTimestamp()} [INFO] ${t.vibeMeta}`, `${getTimestamp()} [CMD] ${t.vibeClose}`]);
                        setIsRevealed(true);
                    }, 600);
                }, 600);
            }, 800);
        } else if (cmd === 'clear') {
            setLines([]);
        } else if (cmd === 'help') {
            setLines(prev => [...prev, 
                `${getTimestamp()} [HELP] ${t.terminalHelpTitle}`, 
                `  - reveal : ${t.terminalHelpReveal}`, 
                `  - clear  : ${t.terminalHelpClear}`, 
                `  - help   : ${t.terminalHelpHelp}`, 
                `  - exit   : ${t.terminalHelpExit}`
            ]);
        } else if (cmd === 'exit') {
            onClose();
        } else {
            setLines(prev => [...prev, `${getTimestamp()} [ERROR] ${t.terminalError}: ${cmd}`]);
        }
        setInputValue('');
    };

    return (
        <div className="terminal-overlay" onClick={onClose}>
            <div className="terminal-window" onClick={e => e.stopPropagation()}>
                <div className="terminal-header">
                    <div className="terminal-dots">
                      <span className="dot red" onClick={onClose} style={{ cursor: 'pointer' }}></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                    </div>
                    <span className="terminal-title">root@3d-printer:~</span>
                    <button className="terminal-close" onClick={onClose}>×</button>
                </div>
                <div className="terminal-body">
                    {lines.map((line, i) => (
                        <div key={i} className="terminal-line">{line}</div>
                    ))}
                    {!isRevealed && (
                        <form onSubmit={handleCommand} className="terminal-input-line">
                            <span className="terminal-prompt">guest@portfolio:~$</span>
                            <input
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                autoFocus
                                className="terminal-input"
                            />
                        </form>
                    )}
                    <div ref={terminalEndRef} />
                </div>
            </div>
        </div>
    );
};
