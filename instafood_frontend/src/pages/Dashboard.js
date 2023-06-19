import { useEffect, useState } from 'react';
import DisplayPostUI from '../functions/Post/DisplayPostUI'
import './Dashboard.css';
import { auth, db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import listenerImplementer from '../listeners/ListenerImplementer';

function Dashboard() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allPosts, setAllPosts] = useState([]);

    const [loadedPosts, setLoadedPosts] = useState([]);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const numOfPostsToLoad = 2;

    const [userDocListener, setUserDocListener] = useState(null);
    const [savedPosts, setSavedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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


    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {

        // Check that the listener is fully set up before setting up subscriptions,
        // and initializing userDoc and UserDocEditor
        if (userDocListener) {
            const unsubscribeFromSavedPosts = setupSubscriptions();
            setIsLoading(false);

            return () => {
                unsubscribeFromSavedPosts();
            }
            
        }

    }, [userDocListener]);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function setupSubscriptions() {
        const unsubscribeFromSavedPosts =
            userDocListener.subscribeToField('savedPosts',
                (savedPosts) => {
                    setSavedPosts(savedPosts);
                });

        return () => {
            unsubscribeFromSavedPosts();
        }
    }

    function loadMorePosts() {
        const numOfPostsLoaded = loadedPosts.length;
        if (numOfPostsLoaded + numOfPostsToLoad > allPosts.length) {
            setLoadedPosts(allPosts);
            setHasMorePosts(false);
        } else {
            setLoadedPosts(loadedPosts.concat(allPosts.slice(numOfPostsLoaded, numOfPostsLoaded + numOfPostsToLoad)));
        }
    }

    if (loading || isLoading) {
        return (
            <div>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <p className="welcome-message">Welcome, {userProfile.userID}!</p>
            { (loadedPosts.length !== 0 ) && <InfiniteScroll
                dataLength={loadedPosts.length}
                next={loadMorePosts}
                hasMore={hasMorePosts}
                loader={<p>Loading...</p>}
                endMessage={<p>No more posts to load.</p>}
            >

                {loadedPosts.map(postID => {
                    return <DisplayPostUI
                    key={postID}
                        postID={postID}
                        userOwnID={userProfile.userID} 
                        isAPersonalPost={false}
                        isASavedPost={savedPosts.includes(postID)}
                    />
                }
                )}

            </InfiniteScroll>
            }
        </div>
    );
}

export default Dashboard;
