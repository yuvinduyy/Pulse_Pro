import React from 'react';
import { User, Smile, Lock, ChevronRight, Home } from 'lucide-react';

export default function ProfileScreen({
  currentUser,
  setCurrentUser,
  setScreen,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  dob,
  setDob,
  address,
  setAddress,
  telNo,
  setTelNo,
  handleUpdateProfile
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="scroll-content">
        
        {/* Hero profile */}
        <div className="profile-hero">
          <div className="profile-avatar-wrapper">
            <img src={currentUser.profile_pic} className="profile-avatar" alt="" />
          </div>
          <div>
            <h2 className="profile-name">{currentUser.first_name || currentUser.username}</h2>
          </div>
        </div>

        {/* User profile fields matching mockup */}
        <div className="profile-fields">
          <div className="profile-field-row">
            <div className="field-icon-circle">
              <User size={18} />
            </div>
            <div className="field-info">
              <span className="field-label">User Name</span>
              <span className="field-value">{currentUser.username}</span>
            </div>
          </div>

          <div className="profile-field-row">
            <div className="field-icon-circle">
              <Smile size={18} />
            </div>
            <div className="field-info">
              <span className="field-label">Email</span>
              <span className="field-value">{currentUser.email || 'Yu.ccpa@hotmail.com'}</span>
            </div>
          </div>

          <div className="profile-field-row">
            <div className="field-icon-circle">
              <Lock size={18} />
            </div>
            <div className="field-info" style={{ cursor: 'pointer' }} onClick={() => alert('Password reset link sent to your email!')}>
              <span className="field-label">Password</span>
              <span className="field-value">Reset Password</span>
            </div>
          </div>
        </div>

        {/* USER DETAILS INPUT FIELDS ROW BY ROW MATCHING MOCKUP */}
        {currentUser.role === 'user' && (
          <div style={{ marginTop: '10px' }}>
            <h3 className="profile-section-title">User Details</h3>
            
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="detail-row">
                <span className="detail-label">First Name</span>
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="-"
                  className="detail-input" 
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Last Name</span>
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="-"
                  className="detail-input" 
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">DOB</span>
                <input 
                  type="date" 
                  value={dob} 
                  onChange={(e) => setDob(e.target.value)} 
                  className="detail-input" 
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Address</span>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Colombo, Sri Lanka"
                  className="detail-input" 
                />
              </div>

              <div className="detail-row">
                <span className="detail-label">Tel No</span>
                <input 
                  type="tel" 
                  value={telNo} 
                  onChange={(e) => setTelNo(e.target.value)} 
                  placeholder="0771234567"
                  className="detail-input" 
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary interactive" 
                style={{ marginTop: '16px', background: '#e5e7eb', color: '#111' }}
              >
                Update User Details
              </button>
            </form>

            {/* WHITE ROW: Personal Trainer nav card */}
            <div className="trainer-nav-row" onClick={() => setScreen('trainer-chat')}>
              <div className="trainer-nav-left">
                <Smile size={20} />
                <span>Personal Trainer</span>
              </div>
              <ChevronRight size={18} />
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button 
          className="btn-primary interactive" 
          style={{ background: '#ef4444', borderColor: '#ef4444', color: '#fff', marginTop: '10px' }}
          onClick={() => { setScreen('login'); setCurrentUser(null); }}
        >
          Log Out of PulsePro
        </button>

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
        <button className="nav-item active" onClick={() => setScreen('profile')}>
          <User />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
