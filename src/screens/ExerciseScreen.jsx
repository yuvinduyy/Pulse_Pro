import { ArrowLeft, Plus, Activity, Flame, Home, Smile, User } from 'lucide-react';

export default function ExerciseScreen({
  setScreen,
  exercises,
  showExerciseModal,
  setShowExerciseModal,
  newExercise,
  setNewExercise,
  handleAddExercise
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="sub-header-title">Physical Training</span>
        <button className="back-btn" onClick={() => setShowExerciseModal(true)}>
          <Plus size={20} />
        </button>
      </div>

      <div className="scroll-content">
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <Activity size={16} style={{ color: 'var(--primary)' }} />
            <span>Log exercise periods to calculate daily calorie metrics!</span>
          </div>

          {exercises.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No routines assigned yet. Click the '+' icon at the top to add an exercise!
            </div>
          ) : (
            exercises.map(ex => (
              <div key={ex.id} className="exercise-routine-card">
                <div className="exercise-info-left">
                  <span className="exercise-name">{ex.name}</span>
                  <span className="exercise-specs">{ex.sets} Sets x {ex.reps} Reps</span>
                </div>
                <span className="exercise-duration">
                  <Flame size={16} />
                  {ex.duration} mins
                </span>
              </div>
            ))
          )}
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

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="modal-overlay">
          <form onSubmit={handleAddExercise} className="modal-content">
            <h3 className="modal-title">Schedule Workout Item</h3>

            <div className="input-group">
              <label>Exercise Name</label>
              <input 
                type="text"
                className="app-input"
                style={{ paddingLeft: '16px' }}
                value={newExercise.name}
                onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                placeholder="e.g. Dumbbell Curls, Squats"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="input-group">
                <label>Sets</label>
                <input 
                  type="number"
                  className="app-input"
                  style={{ paddingLeft: '16px' }}
                  value={newExercise.sets}
                  onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })}
                  placeholder="3"
                  required
                />
              </div>
              <div className="input-group">
                <label>Reps</label>
                <input 
                  type="number"
                  className="app-input"
                  style={{ paddingLeft: '16px' }}
                  value={newExercise.reps}
                  onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  placeholder="10"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Duration (Minutes)</label>
              <input 
                type="number"
                className="app-input"
                style={{ paddingLeft: '16px' }}
                value={newExercise.duration}
                onChange={(e) => setNewExercise({ ...newExercise, duration: e.target.value })}
                placeholder="15"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowExerciseModal(false)}>Cancel</button>
              <button type="submit" className="btn-modal-action">Log Workout</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
