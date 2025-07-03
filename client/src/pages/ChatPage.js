import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FREE_USER_LIMIT = 10; // Keep in sync with backend

const styles = {
  chatWrapper: {
    maxWidth: 700,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 500,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
    borderRadius: 18,
    boxShadow: '0 6px 32px 0 rgba(60,60,120,0.10)',
    padding: 0,
    overflow: 'hidden',
  },
  chatBox: {
    flex: 1,
    minHeight: 340,
    maxHeight: 480,
    overflowY: 'auto',
    background: 'rgba(255,255,255,0.95)',
    padding: 32,
    borderBottom: '1px solid #e5e7eb',
    transition: 'box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'relative',
  },
  chatBgDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 0,
    background: 'radial-gradient(circle at 80% 10%, #6366f1 0%, transparent 60%), radial-gradient(circle at 10% 90%, #60a5fa 0%, transparent 70%)',
    opacity: 0.08,
  },
  message: role => ({
    display: 'flex',
    flexDirection: role === 'user' ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    margin: '8px 0',
    gap: 12,
    opacity: 1,
    animation: 'fadeInMsg 0.4s',
    zIndex: 1,
  }),
  bubble: role => ({
    background: role === 'user' ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : '#fff',
    color: role === 'user' ? '#fff' : '#23293a',
    borderRadius: 18,
    padding: '14px 20px',
    maxWidth: '70%',
    fontSize: 16,
    boxShadow: '0 2px 12px 0 rgba(60,60,120,0.08)',
    wordBreak: 'break-word',
    position: 'relative',
    transition: 'background 0.3s',
    zIndex: 1,
    border: role === 'user' ? '2px solid #6366f1' : '1px solid #e5e7eb',
    fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
  }),
  avatar: role => ({
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: role === 'user' ? 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)' : '#e0e7ef',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: role === 'user' ? '#fff' : '#6366f1',
    fontWeight: 700,
    fontSize: 22,
    boxShadow: '0 1px 4px 0 rgba(60,60,120,0.08)',
    flexShrink: 0,
    border: role === 'user' ? '2px solid #6366f1' : '1px solid #e0e7ef',
    transition: 'box-shadow 0.2s, border 0.2s',
  }),
  bubbleMeta: role => ({
    fontSize: 12,
    color: role === 'user' ? '#e0e7ef' : '#94a3b8',
    marginTop: 6,
    textAlign: 'right',
    textShadow: role === 'user' ? '0 1px 2px #6366f1' : 'none',
    fontWeight: 500,
  }),
  formBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#fff',
    padding: '16px 20px',
    borderRadius: 0,
    boxShadow: '0 -2px 8px 0 rgba(60,60,120,0.04)',
    position: 'relative',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 24,
    border: '1px solid #d1d5db',
    fontSize: 16,
    outline: 'none',
    background: '#f8fafc',
    transition: 'border 0.2s',
    marginRight: 8,
  },
  fileLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: '#6366f1',
    fontSize: 22,
    marginRight: 8,
    borderRadius: 8,
    padding: 4,
    transition: 'background 0.2s',
  },
  fileInput: {
    display: 'none',
  },
  preview: {
    maxWidth: 120,
    margin: '8px 0',
    borderRadius: 10,
    boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)',
  },
  sendBtn: {
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    border: 'none',
    borderRadius: '50%',
    width: 44,
    height: 44,
    color: '#fff',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
    transition: 'background 0.2s',
    marginLeft: 4,
    outline: 'none',
  },
  loading: {
    color: '#6366f1',
    fontStyle: 'italic',
    margin: '12px 0',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  error: {
    color: '#ef4444',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 10,
    padding: '10px 16px',
    margin: '12px 0',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: 15,
    boxShadow: '0 1px 4px 0 rgba(239,68,68,0.08)',
    animation: 'fadeIn 0.5s',
  },
};

