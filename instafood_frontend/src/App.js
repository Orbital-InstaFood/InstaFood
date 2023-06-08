import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { auth } from './firebaseConf';

import Login from './authentication/login';
import Signup from './authentication/signup';
import Logout from './authentication/logout';

import Dashboard from './pages/Dashboard';
import UserInfo from './pages/UserInfo';
import NewPost from './pages/NewPost';
import Connect from './pages/Connect';
import ViewPosts from './pages/ViewPosts';

import Navbar from './Navbar';

import "./ButtonDesign/general.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  const DashboardButton = () => {
    return (
      <div>
        <button className="general-button">Dashboard</button>
        <Dashboard />
      </div>
    );
  };

  const NewPostButton = () => {
    return (
      <div>
        <button className="general-button">New Post</button>
        <NewPost />
      </div>
    );
  };

  const UserInfoButton = () => {
    return (
      <div>
        <button className="general-button">Edit Profile</button>
        <UserInfo />
      </div>
    );
  };

  const ConnectButton = () => {
    return (
      <div>
        <button className="general-button">Connect</button>
        <Connect />
      </div>
    );
  };

  const ViewPostsButton = () => {
    return (
      <div>
        <button className="general-button">ViewPosts</button>
        <ViewPosts />
      </div>
    );
  };

  if (user) {
    return (
      <div className="background-in-website">
      <div className="container-in-website">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<DashboardButton />} />
            <Route path="/newPost" element={<NewPostButton />} />
            <Route path="/editProfile" element={<UserInfoButton />} />
            <Route path="/connect" element={<ConnectButton />} />
            <Route path="/viewPosts" element={<ViewPostsButton />} />
          </Routes>
          <Logout />
        </Router>
      </div>
    </div>
    );
  }

  return (
    <div className="container-login-page">
      <h1 className="logo-login-page">InstaFood</h1>
        <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
