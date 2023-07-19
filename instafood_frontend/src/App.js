import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConf';

import Login from './authentication/login';
import SignUp from './authentication/signup';
import SignInAfterEmailVerification from './authentication/signInAfterEmailVerification';
import ForgotPassword from './authentication/forgotPassword';

import Dashboard from './pages/Dashboard/Dashboard';
import CreateProfile from './pages/Profile/Create/CreateProfile';
import ViewProfile from './pages/Profile/View/ViewProfileUI';
import NewPost from './pages/Create/NewPost';
import ConnectUI from './pages/Connect/ConnectUI';
import Explore from './pages/Explore/Explore';
import ViewOtherUsers from './pages/ViewOtherUsers/ViewOtherUsers';
import EditProfile from './pages/Profile/Edit/EditProfile';
import EventUI from './pages/Event/EventUI';

import Navbar from './Navbar';
import PageNotFound from './pages/404';

import backgroundImage from './theme/login_background.jpg';
import inWebBackgroundImage from './theme/inWeb_background.jpg';

import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAuthPage =
    window.location.pathname === '/' ||
    window.location.pathname === '/signup' ||
    window.location.pathname === '/forgotPassword' ||
    window.location.pathname === '/signInAfterEmailVerification';
    const pageTitle = isAuthPage ? 'InstaFood | Join a Community of Food Lovers!' : '';
    const titleClassName = isAuthPage ? 'auth-title' : 'other-title';

  return (
    <Router>
      <div
        className="app-container"
        style={{
          backgroundImage: `url(${isAuthPage ? backgroundImage : inWebBackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className={titleClassName}>{pageTitle}</h1>

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
              <Route path="/explore" element={<Explore />} />
              <Route path="/viewOtherUsers" element={<ViewOtherUsers />} />
              <Route path="/event" element={<EventUI />} />
            </>
          ) : null}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
