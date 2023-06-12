import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConf';

const getPostsByPostIds = async (postIds) => {
  const posts = [];

  for (const postId of postIds) {
    const postRef = doc(db, 'posts', postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      posts.push({ id: postId, ...postData });
    }
  }

  return posts;
};

export default getPostsByPostIds;