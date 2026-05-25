import { User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginScreen({
  errorMsg,
  setErrorMsg,
  isTrainerMode,
  setIsTrainerMode,
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  setScreen
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12', overflowY: 'auto' }}>
      <div className="login-header-img">
        <h2>Log In To PulsePro</h2>
        <p>Train Smart. Move Strong. Live Pro</p>
      </div>

      <div className="login-form-container">
        {errorMsg && (
          <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {errorMsg}
          </div>
        )}

        {/* Elegant Role selector */}
        <div className="role-selector">
          <button 
            type="button"
            className={`role-tab ${!isTrainerMode ? 'active' : ''}`}
            onClick={() => { setIsTrainerMode(false); setUsername('Yuvindu'); setPassword('password123'); }}
          >
            User Account
          </button>
          <button 
            type="button"
            className={`role-tab ${isTrainerMode ? 'active' : ''}`}
            onClick={() => { setIsTrainerMode(true); setUsername('Trainer123'); setPassword('trainer123'); }}
          >
            Trainer Portal
          </button>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label>Email Address or Username</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><User size={18} /></span>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="app-input" 
                placeholder="name@email.com or username" 
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="app-input" 
                placeholder="************" 
                required
              />
              <span 
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          </div>

          <button type="submit" className="btn-primary interactive">
            Log In <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-links">
          <span>Don't have an account? <a href="#" onClick={() => { setErrorMsg(''); setScreen('register'); }}>Sign Up.</a></span>
          <a href="#" onClick={() => alert('Demo Feature: Register a new account or log in with default profiles provided on the left!')}>Forgot Password</a>
        </div>
      </div>
    </div>
  );
}
