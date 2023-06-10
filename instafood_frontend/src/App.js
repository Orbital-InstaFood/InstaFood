import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { auth } from './firebaseConf';

import Login from './authentication/login';
import Signup from './authentication/signup';
import Logout from './authentication/logout';
import SignInAfterEmailVerification from './authentication/signInAfterEmailVerification';
import ForgotPassword from './authentication/forgotPassword';

import Dashboard from './pages/Dashboard';
import UserInfo from './pages/UserInfo';
import NewPost from './pages/NewPost';
import Connect from './pages/Connect';
import ViewOtherUsers from './pages/ViewOtherUsers';
import Navbar from './Navbar';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  if (user && user.emailVerified) {
    return (
      <Router>
        <h1>InstaFood</h1>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/newPost" element={<NewPost />} />
          <Route path="/editProfile" element={<UserInfo />} />
          <Route path="/connect" element={<Connect />} />
          <Route exact path="/:userID" element={<ViewOtherUsers />} />

        </Routes>
        <Logout />
      </Router>
    );
  }

  return (
    <Router>
      <h1>InstaFood</h1>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signInAfterEmailVerification" element={<SignInAfterEmailVerification />} />
      </Routes>
    </Router>
  );
}

export default App;
