import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { db, auth, functions } from '../firebaseConf';
import { getDoc, doc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import DisplayArray from '../functions/DisplayArray';
import DisplayUserLink from '../functions/DisplayUserLink';
import DisplayPostUI from '../functions/Post/DisplayPostUI';
import DisplayUserForConnect from '../functions/DisplayUserForConnect';

function ViewOtherUsers() {
    const navigate = useNavigate();

    const userUID = auth.currentUser.uid;
    const userOwnRef = doc(db, 'users', userUID);
    const [userOwnID, setUserOwnID] = useState(null);
    const [following, setFollowing] = useState([]);
    const [followRequestsSent, setFollowRequestsSent] = useState([]);

    const { userID } = useParams();
    const infoUserCanView = httpsCallable(functions, 'infoUserCanView');
    const [userInfo, setUserInfo] = useState(null);

    const [loading, setLoading] = useState(true);

    async function getUserOwnID() {
        const userOwnDoc = await getDoc(userOwnRef);

        const docUserID = userOwnDoc.data().userID;
        if (docUserID === userID) {
            navigate('/viewProfile');
            return;
        }

        setUserOwnID(docUserID);
        setFollowing(userOwnDoc.data().following);
        setFollowRequestsSent(userOwnDoc.data().followRequestsSent);
    }

    async function getTheOtherUserInfo() {
        const result = await infoUserCanView({ userOwnID: userOwnID, requestedUserID: userID });
        setUserInfo(result.data.userInfo);
        setLoading(false);
    } 

    useEffect(() => {
        setLoading(true);

        async function getUserOwnIDAndTheOtherUserInfo() {
            await getUserOwnID();
            await getTheOtherUserInfo();
        }
        getUserOwnIDAndTheOtherUserInfo();
        
    }, [userID, userOwnID]);

    const handleFollowRequestSent = (otherUserID) => {
        setFollowRequestsSent([...followRequestsSent, otherUserID]);
    };

    if (loading) {
        return (
            <div>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div>
            <h4>Viewing {userID}'s profile</h4>
            <p>Username: {userInfo.username}</p>
            <p>Bio: {userInfo.bio}</p>
            <p>UserID: {userInfo.userID}</p>

            <DisplayUserForConnect
                userOwnID={userOwnID}
                otherUserID={userID}
                following={following}
                followRequestsSent={followRequestsSent}
                onFollowRequestSent={handleFollowRequestSent}
            />

            <DisplayArray array={userInfo.personalPosts} displayObjectFunc={c => {
                console.log(c);
                return <DisplayPostUI postID={c} userOwnID={userOwnID} />
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