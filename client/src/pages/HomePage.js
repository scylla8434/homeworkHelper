import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useTheme } from '../ThemeContext';
import { 
  MessageCircle, 
  CreditCard, 
  User, 
  Lightbulb, 
  Star,
  Quote,
  LogIn,
  UserPlus,
  ArrowRight,
  Sparkles,
  Heart,
  Trophy,
  Zap
} from 'lucide-react';

const getStyles = (theme) => ({
  container: {
    width: '100%',
    maxWidth: 1200,
    margin: '0 auto',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    background: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    minHeight: '100vh',
    transition: 'all 0.3s ease-in-out',
  },

  hero: {
    width: '100%',
    maxWidth: 900,
    margin: '0 auto 4rem auto',
    padding: '3rem 2rem',
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' 
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 24,
    boxShadow: theme === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(79, 70, 229, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
  },

  heroLogo: {
    width: 72,
    height: 72,
    borderRadius: 20,
    marginBottom: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: '3px solid rgba(255, 255, 255, 0.2)',
  },

  heroTitle: {
    fontSize: 42,
    fontWeight: 800,
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: '-0.025em',
    textAlign: 'center',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: 1.1,
  },

  heroSubtitle: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 32,
    fontWeight: 500,
    textAlign: 'center',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    maxWidth: 600,
    lineHeight: 1.4,
  },

  ctaButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255, 255, 255, 0.95)',
    color: '#4f46e5',
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    borderRadius: 16,
    padding: '16px 32px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    letterSpacing: '-0.01em',
  },

  ctaButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    background: '#ffffff',
  },

  featuresGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: 24,
    marginBottom: '4rem',
    zIndex: 1,
  },

  featureCard: {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 20,
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    margin: '0.5rem',
    flex: 1,
    minWidth: 280,
    maxWidth: 350,
    minHeight: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(229, 231, 235, 0.5)',
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
  },

  featureCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: theme === 'dark'
      ? '0 12px 32px rgba(0, 0, 0, 0.4)'
      : '0 12px 32px rgba(79, 70, 229, 0.15)',
    border: `1px solid ${theme === 'dark' ? '#4f46e5' : '#667eea'}`,
  },

  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    color: '#ffffff',
    boxShadow: '0 4px 8px rgba(79, 70, 229, 0.2)',
  },

  featureTitle: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 12,
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    lineHeight: 1.2,
  },

  featureDesc: {
    fontSize: 16,
    color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
    lineHeight: 1.5,
    flex: 1,
  },

  tipsSection: {
    width: '100%',
    maxWidth: 900,
    background: theme === 'dark' ? '#1e293b' : '#f8fafc',
    borderRadius: 20,
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.06)',
    padding: '2.5rem',
    marginBottom: '4rem',
    border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(229, 231, 235, 0.5)',
  },

  tipsTitle: {
    fontWeight: 700,
    fontSize: 24,
    color: theme === 'dark' ? '#f8fafc' : '#1f2937',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  tipsList: {
    marginTop: 16,
    fontSize: 16,
    color: theme === 'dark' ? '#cbd5e1' : '#4b5563',
    paddingLeft: 0,
    lineHeight: 1.7,
    listStyle: 'none',
  },

  tipItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
    padding: '8px 0',
  },

  testimonialsSection: {
    width: '100%',
    maxWidth: 900,
    margin: '0 auto 4rem auto',
    textAlign: 'center',
  },

  testimonialsTitle: {
    fontWeight: 700,
    fontSize: 28,
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    marginBottom: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  testimonialsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
  },

  testimonialCard: {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 20,
    boxShadow: theme === 'dark'
      ? '0 4px 12px rgba(0, 0, 0, 0.3)'
      : '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '2rem',
    maxWidth: 320,
    minWidth: 280,
    fontSize: 16,
    color: theme === 'dark' ? '#cbd5e1' : '#374151',
    fontStyle: 'italic',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(229, 231, 235, 0.5)',
    transition: 'transform 0.2s ease-in-out',
  },

  testimonialCardHover: {
    transform: 'translateY(-4px)',
  },

  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 16px auto',
    display: 'block',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '3px solid rgba(79, 70, 229, 0.1)',
  },

  testimonialName: {
    fontWeight: 600,
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    marginBottom: 12,
    fontSize: 16,
  },

  testimonialText: {
    lineHeight: 1.6,
    position: 'relative',
  },

  pressSection: {
    width: '100%',
    maxWidth: 900,
    margin: '0 auto 4rem auto',
    textAlign: 'center',
  },

  pressTitle: {
    fontWeight: 600,
    fontSize: 16,
    color: theme === 'dark' ? '#94a3b8' : '#6b7280',
    marginBottom: 16,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },

  pressLogos: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },

  pressLogo: {
    height: 32,
    width: 'auto',
    filter: theme === 'dark' ? 'grayscale(1) brightness(0.8)' : 'grayscale(1) contrast(1.2)',
    opacity: theme === 'dark' ? 0.6 : 0.7,
    background: theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : '#ffffff',
    borderRadius: 8,
    padding: 8,
    boxShadow: theme === 'dark'
      ? '0 2px 4px rgba(0, 0, 0, 0.3)'
      : '0 2px 4px rgba(0, 0, 0, 0.06)',
    transition: 'opacity 0.2s ease-in-out',
  },

  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  },

  modalContent: {
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    borderRadius: 20,
    padding: '2.5rem',
    minWidth: 320,
    maxWidth: 400,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    textAlign: 'center',
    border: theme === 'dark' ? '1px solid rgba(148, 163, 184, 0.2)' : 'none',
  },

  modalTitle: {
    fontWeight: 700,
    fontSize: 24,
    color: theme === 'dark' ? '#f8fafc' : '#4f46e5',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  modalText: {
    fontSize: 16,
    color: theme === 'dark' ? '#cbd5e1' : '#6b7280',
    marginBottom: 24,
    lineHeight: 1.5,
  },

  modalButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    fontWeight: 600,
    fontSize: 16,
    border: 'none',
    borderRadius: 12,
    padding: '14px 24px',
    marginBottom: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
  },

  modalButtonSecondary: {
    background: theme === 'dark' 
      ? 'rgba(148, 163, 184, 0.1)' 
      : 'rgba(107, 114, 128, 0.1)',
    color: theme === 'dark' ? '#f8fafc' : '#374151',
  },

  backgroundDecoration: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
    zIndex: 0,
  },
});

