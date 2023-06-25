import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { db, auth, storage, functions } from '../firebaseConf';
import { httpsCallable } from 'firebase/functions';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, updateDoc, serverTimestamp, getDoc, arrayUnion } from 'firebase/firestore';

import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';
import { categoriesData } from '../theme/categoriesData.js';

import './NewPost.css'

function NewPost() {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const addPostToFollowersToView = httpsCallable(functions, 'addPostToFollowersToView');

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
      postID: postDocRef.id,
      likes: [],
      comments: [],
      category: selectedCategory,
    };


    await setDoc(postDocRef, postDoc);

    await updateDoc(userRef, {
      personalPosts: [...userDoc.data().personalPosts, postDocRef.id]
    });

    addPostToFollowersToView({
      postID: postDocRef.id,
      creatorUID: user.uid
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

    navigate('/dashboard');
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmitNewPost}>

        <label htmlFor="title">Title</label>
        <input
        className='title-input'
          type="text"
          id="title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categoriesData.map((category, index) => (
            <option key={index} value={index}>
              {category}
            </option>
          ))}
        </select>

        <label htmlFor="caption">Caption / Recipe Details</label>
        <input
        className='caption-input'
          type="text"
          id="caption"
          required
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

        {imageObjects.length > 0 && (
          <div>
            {imageObjects.map((imageObject) => (
              <div key={imageObject.uniqueID} className="image-preview">
                <img src={URL.createObjectURL(imageObject.content)} alt="preview" />

                <button
                  type="button"
                  onClick={() => {
                    setImageObjects(imageObjects.filter((imgObj) => {
                      return imgObj !== imageObject;
                    }));

                    setImages(images.filter((image) => {
                      return image !== imageObject.content;
                    }));
                  }}
                >
                  Delete Image
                </button>
              </div>
            ))}
          </div>
        )}
<button type="submit" className="create-post-button">Create Post</button>

      </form>
    </div>

  )
}

export default NewPost;