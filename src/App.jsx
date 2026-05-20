import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Apple, ArrowLeft, ArrowRight, Award, 
  ChevronRight, Dumbbell, Eye, EyeOff, Flame, 
  Heart, Home, Lock, LogIn, LogOut, MapPin, 
  Menu, MessageSquare, Phone, Plus, RefreshCw, 
  Send, Smile, User, Users, Utensils, Calendar, Trash2, Settings
} from 'lucide-react';
import './App.css';

// Import split-out screen components
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import BMIScreen from './screens/BMIScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrainerChatScreen from './screens/TrainerChatScreen';
import DietScreen from './screens/DietScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import CaloriesScreen from './screens/CaloriesScreen';
import CommunityScreen from './screens/CommunityScreen';

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
        u => (u.username.toLowerCase() === username.toLowerCase() || (u.email && u.email.toLowerCase() === username.toLowerCase())) && 
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
    if (!regUsername || !regPassword || !regEmail) {
      setErrorMsg('Please fill in username, email, and password');
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
        <div className="app-container">            {screen === 'splash' && <SplashScreen setScreen={setScreen} />}
            {screen === 'login' && (
              <LoginScreen
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                isTrainerMode={isTrainerMode}
                setIsTrainerMode={setIsTrainerMode}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                handleLogin={handleLogin}
                setScreen={setScreen}
              />
            )}
            {screen === 'register' && (
              <RegisterScreen
                errorMsg={errorMsg}
                setErrorMsg={setErrorMsg}
                regRole={regRole}
                setRegRole={setRegRole}
                regUsername={regUsername}
                setRegUsername={setRegUsername}
                regEmail={regEmail}
                setRegEmail={setRegEmail}
                regPassword={regPassword}
                setRegPassword={setRegPassword}
                handleRegister={handleRegister}
                setScreen={setScreen}
              />
            )}
            {screen === 'dashboard' && currentUser && (
              <DashboardScreen
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setScreen={setScreen}
                clients={clients}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
              />
            )}
            {screen === 'bmi' && currentUser && (
              <BMIScreen
                currentUser={currentUser}
                setScreen={setScreen}
                rawBMI={rawBMI}
                bmiString={bmiString}
                bmiCategory={bmiCategory}
                bmiCategoryClass={bmiCategoryClass}
                height={height}
                setHeight={setHeight}
                weight={weight}
                setWeight={setWeight}
                age={age}
                setAge={setAge}
                location={location}
                setLocation={setLocation}
                handleUpdateHealth={handleUpdateHealth}
              />
            )}
            {screen === 'profile' && currentUser && (
              <ProfileScreen
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                setScreen={setScreen}
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                dob={dob}
                setDob={setDob}
                address={address}
                setAddress={setAddress}
                telNo={telNo}
                setTelNo={setTelNo}
                handleUpdateProfile={handleUpdateProfile}
              />
            )}
            {screen === 'trainer-chat' && currentUser && (
              <TrainerChatScreen
                currentUser={currentUser}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                setScreen={setScreen}
                messages={messages}
                chatBottomRef={chatBottomRef}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleSendMessage={handleSendMessage}
              />
            )}
            {screen === 'diet' && currentUser && (
              <DietScreen
                currentUser={currentUser}
                setScreen={setScreen}
                diets={diets}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                showMealModal={showMealModal}
                setShowMealModal={setShowMealModal}
                newMeal={newMeal}
                setNewMeal={setNewMeal}
                handleAddMeal={handleAddMeal}
              />
            )}
            {screen === 'exercise' && currentUser && (
              <ExerciseScreen
                currentUser={currentUser}
                setScreen={setScreen}
                exercises={exercises}
                showExerciseModal={showExerciseModal}
                setShowExerciseModal={setShowExerciseModal}
                newExercise={newExercise}
                setNewExercise={setNewExercise}
                handleAddExercise={handleAddExercise}
              />
            )}
            {screen === 'calories' && currentUser && (
              <CaloriesScreen
                currentUser={currentUser}
                setScreen={setScreen}
                caloriePercent={caloriePercent}
                burnPercent={burnPercent}
                loggedCalories={loggedCalories}
                targetCalories={targetCalories}
                burnedCalories={burnedCalories}
                burnTarget={burnTarget}
                bmiString={bmiString}
              />
            )}
            {screen === 'community' && currentUser && (
              <CommunityScreen
                currentUser={currentUser}
                setScreen={setScreen}
                posts={posts}
                handleLikePost={handleLikePost}
                showPostModal={showPostModal}
                setShowPostModal={setShowPostModal}
                newPostText={newPostText}
                setNewPostText={setNewPostText}
                handleAddPost={handleAddPost}
              />
            )}
          </div>

        </div>
      </div>
  );
}

export default App;
