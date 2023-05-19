import React, { useEffect, useState } from 'react';
import getUserDoc from '../getUserDoc';

function Dashboard() {
    const [username, setUserName] = useState('');

    useEffect(() => {
        async function getUserInfo() {
            const userDoc = await getUserDoc();
            if (userDoc) {
                const data = userDoc.data();
                setUserName(data.username);
            }
        }
        getUserInfo();
    },[]);

    return (
        <div>
            <p>Dashboard</p>
            <p>Welcome, {username}</p>
        </div>
    );
}

export default Dashboard;