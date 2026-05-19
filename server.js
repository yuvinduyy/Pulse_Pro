import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client if credentials are provided in .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase Connection Status: ACTIVE (Directly connecting to Supabase Postgres)');
  } catch (err) {
    console.error('Failed to connect to Supabase:', err.message);
  }
} else {
  console.log('Supabase Connection Status: INACTIVE (Missing SUPABASE_URL / SUPABASE_KEY in .env)');
  console.log('PulsePro is falling back to SQLite3 Local Database Mode.');
}

// Connect to local SQLite Database (used as backup if Supabase is offline/inactive)
const dbPath = join(__dirname, 'pulsepro.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('SQLite database backup operational at:', dbPath);
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT NOT NULL CHECK(role IN ('user', 'trainer')),
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        first_name TEXT,
        last_name TEXT,
        dob TEXT,
        address TEXT,
        tel_no TEXT,
        height REAL,
        weight REAL,
        age INTEGER,
        location TEXT,
        profile_pic TEXT
      )
    `);

    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
      )
    `);

    // Diet plans table
    db.run(`
      CREATE TABLE IF NOT EXISTS diets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        day TEXT NOT NULL,
        meal_type TEXT NOT NULL,
        items TEXT NOT NULL,
        calories INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Exercise plans table
    db.run(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        sets INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        duration INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(id)
      )
    `);

    // Seed default data if users table is empty
    db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
      if (err) return;
      if (row.count === 0) {
        console.log('Seeding initial SQLite data...');
        
        // Seed Trainer
        db.run(`
          INSERT INTO users (role, username, password, email, first_name, last_name, profile_pic)
          VALUES ('trainer', 'Trainer123', 'trainer123', 'trainer@pulsepro.com', 'John', 'Doe', 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150')
        `);

        // Seed User "Yuvindu"
        db.run(`
          INSERT INTO users (role, username, password, email, first_name, last_name, dob, address, tel_no, height, weight, age, location, profile_pic)
          VALUES ('user', 'Yuvindu', 'password123', 'Yu.ccpa@hotmail.com', 'Yuvindu', 'Senanayake', '2003-07-14', 'Colombo, Sri Lanka', '0771234567', 172, 76, 23, 'Sri Lanka', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150')
        `, function(err) {
          if (err) return;
          const userId = this.lastID;

          // Seed messages
          db.run(`
            INSERT INTO messages (sender_id, receiver_id, message, timestamp)
            VALUES 
              (1, 2, 'Welcome to PulsePro! I am John, your personal trainer.', '2026-05-19T20:00:00.000Z'),
              (2, 1, 'Hi John! Glad to connect. I want to improve my overall fitness and maintain a healthy weight.', '2026-05-19T20:05:00.000Z'),
              (1, 2, 'Great goal! Let us start by looking at your current height and weight. I see you are 172cm and 76kg, giving you a BMI of 25.7. We should target a normal range (under 25).', '2026-05-19T20:10:00.000Z')
          `);

          // Seed diets
          const meals = [
            { day: 'Monday', meal: 'Breakfast', items: 'Oatmeal with bananas and honey, Egg whites', cals: 350 },
            { day: 'Monday', meal: 'Lunch', items: 'Grilled chicken breast with brown rice and broccoli', cals: 550 },
            { day: 'Monday', meal: 'Dinner', items: 'Baked salmon with sweet potato and steamed asparagus', cals: 480 },
            { day: 'Monday', meal: 'Snack', items: 'Greek yogurt with mixed berries, Almonds', cals: 200 }
          ];

          meals.forEach(m => {
            db.run(`
              INSERT INTO diets (user_id, day, meal_type, items, calories)
              VALUES (?, ?, ?, ?, ?)
            `, [userId, m.day, m.meal, m.items, m.cals]);
          });

          // Seed exercises
          const routines = [
            { name: 'Treadmill Jogging', sets: 1, reps: 1, duration: 30 },
            { name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, duration: 15 },
            { name: 'Push-Ups', sets: 4, reps: 15, duration: 10 },
            { name: 'Barbell Squats', sets: 4, reps: 10, duration: 20 }
          ];

          routines.forEach(r => {
            db.run(`
              INSERT INTO exercises (user_id, name, sets, reps, duration)
              VALUES (?, ?, ?, ?, ?)
            `, [userId, r.name, r.sets, r.reps, r.duration]);
          });
        });
      }
    });
  });
}

