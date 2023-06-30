import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { auth } from './firebaseConf';

import Login from './authentication/login';
import SignUp from './authentication/signup';
import SignInAfterEmailVerification from './authentication/signInAfterEmailVerification';
import ForgotPassword from './authentication/forgotPassword';

import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/Profile/CreateProfile';
import ViewProfile from './pages/Profile/ViewProfileUI';
import NewPost from './pages/NewPost';
import ConnectUI from './pages/Connect/ConnectUI';
import ViewPosts from './pages/ViewPosts';
import ViewOtherUsers from './pages/ViewOtherUsers';
import EditProfile from './pages/Profile/EditProfile';

import Navbar from './Navbar';

import "./theme/ButtonDesign/general.css";
import PageNotFound from './pages/404';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <h1>InstaFood</h1>

      {user && user.emailVerified && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/signInAfterEmailVerification" element={<SignInAfterEmailVerification />} />
        {user && user.emailVerified ? (
          <>
            <Route path="/createProfile" element={<CreateProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/newPost" element={<NewPost />} />
            <Route path="/viewProfile" element={<ViewProfile />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/connect" element={<ConnectUI />} />
            <Route path="/viewPosts" element={<ViewPosts />} />
            <Route path="/:userID" element={<ViewOtherUsers />} />
          </>
        )
          : null}
          <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
