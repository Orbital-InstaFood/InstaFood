import { db } from '../firebaseConf';
import { doc, getDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const useGetPosts = (postIDsArray) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getPosts() {
            const posts = [];
            for (const postID of postIDsArray) {
                const postRef = doc(db, 'posts', postID);
                const postSnap = await getDoc(postRef);
                const post = postSnap.data();
                posts.push(post);
            }
            setPosts(posts);
            setLoading(false);
        }
        getPosts();
    }, [postIDsArray]);

    return [ posts, loading ];
}

export default useGetPosts;
