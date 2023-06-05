import { useEffect, useState } from 'react';
import getUserDoc from '../functions/getUserDoc';
import DisplayArray from '../functions/DisplayArray';
import DisplayPost from '../functions/DisplayPost'

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUserInfo() {
            const userDoc = await getUserDoc();
            if (userDoc) {
                setUserProfile(userDoc.data());
                setLoading(false);
            }
        }
        getUserInfo();
    }, []);

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>
            <p>Dashboard</p>
            <p>Welcome, {userProfile.username}!</p>

            <DisplayArray array={userProfile.postsToView} displayObjectFunc={postID =>
                <DisplayPost
                    postID={postID}
                    userOwnID={userProfile.userID} />}
            />
        </div>
    );
}

export default Dashboard;