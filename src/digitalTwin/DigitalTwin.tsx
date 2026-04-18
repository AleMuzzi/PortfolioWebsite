import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_STARTS = [
  { label: 'Drone Compliance Logic', prompt: 'How does Alessandro handle EU regulatory compliance for autonomous drone systems?' },
  { label: 'System Crashes Debugging', prompt: 'How do you handle system crashes and memory leaks?' },
  { label: 'BERT Acceleration 60%', prompt: 'How did you accelerate get a 60% acceleration by using BERT at Maps Group?' },
  { label: 'Active Inference Architecture', prompt: 'What is the Active Inference framework architecture at VERSES?' },
  { label: 'Force Multiplier', prompt: 'What does being a force multiplier mean in practice?' },
  { label: 'Hardware to Software', prompt: 'How does Alessandro\'s hardware background influence his software architecture?' },
];

export function DigitalTwin({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Ciao! I'm **Sandro**, Alessandro's digital twin. I have full access to his career, projects, and technical experience. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    // Small delay so the click that opens the panel doesn't immediately close it
    const id = setTimeout(() => document.addEventListener('mousedown', handleClick), 200);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [onClose]);

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
      setError(e.message || 'Connection failed. Is the server running?');
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Error: ${e.message}` }]);
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

  return (
    <div className="digital-twin" ref={panelRef}>
      {/* Header */}
      <div className="dt-header">
        <div className="dt-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
          </svg>
        </div>
        <div className="dt-title">
          <span className="dt-name">Sandro</span>
          <span className="dt-subtitle">Alessandro's Digital Twin</span>
        </div>
      </div>

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
        {QUICK_STARTS.map(qs => (
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
          placeholder="Ask Sandro anything..."
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
