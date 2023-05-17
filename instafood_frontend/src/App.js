import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db, storage, auth } from './firebase';

function App() {
  return (
    <div className="App">
      <p>Instafood</p>
    </div>
  );
}

export default App;
