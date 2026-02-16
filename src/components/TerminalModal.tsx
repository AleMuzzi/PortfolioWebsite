import React, { useState, useEffect, useRef } from 'react';
import './TerminalModal.css';
import { trackEvent } from '../utils/analytics';

interface TerminalModalProps {
    isOpen: boolean;
    onClose: () => void;
    t: any;
}

interface TerminalLine {
    timestamp: string;
    type?: string;
    content: string;
    isCommand?: boolean;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ isOpen, onClose, t }) => {
    const getTimestamp = () => {
        return new Date().toLocaleTimeString('en-GB', { hour12: false });
    };

    const initialLines: TerminalLine[] = [
        { timestamp: getTimestamp(), type: 'SYS', content: t.terminalInit1 },
        { timestamp: getTimestamp(), type: 'SYS', content: t.terminalInit2 },
        { timestamp: getTimestamp(), type: 'SYS', content: t.terminalInit3 },
        { timestamp: getTimestamp(), type: 'AUTH', content: t.terminalAuth },
        { timestamp: getTimestamp(), type: 'INFO', content: t.terminalInfo },
        { timestamp: getTimestamp(), type: 'HINT', content: t.terminalHint },
    ];

    const [lines, setLines] = useState<TerminalLine[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isRevealed, setIsRevealed] = useState(false);
    const [isBooting, setIsBooting] = useState(false);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            trackEvent('easter-egg-terminal-opened');
            setLines([initialLines[0]]);
            setIsRevealed(false);
            setInputValue('');
            setIsBooting(true);

            const timer = setInterval(() => {
                setLines(prev => {
                    if (prev.length < initialLines.length) {
                        return [...prev, initialLines[prev.length]];
                    } else {
                        clearInterval(timer);
                        setIsBooting(false);
                        return prev;
                    }
                });
            }, 750);

            return () => clearInterval(timer);
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
        setLines(prev => [...prev, { timestamp: getTimestamp(), content: `guest@portfolio:~$ ${inputValue}`, isCommand: true }]);

        if (cmd === 'reveal') {
            trackEvent('easter-egg-terminal-reveal-command');
            setIsBooting(true); // Disable input during automated typing
            setLines(prev => [...prev, { timestamp: getTimestamp(), type: 'PROCESS', content: t.terminalProcess }]);
            setTimeout(() => {
                setLines(prev => [...prev, { timestamp: getTimestamp(), type: 'SUCCESS', content: `${t.terminalSuccess1}: ${t.vibeP1}` }]);
                setTimeout(() => {
                  setLines(prev => [...prev, { timestamp: getTimestamp(), type: 'SUCCESS', content: `${t.terminalSuccess2}: ${t.vibeP2}` }]);
                  setTimeout(() => {
                      setLines(prev => [...prev, { timestamp: getTimestamp(), type: 'SUCCESS', content: `${t.terminalSuccess3}: ${t.vibeP3}` }]);
                      setTimeout(() => {
                          setLines(prev => [...prev,
                              { timestamp: getTimestamp(), type: 'INFO', content: t.vibeMeta },
                              { timestamp: getTimestamp(), type: 'CMD', content: t.vibeClose }
                          ]);
                          setIsRevealed(true);
                          setIsBooting(false);
                      }, 600);
                    }, 600);
                }, 600);
            }, 800);
        } else if (cmd === 'clear') {
            trackEvent('easter-egg-terminal-clear-command');
            setLines([]);
        } else if (cmd === 'help') {
            trackEvent('easter-egg-terminal-help-command');
            setLines(prev => [...prev, 
                { timestamp: getTimestamp(), type: 'HELP', content: t.terminalHelpTitle }, 
                { timestamp: '', content: `  - reveal : ${t.terminalHelpReveal}` }, 
                { timestamp: '', content: `  - clear  : ${t.terminalHelpClear}` }, 
                { timestamp: '', content: `  - help   : ${t.terminalHelpHelp}` }, 
                { timestamp: '', content: `  - exit   : ${t.terminalHelpExit}` }
            ]);
        } else if (cmd === 'exit') {
            trackEvent('easter-egg-terminal-exit-command');
            onClose();
        } else {
            trackEvent('easter-egg-terminal-custom-command', {command: cmd});
            setLines(prev => [...prev, { timestamp: getTimestamp(), type: 'ERROR', content: `${t.terminalError}: ${cmd}` }]);
        }
        setInputValue('');
    };

    const renderLine = (line: TerminalLine | undefined, index: number) => {
        if (!line) return null;
        const typeClass = line.type ? `type-${line.type.toLowerCase()}` : '';
        
        return (
            <div key={index} className="terminal-line">
                {line.timestamp && <span className="terminal-timestamp">[{line.timestamp}] </span>}
                {line.type && <span className={`terminal-type ${typeClass}`}>[{line.type}] </span>}
                <span className="terminal-content">{line.content}</span>
            </div>
        );
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
                    {lines.map((line, i) => renderLine(line, i))}
                    {!isRevealed && !isBooting && (
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
