import { useEffect, useState } from 'react';
import getUserDoc from '../functions/getUserDoc';
import DisplayArray from '../functions/DisplayArray';
import DisplayPost from '../functions/DisplayPost'

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        async function getUserInfo() {
            const userDoc = await getUserDoc();
            const userDocData = userDoc.data();
            setUserProfile(userDocData);

            const allPosts = userDocData.postsToView.reverse();
            setAllPosts(allPosts);

            setLoading(false);
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
        <div >
            <p>Dashboard</p>
            <p>Welcome, {userProfile.username}!</p>

                <DisplayArray array={allPosts} displayObjectFunc={c => {
                    return <DisplayPost
                        postID={c}
                        userOwnID={userProfile.userID} />
                }} />

        </div>
    );
}

export default Dashboard;