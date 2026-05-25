import { ArrowLeft, Heart, MessageSquare, Plus, Home, Smile, User } from 'lucide-react';

export default function CommunityScreen({
  currentUser,
  setScreen,
  posts,
  handleLikePost,
  showPostModal,
  setShowPostModal,
  newPostText,
  setNewPostText,
  handleAddPost
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="sub-header-title">Athletes Community</span>
        <div style={{ width: '20px' }}></div>
      </div>

      <div className="scroll-content">
        
        {/* Post creation tile trigger */}
        <div 
          style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}
          onClick={() => setShowPostModal(true)}
        >
          <img src={currentUser.profile_pic} style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }} alt="" />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Share your workouts with other athletes...</span>
        </div>

        {/* Dynamic Post Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {posts.map(p => (
            <div key={p.id} className="community-post">
              <div className="post-author-row">
                <img src={p.avatar} className="post-author-avatar" alt="" />
                <div className="post-author-info">
                  <span className="post-author-name">{p.author}</span>
                  <span className="post-time">{p.time}</span>
                </div>
              </div>

              <p className="post-text">{p.text}</p>
              {p.image && <img src={p.image} className="post-img" alt="" />}

              <div className="post-actions-row">
                <button 
                  className={`post-action-btn ${p.liked ? 'liked' : ''}`}
                  onClick={() => handleLikePost(p.id)}
                >
                  <Heart size={16} fill={p.liked ? "#ff3366" : "none"} />
                  {p.likes} Likes
                </button>
                
                <button 
                  className="post-action-btn"
                  onClick={() => alert('Demo Feature: Comments are managed by assigned coaches!')}
                >
                  <MessageSquare size={16} />
                  {p.comments} Comments
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Floating post trigger */}
      <button className="floating-action-btn" onClick={() => setShowPostModal(true)}>
        <Plus size={24} />
      </button>

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

      {/* Community Post Modal */}
      {showPostModal && (
        <div className="modal-overlay">
          <form onSubmit={handleAddPost} className="modal-content">
            <h3 className="modal-title">Write Community Post</h3>
            
            <div className="input-group">
              <label>What's on your mind?</label>
              <textarea
                className="app-input"
                style={{ paddingLeft: '16px', minHeight: '100px', resize: 'none' }}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="Log your physical stats, records or ask other fitness folks questions!"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowPostModal(false)}>Cancel</button>
              <button type="submit" className="btn-modal-action">Publish Post</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
