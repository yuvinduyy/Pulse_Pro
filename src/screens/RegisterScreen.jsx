import { User, Smile, Lock, ArrowRight } from 'lucide-react';

export default function RegisterScreen({
  errorMsg,
  setErrorMsg,
  regRole,
  setRegRole,
  regUsername,
  setRegUsername,
  regEmail,
  setRegEmail,
  regPassword,
  setRegPassword,
  handleRegister,
  setScreen
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12', overflowY: 'auto' }}>
      <div className="login-header-img" style={{ height: '160px' }}>
        <h2>Create Account</h2>
        <p>Join the PulsePro Community</p>
      </div>

      <div className="login-form-container">
        {errorMsg && (
          <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px 14px', borderRadius: '12px', fontSize: '0.8rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group">
            <label>Account Role</label>
            <select 
              value={regRole} 
              onChange={(e) => setRegRole(e.target.value)}
              className="app-input"
              style={{ paddingLeft: '16px', background: '#16171d' }}
            >
              <option value="user">User / Athlete</option>
              <option value="trainer">Fitness Trainer</option>
            </select>
          </div>

          <div className="input-group">
            <label>Username</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><User size={18} /></span>
              <input 
                type="text" 
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                className="app-input" 
                placeholder="e.g. Yuvindu" 
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Smile size={18} /></span>
              <input 
                type="email" 
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="app-input" 
                placeholder="name@email.com" 
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <span className="input-icon-left"><Lock size={18} /></span>
              <input 
                type="password" 
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                className="app-input" 
                placeholder="Create strong password" 
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary interactive">
            Sign Up <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-links">
          <span>Already have an account? <a href="#" onClick={() => { setErrorMsg(''); setScreen('login'); }}>Log In.</a></span>
        </div>
      </div>
    </div>
  );
}
