import { useEffect, useState } from 'react';
import getUserDoc from '../functions/getUserDoc';
import './Dashboard.css';


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
        <div className="container">
        <p className="welcome-message">Welcome, {username}! Here's your personalised dashboard.</p>
        </div>
    );
}

export default Dashboard;