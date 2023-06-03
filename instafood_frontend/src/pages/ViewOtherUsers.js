import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { db, auth, functions } from '../firebaseConf';
import { getDoc, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import DisplayArray from '../functions/DisplayArray';
import DisplayUserLink from '../functions/DisplayUserLink';
import DisplayPost from '../functions/DisplayPost';


// Display a user's profile based on his userID

function ViewOtherUsers() {
    const navigate = useNavigate();

    const userUID = auth.currentUser.uid;
    const userOwnRef = doc(db, 'users', userUID);
    const [userOwnID, setUserOwnID] = useState(null);

    const { userID } = useParams();
    const infoUserCanView = httpsCallable(functions, 'infoUserCanView');
    const [userInfo, setUserInfo] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUserOwnID() {
            const userOwnDoc = await getDoc(userOwnRef);
            setUserOwnID(userOwnDoc.data().userID);
        }
        getUserOwnID();
    }, []);

    useEffect(() => {
        setLoading(true);
        async function getTheOtherUserInfo() {
            const result = await infoUserCanView({ userOwnID: userOwnID, requestedUserID: userID });
            setUserInfo(result.data.userInfo);
            setLoading(false);
        }
        getTheOtherUserInfo();
    }, [userID]);

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (userOwnID === userID) {
        navigate('/editProfile');
    }

    return (
        <div>
            <h4>Viewing {userID}'s profile</h4>
            <p>Username: {userInfo.username}</p>
            <p>Bio: {userInfo.bio}</p>
            <p>UserID: {userInfo.userID}</p>

            <DisplayArray array={userInfo.personal_posts} displayObjectFunc={c => {
                return <DisplayPost post={c} userOwnID={userOwnID} />
            }} />

            <p>Followers:</p>
            <DisplayArray array={userInfo.followers} displayObjectFunc={c => {
                return <DisplayUserLink userID={c} />
            }} />

            <p>Following:</p>
            <DisplayArray array={userInfo.following} displayObjectFunc={c => {
                return <DisplayUserLink userID={c} />
            }} />

        </div>
    );
}

export default ViewOtherUsers;