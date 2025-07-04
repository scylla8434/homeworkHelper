import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, 
  Paperclip, 
  User, 
  Bot, 
  Clock, 
  AlertCircle,
  Loader2,
  CheckCircle,
  Crown,
  Wifi,
  WifiOff
} from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const FREE_USER_LIMIT = 10; // Keep in sync with backend

const styles = {
  chatWrapper: {
    maxWidth: 800,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 600,
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  
  usageBar: {
    padding: '12px 24px',
    background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
    borderBottom: '1px solid #e5e7eb',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  usageBarSubscribed: {
    color: '#059669',
  },
  
  usageBarFree: {
    color: '#4f46e5',
  },
  
  usageWarning: {
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fde68a',
    borderRadius: 8,
    margin: '16px 24px',
    padding: '12px 16px',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  debugBar: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    margin: '16px 24px',
    padding: '12px 16px',
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#374151',
  },
  
  debugSection: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  
  debugLabel: {
    fontWeight: 600,
    color: '#1f2937',
    display: 'inline-block',
    minWidth: 120,
  },
  
  debugValue: {
    color: '#6b7280',
  },
  
  debugError: {
    color: '#dc2626',
    fontWeight: 500,
  },
  
  debugSuccess: {
    color: '#059669',
    fontWeight: 500,
  },
  
  chatBox: {
    flex: 1,
    minHeight: 400,
    maxHeight: 500,
    overflowY: 'auto',
    background: '#fafafa',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    scrollBehavior: 'smooth',
  },
  
  message: role => ({
    display: 'flex',
    flexDirection: role === 'user' ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    gap: 12,
    opacity: 1,
    animation: 'slideInUp 0.3s ease-out',
  }),
  
  avatar: role => ({
    width: 36,
    height: 36,
    borderRadius: 8,
    background: role === 'user' ? '#4f46e5' : '#ffffff',
    border: role === 'user' ? 'none' : '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: role === 'user' ? '#ffffff' : '#6b7280',
    flexShrink: 0,
    marginTop: 2,
  }),
  
  messageContent: role => ({
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }),
  
  bubble: role => ({
    background: role === 'user' ? '#4f46e5' : '#ffffff',
    color: role === 'user' ? '#ffffff' : '#1f2937',
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    padding: '12px 16px',
    fontSize: 15,
    lineHeight: 1.5,
    boxShadow: role === 'user' ? '0 2px 8px rgba(79, 70, 229, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: role === 'user' ? 'none' : '1px solid #e5e7eb',
    wordBreak: 'break-word',
    position: 'relative',
  }),
  
  messageMeta: role => ({
    fontSize: 12,
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    justifyContent: role === 'user' ? 'flex-end' : 'flex-start',
  }),
  
  preview: {
    maxWidth: 200,
    maxHeight: 150,
    borderRadius: 8,
    marginTop: 8,
    border: '1px solid #e5e7eb',
    objectFit: 'cover',
  },
  
  formBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: '#ffffff',
    padding: '20px 24px',
    borderTop: '1px solid #e5e7eb',
  },
  
  inputContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: '#f9fafb',
    borderRadius: 12,
    border: '1px solid #e5e7eb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  
  inputContainerFocused: {
    borderColor: '#4f46e5',
    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)',
  },
  
  input: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    fontSize: 15,
    outline: 'none',
    color: '#1f2937',
  },
  
  fileButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    background: '#f3f4f6',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#6b7280',
  },
  
  fileButtonHover: {
    background: '#e5e7eb',
    borderColor: '#9ca3af',
    color: '#4b5563',
  },
  
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    background: '#4f46e5',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#ffffff',
  },
  
  sendButtonDisabled: {
    background: '#d1d5db',
    cursor: 'not-allowed',
    color: '#9ca3af',
  },
  
  sendButtonHover: {
    background: '#4338ca',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '16px',
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 500,
  },
  
  error: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 12,
    padding: '12px 16px',
    color: '#dc2626',
    fontSize: 14,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    margin: '8px 0',
  },
  
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#ffffff',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    color: '#6b7280',
    fontSize: 14,
    fontStyle: 'italic',
  },
  
  previewContainer: {
    position: 'relative',
    display: 'inline-block',
    margin: '0 8px',
  },
  
  previewImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    objectFit: 'cover',
    border: '1px solid #e5e7eb',
  },
  
  removePreview: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#dc2626',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

