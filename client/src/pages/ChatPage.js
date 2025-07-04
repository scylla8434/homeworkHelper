import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
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

const getStyles = (theme) => ({
  chatWrapper: {
    maxWidth: 800,
    margin: '0 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 600,
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 16,
    boxShadow: theme === 'dark' 
      ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
      : '0 4px 24px rgba(0, 0, 0, 0.08)',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    transition: 'all 0.3s ease-in-out',
  },
  
  usageBar: {
    padding: '12px 24px',
    background: theme === 'dark' 
      ? 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)'
      : 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
    borderBottom: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
    fontSize: 14,
    fontWeight: 600,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  
  usageBarSubscribed: {
    color: theme === 'dark' ? '#10b981' : '#059669',
  },
  
  usageBarFree: {
    color: theme === 'dark' ? '#6366f1' : '#4f46e5',
  },
  
  usageWarning: {
    background: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : '#fef3c7',
    color: theme === 'dark' ? '#fbbf24' : '#92400e',
    border: theme === 'dark' 
      ? '1px solid rgba(251, 191, 36, 0.2)' 
      : '1px solid #fde68a',
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
  
  chatBox: {
    flex: 1,
    minHeight: 400,
    maxHeight: 500,
    overflowY: 'auto',
    background: theme === 'dark' ? '#0f172a' : '#fafafa',
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
    background: role === 'user' 
      ? (theme === 'dark' ? '#6366f1' : '#4f46e5')
      : (theme === 'dark' ? '#334155' : '#ffffff'),
    border: role === 'user' 
      ? 'none' 
      : (theme === 'dark' 
          ? '2px solid rgba(148, 163, 184, 0.3)' 
          : '2px solid #e5e7eb'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: role === 'user' 
      ? '#ffffff' 
      : (theme === 'dark' ? '#cbd5e1' : '#6b7280'),
    flexShrink: 0,
    marginTop: 2,
    transition: 'all 0.2s ease-in-out',
  }),
  
  messageContent: role => ({
    maxWidth: '70%',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  }),
  
  bubble: role => ({
    background: role === 'user' 
      ? (theme === 'dark' ? '#6366f1' : '#4f46e5')
      : (theme === 'dark' ? '#334155' : '#ffffff'),
    color: role === 'user' 
      ? '#ffffff' 
      : (theme === 'dark' ? '#f8fafc' : '#1f2937'),
    borderRadius: role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
    padding: '12px 16px',
    fontSize: 15,
    lineHeight: 1.5,
    boxShadow: role === 'user' 
      ? (theme === 'dark' 
          ? '0 4px 12px rgba(99, 102, 241, 0.25)' 
          : '0 2px 8px rgba(79, 70, 229, 0.15)')
      : (theme === 'dark' 
          ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
          : '0 2px 8px rgba(0, 0, 0, 0.08)'),
    border: role === 'user' 
      ? 'none' 
      : (theme === 'dark' 
          ? '1px solid rgba(148, 163, 184, 0.2)' 
          : '1px solid #e5e7eb'),
    wordBreak: 'break-word',
    position: 'relative',
    transition: 'all 0.2s ease-in-out',
  }),
  
  messageMeta: role => ({
    fontSize: 12,
    color: theme === 'dark' ? '#94a3b8' : '#9ca3af',
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
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.3)' 
      : '1px solid #e5e7eb',
    objectFit: 'cover',
  },
  
  formBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    padding: '20px 24px',
    borderTop: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
  },
  
  inputContainer: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: theme === 'dark' ? '#0f172a' : '#f9fafb',
    borderRadius: 12,
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  
  inputContainerFocused: {
    borderColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
    boxShadow: theme === 'dark' 
      ? '0 0 0 3px rgba(99, 102, 241, 0.2)' 
      : '0 0 0 3px rgba(79, 70, 229, 0.1)',
  },
  
  input: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    fontSize: 15,
    outline: 'none',
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    '::placeholder': {
      color: theme === 'dark' ? '#64748b' : '#9ca3af',
    },
  },
  
  fileButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    background: theme === 'dark' ? '#334155' : '#f3f4f6',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.3)' 
      : '1px solid #d1d5db',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
  },
  
  fileButtonHover: {
    background: theme === 'dark' ? '#475569' : '#e5e7eb',
    borderColor: theme === 'dark' ? '#64748b' : '#9ca3af',
    color: theme === 'dark' ? '#f1f5f9' : '#4b5563',
    transform: 'translateY(-1px)',
  },
  
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 8,
    background: theme === 'dark' ? '#6366f1' : '#4f46e5',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#ffffff',
  },
  
  sendButtonDisabled: {
    background: theme === 'dark' ? '#475569' : '#d1d5db',
    cursor: 'not-allowed',
    color: theme === 'dark' ? '#64748b' : '#9ca3af',
  },
  
  sendButtonHover: {
    background: theme === 'dark' ? '#5b21b6' : '#4338ca',
    transform: 'translateY(-1px)',
    boxShadow: theme === 'dark' 
      ? '0 6px 20px rgba(99, 102, 241, 0.4)' 
      : '0 4px 12px rgba(79, 70, 229, 0.3)',
  },
  
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '16px',
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    fontSize: 14,
    fontWeight: 500,
  },
  
  error: {
    background: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
    border: theme === 'dark' 
      ? '1px solid rgba(239, 68, 68, 0.2)' 
      : '1px solid #fecaca',
    borderRadius: 12,
    padding: '12px 16px',
    color: theme === 'dark' ? '#f87171' : '#dc2626',
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
    background: theme === 'dark' ? '#334155' : '#ffffff',
    padding: '12px 16px',
    borderRadius: '18px 18px 18px 4px',
    boxShadow: theme === 'dark' 
      ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
      : '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.2)' 
      : '1px solid #e5e7eb',
    color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
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
    border: theme === 'dark' 
      ? '1px solid rgba(148, 163, 184, 0.3)' 
      : '1px solid #e5e7eb',
  },
  
  removePreview: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: theme === 'dark' ? '#ef4444' : '#dc2626',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease-in-out',
  },
});

