'use client';
export const dynamic = "force-dynamic";
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

/** Types */
interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}
type BuildStage = 'idle' | 'analyzing' | 'planning' | 'building' | 'complete';

export default function StudioPage() {
  const sp = useSearchParams();

  const [isLoaded, setIsLoaded] = useState(false);
  const [projectName, setProjectName] = useState('VyapYantra Studio');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [messages, setMessages] = useState<Message[]>([]);
  const [buildStage, setBuildStage] = useState<BuildStage>('idle');

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [previewPage, setPreviewPage] = useState<'inventory' | 'sales' | 'employees' | 'services'>('inventory');

  // Download link (client-only placeholder APK)
  const [apkUrl, setApkUrl] = useState<string | null>(null);

  const nameRef = useRef<HTMLSpanElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Prevent double-init in Strict Mode
  const bootedRef = useRef(false);

  // Add a message & scroll to bottom (safe in Strict Mode)
  const addMessage = (sender: 'user' | 'ai', content: string) => {
    setMessages((prev) => {
      const next: Message = {
        id: prev.length + 1,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [...prev, next];
      requestAnimationFrame(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      });
      return updated;
    });
  };

  // Init once
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    setIsLoaded(true);

    // Seed from URL ?brief= or sessionStorage
    let brief = sp?.get('brief') || '';
    if (!brief) {
      try {
        brief = sessionStorage.getItem('businessIdea') || '';
      } catch {
        // ignore
      }
    }
    if (!brief) brief = 'shopkeeper app';

    // First user message
    const initial: Message = {
      id: 1,
      sender: 'user',
      content: `Build a ${brief}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initial]);
    setBuildStage('analyzing');

    // Stage timers (browser safe; clear on unmount)
    const timers: number[] = [];

    timers.push(
      window.setTimeout(() => {
        setIsTyping(true);
        timers.push(
          window.setTimeout(() => {
            addMessage('ai', 'Analyzing requirements and planning features...');
            setIsTyping(false);
            setBuildStage('planning');
          }, 900),
        );
      }, 1600),
    );

    timers.push(
      window.setTimeout(() => {
        setIsTyping(true);
        timers.push(
          window.setTimeout(() => {
            addMessage('ai', 'Planning complete. Core features: inventory, sales, employees, services. Starting build...');
            setIsTyping(false);
            setBuildStage('building');
          }, 900),
        );
      }, 4300),
    );

    timers.push(
      window.setTimeout(() => {
        setIsTyping(true);
        timers.push(
          window.setTimeout(() => {
            addMessage('ai', 'Build complete! Your shopkeeper app is ready. Check the preview and let me know changes.');
            setIsTyping(false);
            setBuildStage('complete');
          }, 900),
        );
      }, 7300),
    );

    // Voice recognition setup (optional)
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const recognition = new SR();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript || '';
          setUserInput(transcript);
        };
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    } catch {
      // ignore
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      try {
        recognitionRef.current?.stop?.();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* -----------------------------
     FIX: APK URL effect
     - Remove apkUrl from deps to avoid self-trigger.
     - Only (re)generate on stage/projectName/messages changes.
     - Revoke old URL before creating a new one.
  ------------------------------ */
  useEffect(() => {
    // If not complete, revoke and clear any existing URL.
    if (buildStage !== 'complete') {
      if (apkUrl) {
        URL.revokeObjectURL(apkUrl);
        setApkUrl(null);
      }
      return;
    }

    // Build complete → (re)create placeholder once per relevant change.
    try {
      const brief =
        messages.find((m) => m.sender === 'user')?.content.replace(/^Build a\s*/i, '') || 'shopkeeper app';

      const payload = {
        name: projectName,
        brief,
        generatedAt: new Date().toISOString(),
        modules: ['inventory', 'sales', 'employees', 'services'],
        note:
          'Demo placeholder APK file — replace with real build artifact when your CI produces it. This blob just lets the Download button work during static demos.',
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/vnd.android.package-archive',
      });
      const nextUrl = URL.createObjectURL(blob);

      // Revoke previous URL (if any) before swapping.
      if (apkUrl) URL.revokeObjectURL(apkUrl);
      setApkUrl(nextUrl);
    } catch {
      // ignore
    }

    // On unmount or deps change, revoke the last known URL.
    return () => {
      if (apkUrl) URL.revokeObjectURL(apkUrl);
    };
    // ⬇️ Notice: apkUrl intentionally NOT in deps
  }, [buildStage, projectName, messages]); // <-- apkUrl removed

  // Actions
  const handleSend = () => {
    if (!userInput.trim() || buildStage !== 'complete') return;
    const text = userInput.trim();
    addMessage('user', text);
    setUserInput('');
    setIsTyping(true);
    window.setTimeout(() => {
      addMessage('ai', `Updating based on: "${text}". Changes applied!`);
      setIsTyping(false);
    }, 1800);
  };

  const toggleListening = () => {
    if (buildStage !== 'complete' || !recognitionRef.current) return;
    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.lang = 'hi-IN';
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch {
      setIsListening(false);
    }
  };

  const handleNameEdit = () => {
    // prevent newlines/pasting rich text
    if (!nameRef.current) return;
    const text = (nameRef.current.textContent || '').replace(/\s+/g, ' ').trim();
    nameRef.current.textContent = text || 'VyapYantra Studio';
    setProjectName(nameRef.current.textContent);
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleSave = () => {
    try {
      const state = {
        projectName,
        messages,
        buildStage,
        previewPage,
        savedAt: Date.now(),
      };
      localStorage.setItem('vyapyantra.studio.save', JSON.stringify(state));
      alert('Project saved locally!');
    } catch {
      alert('Unable to save locally (storage unavailable).');
    }
  };

  const handleExport = () => {
    // Export current spec as JSON (independent of APK)
    try {
      const brief =
        messages.find((m) => m.sender === 'user')?.content.replace(/^Build a\s*/i, '') || 'shopkeeper app';
      const spec = {
        name: projectName,
        brief,
        modules: ['inventory', 'sales', 'employees', 'services'],
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName.replace(/\s+/g, '_')}_spec.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Export failed.');
    }
  };

  if (!isLoaded) {
    return (
      <div className="studio-loading">
        <div className="loading-content">
          {/* fallback loader */}
          <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f59e0b', opacity: 0.9 }} />
          <h2>Loading VyapYantra Studio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`studio-container ${theme}`}>
      {/* === Single, global header (VyapGO logo + status + actions) === */}
      <header className="studio-header">
        <div className="header-brand">
          <Link href="/" aria-label="Go to VyapGO home" className="flex items-center gap-2">
            {/* Use the VyapGO logo only (clickable) */}
            <span className="relative inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="VyapGO"
                width={28}
                height={28}
                priority
                style={{ objectFit: 'contain' }}
              />
            </span>
          </Link>

          {/* Editable project name */}
          <span
            ref={nameRef}
            className="brand-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameEdit}
            onKeyDown={(e) => {
              // prevent Enter/newline in contentEditable
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target as HTMLSpanElement).blur();
              }
            }}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              marginLeft: '0.5rem',
              outline: 'none',
              cursor: 'text',
              minWidth: '150px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '44vw',
            }}
            title="Click to rename"
          >
            {projectName}
          </span>

          {/* Live status pill */}
          <span
            className="ml-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs"
            style={{
              background: buildStage === 'complete' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
              color: buildStage === 'complete' ? '#065f46' : '#92400e',
              border: `1px solid ${buildStage === 'complete' ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)'}`,
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: buildStage === 'complete' ? '#10b981' : '#f59e0b' }}
            />
            {buildStage === 'complete' ? 'Ready' : 'Building…'}
          </span>
        </div>

        <div className="header-actions">
          <button type="button" className="header-btn secondary" onClick={handleSave}>
            Save
          </button>

          {/* Export spec (JSON) */}
          <button type="button" className="header-btn primary" onClick={handleExport}>
            Export
          </button>

          {/* Theme toggle */}
          <button type="button" className="header-btn secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>

          {/* Download APK — enabled only when build is complete */}
          {buildStage === 'complete' ? (
            apkUrl ? (
              <a
                href={apkUrl}
                download={`${projectName.replace(/\s+/g, '_')}.apk`}
                className="header-btn success"
                title="Download demo APK"
              >
                Download APK
              </a>
            ) : (
              <button type="button" className="header-btn secondary" disabled title="Preparing APK…">
                Preparing…
              </button>
            )
          ) : (
            <button type="button" className="header-btn secondary" disabled title="Available after build completes">
              Download APK
            </button>
          )}
        </div>
      </header>

      {/* === Main workspace (left chat, right preview) === */}
      <main className="studio-workspace">
        {/* Chat */}
        <section className="chat-panel">
          <div className="chat-messages" ref={chatRef} aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}-message`}>
                <div className="message-header">
                  <span className="sender">{msg.sender === 'user' ? 'You' : 'VyapYantra'}</span>
                  <span className="timestamp">{msg.timestamp}</span>
                </div>
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai-message">
                <div className="message-header">
                  <span className="sender">VyapYantra</span>
                  <span className="timestamp">Now</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator" aria-label="Typing">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              ref={inputRef}
              type="text"
              placeholder={
                buildStage === 'complete' ? 'Type refinements or use voice…' : 'Building… Please wait'
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  // prevent accidental sends while building
                  if (buildStage !== 'complete') {
                    e.preventDefault();
                    return;
                  }
                  handleSend();
                }
              }}
              disabled={buildStage !== 'complete'}
            />
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              disabled={buildStage !== 'complete' || !recognitionRef.current}
              title={
                buildStage !== 'complete'
                  ? 'Voice input unlocked after build completes'
                  : !recognitionRef.current
                  ? 'Microphone not available'
                  : isListening
                  ? 'Stop listening'
                  : 'Start voice input'
              }
              aria-label="Voice input"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <button
              className="send-button"
              onClick={handleSend}
              disabled={buildStage !== 'complete' || !userInput.trim()}
              title={buildStage !== 'complete' ? 'Available after build completes' : 'Send'}
            >
              Send
            </button>
          </div>
        </section>

        {/* Preview */}
        <section className="app-preview">
          <div className="preview-header">
            <h2 className="preview-title">App Preview</h2>
            <span className="preview-status">
              <div className="status-dot"></div>
              {buildStage === 'complete' ? 'Ready' : 'Building...'}
            </span>
          </div>

          <div className="preview-content">
            <div className="mobile-frame">
              <div className="mobile-screen-merged">
                {buildStage === 'idle' || buildStage === 'analyzing' ? (
                  <div className="preview-state analyzing">
                    <h3>Analyzing...</h3>
                    <p>Processing your idea</p>
                  </div>
                ) : buildStage === 'planning' ? (
                  <div className="preview-state wireframe">
                    <div className="wire-header"></div>
                    <div className="wire-content">
                      <div className="wire-block large"></div>
                      <div className="wire-block medium"></div>
                      <div className="wire-block small"></div>
                    </div>
                    <p>Planning layout</p>
                  </div>
                ) : buildStage === 'building' ? (
                  <div className="preview-state building">
                    <div className="progress-bar">
                      <div style={{ width: '60%' }}></div>
                    </div>
                    <p>Building components...</p>
                  </div>
                ) : (
                  <div className="final-app-merged">
                    <nav className="app-nav-merged">
                      <button
                        onClick={() => setPreviewPage('inventory')}
                        className={previewPage === 'inventory' ? 'active' : ''}
                      >
                        {/* Inventory */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                        Inventory
                      </button>
                      <button
                        onClick={() => setPreviewPage('sales')}
                        className={previewPage === 'sales' ? 'active' : ''}
                      >
                        {/* Sales */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="m17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        Sales
                      </button>
                      <button
                        onClick={() => setPreviewPage('employees')}
                        className={previewPage === 'employees' ? 'active' : ''}
                      >
                        {/* Staff */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="m22 21-3-3m0 0a2 2 0 1 0-3-3 2 2 0 0 0 3 3Z"></path>
                        </svg>
                        Staff
                      </button>
                      <button
                        onClick={() => setPreviewPage('services')}
                        className={previewPage === 'services' ? 'active' : ''}
                      >
                        {/* Services */}
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
                        </svg>
                        VyapGo
                      </button>
                    </nav>

                    <div className="app-content-merged">
                      {previewPage === 'inventory' && (
                        <div className="app-page-merged inventory">
                          <h2>Inventory Management</h2>
                          <div className="stats-row">
                            <div className="stat-card">
                              <span className="stat-number">250</span>
                              <span className="stat-label">Total Items</span>
                            </div>
                            <div className="stat-card">
                              <span className="stat-number">₹45,000</span>
                              <span className="stat-label">Stock Value</span>
                            </div>
                          </div>
                          <div className="item-list">
                            <div className="item-card">
                              <div className="item-info">
                                <h3>Fresh Apples</h3>
                                <p>Stock: 100 units • Price: ₹120/kg</p>
                              </div>
                              <button className="action-btn">Update</button>
                            </div>
                            <div className="item-card">
                              <div className="item-info">
                                <h3>Bananas</h3>
                                <p>Stock: 150 units • Price: ₹80/kg</p>
                              </div>
                              <button className="action-btn">Update</button>
                            </div>
                            <div className="item-card">
                              <div className="item-info">
                                <h3>Milk (1L)</h3>
                                <p>Stock: 75 units • Price: ₹60/pack</p>
                              </div>
                              <button className="action-btn">Update</button>
                            </div>
                          </div>
                          <button className="primary-btn">Add New Item</button>
                        </div>
                      )}

                      {previewPage === 'sales' && (
                        <div className="app-page-merged sales">
                          <h2>Sales Dashboard</h2>
                          <div className="stats-row">
                            <div className="stat-card">
                              <span className="stat-number">₹12,500</span>
                              <span className="stat-label">Today's Sales</span>
                            </div>
                            <div className="stat-card">
                              <span className="stat-number">87</span>
                              <span className="stat-label">Transactions</span>
                            </div>
                          </div>
                          <div className="sales-list">
                            <div className="sale-card">
                              <div className="sale-info">
                                <h3>Sale #001</h3>
                                <p>₹850 • 2:30 PM • Cash</p>
                              </div>
                              <span className="sale-status">Completed</span>
                            </div>
                            <div className="sale-card">
                              <div className="sale-info">
                                <h3>Sale #002</h3>
                                <p>₹1,200 • 2:45 PM • UPI</p>
                              </div>
                              <span className="sale-status">Completed</span>
                            </div>
                            <div className="sale-card">
                              <div className="sale-info">
                                <h3>Sale #003</h3>
                                <p>₹650 • 3:00 PM • Card</p>
                              </div>
                              <span className="sale-status">Completed</span>
                            </div>
                          </div>
                          <button className="primary-btn">Record New Sale</button>
                        </div>
                      )}

                      {previewPage === 'employees' && (
                        <div className="app-page-merged employees">
                          <h2>Staff Management</h2>
                          <div className="stats-row">
                            <div className="stat-card">
                              <span className="stat-number">5</span>
                              <span className="stat-label">Total Staff</span>
                            </div>
                            <div className="stat-card">
                              <span className="stat-number">₹25,000</span>
                              <span className="stat-label">Monthly Payroll</span>
                            </div>
                          </div>
                          <div className="employee-list">
                            <div className="employee-card">
                              <div className="employee-info">
                                <h3>Rajesh Kumar</h3>
                                <p>Store Manager • ₹15,000/month</p>
                              </div>
                              <button className="action-btn">View</button>
                            </div>
                            <div className="employee-card">
                              <div className="employee-info">
                                <h3>Priya Sharma</h3>
                                <p>Cashier • ₹10,000/month</p>
                              </div>
                              <button className="action-btn">View</button>
                            </div>
                            <div className="employee-card">
                              <div className="employee-info">
                                <h3>Suresh Singh</h3>
                                <p>Helper • ₹8,000/month</p>
                              </div>
                              <button className="action-btn">View</button>
                            </div>
                          </div>
                          <button className="primary-btn">Add Employee</button>
                        </div>
                      )}

                      {previewPage === 'services' && (
                        <div className="app-page-merged services">
                          <h2>VyapGo Services</h2>
                          <div className="service-grid">
                            <div className="service-card-large">
                              <div className="service-icon">
                                <svg
                                  width="40"
                                  height="40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="3"></circle>
                                  <path d="M12 1v6m0 6v6"></path>
                                  <path d="m21 12-6-6-6 6-6-6"></path>
                                </svg>
                              </div>
                              <h3>AI Data Scientist</h3>
                              <p>Get powerful insights about your sales patterns, inventory optimization, and customer behavior.</p>
                              <button className="service-btn">Explore AI</button>
                            </div>
                            <div className="service-card-large">
                              <div className="service-icon">
                                <svg
                                  width="40"
                                  height="40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M9 12l2 2 4-4"></path>
                                  <path d="M21 12c.552 0 1-.448 1-1V8a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v3c0 .552.448 1 1 1"></path>
                                  <path d="M21 21H3a2 2 0 0 1-2-2v-7h20v7a2 2 0 0 1-2 2Z"></path>
                                </svg>
                              </div>
                              <h3>VyapGo Copilot</h3>
                              <p>Your intelligent business assistant for daily operations, smart recommendations, and automation.</p>
                              <button className="service-btn">Try Copilot</button>
                            </div>
                            <div className="service-card-large">
                              <div className="service-icon">
                                <svg
                                  width="40"
                                  height="40"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="18" y1="20" x2="18" y2="10"></line>
                                  <line x1="12" y1="20" x2="12" y2="4"></line>
                                  <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                              </div>
                              <h3>Business Analytics</h3>
                              <p>Advanced reporting and analytics to help you make data-driven decisions for growth.</p>
                              <button className="service-btn">View Reports</button>
                            </div>
                          </div>
                          <div className="coming-soon">
                            <p>Many more exciting features coming soon...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}