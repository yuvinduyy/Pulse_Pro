import { ArrowLeft, Smile, Send, Home, User } from 'lucide-react';

export default function TrainerChatScreen({
  currentUser,
  selectedClient,
  setSelectedClient,
  setScreen,
  messages,
  chatBottomRef,
  chatInput,
  setChatInput,
  handleSendMessage
}) {
  return (
    <div className="app-screen fade-in">
      
      {/* Dynamic Header based on Role */}
      <div className="chat-header">
        {currentUser.role === 'trainer' ? (
          <>
            <button className="back-btn" onClick={() => { setSelectedClient(null); setScreen('dashboard'); }}>
              <ArrowLeft size={20} />
            </button>
            {selectedClient ? (
              <>
                <img src={selectedClient.profile_pic} className="chat-header-avatar" alt="" />
                <div className="chat-header-info">
                  <span className="chat-header-name">Chatting with: {selectedClient.first_name || selectedClient.username}</span>
                  <span className="chat-header-status"><div className="pulse-dot"></div> Client details: {selectedClient.height}cm / {selectedClient.weight}kg</span>
                </div>
              </>
            ) : (
              <div className="chat-header-info">
                <span className="chat-header-name">Client Portal</span>
              </div>
            )}
          </>
        ) : (
          <>
            <button className="back-btn" onClick={() => setScreen('dashboard')}>
              <ArrowLeft size={20} />
            </button>
            <img src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150" className="chat-header-avatar" alt="" />
            <div className="chat-header-info">
              <span className="chat-header-name">Coach John</span>
              <span className="chat-header-status"><div className="pulse-dot"></div> PulsePro Expert Trainer</span>
            </div>
          </>
        )}
      </div>

      <div className="chat-container">
        
        {currentUser.role === 'trainer' && !selectedClient ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Smile size={48} style={{ alignSelf: 'center', color: 'var(--primary)' }} />
            <h3>Client Selection Required</h3>
            <p>Go to the Home dashboard to select a client athlete from your list to initiate the live coaching chat.</p>
            <button className="btn-primary" onClick={() => setScreen('dashboard')}>Go to Dashboard</button>
          </div>
        ) : (
          <>
            {/* Messages Area */}
            <div className="chat-messages-area">
              {messages.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  No messages in this chat. Start the conversation!
                </div>
              ) : (
                messages.map(m => {
                  const isSent = m.sender_id === currentUser.id;
                  return (
                    <div key={m.id} className={`chat-bubble ${isSent ? 'sent' : 'received'}`}>
                      <div>{m.message}</div>
                      <div className="chat-bubble-time">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="chat-input-area">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="chat-input-field" 
                placeholder="Type your message here..."
              />
              <button type="submit" className="chat-send-btn">
                <Send size={18} />
              </button>
            </form>
          </>
        )}

      </div>

      {/* BOTTOM TAB NAVBAR */}
      <div className="app-nav-bar">
        <button className="nav-item" onClick={() => setScreen('dashboard')}>
          <Home />
          <span>Home</span>
        </button>
        <button className="nav-item active" onClick={() => setScreen('trainer-chat')}>
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
