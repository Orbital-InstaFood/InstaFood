import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Logout from '../authentication/logout';

function Dashboard( {user} ) {
    return (
        <div>
            <p>Dashboard</p>
            <p>Welcome, {user.email}</p>
            <Logout />
        </div>
    );
}

export default Dashboard;