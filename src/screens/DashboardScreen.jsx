import { LogOut, Smile, ChevronRight, Home, User } from 'lucide-react';

export default function DashboardScreen({
  currentUser,
  setCurrentUser,
  setScreen,
  clients,
  selectedClient,
  setSelectedClient
}) {
  return (
    <div className="app-screen fade-in">
      <div className="app-header">
        <div className="app-header-left">
          <span className="date">Monday, 14 July</span>
          <h2 className="title">PulsePro</h2>
        </div>
        <div className="app-header-right">
          <button className="header-icon-btn" onClick={() => { setScreen('login'); setCurrentUser(null); }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="scroll-content">
        
        {/* Quick User summary if User Role logged in */}
        {currentUser.role === 'user' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
            <img src={currentUser.profile_pic} alt="user profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Welcome back,</div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{currentUser.first_name || currentUser.username}</div>
            </div>
          </div>
        )}

        {/* TRAINER VIEW: Dashboard details */}
        {currentUser.role === 'trainer' && (
          <div style={{ background: 'var(--primary-glow)', border: '1px solid var(--primary)', padding: '16px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Smile size={20} style={{ color: 'var(--primary)' }} />
              <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Trainer Dashboard Mode</h4>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              You are logged in as Coach <strong>John (Trainer)</strong>. Click "Assistant" below to view clients and reply to chat logs.
            </p>
          </div>
        )}

        {currentUser.role === 'user' ? (
          <>
            {/* Interactive cards grid exactly from mockup */}
            <div className="home-grid">
              <div className="home-card card-exercise interactive" onClick={() => setScreen('exercise')}>
                <div className="home-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300')" }}></div>
                <div className="home-card-overlay"></div>
                <div className="home-card-content">
                  <h3 className="home-card-title">Exercise<br />Plans</h3>
                </div>
              </div>

              <div className="home-card card-diet interactive" onClick={() => setScreen('diet')}>
                <div className="home-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300')" }}></div>
                <div className="home-card-overlay"></div>
                <div className="home-card-content">
                  <h3 className="home-card-title">Diet<br />Plans</h3>
                </div>
              </div>

              <div className="home-card card-bmi interactive" onClick={() => setScreen('bmi')}>
                <div className="home-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300')" }}></div>
                <div className="home-card-overlay"></div>
                <div className="home-card-content">
                  <h3 className="home-card-title">BMI<br />Calculator</h3>
                </div>
              </div>

              <div className="home-card card-calories interactive" onClick={() => setScreen('calories')}>
                <div className="home-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300')" }}></div>
                <div className="home-card-overlay"></div>
                <div className="home-card-content">
                  <h3 className="home-card-title">Calory<br />Meter</h3>
                </div>
              </div>

              <div className="home-card card-community interactive" onClick={() => setScreen('community')}>
                <div className="home-card-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=400')" }}></div>
                <div className="home-card-overlay"></div>
                <div className="home-card-content">
                  <h3 className="home-card-title">Community</h3>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Trainer Client list
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 className="trainer-dashboard-title">Active Clients</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Select an athlete below to review and chat</p>
            
            {clients.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-secondary)' }}>
                No active clients loaded yet.
              </div>
            ) : (
              clients.map(client => (
                <div 
                  key={client.id}
                  className="client-card interactive"
                  onClick={() => {
                    setSelectedClient(client);
                    setScreen('trainer-chat');
                  }}
                >
                  <div className="client-card-left">
                    <img src={client.profile_pic} alt="" className="client-card-avatar" />
                    <div className="client-card-info">
                      <span className="client-card-name">{client.first_name || client.username}</span>
                      <span className="client-card-metrics">
                        Height: {client.height}cm | Weight: {client.weight}kg | BMI: {((client.weight || 0) / Math.pow((client.height || 170)/100, 2)).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="client-card-arrow">
                    <ChevronRight size={18} />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* BOTTOM TAB NAVBAR */}
      <div className="app-nav-bar">
        <button className="nav-item active" onClick={() => setScreen('dashboard')}>
          <Home />
          <span>Home</span>
        </button>
        <button className="nav-item" onClick={() => {
          if (currentUser.role === 'trainer') {
            if (!selectedClient && clients.length > 0) {
              setSelectedClient(clients[0]);
            }
          }
          setScreen('trainer-chat');
        }}>
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
