import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';

import Login from './authentication/login';
import Signup from './authentication/signup';
import Logout from './authentication/logout';

function App() {
  return (
    <div className="App">
      <p>Instafood</p>
      <Login />
      <Signup />
      <Logout />
    </div>
  );
}

export default App;
