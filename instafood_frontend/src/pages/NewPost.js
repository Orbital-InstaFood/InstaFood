import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, storage } from '../firebaseConf';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, updateDoc, serverTimestamp, getDoc, arrayUnion } from 'firebase/firestore';

import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';
import {categoriesData} from '../theme/categoriesData.js';

function NewPost() {
    const navigate = useNavigate();

    const user = auth.currentUser;

    const [title, setTitle] = useState('');
    const [caption, setCaption] = useState('');
    const [images, setImages] = useState([]);
    const [imageObjects, setImageObjects] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(''); 
    
    function handleImageChange(e) {
        const newImages = [...images];
        const newImageObjects = [...imageObjects];

        for (const image of e.target.files) {
            newImages.push(image);
            newImageObjects.push({
                content: image,
                uniqueID: generateUniqueID()
            })
        }

        setImages(newImages);
        setImageObjects(newImageObjects);

        e.target.value = null;
    };

    const handleSubmitNewPost = async (e) => {
        e.preventDefault();

        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userUniqueID = userDoc.data().userID;

        const postDocRef = doc(collection(db, 'posts'));

        let urls = [];

        for (const imageObject of imageObjects) {
            const imageRef = ref(storage, `/${userUniqueID}/${postDocRef.id}/${imageObject.content.name}/${imageObject.uniqueID}`);
            const snapshot = await uploadBytesResumable(imageRef, imageObject.content);
            const url = await getDownloadURL(snapshot.ref);
            urls.push(url);
        }

        const postDoc = {
            title: title,
            creator: userUniqueID,
            caption: caption,
            date_created: serverTimestamp(),
            images: urls,
            post_id: postDocRef.id,
            likes: [],
            comments: [],
            category: selectedCategory,
        };


        await setDoc(postDocRef, postDoc);

        await updateDoc(userRef, {
            personalPosts: [...userDoc.data().personalPosts, postDocRef.id]
        });
        
        const categorisedPostsRef = doc(db, 'categorisedPosts', selectedCategory);
        const categorisedPostsDoc = await getDoc(categorisedPostsRef);
        
        if (categorisedPostsDoc.exists()) {
          await updateDoc(categorisedPostsRef, {
            post_id_array: arrayUnion(postDocRef.id)
          });
        } else {
          await setDoc(categorisedPostsRef, {
            post_id_array: [postDocRef.id]
          });
        }

        console.log('Post created successfully!');
        navigate('/');
    };

    return (
    <div>
      <h2>New Post</h2>
      <form onSubmit={handleSubmitNewPost}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="caption">Caption</label>
        <input
          type="text"
          id="caption"
          required
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        > 
          <option value="">Select a category</option>
          {categoriesData.map((category,index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>
        <label htmlFor="images">Images</label>
        <input type="file" id="images" multiple onChange={handleImageChange} />
        {imageObjects.length > 0 && (
          <div>
            {imageObjects.map((imageObject) => (
              <div key={imageObject.uniqueID}>
                <img src={URL.createObjectURL(imageObject.content)} alt="preview" />

                <button
                  type="button"
                  onClick={() => {
                    setImageObjects(
                      imageObjects.filter((imgObj) => imgObj !== imageObject)
                    );

                    setImages(images.filter((image) => image !== imageObject.content));
                  }}
                >
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