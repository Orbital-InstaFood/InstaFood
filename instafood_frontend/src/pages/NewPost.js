import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, storage } from '../firebaseConf';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore';

import getUserDoc from '../functions/getUserDoc';

import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

function NewPost() {
    const navigate = useNavigate();

    const user = auth.currentUser;

    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        const newImages = Array.from(e.target.files)
        .map(file => ({
            file: file,
            uniqueID: generateUniqueID()
        }));
        setImages(prevImages => [...prevImages, ...newImages]);
    };

    const handleSubmitNewPost = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getUserDoc();
        let urls = [];

        for (const image of images) {
            const storageRef = ref(storage, `${image.uniqueID}`);
            const snapshot = await uploadBytesResumable(storageRef, image.file);
            const url = await getDownloadURL(snapshot.ref);
            urls.push(url);
        }

        if (userDoc) {

            const postDocRef = doc(collection(db, 'posts'));

            const postDoc = {
                title: title,
                creator: userDoc.data().user_id,
                caption: caption,
                date_created: serverTimestamp(),
                post_id : postDocRef.id,
                likes: [],
                comments: [],
            };

            if (urls.length > 0) {
                postDoc.images = urls;
            }

            await setDoc(postDocRef, postDoc);

            await updateDoc(userRef, {
                personal_posts: [...userDoc.data().personal_posts, postDocRef.id]
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
                <label htmlFor="images">Images</label>
                <input
                    type="file"
                    id="images"
                    multiple
                    onChange={handleImageChange}
                />
                {images.length > 0 && (
                    <div>
                        {images.map((image) => (
                            <div key={image.uniqueID}>
                                <h3>{image.file.name}</h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImages(images.filter((img) => img.uniqueID !== image.uniqueID));
                                    }}>
                                    Delete Image
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit">Create Post</button>
            </form>
        </div>
    );


}
export default NewPost;