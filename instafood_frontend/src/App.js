import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './authentication/login';
import Signup from './authentication/signup';
import { auth } from './firebase';

import Dashboard from './pages/dashboard';
import UserInfo from './pages/UserInfo';
import NewPost from './pages/NewPost';
import Navbar from './Navbar';
import Logout from './authentication/logout';


function App() {
  // renders a login page if user is not logged in
  // renders a dashboard if user is logged in

  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  if (user) {
    return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/create" element={<NewPost />} />
          <Route path="/profile" element={<UserInfo user={user} />} />
        </Routes>
        <Logout />
      </Router>
    );
  }

  return (
    <div className="App">
      <Login />
      <Signup />
    </div>
  );
}

export default App;
