'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VyapYantraLogo } from '@/components/icons/VyapYantraLogo';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

type BuildStage = 'idle' | 'analyzing' | 'planning' | 'building' | 'complete';

export default function StudioPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [projectName, setProjectName] = useState('VyapYantra Studio');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [messages, setMessages] = useState<Message[]>([]);
  const [buildStage, setBuildStage] = useState<BuildStage>('idle');
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [previewPage, setPreviewPage] = useState('inventory');
  const nameRef = useRef<HTMLSpanElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setIsLoaded(true);

    const storedPrompt = sessionStorage.getItem('businessIdea') || 'shopkeeper app';
    const initialMessage: Message = {
      id: 1,
      sender: 'user',
      content: `Build a ${storedPrompt}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([initialMessage]);
    setBuildStage('analyzing');

    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => {
      setIsTyping(true);
      timers.push(setTimeout(() => {
        addMessage('ai', 'Analyzing requirements and planning features...');
        setIsTyping(false);
        setBuildStage('planning');
      }, 1000));
    }, 2000));

    timers.push(setTimeout(() => {
      setIsTyping(true);
      timers.push(setTimeout(() => {
        addMessage('ai', 'Planning complete. Core features: inventory, sales, employees, services. Starting build...');
        setIsTyping(false);
        setBuildStage('building');
      }, 1000));
    }, 5000));

    timers.push(setTimeout(() => {
      setIsTyping(true);
      timers.push(setTimeout(() => {
        addMessage('ai', 'Build complete! Your shopkeeper app is ready. Check the preview and let me know changes.');
        setIsTyping(false);
        setBuildStage('complete');
      }, 1000));
    }, 8000));

    // Voice recognition setup
    if (typeof window !== 'undefined') {
      try {
        const SpeechRecognition = 
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setUserInput(transcript);
          };
          recognition.onend = () => setIsListening(false);
          recognition.onerror = () => {
            console.warn('Voice recognition error');
            setIsListening(false);
          };
          recognitionRef.current = recognition;
        }
      } catch (error) {
        console.warn('Speech recognition not supported');
      }
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  const addMessage = (sender: 'user' | 'ai', content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender,
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    if (userInput.trim() && buildStage === 'complete') {
      addMessage('user', userInput);
      setUserInput('');
      setIsTyping(true);
      setTimeout(() => {
        addMessage('ai', `Updating based on: "${userInput}". Changes applied!`);
        setIsTyping(false);
      }, 2000);
    }
  };

  const toggleListening = () => {
    if (buildStage !== 'complete' || !recognitionRef.current) return;
    
    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
        setIsListening(true);
      }
    } catch (error) {
      console.warn('Voice recognition error:', error);
      setIsListening(false);
    }
  };

  const handleNameEdit = () => {
    if (nameRef.current) {
      setProjectName(nameRef.current.textContent || 'VyapYantra Studio');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSave = () => {
    alert('Project saved!');
  };

  const handleExport = () => {
    alert('Exporting project...');
  };

  if (!isLoaded) {
    return (
      <div className="studio-loading">
        <div className="loading-content">
          <VyapYantraLogo size={48} variant="detailed" />
          <h2>Loading VyapYantra Studio...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={`studio-container ${theme}`}>
      <header className="studio-header">
        <div className="header-brand">
          <VyapYantraLogo size={32} variant="header" />
          <span
            ref={nameRef}
            className="brand-text"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleNameEdit}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: 600,
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.25rem',
              marginLeft: '0.5rem',
              outline: 'none',
              cursor: 'text',
              minWidth: '150px',
            }}
          >
            {projectName}
          </span>
        </div>
        <div className="header-actions">
          <button type="button" className="header-btn secondary" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="header-btn primary" onClick={handleExport}>
            Export
          </button>
          <button type="button" className="header-btn secondary" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      <main className="studio-workspace">
        <section className="chat-panel">
          <div className="chat-header">
            <div className="ai-info">
              <div className="ai-avatar">
                <VyapYantraLogo size={24} variant="minimal" />
              </div>
              <div className="ai-details">
                <h3 className="ai-name">VyapYantra AI</h3>
                <span className="ai-status">
                  <div className="status-dot"></div>
                  {buildStage === 'complete' ? 'Ready for Edits' : 'Building...'}
                </span>
              </div>
            </div>
          </div>

          <div className="chat-messages" ref={chatRef}>
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}-message`}>
                <div className="message-header">
                  <span className="sender">{msg.sender === 'user' ? 'You' : 'VyapYantra AI'}</span>
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
                  <span className="sender">VyapYantra AI</span>
                  <span className="timestamp">Now</span>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
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
              placeholder={buildStage === 'complete' ? 'Type refinements or use voice...' : 'Building... Please wait'}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={buildStage !== 'complete'}
            />
            <button 
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={toggleListening} 
              disabled={buildStage !== 'complete' || !recognitionRef.current}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            >
              Send
            </button>
          </div>
        </section>

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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="1" x2="12" y2="23"></line>
                          <path d="m17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        Sales
                      </button>
                      <button 
                        onClick={() => setPreviewPage('employees')} 
                        className={previewPage === 'employees' ? 'active' : ''}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
