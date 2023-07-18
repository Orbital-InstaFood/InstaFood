import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpsCallable } from 'firebase/functions';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc, arrayUnion } from 'firebase/firestore';
import { generateUniqueID } from 'web-vitals/dist/modules/lib/generateUniqueID';

import listenerImplementer from '../../listeners/ListenerImplementer';
import { db, auth, storage, functions } from '../../firebaseConf';
import {
    _handleImageChange,
} from './newpostUtils';

/**
 * This hook handles the logic for the new post page.
 * It handles image upload, deletion, and viewing.
 * It also handles the submission of the new post.
 * It exposes the following methods:
 * 
 * @function handleImageChange - handles new image selection
 * @function handleImageDelete - delete an uploaded image
 * @function handleSubmitNewPost - submit the new post
 */
export default function useNewPost() {

    const navigate = useNavigate();
    const user = auth.currentUser;

    // State for post details
    const [title, setTitle] = useState('');

    const [captionHTML, setCaptionHTML] = useState('');

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [imageObjects, setImageObjects] = useState([]);

    // State for image preview

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // State for listeners
    const [userDocListener, setUserDocListener] = useState(null);
    const [userID, setUserID] = useState('');

    const [categoriesListener, setCategoriesListener] = useState(null);
    const [categories, setCategories] = useState([]);

    const [ingredientsListener, setIngredientsListener] = useState(null);
    const [ingredients, setIngredients] = useState([]);

    // State for loading
    const [isLoading, setIsLoading] = useState(true);

    async function setup() {
        // Setup listeners
        const userDocListener = await listenerImplementer.getUserDocListener();
        setUserDocListener(userDocListener);

        const categoriesListener = await listenerImplementer.getCategoriesListener();
        setCategoriesListener(categoriesListener);

        const ingredientsListener = await listenerImplementer.getIngredientsListener();
        setIngredientsListener(ingredientsListener);

        // Initialise states
        const userDoc = userDocListener.getCurrentDocument();
        setUserID(userDoc.userID);

        const categoriesDoc = categoriesListener.getCurrentDocument();
        setCategories(categoriesDoc.categories);

        const ingredientsDoc = ingredientsListener.getCurrentDocument();
        setIngredients(ingredientsDoc.Ingredients);

        setIsLoading(false);
    }

    useEffect(() => {
        setup();
    }, []);

    function handleImageChange(e) {
        const newImageObjects = _handleImageChange(e, imageObjects);
        setImageObjects(newImageObjects);
        e.target.value = null;
    }

    function handleImageDelete(uniqueID) {
        const newImageObjects = imageObjects.filter(
            imageObject => imageObject.uniqueID !== uniqueID
        );
        setImageObjects(newImageObjects);
    }

    const handleSubmitNewPost = async (e) => {

        const timestamp = serverTimestamp();
        const uniqueID = generateUniqueID();
        const encodedCaption = encodeURIComponent(captionHTML);

        const postID = `${userID}_${uniqueID}`;
        const postDocRef = doc(db, 'posts', postID);

        const uploadTasks = imageObjects.map(async (imageObject) => {
            const imageRef = ref(storage, `/${userID}/${postID}/${imageObject.content.name}/${imageObject.uniqueID}`);
            const snapshot = await uploadBytesResumable(imageRef, imageObject.content);
            return getDownloadURL(snapshot.ref);
        });
        const imageUrls = await Promise.all(uploadTasks);

        const postDoc = {
            title: title,
            creator: userID,
            caption: encodedCaption,
            date_created: timestamp,
            images: imageUrls,
            postID: postID,
            likes: [],
            comments: [],
            categories: selectedCategories,
            ingredients: selectedIngredients
        };

        await setDoc(postDocRef, postDoc);

        await updateDoc(
            doc(db, 'users', user.uid),
            {
                personalPosts: arrayUnion(postID)
            }
        );

        const addPostToFollowersToView = httpsCallable(functions, 'addPostToFollowersToView');
        addPostToFollowersToView({
            postID: postID,
            creatorUID: user.uid
        });

        for (const category of selectedCategories) {
            const categoryRef = doc(db, 'categorisedPosts', category) ;
            const categoryDoc = await getDoc(categoryRef);

            if (categoryDoc.exists()) {
                await updateDoc(categoryRef, {
                    post_id_array: arrayUnion(postID)
                });
            } else {
                await setDoc(categoryRef, {
                    post_id_array: [postID]
                });
            }
        }

        for (const ingredient of selectedIngredients) {
            const ingredientRef = doc(db, 'ingredientPosts', ingredient);
            const ingredientDoc = await getDoc(ingredientRef);

            if (ingredientDoc.exists()) {
                await updateDoc(ingredientRef, {
                    post_id_array: arrayUnion(postID)
                });
            } else {
                await setDoc(ingredientRef, {
                    post_id_array: [postID]
                });
            }
        }

        navigate('/viewProfile');
    };

    return {
        title, setTitle,
        captionHTML, setCaptionHTML,
        categories, selectedCategories, setSelectedCategories,
        ingredients, selectedIngredients, setSelectedIngredients,
        imageObjects, currentImageIndex,setCurrentImageIndex,
        handleImageChange, handleImageDelete,
        handleSubmitNewPost, isLoading
    }
}

