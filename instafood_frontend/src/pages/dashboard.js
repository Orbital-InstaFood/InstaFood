import { useEffect, useState } from 'react';
import DisplayArray from '../functions/DisplayArray';
import DisplayPost from '../functions/DisplayPost'
import './Dashboard.css';
import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getUserInfo() {
            const user = auth.currentUser;
            const userRef = doc(db, "users", user.uid);

            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) {
                navigate("/createProfile");
                return;
            } else {
                const userDocData = userDoc.data();
                setUserProfile(userDocData);
                const allPosts = userDocData.postsToView.reverse();
                setAllPosts(allPosts);
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
        <div className="container">
        <p className="welcome-message">Welcome, {userProfile.userID}! Here's your personalised dashboard.</p>

                <DisplayArray array={allPosts} displayObjectFunc={c => {
                    return <DisplayPost
                        postID={c}
                        userOwnID={userProfile.userID} />
                }} />

        </div>
    );
}

export default Dashboard;
