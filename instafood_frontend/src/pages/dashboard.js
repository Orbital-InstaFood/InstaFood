import React from 'react';

function Dashboard( {user} ) {
    return (
        <div>
            <p>Dashboard</p>
            <p>Welcome, {user.email}</p>
        </div>
    );
}

export default Dashboard;