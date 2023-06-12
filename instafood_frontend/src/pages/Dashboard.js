import { useEffect, useState } from 'react';
import DisplayPost from '../functions/DisplayPost'
import './Dashboard.css';
import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);

    const [loadedPosts, setLoadedPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const numOfPostsToLoad = 2;

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

                if (allPosts.length < numOfPostsToLoad) {
                    setLoadedPosts(allPosts);
                } else {
                    setLoadedPosts(allPosts.slice(0, numOfPostsToLoad));
                }

                setLoading(false);
            }
        }
        getUserInfo();
    }, []);

    function loadMorePosts() {
        const numOfPostsLoaded = loadedPosts.length;
        if (numOfPostsLoaded + numOfPostsToLoad > allPosts.length) {
            setLoadedPosts(allPosts);
            setHasMorePosts(false);
        } else {
            setLoadedPosts(loadedPosts.concat(allPosts.slice(numOfPostsLoaded, numOfPostsLoaded + numOfPostsToLoad)));
        }
    }

    if (loading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    if (loadedPosts.length === 0) {
        return (
            <div className="container">
                <p className="welcome-message">Welcome, {userProfile.userID}!</p>
            </div>
        );
    }

    return (
        <div className="container">
            <p className="welcome-message">Welcome, {userProfile.userID}!</p>
            <InfiniteScroll
                dataLength={loadedPosts.length}
                next={loadMorePosts}
                hasMore={hasMorePosts}
                loader={<p>Loading...</p>}
                endMessage={<p>No more posts to load.</p>}
            >

                {loadedPosts.map(postID => {
                    return <DisplayPost
                        postID={postID}
                        userOwnID={userProfile.userID} />
                }
                )}

            </InfiniteScroll>
        </div>
    );
}

export default Dashboard;
