import { useState, useRef, useEffect } from 'react';
import './DigitalTwin.css';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { translations, Language } from '../i18n';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DigitalTwinProps {
  onClose?: () => void;
  hideHeader?: boolean;
  isMobile?: boolean;
  lang: Language;
}

export function DigitalTwin({ onClose, hideHeader, isMobile, lang }: DigitalTwinProps) {
  const t = translations[lang];

  const defaultMessage: Message = {
    role: 'assistant',
    content: isMobile ? t.dtMobileWelcome : t.dtDesktopWelcome,
  };

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem('sandro_messages_v2');
      return saved ? JSON.parse(saved) : [defaultMessage];
    } catch {
      return [defaultMessage];
    }
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('sandro_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userText = text.trim();
    setInput('');
    setError(null);
    setMessages(prev => [...prev, { role: 'user', content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/digitalTwin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user' as const, content: userText }] }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).error || `HTTP ${res.status}`);
      }

      const data = await res.json() as { reply: string };
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (e: any) {
      const errorMsg = e.message || t.dtConnectionError;
      setError(errorMsg);
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${errorMsg}` }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  const quickStarts = [
    { label: t.dtQuickStart1Label, prompt: t.dtQuickStart1Prompt },
    { label: t.dtQuickStart2Label, prompt: t.dtQuickStart2Prompt },
    { label: t.dtQuickStart3Label, prompt: t.dtQuickStart3Prompt },
    { label: t.dtQuickStart4Label, prompt: t.dtQuickStart4Prompt },
    { label: t.dtQuickStart5Label, prompt: t.dtQuickStart5Prompt },
    { label: t.dtQuickStart6Label, prompt: t.dtQuickStart6Prompt },
  ];

  return (
    <div className="digital-twin" ref={panelRef}>
      {/* Header */}
      {!hideHeader && (
      <div className="dt-header">
        <div className="dt-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0-3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
        </div>
        <div className="dt-title">
          <span className="dt-name">Sandro</span>
          <span className="dt-subtitle">{t.dtSubtitle}</span>
        </div>
        {onClose && (
          <button
            className="dt-close"
            onClick={onClose}
            aria-label="Close"
            style={{ marginLeft: 'auto' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      )}

      {/* Messages */}
      <div className="dt-messages">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`dt-msg dt-msg-${msg.role}`}
            >
              <div className="dt-msg-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="dt-msg dt-msg-assistant"
          >
            <div className="dt-msg-bubble dt-typing">
              <span className="dt-dot" />
              <span className="dt-dot" />
              <span className="dt-dot" />
            </div>
          </motion.div>
        )}

        {error && (
          <div className="dt-error">
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick starts */}
      <div className="dt-quickstarts">
        {quickStarts.map(qs => (
          <button
            key={qs.label}
            className="dt-qs-btn"
            onClick={() => send(qs.prompt)}
            disabled={isLoading}
          >
            {qs.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="dt-input-row">
        <textarea
          ref={inputRef}
          className="dt-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.dtPlaceholder}
          rows={1}
          disabled={isLoading}
        />
        <button
          className="dt-send"
          onClick={() => send(input)}
          disabled={!input.trim() || isLoading}
          aria-label="Send"
        >
          <svg viewBox="0 0 24 24" fill="#ffffff" style={{ color: '#ffffff' }}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
