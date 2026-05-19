import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Apple, ArrowLeft, ArrowRight, Award, 
  ChevronRight, Dumbbell, Eye, EyeOff, Flame, 
  Heart, Home, Lock, LogIn, LogOut, MapPin, 
  Menu, MessageSquare, Phone, Plus, RefreshCw, 
  Send, Smile, User, Users, Utensils, Calendar, Trash2, Settings
} from 'lucide-react';
import './App.css';

// Fallback Local Storage Database (if API is not running)
const DEFAULT_USER_DATA = {
  id: 2,
  role: 'user',
  username: 'Yuvindu',
  email: 'Yu.ccpa@hotmail.com',
  first_name: 'Yuvindu',
  last_name: 'Senanayake',
  dob: '2003-07-14',
  address: 'Colombo, Sri Lanka',
  tel_no: '0771234567',
  height: 172,
  weight: 76,
  age: 23,
  location: 'Sri Lanka',
  profile_pic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'
};

const DEFAULT_TRAINER_DATA = {
  id: 1,
  role: 'trainer',
  username: 'Trainer123',
  email: 'trainer@pulsepro.com',
  first_name: 'John',
  last_name: 'Doe',
  profile_pic: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150'
};

const INITIAL_MESSAGES = [
  { id: 1, sender_id: 1, receiver_id: 2, message: 'Welcome to PulsePro! I am John, your personal trainer.', timestamp: '2026-05-19T20:00:00.000Z' },
  { id: 2, sender_id: 2, receiver_id: 1, message: 'Hi John! Glad to connect. I want to improve my overall fitness and maintain a healthy weight.', timestamp: '2026-05-19T20:05:00.000Z' },
  { id: 3, sender_id: 1, receiver_id: 2, message: 'Great goal! Let us start by looking at your current height and weight. I see you are 172cm and 76kg, giving you a BMI of 25.7. We should target a normal range (under 25).', timestamp: '2026-05-19T20:10:00.000Z' }
];

const INITIAL_DIETS = [
  { id: 1, user_id: 2, day: 'Monday', meal_type: 'Breakfast', items: 'Oatmeal with bananas and honey, Egg whites', calories: 350 },
  { id: 2, user_id: 2, day: 'Monday', meal_type: 'Lunch', items: 'Grilled chicken breast with brown rice and broccoli', calories: 550 },
  { id: 3, user_id: 2, day: 'Monday', meal_type: 'Dinner', items: 'Baked salmon with sweet potato and steamed asparagus', calories: 480 },
  { id: 4, user_id: 2, day: 'Monday', meal_type: 'Snack', items: 'Greek yogurt with mixed berries, Almonds', calories: 200 }
];

const INITIAL_EXERCISES = [
  { id: 1, user_id: 2, name: 'Treadmill Jogging', sets: 1, reps: 1, duration: 30 },
  { id: 2, user_id: 2, name: 'Dumbbell Bicep Curls', sets: 3, reps: 12, duration: 15 },
  { id: 3, user_id: 2, name: 'Push-Ups', sets: 4, reps: 15, duration: 10 },
  { id: 4, user_id: 2, name: 'Barbell Squats', sets: 4, reps: 10, duration: 20 }
];

const API_BASE = 'http://localhost:5000/api';

// Helper to calculate age from date of birth
const calculateAge = (dobString) => {
  if (!dobString) return 23;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return 23;
  const today = new Date();
  let calculatedAge = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    calculatedAge--;
  }
  return calculatedAge;
};

