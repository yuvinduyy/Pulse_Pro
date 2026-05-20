import React from 'react';
import { ArrowLeft, Home, Smile, User } from 'lucide-react';

export default function CaloriesScreen({
  currentUser,
  setScreen,
  caloriePercent,
  burnPercent,
  loggedCalories,
  targetCalories,
  burnedCalories,
  burnTarget,
  bmiString
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="sub-header-title">Calory Meter</span>
        <div style={{ width: '20px' }}></div>
      </div>

      <div className="scroll-content">
        
        {/* Visual SVG Progress Ring */}
        <div className="calories-rings-container">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* Background track circle */}
            <circle cx="100" cy="100" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="12" fill="none" />
            
            {/* Calories Consumed active ring */}
            <circle 
              cx="100" 
              cy="100" 
              r="80" 
              stroke="var(--primary)" 
              strokeWidth="12" 
              fill="none" 
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - caloriePercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />

            {/* Burned calories background track circle */}
            <circle cx="100" cy="100" r="60" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" fill="none" />

            {/* Burned active ring */}
            <circle 
              cx="100" 
              cy="100" 
              r="60" 
              stroke="#10b981" 
              strokeWidth="10" 
              fill="none" 
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - burnPercent / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />

            {/* Center stats */}
            <text x="100" y="95" fontSize="24" fontWeight="extrabold" fill="#fff" textAnchor="middle" fontFamily="var(--font-heading)">
              {loggedCalories}
            </text>
            <text x="100" y="115" fontSize="10" fill="var(--text-secondary)" textAnchor="middle">
              of {targetCalories} kcal
            </text>
            <text x="100" y="130" fontSize="10" fontWeight="bold" fill="var(--primary)" textAnchor="middle">
              Consumed
            </text>
          </svg>
        </div>

        {/* Summary row boxes */}
        <div className="calories-summary-grid">
          <div className="calorie-stat-box">
            <span className="calorie-stat-label">Consumed Today</span>
            <div className="calorie-stat-value" style={{ color: 'var(--primary)' }}>{loggedCalories} kcal</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: {targetCalories}</span>
          </div>

          <div className="calorie-stat-box">
            <span className="calorie-stat-label">Burned in Workouts</span>
            <div className="calorie-stat-value" style={{ color: '#10b981' }}>{burnedCalories} kcal</div>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: {burnTarget}</span>
          </div>
        </div>

        {/* Quick details */}
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>Daily Health Recommendations</div>
          <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
            <li>Ensure protein intake of at least 1.6g per kg of bodyweight (approx 120g).</li>
            <li>Based on your BMI ({bmiString}), maintain a calorie deficit of 300 kcal for safe weight management.</li>
            <li>Drink 3.5 liters of clean water daily.</li>
          </ul>
        </div>

      </div>

      {/* BOTTOM TAB NAVBAR */}
      <div className="app-nav-bar">
        <button className="nav-item active" onClick={() => setScreen('dashboard')}>
          <Home />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => setScreen('trainer-chat')}>
          <Smile />
          <span>Assistant</span>
        </button>
        <button className="nav-item" onClick={() => setScreen('profile')}>
          <User />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