// REST API Endpoints with Supabase / SQLite Dual Capability

// Helper to calculate age from Date of Birth
function calculateAge(dobString) {
  if (!dobString) return 23;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 23;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// Helper to log DB active mode
app.get('/api/db-status', (req, res) => {
  res.json({
    supabaseActive: supabase !== null,
    supabaseUrl: supabaseUrl ? supabaseUrl.replace(/(?<=.{12})./g, "*") : null,
    message: supabase ? "Connected to Supabase Postgres Cloud Database" : "Using Local SQLite3 Database"
  });
});

// Authentication - Register
app.post('/api/auth/register', async (req, res) => {
  const { role, username, password, email, first_name, last_name } = req.body;
  if (!role || !username || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const defaultDob = '2003-07-14';
  const defaultHeight = 170;
  const defaultWeight = 70;
  const defaultAge = calculateAge(defaultDob);
  const defaultLocation = 'Sri Lanka';
  const defaultPic = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  if (supabase) {
    try {
      // Check if username already exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists in Supabase' });
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          role, 
          username, 
          password, 
          email: email || '', 
          first_name: first_name || username, 
          last_name: last_name || '', 
          dob: defaultDob,
          height: defaultHeight, 
          weight: defaultWeight, 
          age: defaultAge, 
          location: defaultLocation, 
          profile_pic: defaultPic 
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json({ message: 'User registered on Supabase successfully', user: data });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // Local SQLite Fallback
    db.run(`
      INSERT INTO users (role, username, password, email, first_name, last_name, dob, height, weight, age, location, profile_pic)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [role, username, password, email || '', first_name || '', last_name || '', defaultDob, defaultHeight, defaultWeight, defaultAge, defaultLocation, defaultPic], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      const userId = this.lastID;
      db.get("SELECT id, role, username, email, first_name, last_name, dob, height, weight, age, location, profile_pic FROM users WHERE id = ?", [userId], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'User registered in SQLite successfully', user });
      });
    });
  }
});

// Authentication - Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Missing username, password, or role' });
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .eq('role', role)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return res.status(401).json({ error: 'Invalid username, password, or role selection on Supabase' });
      }
      
      const safeUser = { ...data };
      delete safeUser.password;
      res.json({ message: 'Login via Supabase successful', user: safeUser });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.get("SELECT * FROM users WHERE username = ? AND password = ? AND role = ?", [username, password, role], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      
      const safeUser = { ...user };
      delete safeUser.password;
      res.json({ message: 'Login via SQLite successful', user: safeUser });
    });
  }
});

// Get User Profile
app.get('/api/profile/:id', async (req, res) => {
  const userId = Number(req.params.id);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, role, username, email, first_name, last_name, dob, address, tel_no, height, weight, age, location, profile_pic')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return res.status(404).json({ error: 'User not found in Supabase' });
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.get("SELECT id, role, username, email, first_name, last_name, dob, address, tel_no, height, weight, age, location, profile_pic FROM users WHERE id = ?", [userId], (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found in SQLite' });
      res.json(user);
    });
  }
});

// Update User Profile
app.put('/api/profile/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const { first_name, last_name, dob, address, tel_no, email, username } = req.body;
  const age = calculateAge(dob);

  if (supabase) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ first_name, last_name, dob, address, tel_no, email, username, age })
        .eq('id', userId);

      if (error) throw error;
      res.json({ message: 'Profile updated on Supabase successfully', age });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.run(`
      UPDATE users 
      SET first_name = ?, last_name = ?, dob = ?, address = ?, tel_no = ?, email = ?, username = ?, age = ?
      WHERE id = ?
    `, [first_name, last_name, dob, address, tel_no, email, username, age, userId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Profile updated in SQLite successfully', age });
    });
  }
});

// Update Health Metrics
app.put('/api/health-metrics/:id', async (req, res) => {
  const userId = Number(req.params.id);
  const { height, weight, age, location } = req.body;

  if (supabase) {
    try {
      const { error } = await supabase
        .from('users')
        .update({ height: Number(height), weight: Number(weight), age: Number(age), location })
        .eq('id', userId);

      if (error) throw error;
      res.json({ message: 'Metrics updated on Supabase successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.run(`
      UPDATE users 
      SET height = ?, weight = ?, age = ?, location = ?
      WHERE id = ?
    `, [height, weight, age, location, userId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Metrics updated in SQLite successfully' });
    });
  }
});

// Get Trainer's Clients
app.get('/api/trainer/:trainerId/clients', async (req, res) => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, username, first_name, last_name, height, weight, age, location, profile_pic')
        .eq('role', 'user');

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.all("SELECT id, username, first_name, last_name, height, weight, age, location, profile_pic FROM users WHERE role = 'user'", [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// Get Chat Messages
app.get('/api/chat/messages', async (req, res) => {
  const user_id = Number(req.query.user_id);
  const trainer_id = Number(req.query.trainer_id);

  if (!user_id || !trainer_id) {
    return res.status(400).json({ error: 'Missing user_id or trainer_id' });
  }

  if (supabase) {
    try {
      // Query where (sender = user AND receiver = trainer) OR (sender = trainer AND receiver = user)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user_id},receiver_id.eq.${trainer_id}),and(sender_id.eq.${trainer_id},receiver_id.eq.${user_id})`)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.all(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY timestamp ASC
    `, [user_id, trainer_id, trainer_id, user_id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// Send Chat Message
app.post('/api/chat/messages', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({ error: 'Missing required message details' });
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ 
          sender_id: Number(sender_id), 
          receiver_id: Number(receiver_id), 
          message 
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.run(`
      INSERT INTO messages (sender_id, receiver_id, message)
      VALUES (?, ?, ?)
    `, [sender_id, receiver_id, message], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get("SELECT * FROM messages WHERE id = ?", [this.lastID], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    });
  }
});

// Get User Diets
app.get('/api/diets/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('diets')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.all("SELECT * FROM diets WHERE user_id = ?", [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// Add User Diet Plan
app.post('/api/diets', async (req, res) => {
  const { user_id, day, meal_type, items, calories } = req.body;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('diets')
        .insert([{ 
          user_id: Number(user_id), 
          day, 
          meal_type, 
          items, 
          calories: Number(calories) 
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.run(`
      INSERT INTO diets (user_id, day, meal_type, items, calories)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, day, meal_type, items, calories], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
  }
});

// Get User Exercises
app.get('/api/exercises/:userId', async (req, res) => {
  const userId = Number(req.params.userId);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.all("SELECT * FROM exercises WHERE user_id = ?", [userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }
});

// Add User Exercise Plan
app.post('/api/exercises', async (req, res) => {
  const { user_id, name, sets, reps, duration } = req.body;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .insert([{ 
          user_id: Number(user_id), 
          name, 
          sets: Number(sets), 
          reps: Number(reps), 
          duration: Number(duration) 
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    // SQLite Fallback
    db.run(`
      INSERT INTO exercises (user_id, name, sets, reps, duration)
      VALUES (?, ?, ?, ?, ?)
    `, [user_id, name, sets, reps, duration], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
  }
});

app.listen(PORT, () => {
  console.log(`PulsePro Backend Server running on http://localhost:${PORT}`);
});
