import { useEffect, useState } from 'react';
import getUserDoc from '../functions/getUserDoc';

import {functions} from '../firebaseConf'
import { httpsCallable } from 'firebase/functions';

function Dashboard() {
    const [username, setUserName] = useState('');

    const test = httpsCallable(functions, 'test');

    useEffect(() => {
        async function getUserInfo() {
            const result = await test();
            console.log(result.data.result);
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