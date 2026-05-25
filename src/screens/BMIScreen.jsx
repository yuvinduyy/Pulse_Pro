import { ArrowLeft, Menu, Activity, Award, Utensils, User, Home, Smile } from 'lucide-react';

export default function BMIScreen({
  currentUser,
  setScreen,
  rawBMI,
  bmiString,
  bmiCategory,
  bmiCategoryClass,
  height,
  setHeight,
  weight,
  setWeight,
  age,
  setAge,
  location,
  setLocation,
  handleUpdateHealth
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="sub-header-title">Health Details</span>
        <button className="back-btn" onClick={() => alert('Menu Options')}>
          <Menu size={20} />
        </button>
      </div>

      <div className="scroll-content">
        
        {/* Avatar and Age Card Row */}
        <div className="health-profile-section">
          <div className="health-profile-info">
            <img src={currentUser.profile_pic} className="health-avatar" alt="" />
            <div>
              <h4 className="health-name">{currentUser.first_name || currentUser.username}</h4>
              <span className="health-location">{currentUser.location || 'Sri Lanka'}</span>
            </div>
          </div>
          <div className="health-age-card">
            <span className="health-age-label">Age</span>
            <span className="health-age-value">{currentUser.age || 23}</span>
          </div>
        </div>

        {/* List Metrics rows matching user mockups */}
        <div className="metric-list">
          <div className="metric-row">
            <div className="metric-icon-circle height">
              <Activity size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-label">Height</span>
              <span className="metric-value"><span>{currentUser.height || 172}</span> cm</span>
            </div>
          </div>

          <div className="metric-row">
            <div className="metric-icon-circle weight">
              <Award size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-label">Weight</span>
              <span className="metric-value"><span>{currentUser.weight || 76}</span> Kg</span>
            </div>
          </div>

          <div className="metric-row">
            <div className="metric-icon-circle bmi">
              <Utensils size={20} />
            </div>
            <div className="metric-details">
              <span className="metric-label">BMI</span>
              <span className="metric-value"><span>{bmiString}</span> kg/m2 ({bmiCategory})</span>
            </div>
          </div>
        </div>

        {/* Obesity Categorization card matching mockup exactly */}
        <div className="obesity-categorization-card">
          <h3 className="obesity-title">Obesity Categorization</h3>
          
          <div className="obesity-grid">
            <div className={`obesity-class ${bmiCategoryClass === 'underweight' ? 'active' : ''}`}>
              <span className="obesity-class-label">Weight Class: <br /><strong>Underweight</strong></span>
              <div className="obesity-icon-wrapper"><User size={24} /></div>
              <span className="obesity-bmi-range">BMI: Under 18</span>
            </div>
            
            <div className={`obesity-class ${bmiCategoryClass === 'normal' ? 'active' : ''}`}>
              <span className="obesity-class-label">Normal Weight<br /><strong>Range</strong></span>
              <div className="obesity-icon-wrapper"><User size={24} /></div>
              <span className="obesity-bmi-range">18 to &lt;25</span>
            </div>

            <div className={`obesity-class ${bmiCategoryClass === 'overweight' || bmiCategoryClass === 'obese' ? 'active' : ''}`}>
              <span className="obesity-class-label">Weight Class: <br /><strong>Overweight</strong></span>
              <div className="obesity-icon-wrapper"><User size={24} /></div>
              <span className="obesity-bmi-range">25 to &lt;30</span>
            </div>
          </div>

          {/* Highly Visual Colored Obesity Grid */}
          <div className="bmi-chart-grid">
            <svg viewBox="0 0 120 70" width="100%" height="auto" style={{ borderRadius: '8px', background: 'rgba(255,255,255,0.05)', padding: '6px' }}>
              <rect x="0" y="0" width="30" height="70" fill="#38bdf8" opacity="0.6" />
              <rect x="30" y="0" width="40" height="70" fill="#4ade80" opacity="0.6" />
              <rect x="70" y="0" width="30" height="70" fill="#facc15" opacity="0.6" />
              <rect x="100" y="0" width="20" height="70" fill="#f87171" opacity="0.6" />
              
              <text x="15" y="40" fontSize="5" textAnchor="middle" fill="#fff" fontWeight="bold">Under</text>
              <text x="50" y="40" fontSize="5" textAnchor="middle" fill="#fff" fontWeight="bold">Healthy</text>
              <text x="85" y="40" fontSize="5" textAnchor="middle" fill="#fff" fontWeight="bold">Over</text>
              <text x="110" y="40" fontSize="5" textAnchor="middle" fill="#fff" fontWeight="bold">Obese</text>

              {/* Indicator of current user's BMI */}
              {rawBMI > 0 && (
                <g transform={`translate(${Math.min(115, Math.max(5, (rawBMI / 40) * 120))}, 20)`}>
                  <polygon points="0,0 -4,-8 4,-8" fill="#ffcc00" />
                  <circle cx="0" cy="-12" r="6" fill="#ffcc00" />
                  <text x="0" y="-10" fontSize="5" textAnchor="middle" fill="#000" fontWeight="extrabold">{bmiString}</text>
                </g>
              )}
            </svg>
            <span style={{ fontSize: '0.65rem', opacity: '0.8', fontStyle: 'italic', display: 'block', textAlign: 'center', marginTop: '4px' }}>Interactive BMI indicator represents your placement</span>
          </div>
        </div>

        {/* Calculator inputs form */}
        <form onSubmit={handleUpdateHealth} className="edit-metrics-form">
          <h3 className="edit-metrics-title">Recalculate Health Details:</h3>
          
          <div className="form-row-2">
            <div className="input-group">
              <label>Height (cm)</label>
              <input 
                type="number" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="app-input" 
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. 172"
                required
              />
            </div>
            
            <div className="input-group">
              <label>Weight (kg)</label>
              <input 
                type="number" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="app-input" 
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. 76"
                required
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="input-group">
              <label>Age</label>
              <input 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="app-input" 
                style={{ paddingLeft: '16px' }}
                placeholder="e.g. 23"
                disabled
              />
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'block' }}>Calculated from DOB</span>
            </div>
            
            <div className="input-group">
              <label>Location</label>
              <input 
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="app-input" 
                style={{ paddingLeft: '16px' }}
                placeholder="Sri Lanka"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary interactive">
            Save & Sync Metrics
          </button>
        </form>

      </div>

      {/* BOTTOM TAB NAVBAR */}
      <div className="app-nav-bar">
        <button className="nav-item" onClick={() => setScreen('dashboard')}>
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
