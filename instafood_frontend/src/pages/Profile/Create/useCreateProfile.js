import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, functions } from "../../../firebaseConf";
import { httpsCallable } from "firebase/functions";

import listenerImplementer from "../../../listeners/ListenerImplementer";

/**
 * This hook handles the logic for the create profile page.
 * Its main purpose is to ensure that the user does not create a profile with an existing userID.
 */
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

    let cleanupFunctions = [];

    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingUserProfile, setIsCreatingUserProfile] = useState(false);

    const createUserProfile = httpsCallable(functions, 'createUserProfile');

    async function setup() {
        // Check if userDoc already exists
        const userDocListener = await listenerImplementer.getUserDocListener();
        if (userDocListener) {
            alert("You already have an account. Redirecting to home page with your account.");
            navigate("/dashboard");
            return;
        }

        const userIDsListener = await listenerImplementer.getListOfUserIDsListener();
        setUserIDsListener(userIDsListener);
        
        // setupSubscriptions
        const unsubscribeFromUserIDs =
            userIDsListener.subscribeToField('userIDs',
                (userIDs) => {
                    setExistingUserIDs(userIDs);
                }
            );

        cleanupFunctions.push(unsubscribeFromUserIDs);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanupFunctions.forEach((cleanupFunction) => {
                cleanupFunction();
            });
        }
    }, []);

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

    const handleCreate = async () => {
        setIsCreatingUserProfile(true);

        await createUserProfile({
            UID: user.uid,
            username: username,
            bio: bio,
            isPrivate: isPrivate,
            userID: userID,
        });

        setIsCreatingUserProfile(false);
        navigate("/dashboard");
    }

    return {
        username, setUserName,
        bio, setBio,
        isPrivate, setIsPrivate,
        userID, setUserID,
        isValidUserID, helperText,
        isLoading,
        handleCreate, isCreatingUserProfile,
    }
}