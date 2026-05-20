import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function SplashScreen({ setScreen }) {
  return (
    <div className="splash-screen fade-in">
      <div className="splash-logo-container">
        <h1 className="splash-logo">Pulse<span>Pro</span></h1>
      </div>
      <div className="splash-info">
        <h2 className="splash-title">Wherever You Are Health Is Number One</h2>
        <p className="splash-subtitle">There is no instant way to a healthy life</p>
        
        <div className="pagination-dots">
          <div className="pag-dot"></div>
          <div className="pag-dot"></div>
          <div className="pag-dot active"></div>
        </div>

        <button 
          className="btn-large interactive" 
          onClick={() => setScreen('login')}
        >
          Get Started <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
