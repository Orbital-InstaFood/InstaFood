import listenerImplementer from '../../listeners/ListenerImplementer';
import eventDocEditor from '../../editor/eventDocEditor';
import { useEffect, useState } from 'react';

export default function useDisplayEvent ({eventID}) {
    const [eventDoc, setEventDoc] = useState(null);
    const [eventDocEditorInstance, setEventDocEditorInstance] = useState(null);
    const [userDoc, setUserDoc] = useState(null);
    const [isInitialising, setIsInitialising] = useState(true);
    const [hasEnded, setHasEnded] = useState(false);
    const [commentText, setCommentText] = useState('');
    let cleanUpFunctions = [];

    async function setup() {
        const eventDocListener = await listenerImplementer.getEventDocListener(eventID);
        const eventDoc = eventDocListener.getCurrentDocument();
        setEventDoc(eventDoc);

        const hasEnded = new Date (eventDoc.eventTime) < new Date();
        setHasEnded(hasEnded);

        const userDocListener = await listenerImplementer.getUserDocListener();
        const userDoc = userDocListener.getCurrentDocument();
        setUserDoc(userDoc);

        const eventDocEditorInstance = new eventDocEditor(eventID, setEventDoc, userDoc.userID);
        setEventDocEditorInstance(eventDocEditorInstance);

        const unsubscribeFromAttendees 
        = eventDocListener.subscribeToField('attendees', (attendees) => {
            setEventDoc((prevState) => {
                return {
                    ...prevState,
                    attendees: attendees,
                };
            });
        });
        cleanUpFunctions.push(unsubscribeFromAttendees);

        setIsInitialising(false);
    }

    useEffect(() => {
        setup();
        return () => {
            cleanUpFunctions.forEach((cleanUpFunction) => {
                cleanUpFunction();
            });
        };
    }, [eventID]);

    function handleMakeComment() {
        if (commentText === "") {
            return;
        }
        const comment = {
            commenterID: userDoc.userID,
            commentText: commentText,
        }
        eventDocEditorInstance.makeComment(comment);
        setCommentText('');
    }

    return {
        userDoc,
        eventDoc, eventDocEditorInstance,
        hasEnded,
        isInitialising,
        commentText, setCommentText, handleMakeComment,
    };
}