function FeatureCard({ to, icon: Icon, title, desc, theme }) {
  const [hover, setHover] = useState(false);
  const styles = getStyles(theme);

  return (
    <Link 
      to={to} 
      style={{
        ...styles.featureCard,
        ...(hover ? styles.featureCardHover : {})
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.featureIcon}>
        <Icon size={24} />
      </div>
      <div style={styles.featureTitle}>{title}</div>
      <div style={styles.featureDesc}>{desc}</div>
    </Link>
  );
}

function TestimonialCard({ testimonial, theme }) {
  const [hover, setHover] = useState(false);
  const styles = getStyles(theme);

  return (
    <div 
      style={{
        ...styles.testimonialCard,
        ...(hover ? styles.testimonialCardHover : {})
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Quote size={20} style={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        color: theme === 'dark' ? '#4f46e5' : '#667eea',
        opacity: 0.3 
      }} />
      <img src={testimonial.avatar} alt={testimonial.name} style={styles.testimonialAvatar} />
      <div style={styles.testimonialName}>{testimonial.name}</div>
      <div style={styles.testimonialText}>"{testimonial.text}"</div>
    </div>
  );
}

function HomePage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const userName = user?.name || user?.email || '';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [ctaHover, setCtaHover] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  const styles = getStyles(theme);

  const testimonials = [
    {
      name: 'Mildred Omollo',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Homework Helper has made evenings so much easier! The AI answers are spot on and the interface is beautiful.',
    },
    {
      name: 'Florence Wesonga',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'I love the Pro plan. Unlimited questions and fast support. Highly recommended for busy parents!',
    },
    {
      name: 'Wilkister Anyangu',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: 'The OCR feature is a lifesaver for math homework. My kids are more independent now.',
    },
  ];

  const pressLogos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/New_York_Times_logo_variation.jpg', alt: 'The Star' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/TechCrunch_logo.svg', alt: 'TechCrunch' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Forbes_logo.svg', alt: 'Forbes' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/USA_Today_logo.svg', alt: 'USA Today' },
  ];

  const tips = [
    { icon: Heart, text: 'Encourage curiosity and praise effort, not just results' },
    { icon: Trophy, text: 'Break big tasks into small, manageable steps' },
    { icon: Star, text: 'Use visuals and real-life examples to explain concepts' },
    { icon: Zap, text: 'Stay positive—every question is a chance to learn!' },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <img src="/logo.jpg" alt="EduEdge Logo" style={styles.heroLogo} />
        <div style={styles.heroTitle}>
          {userName ? `Welcome back, ${userName}!` : 'Welcome to EduEdge'}
        </div>
        <div style={styles.heroSubtitle}>
          AI-powered homework assistance that makes learning engaging and accessible for every child
        </div>
        <button
          style={{
            ...styles.ctaButton,
            ...(ctaHover ? styles.ctaButtonHover : {})
          }}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          onClick={() => {
            if (!isLoggedIn) setShowAuthModal(true);
            else navigate('/chat');
          }}
        >
          <Sparkles size={20} />
          Ask a Question
          <ArrowRight size={20} />
        </button>
        
        {/* Background decorations */}
        <div style={{
          ...styles.backgroundDecoration,
          top: -40,
          right: -40,
          width: 160,
          height: 160,
        }}></div>
        <div style={{
          ...styles.backgroundDecoration,
          bottom: -40,
          left: -40,
          width: 160,
          height: 160,
        }}></div>
      </div>

      {/* Feature Cards */}
      <div style={styles.featuresGrid}>
        <FeatureCard 
          to="/chat" 
          icon={MessageCircle} 
          title="Homework Chat" 
          desc="Ask questions, upload images, and get instant, friendly AI help with step-by-step explanations."
          theme={theme}
        />
        <FeatureCard 
          to="/pricing" 
          icon={CreditCard} 
          title="Premium Plans" 
          desc="Upgrade for unlimited questions, priority support, and advanced features for serious learners."
          theme={theme}
        />
        <FeatureCard 
          to="/profile" 
          icon={User} 
          title="Your Account" 
          desc="Manage your profile, track your learning progress, and customize your experience."
          theme={theme}
        />
      </div>

      {/* Tips Section */}
      <div style={styles.tipsSection}>
        <div style={styles.tipsTitle}>
          <Lightbulb size={28} />
          Parenting & Learning Tips
        </div>
        <ul style={styles.tipsList}>
          {tips.map((tip, index) => {
            const IconComponent = tip.icon;
            return (
              <li key={index} style={styles.tipItem}>
                <IconComponent size={20} style={{ 
                  color: theme === 'dark' ? '#667eea' : '#4f46e5',
                  flexShrink: 0,
                  marginTop: 2
                }} />
                <span>{tip.text}</span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Testimonials Section */}
      <div style={styles.testimonialsSection}>
        <div style={styles.testimonialsTitle}>
          <Star size={28} />
          What Parents Say
        </div>
        <div style={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              theme={theme}
            />
          ))}
        </div>
      </div>

      {/* Press/Trust Logos Section */}
      <div style={styles.pressSection}>
        <div style={styles.pressTitle}>As Featured In</div>
        <div style={styles.pressLogos}>
          {pressLogos.map((logo, index) => (
            <img 
              key={index} 
              src={logo.src} 
              alt={logo.alt} 
              style={styles.pressLogo}
            />
          ))}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div style={styles.modal} onClick={() => setShowAuthModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              <User size={24} />
              Sign in to Continue
            </div>
            <div style={styles.modalText}>
              Create an account or sign in to access our AI-powered homework assistance and track your learning progress.
            </div>
            <Link 
              to="/login" 
              style={styles.modalButton}
              onClick={() => setShowAuthModal(false)}
            >
              <LogIn size={18} />
              Sign In
            </Link>
            <Link 
              to="/register" 
              style={{
                ...styles.modalButton,
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
              }}
              onClick={() => setShowAuthModal(false)}
            >
              <UserPlus size={18} />
              Create Account
            </Link>
            <button 
              style={{
                ...styles.modalButton,
                ...styles.modalButtonSecondary
              }}
              onClick={() => {
                setShowAuthModal(false);
                navigate('/chat');
              }}
            >
              Continue as Guest
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;