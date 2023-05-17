import './App.css';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './authentication/login';
import Signup from './authentication/signup';
import { auth } from './firebase';

import Dashboard from './pages/dashboard';

function App() {
  // renders a login page if user is not logged in
  // renders a dashboard if user is logged in

  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
  }, []);

  return (
    <div className="App">
      {user ?
        (<Dashboard user={user} />) :
        (
          <div>
            <Login />
            <Signup />
          </div>
        )
      }
    </div>
  );
}

export default App;