function App() {
  // App States
  const [screen, setScreen] = useState('splash'); // 'splash', 'login', 'register', 'dashboard', 'bmi', 'diet', 'exercise', 'calories', 'community', 'profile', 'trainer-chat'
  const [currentUser, setCurrentUser] = useState(null);
  const [isTrainerMode, setIsTrainerMode] = useState(false); // role toggle on login
  
  // Auth Form States
  const [username, setUsername] = useState('Yuvindu');
  const [password, setPassword] = useState('password123');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // DB Mode Tracker
  const [isUsingServer, setIsUsingServer] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [showDebug, setShowDebug] = useState(false);

  // Health Metrics Form
  const [height, setHeight] = useState(172);
  const [weight, setWeight] = useState(76);
  const [age, setAge] = useState(23);
  const [location, setLocation] = useState('Sri Lanka');

  // Profile Details Form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [telNo, setTelNo] = useState('');
  const [email, setEmail] = useState('');

  // Chat/Trainer states
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const chatBottomRef = useRef(null);

  // Diet / Exercise / Calories state
  const [diets, setDiets] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [newMeal, setNewMeal] = useState({ type: 'Snack', items: '', calories: 150 });
  const [newExercise, setNewExercise] = useState({ name: '', sets: 3, reps: 10, duration: 15 });
  const [showMealModal, setShowMealModal] = useState(false);
  const [showExerciseModal, setShowExerciseModal] = useState(false);

  // Community Mock Board
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Yuvindu',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      time: '2 hours ago',
      text: 'Just finished my heavy squats routine assigned by Coach John! Feeling amazing. Reached my new Personal Record today! 🏋️‍♂️💪',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500',
      likes: 12,
      comments: 3,
      liked: false
    },
    {
      id: 2,
      author: 'Trainer John',
      avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150',
      time: '5 hours ago',
      text: 'Consistency is the key to progress. Make sure to log your diet plan items today and complete your hydration levels! Let\'s go Team PulsePro!',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
      likes: 24,
      comments: 5,
      liked: true
    }
  ]);
  const [newPostText, setNewPostText] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // Initialize and check Server connectivity
  useEffect(() => {
    checkServerConnection();
    // Load local storage fallbacks if server offline
    if (!localStorage.getItem('pulsepro_users')) {
      localStorage.setItem('pulsepro_users', JSON.stringify([DEFAULT_USER_DATA, DEFAULT_TRAINER_DATA]));
      localStorage.setItem('pulsepro_messages', JSON.stringify(INITIAL_MESSAGES));
      localStorage.setItem('pulsepro_diets', JSON.stringify(INITIAL_DIETS));
      localStorage.setItem('pulsepro_exercises', JSON.stringify(INITIAL_EXERCISES));
    }
  }, []);

  const checkServerConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile/2`);
      if (res.ok) {
        setIsUsingServer(true);
        setServerStatus('Connected to Express & SQLite Backend');
      } else {
        throw new Error('Server returned error');
      }
    } catch (e) {
      setIsUsingServer(false);
      setServerStatus('Server Offline. Running in Local SQLite-Mock Database.');
    }
  };

  // Sync profile details states once logged in
  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.first_name || '');
      setLastName(currentUser.last_name || '');
      setDob(currentUser.dob || '');
      setAddress(currentUser.address || '');
      setTelNo(currentUser.tel_no || '');
      setEmail(currentUser.email || '');
      setHeight(currentUser.height || 172);
      setWeight(currentUser.weight || 76);
      setAge(calculateAge(currentUser.dob) || currentUser.age || 23);
      setLocation(currentUser.location || 'Sri Lanka');
      
      // Load user plans & messages
      fetchUserPlansAndMessages(currentUser);
    }
  }, [currentUser, isUsingServer]);

  // Update age dynamically whenever dob changes
  useEffect(() => {
    if (dob) {
      const calculated = calculateAge(dob);
      setAge(calculated);
    }
  }, [dob]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, screen]);

  // Polling chat every 3 seconds if inside chat
  useEffect(() => {
    let interval;
    if (currentUser && (screen === 'trainer-chat') ) {
      interval = setInterval(() => {
        fetchChatMessages();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [screen, currentUser, selectedClient]);

  const fetchUserPlansAndMessages = async (user) => {
    if (isUsingServer) {
      try {
        // Fetch Diets
        const dietRes = await fetch(`${API_BASE}/diets/${user.id}`);
        if (dietRes.ok) setDiets(await dietRes.json());

        // Fetch Exercises
        const execRes = await fetch(`${API_BASE}/exercises/${user.id}`);
        if (execRes.ok) setExercises(await execRes.json());

        // Fetch Clients (if trainer)
        if (user.role === 'trainer') {
          const clientRes = await fetch(`${API_BASE}/trainer/${user.id}/clients`);
          if (clientRes.ok) setClients(await clientRes.json());
        }
      } catch (e) {
        console.error('Error fetching plans', e);
      }
    } else {
      // Local fallbacks
      const localDiets = JSON.parse(localStorage.getItem('pulsepro_diets') || '[]');
      const localExercises = JSON.parse(localStorage.getItem('pulsepro_exercises') || '[]');
      setDiets(localDiets.filter(d => d.user_id === user.id));
      setExercises(localExercises.filter(e => e.user_id === user.id));

      if (user.role === 'trainer') {
        const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
        setClients(localUsers.filter(u => u.role === 'user'));
      }
    }
    
    // Fetch Chat Messages
    fetchChatMessages(user);
  };

  const fetchChatMessages = async (userObj = currentUser) => {
    if (!userObj) return;

    let userId, trainerId;
    if (userObj.role === 'trainer') {
      if (!selectedClient) return;
      userId = selectedClient.id;
      trainerId = userObj.id;
    } else {
      userId = userObj.id;
      trainerId = 1; // Default Coach John
    }

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/chat/messages?user_id=${userId}&trainer_id=${trainerId}`);
        if (res.ok) setMessages(await res.json());
      } catch (e) {
        console.error('Error loading chat messages', e);
      }
    } else {
      const localMsgs = JSON.parse(localStorage.getItem('pulsepro_messages') || '[]');
      const filtered = localMsgs.filter(
        m => (m.sender_id === userId && m.receiver_id === trainerId) || 
             (m.sender_id === trainerId && m.receiver_id === userId)
      );
      setMessages(filtered);
    }
  };

  // Auth Operations
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const targetRole = isTrainerMode ? 'trainer' : 'user';

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, role: targetRole })
        });
        const data = await res.json();
        if (res.ok) {
          setCurrentUser(data.user);
          setScreen('dashboard');
        } else {
          setErrorMsg(data.error || 'Authentication failed');
        }
      } catch (err) {
        setErrorMsg('Network error connecting to API');
      }
    } else {
      // Local Database Fallback Logic
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const match = localUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() && 
             u.password === password && 
             u.role === targetRole
      );
      if (match) {
        setCurrentUser(match);
        setScreen('dashboard');
      } else {
        setErrorMsg('Invalid login details for ' + targetRole);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regUsername || !regPassword) {
      setErrorMsg('Please fill in username and password');
      return;
    }

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: regRole,
            username: regUsername,
            password: regPassword,
            email: regEmail,
            first_name: regUsername
          })
        });
        const data = await res.json();
        if (res.ok) {
          setCurrentUser(data.user);
          setScreen('dashboard');
        } else {
          setErrorMsg(data.error || 'Registration failed');
        }
      } catch (err) {
        setErrorMsg('Network error connecting to registration API');
      }
    } else {
      // Local storage db signup
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const exists = localUsers.find(u => u.username.toLowerCase() === regUsername.toLowerCase());
      if (exists) {
        setErrorMsg('Username already exists');
        return;
      }

      const newUserObj = {
        id: localUsers.length + 1,
        role: regRole,
        username: regUsername,
        password: regPassword,
        email: regEmail,
        first_name: regUsername,
        last_name: '',
        height: 172,
        weight: 76,
        age: 23,
        location: 'Sri Lanka',
        profile_pic: regRole === 'trainer' 
          ? 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150'
          : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      };

      localUsers.push(newUserObj);
      localStorage.setItem('pulsepro_users', JSON.stringify(localUsers));
      setCurrentUser(newUserObj);
      setScreen('dashboard');
    }
  };

  // Update Health Metrics
  const handleUpdateHealth = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/health-metrics/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ height, weight, age, location })
        });
        if (res.ok) {
          const updatedUser = { ...currentUser, height, weight, age, location };
          setCurrentUser(updatedUser);
          alert('Metrics saved successfully!');
        }
      } catch (err) {
        alert('Failed to save to database server');
      }
    } else {
      // Local DB Update
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const idx = localUsers.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        localUsers[idx].height = Number(height);
        localUsers[idx].weight = Number(weight);
        localUsers[idx].age = Number(age);
        localUsers[idx].location = location;
        localStorage.setItem('pulsepro_users', JSON.stringify(localUsers));
        
        setCurrentUser({ ...currentUser, height: Number(height), weight: Number(weight), age: Number(age), location });
        alert('Metrics saved successfully in Local Database!');
      }
    }
  };

  // Update Profile Details
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const calculatedAge = calculateAge(dob);

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/profile/${currentUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            dob,
            address,
            tel_no: telNo,
            email,
            username: currentUser.username
          })
        });
        if (res.ok) {
          const updatedUser = { 
            ...currentUser, first_name: firstName, last_name: lastName, dob, address, tel_no: telNo, email, age: calculatedAge
          };
          setCurrentUser(updatedUser);
          alert('Profile details saved to SQLite Database!');
        }
      } catch (err) {
        alert('Failed to update server profile');
      }
    } else {
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const idx = localUsers.findIndex(u => u.id === currentUser.id);
      if (idx !== -1) {
        localUsers[idx].first_name = firstName;
        localUsers[idx].last_name = lastName;
        localUsers[idx].dob = dob;
        localUsers[idx].address = address;
        localUsers[idx].tel_no = telNo;
        localUsers[idx].email = email;
        localUsers[idx].age = calculatedAge;
        localStorage.setItem('pulsepro_users', JSON.stringify(localUsers));
        
        setCurrentUser({ 
          ...currentUser, first_name: firstName, last_name: lastName, dob, address, tel_no: telNo, email, age: calculatedAge
        });
        alert('Profile saved to Local Database!');
      }
    }
  };

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !currentUser) return;

    let receiverId;
    if (currentUser.role === 'trainer') {
      if (!selectedClient) return;
      receiverId = selectedClient.id;
    } else {
      receiverId = 1; // Default Trainer John
    }

    const payload = {
      sender_id: currentUser.id,
      receiver_id: receiverId,
      message: chatInput
    };

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/chat/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const sentMsg = await res.json();
          setMessages([...messages, sentMsg]);
          setChatInput('');
        }
      } catch (e) {
        console.error('Send message failed', e);
      }
    } else {
      const localMsgs = JSON.parse(localStorage.getItem('pulsepro_messages') || '[]');
      const newMsg = {
        id: localMsgs.length + 1,
        sender_id: currentUser.id,
        receiver_id: receiverId,
        message: chatInput,
        timestamp: new Date().toISOString()
      };
      localMsgs.push(newMsg);
      localStorage.setItem('pulsepro_messages', JSON.stringify(localMsgs));
      setMessages([...messages, newMsg]);
      setChatInput('');
    }
  };

  // Plan Modification Operations
  const handleAddMeal = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: currentUser.id,
      day: selectedDay,
      meal_type: newMeal.type,
      items: newMeal.items,
      calories: Number(newMeal.calories)
    };

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/diets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setDiets([...diets, { ...payload, id: data.id }]);
          setNewMeal({ type: 'Snack', items: '', calories: 150 });
          setShowMealModal(false);
        }
      } catch (e) {
        console.error('Diet add failed', e);
      }
    } else {
      const localDiets = JSON.parse(localStorage.getItem('pulsepro_diets') || '[]');
      const newD = {
        id: localDiets.length + 1,
        ...payload
      };
      localDiets.push(newD);
      localStorage.setItem('pulsepro_diets', JSON.stringify(localDiets));
      setDiets([...diets, newD]);
      setNewMeal({ type: 'Snack', items: '', calories: 150 });
      setShowMealModal(false);
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: currentUser.id,
      name: newExercise.name,
      sets: Number(newExercise.sets),
      reps: Number(newExercise.reps),
      duration: Number(newExercise.duration)
    };

    if (isUsingServer) {
      try {
        const res = await fetch(`${API_BASE}/exercises`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          setExercises([...exercises, { ...payload, id: data.id }]);
          setNewExercise({ name: '', sets: 3, reps: 10, duration: 15 });
          setShowExerciseModal(false);
        }
      } catch (e) {
        console.error('Exercise add failed', e);
      }
    } else {
      const localExercises = JSON.parse(localStorage.getItem('pulsepro_exercises') || '[]');
      const newEx = {
        id: localExercises.length + 1,
        ...payload
      };
      localExercises.push(newEx);
      localStorage.setItem('pulsepro_exercises', JSON.stringify(localExercises));
      setExercises([...exercises, newEx]);
      setNewExercise({ name: '', sets: 3, reps: 10, duration: 15 });
      setShowExerciseModal(false);
    }
  };

  // Add post to community
  const handleAddPost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newP = {
      id: posts.length + 1,
      author: currentUser ? currentUser.username : 'Guest User',
      avatar: currentUser ? currentUser.profile_pic : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      time: 'Just now',
      text: newPostText,
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500',
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([newP, ...posts]);
    setNewPostText('');
    setShowPostModal(false);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
          liked: !p.liked
        };
      }
      return p;
    }));
  };

  // Quick testing logs (Master WOW Desktop Panel hooks)
  const quickLogInAsYuvindu = () => {
    setIsTrainerMode(false);
    setUsername('Yuvindu');
    setPassword('password123');
    // Mimic click login
    setTimeout(() => {
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const y = localUsers.find(u => u.username === 'Yuvindu');
      if (y) {
        setCurrentUser(y);
        setScreen('dashboard');
      }
    }, 100);
  };

  const quickLogInAsTrainer = () => {
    setIsTrainerMode(true);
    setUsername('Trainer123');
    setPassword('trainer123');
    // Mimic click login
    setTimeout(() => {
      const localUsers = JSON.parse(localStorage.getItem('pulsepro_users') || '[]');
      const t = localUsers.find(u => u.username === 'Trainer123');
      if (t) {
        setCurrentUser(t);
        setScreen('dashboard');
      }
    }, 100);
  };

  // BMI calculations
  const parsedWeight = Number(weight) || 0;
  const parsedHeight = Number(height) || 0;
  const rawBMI = parsedHeight > 0 ? (parsedWeight / Math.pow(parsedHeight / 100, 2)) : 0;
  const bmiString = rawBMI.toFixed(1);

  let bmiCategory = 'Under Weight';
  let bmiCategoryClass = 'underweight';
  if (rawBMI >= 18 && rawBMI < 25) {
    bmiCategory = 'Normal Weight';
    bmiCategoryClass = 'normal';
  } else if (rawBMI >= 25 && rawBMI < 30) {
    bmiCategory = 'Over Weight';
    bmiCategoryClass = 'overweight';
  } else if (rawBMI >= 30) {
    bmiCategory = 'Obese';
    bmiCategoryClass = 'obese';
  }

  // Daily Calories tracker math
  const loggedCalories = diets.reduce((acc, curr) => acc + (curr.calories || 0), 0);
  const targetCalories = 2200;
  const caloriePercent = Math.min(100, Math.round((loggedCalories / targetCalories) * 100));

  const burnedCalories = exercises.reduce((acc, curr) => acc + (curr.duration * 7.5 || 0), 0); // 7.5 cals/min avg
  const burnTarget = 500;
  const burnPercent = Math.min(100, Math.round((burnedCalories / burnTarget) * 100));

  return (
    <div className="app-viewport">
      
      {/* Sleek Floating Developer Settings / Debug Panel */}
      <div className={`debug-drawer ${showDebug ? 'open' : ''}`}>
        <button className="debug-toggle-btn" onClick={() => setShowDebug(!showDebug)}>
          <Settings size={16} />
          <span>{showDebug ? 'Hide Dev Tools' : 'Dev Tools'}</span>
        </button>
        {showDebug && (
          <div className="debug-content">
            <div className="debug-section">
              <span className="debug-label">Database Mode:</span>
              <span className="debug-badge">{serverStatus}</span>
            </div>
            <div className="debug-section">
              <span className="debug-label">Quick Sign-In:</span>
              <div className="debug-actions">
                <button onClick={quickLogInAsYuvindu} className="debug-btn debug-btn-primary">
                  Athlete Yuvindu
                </button>
                <button onClick={quickLogInAsTrainer} className="debug-btn debug-btn-secondary">
                  Trainer John
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Responsive Web App Shell */}
      <div className="app-content-container">
        <div className="app-container">
            
            {/* 1. SPLASH / WELCOME SCREEN */}
            {screen === 'splash' && (
              <div className="splash-screen fade-in">
                <div className="splash-logo-container">
                  <h1 className="splash-logo">Pulse<span>Pro</span></h1>
                </div>
                <div className="splash-info">
                  <h2 className="splash-title">Wherever You Are Health Is Number One</h2>
                  <p className="splash-subtitle">There is no instant way to a healthy life</p>
                  
                  <div className="pagination-dots">
                    <div className="pag-dot"></div>
                    <div className="pag-dot"></div>
                    <div className="pag-dot active"></div>
                  </div>

                  <button 
                    className="btn-large interactive" 
                    onClick={() => setScreen('login')}
                  >
                    Get Started <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* 2. LOGIN SCREEN */}
            {screen === 'login' && (
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
                      <label>Username</label>
                      <div className="input-wrapper">
                        <span className="input-icon-left"><User size={18} /></span>
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="app-input" 
                          placeholder="Username1122" 
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
            )}

            {/* REGISTER SCREEN */}
            {screen === 'register' && (
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
            )}

            {/* 3. HOME SCREEN DASHBOARD */}
            {screen === 'dashboard' && currentUser && (
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
                      // Automatically select first client if none selected
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
            )}

            {/* 4. HEALTH DETAILS & BMI SCREEN */}
            {screen === 'bmi' && currentUser && (
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
                      <span style={{ fontSize: '0.65rem', textAlign: 'center', opacity: '0.8', fontStyle: 'italic' }}>Interactive BMI indicator represents your placement</span>
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
                        />
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
            )}

            {/* 5. USER PROFILE SCREEN */}
            {screen === 'profile' && currentUser && (
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
            )}

            {/* 6. TRAINER CHAT / ASSISTANT SCREEN */}
            {screen === 'trainer-chat' && currentUser && (
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
            )}

            {/* 7. DIET PLANS SCREEN */}
            {screen === 'diet' && currentUser && (
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
            )}

            {/* 8. EXERCISE PLANS SCREEN */}
            {screen === 'exercise' && currentUser && (
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
            )}

            {/* 9. CALORY METER SCREEN */}
            {screen === 'calories' && currentUser && (
              <div className="app-screen fade-in" style={{ background: '#0d0e12' }}>
                <div className="sub-header">
                  <button className="back-btn" onClick={() => setScreen('dashboard')}>
                    <ArrowLeft size={20} />
                  </button>
                  <span className="sub-header-title">Calory Meter</span>
                  <div style={{ width: '20px' }}></div>
                </div>

                <div className="scroll-content">
                  
                  {/* Visual SVG Progress Ring */}
                  <div className="calories-rings-container">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {/* Background track circle */}
                      <circle cx="100" cy="100" r="80" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="12" fill="none" />
                      
                      {/* Calories Consumed active ring */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        stroke="var(--primary)" 
                        strokeWidth="12" 
                        fill="none" 
                        strokeDasharray={`${2 * Math.PI * 80}`}
                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - caloriePercent / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />

                      {/* Burned calories background track circle */}
                      <circle cx="100" cy="100" r="60" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="10" fill="none" />

                      {/* Burned active ring */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="60" 
                        stroke="#10b981" 
                        strokeWidth="10" 
                        fill="none" 
                        strokeDasharray={`${2 * Math.PI * 60}`}
                        strokeDashoffset={`${2 * Math.PI * 60 * (1 - burnPercent / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                      />

                      {/* Center stats */}
                      <text x="100" y="95" fontSize="24" fontWeight="extrabold" fill="#fff" textAnchor="middle" fontFamily="var(--font-heading)">
                        {loggedCalories}
                      </text>
                      <text x="100" y="115" fontSize="10" fill="var(--text-secondary)" textAnchor="middle">
                        of {targetCalories} kcal
                      </text>
                      <text x="100" y="130" fontSize="10" fontWeight="bold" fill="var(--primary)" textAnchor="middle">
                        Consumed
                      </text>
                    </svg>
                  </div>

                  {/* Summary row boxes */}
                  <div className="calories-summary-grid">
                    <div className="calorie-stat-box">
                      <span className="calorie-stat-label">Consumed Today</span>
                      <div className="calorie-stat-value" style={{ color: 'var(--primary)' }}>{loggedCalories} kcal</div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: {targetCalories}</span>
                    </div>

                    <div className="calorie-stat-box">
                      <span className="calorie-stat-label">Burned in Workouts</span>
                      <div className="calorie-stat-value" style={{ color: '#10b981' }}>{burnedCalories} kcal</div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Target: {burnTarget}</span>
                    </div>
                  </div>

                  {/* Quick details */}
                  <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '10px' }}>Daily Health Recommendations</div>
                    <ul style={{ paddingLeft: '16px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
                      <li>Ensure protein intake of at least 1.6g per kg of bodyweight (approx 120g).</li>
                      <li>Based on your BMI ({bmiString}), maintain a calorie deficit of 300 kcal for safe weight management.</li>
                      <li>Drink 3.5 liters of clean water daily.</li>
                    </ul>
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
              </div>
            )}

            {/* 10. COMMUNITY SCREEN */}
            {screen === 'community' && currentUser && (
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
                    style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
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
            )}

          </div>

        </div>
      </div>
  );
}

export default App;
