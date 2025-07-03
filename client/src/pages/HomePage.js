import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const cardStyles = {
  card: {
    background: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 1px 8px 0 rgba(60,60,120,0.10)',
    padding: '2rem',
    margin: '1rem',
    flex: 1,
    minWidth: 220,
    minHeight: 180,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    transition: 'box-shadow 0.2s, transform 0.2s',
    cursor: 'pointer',
    border: '2px solid #F9FAFB',
    position: 'relative',
    overflow: 'hidden',
  },
  cardHover: {
    boxShadow: '0 4px 16px 0 rgba(60,60,120,0.16)',
    transform: 'translateY(-4px) scale(1.03)',
    border: '2px solid #3B82F6',
  },
  icon: {
    fontSize: 38,
    marginBottom: 18,
    color: '#3B82F6',
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    borderRadius: '50%',
    width: 54,
    height: 54,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
    color: '#111827',
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 0,
  },
  cta: {
    marginTop: 32,
    background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    borderRadius: 12,
    padding: '16px 36px',
    boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
    letterSpacing: 1,
  },
};

function FeatureCard({ to, icon, title, desc }) {
  const [hover, setHover] = React.useState(false);
  return (
    <Link to={to} style={{ ...cardStyles.card, ...(hover ? cardStyles.cardHover : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <div style={cardStyles.icon}>{icon}</div>
      <div style={cardStyles.title}>{title}</div>
      <div style={cardStyles.desc}>{desc}</div>
    </Link>
  );
}

function HomePage() {
  const { user } = useAuth();
  const userName = user?.name || user?.email || '';
  const testimonials = [
    {
      name: 'Mildred Omollo.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'Homework Helper has made evenings so much easier! The AI answers are spot on and the interface is beautiful.',
    },
    {
      name: 'Florence Wesonga.',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'I love the Pro plan. Unlimited questions and fast support. Highly recommended for busy parents!',
    },
    {
      name: 'Wilkister Anyangu.',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      text: 'The OCR feature is a lifesaver for math homework. My kids are more independent now.',
    },
  ];
  const pressLogos = [
    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/44/New_York_Times_logo_variation.jpg', alt: 'The Star' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/TechCrunch_logo.svg', alt: 'TechCrunch' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Forbes_logo.svg', alt: 'Forbes' },
    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/0e/USA_Today_logo.svg', alt: 'PubG' },
  ];
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!user;

  return (
    <div style={{ width: '100%', maxWidth: 1200, margin: '0 auto', padding: '2rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      {/* Hero Section */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 32px auto', padding: '2.5rem 2rem 2rem 2rem', background: 'linear-gradient(135deg, #6366f1 0%, #60a5fa 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 24px 0 rgba(60,60,120,0.10)', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <img src="/logo.jpg" alt="Logo" style={{ width: 64, height: 64, borderRadius: 16, marginBottom: 18, boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)' }} />
        <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', marginBottom: 8, letterSpacing: 1, textAlign: 'center', textShadow: '0 2px 8px #6366f1' }}>
          {userName ? `Welcome, ${userName}!` : 'Welcome!'}
        </div>
        <div style={{ fontSize: 20, color: '#f1f5f9', marginBottom: 24, fontWeight: 600, textAlign: 'center', textShadow: '0 1px 4px #6366f1' }}>AI-powered support for your child’s learning journey</div>
        <button
          style={cardStyles.cta}
          onClick={() => {
            if (!isLoggedIn) setShowAuthModal(true);
            else navigate('/chat');
          }}
        >Ask a Question</button>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, background: 'radial-gradient(circle, #fff 0%, transparent 70%)', opacity: 0.12, zIndex: 0 }}></div>
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 160, height: 160, background: 'radial-gradient(circle, #fff 0%, transparent 70%)', opacity: 0.10, zIndex: 0 }}></div>
      </div>
      {/* Feature Cards */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', gap: 24, marginBottom: 40, zIndex: 1 }}>
        <FeatureCard to="/chat" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="6" fill="#6366f1"/><path d="M8 10h8M8 14h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>} title="Homework Chat" desc="Ask questions, upload images, and get instant, friendly AI help." />
        <FeatureCard to="/pricing" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="4" fill="#60a5fa"/><path d="M7 9h10M7 13h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>} title="Subscription" desc="Upgrade for unlimited questions, priority support, and more." />
        <FeatureCard to="/profile" icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" fill="#6366f1"/><path d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4" fill="#60a5fa"/></svg>} title="Profile & Settings" desc="Manage your account, view your info, and logout securely." />
      </div>
      {/* Tips Section */}
      <div style={{ width: '100%', maxWidth: 900, background: '#F9FAFB', borderRadius: '1rem', boxShadow: '0 1px 8px 0 rgba(60,60,120,0.08)', padding: '2rem', marginBottom: 32, zIndex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: '#111827', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span role="img" aria-label="bulb">💡</span> Parenting & Learning Tips
        </div>
        <ul style={{ marginTop: 12, fontSize: 16, color: '#555', paddingLeft: 24, lineHeight: 1.7 }}>
          <li>Encourage curiosity and praise effort, not just results</li>
          <li>Break big tasks into small, manageable steps</li>
          <li>Use visuals and real-life examples to explain concepts</li>
          <li>Stay positive—every question is a chance to learn!</li>
        </ul>
      </div>
      {/* Testimonials Section */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 32px auto', textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#6366f1', marginBottom: 18 }}>What Parents Say</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 14, boxShadow: '0 2px 8px 0 rgba(60,60,120,0.10)', padding: '22px 28px', margin: '0 12px', maxWidth: 320, minWidth: 220, fontSize: 16, color: '#222', fontStyle: 'italic', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={t.avatar} alt={t.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 8px auto', display: 'block', boxShadow: '0 1px 4px 0 rgba(60,60,120,0.10)' }} />
              <div style={{ fontWeight: 600, color: '#6366f1', marginBottom: 6 }}>{t.name}</div>
              <div>“{t.text}”</div>
            </div>
          ))}
        </div>
      </div>
      {/* Press/Trust Logos Section */}
      <div style={{ width: '100%', maxWidth: 900, margin: '0 auto 32px auto', textAlign: 'center', zIndex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 17, color: '#6366f1', marginBottom: 10, letterSpacing: 1 }}>As featured in</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 32 }}>
          {pressLogos.map((logo, i) => (
            <img key={i} src={logo.src} alt={logo.alt} style={{ height: 32, width: 'auto', filter: 'grayscale(1) contrast(1.2)', opacity: 0.8, background: '#fff', borderRadius: 6, padding: 4, boxShadow: '0 1px 4px 0 rgba(60,60,120,0.06)' }} />
          ))}
        </div>
      </div>
      {showAuthModal && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:16,padding:32,minWidth:300,maxWidth:360,boxShadow:'0 4px 24px 0 rgba(60,60,120,0.18)',textAlign:'center'}}>
            <div style={{fontWeight:700,fontSize:20,color:'#6366f1',marginBottom:12}}>Sign in to Ask a Question</div>
            <div style={{fontSize:16,color:'#444',marginBottom:18}}>You need to login or register to use the AI chat. Continue as guest to try a limited demo.</div>
            <button style={{...cardStyles.cta,marginBottom:10}} onClick={()=>{window.location.href='/login'}}>Login</button>
            <button style={{...cardStyles.cta,background:'linear-gradient(90deg,#60a5fa 0%,#6366f1 100%)',marginBottom:10}} onClick={()=>{window.location.href='/register'}}>Register</button>
            <button style={{...cardStyles.cta,background:'#f3f4f6',color:'#6366f1'}} onClick={()=>{setShowAuthModal(false);navigate('/chat')}}>Continue as Guest</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
