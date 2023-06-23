import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../firebaseConf';

import listenerImplementer from '../../listeners/ListenerImplementer';

function EditProfile () {

    const navigate = useNavigate();

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);

    // State for subscriptions to fields in the user document
    const [username, setUserName] = useState('');
    const [bio, setBio] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);

    const [loading, setLoading] = useState(true);

    async function setupListeners() {
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);
    }

    function initializeUserInfo() {
        const userDoc = userDocListener.getCurrentDocument();

        setUserName(userDoc.username);
        setBio(userDoc.bio);
        setIsPrivate(userDoc.isPrivate);
    }

    const handleSubmitUserInfo = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', auth.currentUser.uid);

        await updateDoc(userRef, {
            username: username,
            bio: bio,
            isPrivate: isPrivate,
        });

        navigate('/dashboard');
    };

    useEffect(() => {
        setupListeners();
    }, []);

    useEffect(() => {
        // Check that the listener is fully set up before initializing the user info and subscriptions
        if (userDocListener) {
            initializeUserInfo();
            setLoading(false);
        }
    }, [userDocListener]);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div>
            <h2>Edit User Information</h2>

            <div>
                <label>Username</label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>

            <div>
                <label>Bio</label>
                <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>

            <div>
                <label>Set as private</label>
                <input
                    type="checkbox"
                    required
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                />
            </div>

            <button onClick={handleSubmitUserInfo}>Submit</button>

        </div>
    );
}

export default EditProfile;