function LoadingSpinner({ size = 16 }) {
  return <Loader2 size={size} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />;
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Debug Info Component
function DebugInfo({ 
  usage, 
  isSubscribed, 
  error, 
  backendHealth, 
  userId,
  showDebug = true 
}) {
  if (!showDebug) return null;
  
  return (
    <div style={styles.debugBar}>
      <div style={styles.debugSection}>
        <span style={styles.debugLabel}>🔍 Debug Mode:</span>
        <span style={styles.debugValue}>Active (Remove in production)</span>
      </div>
      
      <div style={styles.debugSection}>
        <div>
          <span style={styles.debugLabel}>API URL:</span>
          <span style={styles.debugValue}>{API_URL}</span>
        </div>
        <div>
          <span style={styles.debugLabel}>Environment:</span>
          <span style={styles.debugValue}>{process.env.NODE_ENV || 'development'}</span>
        </div>
        <div>
          <span style={styles.debugLabel}>Current URL:</span>
          <span style={styles.debugValue}>{window.location.href}</span>
        </div>
      </div>
      
      <div style={styles.debugSection}>
        <div>
          <span style={styles.debugLabel}>User ID:</span>
          <span style={userId ? styles.debugSuccess : styles.debugError}>
            {userId || 'NOT SET'}
          </span>
        </div>
        <div>
          <span style={styles.debugLabel}>Usage State:</span>
          <span style={styles.debugValue}>
            {usage === null ? 'null' : usage}
          </span>
        </div>
        <div>
          <span style={styles.debugLabel}>Subscribed:</span>
          <span style={styles.debugValue}>{isSubscribed ? 'Yes' : 'No'}</span>
        </div>
      </div>
      
      <div style={styles.debugSection}>
        <div>
          <span style={styles.debugLabel}>Backend Health:</span>
          <span style={backendHealth?.status === 'healthy' ? styles.debugSuccess : styles.debugError}>
            {backendHealth ? 
              (backendHealth.status || backendHealth.error || 'Unknown') : 
              'Checking...'
            }
          </span>
        </div>
        {backendHealth?.mongodb && (
          <div>
            <span style={styles.debugLabel}>MongoDB:</span>
            <span style={backendHealth.mongodb === 'connected' ? styles.debugSuccess : styles.debugError}>
              {backendHealth.mongodb}
            </span>
          </div>
        )}
      </div>
      
      {error && (
        <div>
          <span style={styles.debugLabel}>Last Error:</span>
          <span style={styles.debugError}>{error}</span>
        </div>
      )}
    </div>
  );
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
  const [inputFocused, setInputFocused] = useState(false);
  const [fileButtonHover, setFileButtonHover] = useState(false);
  const [sendButtonHover, setSendButtonHover] = useState(false);
  const [backendHealth, setBackendHealth] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Show debug mode only in development or when localStorage debug flag is set
  const showDebug = process.env.NODE_ENV === 'development' || localStorage.getItem('debug') === 'true';

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Enhanced debugging useEffect
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Set debug info
    setDebugInfo({
      apiUrl: API_URL,
      userId: userId,
      nodeEnv: process.env.NODE_ENV,
      hasUserId: !!userId,
      currentUrl: window.location.href,
      allEnvVars: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
    });

    console.log('🔍 EduEdge Debug Information:');
    console.log('├── API URL:', API_URL);
    console.log('├── User ID:', userId || 'NOT SET');
    console.log('├── Environment:', process.env.NODE_ENV || 'development');
    console.log('├── Current URL:', window.location.href);
    console.log('├── Available React Env Vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
    console.log('└── LocalStorage keys:', Object.keys(localStorage));

    // Test backend connectivity first
    const testBackend = async () => {
      try {
        console.log('🔍 Testing backend connectivity...');
        const healthResponse = await axios.get(`${API_URL}/health`, { timeout: 10000 });
        console.log('✅ Backend health check passed:', healthResponse.data);
        setBackendHealth(healthResponse.data);
        
        // If we have a userId, try to get usage
        if (userId) {
          const usageUrl = `${API_URL}/api/user/${userId}/usage`;
          console.log('🔍 Attempting to fetch usage from:', usageUrl);
          
          try {
            const usageResponse = await axios.get(usageUrl, { timeout: 10000 });
            console.log('✅ Usage response received:', usageResponse.data);
            setUsage(usageResponse.data.usage);
            setIsSubscribed(usageResponse.data.isSubscribed);
            setError(null);
          } catch (usageError) {
            console.error('❌ Usage fetch failed:');
            console.error('├── Status:', usageError.response?.status);
            console.error('├── Message:', usageError.message);
            console.error('├── Response Data:', usageError.response?.data);
            console.error('└── URL attempted:', usageUrl);
            setError(`Usage fetch failed: ${usageError.response?.data?.message || usageError.message}`);
          }
        } else {
          console.warn('⚠️ No userId found in localStorage');
          console.log('📋 Available localStorage keys:', Object.keys(localStorage));
        }
        
      } catch (healthError) {
        console.error('❌ Backend health check failed:');
        console.error('├── Message:', healthError.message);
        console.error('├── Code:', healthError.code);
        console.error('├── Response:', healthError.response?.data);
        console.error('└── URL attempted:', `${API_URL}/health`);
        setBackendHealth({ error: healthError.message });
        setError(`Backend connection failed: ${healthError.message}`);
      }
    };

    testBackend();
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
      console.error('❌ Chat error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong.');
      setMessages((msgs) => [...msgs, { role: 'assistant', content: 'Error: ' + (err.response?.data?.message || err.message), time: new Date() }]);
    } finally {
      setQuestion('');
      setImage(null);
      setImagePreview(null);
      // Clear file input value
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleReaction = (msgIdx, emoji) => {
    setReactions(prev => ({ ...prev, [msgIdx]: prev[msgIdx] === emoji ? null : emoji }));
  };

  const isFormValid = (question.trim() || image) && !loading;

  return (
    <div style={styles.chatWrapper}>
      {/* Usage bar */}
      {usage !== null && (
        <div style={{
          ...styles.usageBar,
          ...(isSubscribed ? styles.usageBarSubscribed : styles.usageBarFree)
        }}>
          {isSubscribed ? (
            <>
              <Crown size={16} />
              Unlimited chats (subscribed)
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              Usage: {usage} / {FREE_USER_LIMIT} free chats this month
            </>
          )}
        </div>
      )}
      
      {/* Debug Info - Only show in development or when debug flag is set */}
      {showDebug && (
        <DebugInfo 
          usage={usage}
          isSubscribed={isSubscribed}
          error={error}
          backendHealth={backendHealth}
          userId={localStorage.getItem('userId')}
          showDebug={showDebug}
        />
      )}
      
      {/* Usage warning notification */}
      {usageWarning && (
        <div style={styles.usageWarning}>
          <AlertCircle size={16} />
          {usageWarning}
        </div>
      )}
      
      <div style={styles.chatBox} aria-live="polite" aria-label="Chat messages">
        {messages.map((msg, i) => (
          <div key={i} style={styles.message(msg.role)}>
            <div style={styles.avatar(msg.role)} aria-label={msg.role === 'user' ? 'User' : 'AI'}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div style={styles.messageContent(msg.role)}>
              <div style={styles.bubble(msg.role)}>
                {msg.content}
                {msg.image && (
                  <div>
                    <img src={msg.image} alt="uploaded" style={styles.preview} />
                  </div>
                )}
              </div>
              <div style={styles.messageMeta(msg.role)}>
                <Clock size={12} />
                {msg.role === 'user' ? 'You' : 'EduEdge'} • {formatTime(msg.time || new Date())}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {aiTyping && (
          <div style={styles.message('assistant')}>
            <div style={styles.avatar('assistant')} aria-label="AI">
              <Bot size={20} />
            </div>
            <div style={styles.messageContent('assistant')}>
              <div style={styles.typingIndicator}>
                <LoadingSpinner size={14} />
                EduEdge is typing...
              </div>
            </div>
          </div>
        )}
        
        {loading && !aiTyping && (
          <div style={styles.loadingContainer}>
            <LoadingSpinner size={16} />
            <span>EduEdge is thinking...</span>
          </div>
        )}
        
        {error && (
          <div style={styles.error} role="alert">
            <AlertCircle size={16} />
            {error}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      <form onSubmit={handleSend} style={styles.formBar} aria-label="Send a message">
        <div
          style={{
            ...styles.fileButton,
            ...(fileButtonHover ? styles.fileButtonHover : {})
          }}
          onMouseEnter={() => setFileButtonHover(true)}
          onMouseLeave={() => setFileButtonHover(false)}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image"
        >
          <Paperclip size={18} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            disabled={loading}
            aria-label="Upload image"
          />
        </div>
        
        <div style={{
          ...styles.inputContainer,
          ...(inputFocused ? styles.inputContainerFocused : {})
        }}>
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            placeholder="Type your question..."
            style={styles.input}
            disabled={loading}
            aria-label="Type your question"
          />
          
          {imagePreview && (
            <div style={styles.previewContainer}>
              <img src={imagePreview} alt="preview" style={styles.previewImage} />
              <button
                type="button"
                style={styles.removePreview}
                onClick={removeImage}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          style={{
            ...styles.sendButton,
            ...(!isFormValid ? styles.sendButtonDisabled : {}),
            ...(sendButtonHover && isFormValid ? styles.sendButtonHover : {})
          }}
          onMouseEnter={() => setSendButtonHover(true)}
          onMouseLeave={() => setSendButtonHover(false)}
          disabled={!isFormValid}
          aria-busy={loading}
          aria-label="Send message"
        >
          {loading ? <LoadingSpinner size={18} /> : <Send size={18} />}
        </button>
      </form>
      
      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        input::placeholder {
          color: #9ca3af;
        }
        
        /* Custom scrollbar */
        *::-webkit-scrollbar {
          width: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        *::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}

export default ChatPage;