import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Search, Sparkles, Brain, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import NetworkScene from './components/NetworkScene';

function App() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  const handleResearch = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setReport(null);
    setFeedback(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (data.success) {
        setReport(data.report);
        setFeedback(data.feedback);
      } else {
        setError(data.error || 'Failed to complete research.');
      }
    } catch (err) {
      setError('Connection to the server failed. Make sure the Python backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 3D Background */}
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <color attach="background" args={['#050505']} />
          <ambientLight intensity={0.5} />
          <NetworkScene isThinking={isLoading} />
        </Canvas>
      </div>

      {/* Main UI */}
      <div className="app-container">
        <header className="header">
          <h1 className="title">AI Research System</h1>
          <p className="subtitle">Multi-Agent Intelligence Pipeline</p>
        </header>

        <form className="search-container" onSubmit={handleResearch}>
          <div className="search-glass">
            <Search className="search-icon" size={24} color="#6366f1" style={{ marginLeft: '0.5rem' }} />
            <input
              type="text"
              className="search-input"
              placeholder="What would you like to research today?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="search-button" disabled={isLoading || !topic.trim()}>
              {isLoading ? 'Thinking...' : 'Research'}
              {!isLoading && <Sparkles size={18} />}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Agents are assembling and processing data...</p>
          </div>
        )}

        {error && (
          <div className="glass-card" style={{ borderLeft: '4px solid #ef4444', animation: 'fadeInUp 0.5s ease-out' }}>
            <div className="card-header" style={{ marginBottom: '1rem', paddingBottom: 0, border: 'none' }}>
              <div className="icon-wrapper" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                <ShieldAlert size={24} />
              </div>
              <h2 className="card-title" style={{ color: '#fca5a5' }}>System Error</h2>
            </div>
            <p style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        {!isLoading && report && (
          <div className="results-container">
            <div className="glass-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <FileText size={28} />
                </div>
                <h2 className="card-title">Comprehensive Research Report</h2>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            </div>

            <div className="glass-card">
              <div className="card-header">
                <div className="icon-wrapper">
                  <Brain size={28} />
                </div>
                <h2 className="card-title">Critic Evaluation</h2>
              </div>
              <div className="markdown-body">
                <ReactMarkdown>{feedback}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