function Spinner() {
  return (
    <span style={{ display: 'inline-block', width: 22, height: 22 }} aria-label="Loading">
      <svg width="22" height="22" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="22" r="20" stroke="#6366f1" strokeWidth="4" opacity="0.2" />
        <path d="M42 22c0-11.046-8.954-20-20-20" stroke="#6366f1" strokeWidth="4" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 22 22" to="360 22 22" dur="0.8s" repeatCount="indefinite" />
        </path>
      </svg>
    </span>
  );
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatPage() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [reactions, setReactions] = useState({}); // {msgIndex: emoji}
  const [aiTyping, setAiTyping] = useState(false);
  const [usage, setUsage] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [usageWarning, setUsageWarning] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      axios.get(`${API_URL}/api/user/${userId}/usage`).then(res => {
        setUsage(res.data.usage);
        setIsSubscribed(res.data.isSubscribed);
      }).catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (usage !== null && !isSubscribed) {
      if (usage === FREE_USER_LIMIT - 1) {
        setUsageWarning('You have 1 free chat left this month!');
      } else if (usage >= FREE_USER_LIMIT - 3 && usage < FREE_USER_LIMIT - 1) {
        setUsageWarning(`You are nearing your free chat limit (${usage} / ${FREE_USER_LIMIT}).`);
      } else {
        setUsageWarning(null);
      }
    } else {
      setUsageWarning(null);
    }
  }, [usage, isSubscribed]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);
    if (!question.trim() && !image) return;
    setMessages((msgs) => [...msgs, { role: 'user', content: question, image: imagePreview, time: new Date() }]);
    setLoading(true);
    setAiTyping(true);
    let imageUrl = null;
    let extractedText = '';
    try {
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imageUrl = uploadRes.data.imageUrl;
        // OCR: extract text from image
        const ocrRes = await axios.post(`${API_URL}/api/ocr`, { imageUrl });
        extractedText = ocrRes.data.text;
      }
      const userId = localStorage.getItem('userId') || 'demo';
      // Enhanced prompt engineering for educational context
      let systemPrompt = `You are an expert educational assistant. Give clear, step-by-step, age-appropriate answers. If the question is about math, show all work. If it's science, explain concepts simply. If it's a language question, provide examples. Always encourage curiosity and a growth mindset. Avoid giving direct answers to homework but guide the student to learn.`;
      let fullPrompt = question.trim() ? `${systemPrompt}\n\nQuestion: ${question.trim()}` : `${systemPrompt}\n\nQuestion: ${extractedText}`;
      // Simulate typing delay for AI
      await new Promise(res => setTimeout(res, 900));
      const res = await axios.post(`${API_URL}/api/chat`, { question: fullPrompt, userId, imageUrl });
      setMessages((msgs) => [...msgs, { role: 'assistant', content: res.data.answer, time: new Date() }]);
      // Refresh usage after chat
      if (userId && userId !== 'demo') {
        const usageRes = await axios.get(`${API_URL}/api/user/${userId}/usage`);
        setUsage(usageRes.data.usage);
        setIsSubscribed(usageRes.data.isSubscribed);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error: ' + (err.response?.data?.message || err.message), time: new Date() }]);
    } finally {
      setQuestion('');
      setImage(null);
      setImagePreview(null);
      // Clear file input value
      if (document.getElementById('imageInput')) {
        document.getElementById('imageInput').value = '';
      }
      setLoading(false);
      setTimeout(() => setAiTyping(false), 600);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleReaction = (msgIdx, emoji) => {
    setReactions(prev => ({ ...prev, [msgIdx]: prev[msgIdx] === emoji ? null : emoji }));
  };

  // Remove emojis from reactions
  // const reactionEmojis = ['👍', '❤️', '😂', '🤔', '👏'];
  const reactionEmojis = [];

  return (
    <div style={styles.chatWrapper}>
      {/* Usage bar */}
      {usage !== null && (
        <div style={{padding: '10px 20px', background: '#f1f5f9', borderBottom: '1px solid #e5e7eb', fontSize: 15, color: '#6366f1', fontWeight: 600, textAlign: 'center'}}>
          {isSubscribed ? (
            <>Unlimited chats (subscribed)</>
          ) : (
            <>Usage: {usage} / {FREE_USER_LIMIT} free chats this month</>
          )}
        </div>
      )}
      {/* Usage warning notification */}
      {usageWarning && (
        <div style={{background:'#fffbe6', color:'#b45309', border:'1px solid #fde68a', borderRadius:8, margin:'10px 20px', padding:'10px', textAlign:'center', fontWeight:600, fontSize:15}}>
          {usageWarning}
        </div>
      )}
      <div style={styles.chatBox} aria-live="polite" aria-label="Chat messages">
        <div style={styles.chatBgDecor}></div>
        {messages.map((msg, i) => (
          <div key={i} style={{...styles.message(msg.role), animation: 'fadeInMsg 0.4s, popIn 0.3s'}}>
            <div style={styles.avatar(msg.role)} aria-label={msg.role === 'user' ? 'User' : 'AI'}>
              {msg.role === 'user' ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{display:'block'}}><circle cx="12" cy="8" r="4" fill="#fff"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#fff"/></svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{display:'block'}}><rect x="4" y="4" width="16" height="16" rx="8" fill="#6366f1"/><path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
              )}
            </div>
            <div style={styles.bubble(msg.role)}>
              {msg.content}
              {msg.image && <div><img src={msg.image} alt="uploaded" style={styles.preview} /></div>}
              <div style={styles.bubbleMeta(msg.role)}>{msg.role === 'user' ? 'You' : 'AI'} • {formatTime(msg.time || new Date())}</div>
              {/* Reactions */}
              <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                {reactionEmojis.map(emoji => (
                  <button
                    key={emoji}
                    style={{
                      background: reactions[i] === emoji ? '#6366f1' : '#f3f4f6',
                      color: reactions[i] === emoji ? '#fff' : '#6366f1',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: 18,
                      padding: '2px 7px',
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'background 0.2s, color 0.2s',
                    }}
                    aria-label={`React with ${emoji}`}
                    onClick={() => handleReaction(i, emoji)}
                  >
                    {emoji}
                  </button>
                ))}
                {reactions[i] && <span style={{ marginLeft: 4, fontSize: 16 }}>{reactions[i]}</span>}
              </div>
            </div>
          </div>
        ))}
        {/* Typing indicator */}
        {aiTyping && (
          <div style={styles.message('assistant')}>
            <div style={styles.avatar('assistant')} aria-label="AI">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{display:'block'}}><rect x="4" y="4" width="16" height="16" rx="8" fill="#6366f1"/><path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div style={{...styles.bubble('assistant'), fontStyle: 'italic', opacity: 0.7, display: 'flex', alignItems: 'center', gap: 8}}>
              <Spinner /> Eduedge is typing...
            </div>
          </div>
        )}
        {loading && !aiTyping && (
          <div style={styles.loading}><Spinner /> <span>Eduedge is thinking...</span></div>
        )}
        {error && (
          <div style={styles.error} role="alert">{error}</div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} style={styles.formBar} aria-label="Send a message">
        <label htmlFor="imageInput" style={styles.fileLabel} title="Attach image">
          <span role="img" aria-label="attach" style={{fontSize:22}}>📎</span>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={styles.fileInput}
            disabled={loading}
            aria-label="Upload image"
          />
        </label>
        <input
          id="chatInput"
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Type your question..."
          style={styles.input}
          disabled={loading}
          aria-label="Type your question"
        />
        {imagePreview && <img src={imagePreview} alt="preview" style={styles.preview} />}
        <button type="submit" style={styles.sendBtn} disabled={loading || (!question.trim() && !image)} aria-busy={loading} aria-label="Send message">
          <span role="img" aria-label="send" style={{fontSize:22}}>📤</span>
        </button>
      </form>
      <style>{`
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes popIn {
          0% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

export default ChatPage;
