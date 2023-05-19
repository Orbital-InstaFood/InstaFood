import React from 'react';
import { db, auth } from '../firebase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';
import getUserDoc from '../getUserDoc';

function NewPost() {
    const navigate = useNavigate();

    const user = auth.currentUser;

    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');

    const handleSubmitNewPost = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getUserDoc();

        if (userDoc) {

            const postDoc = {
                title: title,
                creator: userDoc.data().user_id,
                caption: caption,
                date_created: serverTimestamp(),
                likes: [],
                comments: [],
            };

            const postColRef = collection(db, 'posts');
            const postDocRef = await addDoc(postColRef, postDoc);

            const postID = postDocRef.id;
            const updatedPostDoc = {
                ...postDoc,
                post_id: postID,
            };
            await setDoc(doc(db, 'posts', postID), updatedPostDoc);

            await updateDoc(userRef, {
                personal_posts: [...userDoc.data().personal_posts, postID]
            });

            console.log('Post created successfully!');
            navigate('/');
        }
    };

    return (
        <div>
            <h2>New Post</h2>
            <form onSubmit={handleSubmitNewPost}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="caption">Caption</label>
                <input
                    type="text"
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );

}
export default NewPost;