import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebaseConf';

class eventDocEditor {
    constructor (eventID, setEventDoc, userOwnID) {
        this.eventDocRef = doc(db, 'events', eventID);
        this.setEventDoc = setEventDoc;
        this.userOwnID = userOwnID;
        this._bindFunctions();
    }

    _bindFunctions () {
        this.attend = this.attend.bind(this);
        this.unattend = this.unattend.bind(this);
        this.makeComment = this.makeComment.bind(this);
    }

    attend () {
        updateDoc(this.eventDocRef, {
            attendees: arrayUnion(this.userOwnID),
        });
    }

    unattend () {
        updateDoc(this.eventDocRef, {
            attendees: arrayRemove(this.userOwnID),
        });
    }

    makeComment (comment) {

        this.setEventDoc((prevState) => {
            let newComments;
            if (!prevState.comments){
                newComments = [comment];
            } else {
                newComments = [...prevState.comments, comment];
            }
            return {
                ...prevState,
                comments: newComments,
            };
        });

        updateDoc(this.eventDocRef, {
            comments: arrayUnion(comment),
        });
    }

}

export default eventDocEditor;
