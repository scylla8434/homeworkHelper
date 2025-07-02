import React from 'react';
import { useAuth } from '../AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();
  return (
    <div style={{maxWidth:420,margin:'40px auto',background:'#fff',borderRadius:18,boxShadow:'0 6px 32px 0 rgba(60,60,120,0.10)',padding:'36px 32px'}}>
      <div style={{fontWeight:800,fontSize:28,color:'#6366f1',marginBottom:18,letterSpacing:1,textAlign:'center'}}>Settings</div>
      <div style={{fontSize:17,color:'#222',marginBottom:8}}>Username: <b>{user?.name}</b></div>
      <div style={{fontSize:17,color:'#222',marginBottom:8}}>Email: <b>{user?.email}</b></div>
      <div style={{fontSize:17,color:'#222',marginBottom:8}}>Phone: <b>{user?.phone || 'Not set'}</b></div>
      {/* Add more settings here as needed */}
    </div>
  );
}