function LoadingSpinner({ size = 16 }) {
  return <Loader2 size={size} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />;
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function ChatPage() {
  const { theme } = useTheme();
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
  const [userType, setUserType] = useState('guest'); // guest or registered
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const styles = getStyles(theme);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Initialize user data on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    
    // Debug logging (only console, no UI)
    console.log('🔍 EduEdge Debug Information:');
    console.log('├── API URL:', API_URL);
    console.log('├── User ID:', userId || 'NOT SET (Guest Mode)');
    console.log('├── Environment:', process.env.NODE_ENV || 'development');
    console.log('├── Theme:', theme);
    console.log('└── Current URL:', window.location.href);

    // Test backend connectivity and get user data
    const initializeUserData = async () => {
      try {
        // Test backend health
        console.log('🔍 Testing backend connectivity...');
        await axios.get(`${API_URL}/health`, { timeout: 10000 });
        console.log('✅ Backend health check passed');
        
        // If we have a userId, try to get usage data
        if (userId && userId !== 'demo' && userId !== 'guest') {
          try {
            console.log('🔍 Fetching user usage data...');
            const usageResponse = await axios.get(`${API_URL}/api/user/${userId}/usage`, { timeout: 10000 });
            console.log('✅ Usage data received:', usageResponse.data);
            
            setUsage(usageResponse.data.usage || 0);
            setIsSubscribed(usageResponse.data.isSubscribed || false);
            setUserType(usageResponse.data.userType || 'registered');
            setError(null);
          } catch (usageError) {
            console.warn('⚠️ Could not fetch usage data, continuing in guest mode:', usageError.message);
            setUserType('guest');
            setUsage(0);
            setIsSubscribed(false);
          }
        } else {
          console.log('🎭 Operating in guest mode');
          setUserType('guest');
          setUsage(0);
          setIsSubscribed(false);
        }
        
      } catch (healthError) {
        console.error('❌ Backend connection failed:', healthError.message);
        setError('Connection to server failed. Please check your internet connection.');
      }
    };

    initializeUserData();
  }, [theme]);

  // Update usage warnings for registered users only
  useEffect(() => {
    if (userType === 'registered' && usage !== null && !isSubscribed) {
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
  }, [usage, isSubscribed, userType]);

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
      // Handle image upload if present
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, { 
          headers: { 'Content-Type': 'multipart/form-data' } 
        });
        imageUrl = uploadRes.data.imageUrl;
        
        // OCR: extract text from image (if OCR endpoint exists)
        try {
          const ocrRes = await axios.post(`${API_URL}/api/ocr`, { imageUrl });
          extractedText = ocrRes.data.text;
        } catch (ocrError) {
          console.log('OCR not available, continuing without text extraction');
        }
      }
      
      const userId = localStorage.getItem('userId') || 'guest';
      
      // Enhanced prompt engineering for educational context
      let systemPrompt = `You are an expert educational assistant. Give clear, step-by-step, age-appropriate answers. If the question is about math, show all work. If it's science, explain concepts simply. If it's a language question, provide examples. Always encourage curiosity and a growth mindset. Avoid giving direct answers to homework but guide the student to learn.`;
      let fullPrompt = question.trim() ? `${systemPrompt}\n\nQuestion: ${question.trim()}` : `${systemPrompt}\n\nQuestion: ${extractedText}`;
      
      // Simulate typing delay for AI
      await new Promise(res => setTimeout(res, 900));
      
      const res = await axios.post(`${API_URL}/api/chat`, { 
        question: fullPrompt, 
        userId, 
        imageUrl 
      });
      
      setMessages((msgs) => [...msgs, { 
        role: 'assistant', 
        content: res.data.answer, 
        time: new Date() 
      }]);
      
      // Update usage data if response includes it
      if (res.data.usage !== undefined) {
        setUsage(res.data.usage);
      }
      
      if (res.data.userType) {
        setUserType(res.data.userType);
      }
      
    } catch (err) {
      console.error('❌ Chat error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
      setMessages((msgs) => [...msgs, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${errorMessage}`, 
        time: new Date() 
      }]);
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
      {/* Usage bar - only show for registered users */}
      {userType === 'registered' && usage !== null && (
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
      
      {/* Usage warning notification - only for registered users */}
      {userType === 'registered' && usageWarning && (
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
                EduEdge is thinking...
              </div>
            </div>
          </div>
        )}
        
        {loading && !aiTyping && (
          <div style={styles.loadingContainer}>
            <LoadingSpinner size={16} />
            <span>EduEdge is processing...</span>
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
            style={{
              ...styles.input,
              '::placeholder': {
                color: theme === 'dark' ? '#64748b' : '#9ca3af',
              }
            }}
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
          color: ${theme === 'dark' ? '#64748b' : '#9ca3af'};
        }
        
        /* Custom scrollbar */
        *::-webkit-scrollbar {
          width: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: ${theme === 'dark' ? '#1e293b' : '#f1f5f9'};
        }
        
        *::-webkit-scrollbar-thumb {
          background: ${theme === 'dark' ? '#475569' : '#cbd5e1'};
          border-radius: 3px;
        }
        
        *::-webkit-scrollbar-thumb:hover {
          background: ${theme === 'dark' ? '#64748b' : '#94a3b8'};
        }
      `}</style>
    </div>
  );
}

export default ChatPage;