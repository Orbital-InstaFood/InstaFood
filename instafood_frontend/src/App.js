import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { auth } from './firebaseConf';

import Login from './authentication/login';
import SignUp from './authentication/signup';
import Logout from './authentication/logout';
import SignInAfterEmailVerification from './authentication/signInAfterEmailVerification';
import ForgotPassword from './authentication/forgotPassword';

import Dashboard from './pages/Dashboard';
import CreateProfile from './pages/CreateProfile';
import UserInfo from './pages/UserInfo';
import NewPost from './pages/NewPost';
import Connect from './pages/Connect';
import ViewOtherUsers from './pages/ViewOtherUsers';
import Navbar from './Navbar';

import PageNotFound from './pages/404';

function App() {
  const [user, setUser] = useState(null);

  function NavbarConditional() {
    const location = useLocation();
    const { pathname } = location;
  
    if (pathname === '/createProfile') {
      return null; 
    }
    return <Navbar />;
  }

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      <h1>InstaFood</h1>

      {user && user.emailVerified && <NavbarConditional />}

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
            <Route path="/editProfile" element={<UserInfo />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/:userID" element={<ViewOtherUsers />} />
          </>
        )
          : null}
          <Route path="*" element={<PageNotFound />} />
      </Routes>

      {user && user.emailVerified && <Logout /> }
    </Router>
  );
}

export default App;
