import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db, functions } from "../../firebaseConf";
import { httpsCallable } from "firebase/functions";

import getFCMToken from "../Notification/fcmTokenService";

import listenerImplementer from "../../listeners/ListenerImplementer";

export default function useCreateProfile() {

    const user = auth.currentUser;

    const navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [bio, setBio] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [userID, setUserID] = useState("");

    const [userIDsListener, setUserIDsListener] = useState(null);
    const [existingUserIDs, setExistingUserIDs] = useState([]);
    const [helperText, setHelperText] = useState("");
    const [isValidUserID, setIsValidUserID] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingUserProfile, setIsCreatingUserProfile] = useState(false);

    const createUserProfile = httpsCallable(functions, 'createUserProfile');

    async function checkIfUserDocAlreadyExists() {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            alert("You already have an account. Redirecting to home page with your account.");
            navigate("/dashboard");
            return;
        }
    }

    async function setupListeners() {
        const userIDsListener = await listenerImplementer.getListOfUserIDsListener();
        setUserIDsListener(userIDsListener);
    }

    function setupSubscriptions() {

        const unsubscribeFromUserIDs =
            userIDsListener.subscribeToField('userIDs',
                (userIDs) => {
                    setExistingUserIDs(userIDs);
                }
            );

        return () => {
            unsubscribeFromUserIDs();
        }
    }

    useEffect(() => {
        function validateUserID() {

            let helperText = "";

            if (userID === "") {
                helperText = "USER ID CANNOT BE EMPTY";
            }
            if (existingUserIDs.includes(userID)) {
                helperText += ", USER ID ALREADY EXISTS";
            }
            if (userID.includes(" ")) {
                helperText += ", USER ID CANNOT CONTAIN SPACES";
            }
            if (userID.includes("_") || userID.includes("/")) {
                helperText += ", USER ID CANNOT CONTAIN _ OR /";
            }

            if (helperText[0] === ",") {
                helperText = helperText.substring(2);
            }

            if (helperText !== "") {
                setHelperText(helperText);
                setIsValidUserID(false);
                return;
            }

            setIsValidUserID(true);
            setHelperText("USER ID IS AVAILABLE");
        }
        validateUserID();
    }, [userID, existingUserIDs]);

    useEffect(() => {
        async function setup() {
            await checkIfUserDocAlreadyExists();
            await setupListeners();
        }
        setup();
    }, []);

    /**
     * This useEffect is used to setup subscriptions to the userIDsListener.
     * It is only run once the userIDsListener is set in the previous useEffect.
     */
    useEffect(() => {
        if (userIDsListener) {
            const unsubscribeFromUserIDs = setupSubscriptions();
            setIsLoading(false);
            return () => {
                unsubscribeFromUserIDs();
            }
        }
    }, [userIDsListener]);

    const handleCreate = async () => {
        setIsCreatingUserProfile(true);

        const fcmToken = getFCMToken();
        
        await createUserProfile({
            UID: user.uid,
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            userID: userID,
            fcmToken: fcmToken,
        });

        setIsCreatingUserProfile(false);
        navigate("/dashboard");
    }

    return {
        username,
        setUserName,
        bio,
        setBio,
        isPrivate,
        setIsPrivate,
        userID,
        setUserID,
        helperText,
        isValidUserID,
        isLoading,
        handleCreate,
        isCreatingUserProfile,
    }
}