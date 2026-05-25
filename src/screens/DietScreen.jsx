import { ArrowLeft, Plus, Home, Smile, User } from 'lucide-react';

export default function DietScreen({
  setScreen,
  diets,
  selectedDay,
  setSelectedDay,
  showMealModal,
  setShowMealModal,
  newMeal,
  setNewMeal,
  handleAddMeal
}) {
  return (
    <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
      <div className="sub-header">
        <button className="back-btn" onClick={() => setScreen('dashboard')}>
          <ArrowLeft size={20} />
        </button>
        <span className="sub-header-title">Diet Schedules</span>
        <button className="back-btn" onClick={() => setShowMealModal(true)}>
          <Plus size={20} />
        </button>
      </div>

      <div className="scroll-content">
        
        {/* Day Picker */}
        <div className="day-selector">
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <div 
              key={day}
              className={`day-chip ${selectedDay === day ? 'active' : ''}`}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Meal Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {diets.filter(d => d.day === selectedDay).length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', background: 'var(--bg-card)', borderRadius: '20px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              No meals scheduled for {selectedDay}. Click the '+' icon at the top to schedule a meal!
            </div>
          ) : (
            diets.filter(d => d.day === selectedDay).map(meal => (
              <div key={meal.id} className="meal-card">
                <div className="meal-header">
                  <span className="meal-type">{meal.meal_type}</span>
                  <span className="meal-calories">{meal.calories} kcal</span>
                </div>
                <p className="meal-items">{meal.items}</p>
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

      {/* Meal Modal */}
      {showMealModal && (
        <div className="modal-overlay">
          <form onSubmit={handleAddMeal} className="modal-content">
            <h3 className="modal-title">Schedule Diet Item</h3>
            
            <div className="input-group">
              <label>Meal Class</label>
              <select 
                className="app-input"
                style={{ paddingLeft: '16px', background: '#16171d' }}
                value={newMeal.type}
                onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack / Other</option>
              </select>
            </div>

            <div className="input-group">
              <label>Food Item & Quantity</label>
              <input 
                type="text"
                className="app-input"
                style={{ paddingLeft: '16px' }}
                value={newMeal.items}
                onChange={(e) => setNewMeal({ ...newMeal, items: e.target.value })}
                placeholder="e.g. Scrambled eggs, Toast, Apple"
                required
              />
            </div>

            <div className="input-group">
              <label>Calories (kcal)</label>
              <input 
                type="number"
                className="app-input"
                style={{ paddingLeft: '16px' }}
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
                placeholder="250"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowMealModal(false)}>Cancel</button>
              <button type="submit" className="btn-modal-action">Log Meal</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
