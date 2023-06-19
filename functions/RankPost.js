const functions = require('firebase-functions');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();

const engagementWeight = 0.5;
const popularityWeight = 0.5;

exports.rankPosts = functions.https.onCall(async (data, context) => {
  const rankedPosts = [...posts];
  rankedPosts.forEach((post, index) => {
    const { posts } = data;
    const postRef = db.collection('posts').doc(postID);
    const postDoc = await postRef.get();
    const post = postDoc.data();
    const userRef = db.collection('users').doc(post.creator);
    const userDoc = await userRef.get();
    const userFollowers = userDoc.data().followers;
    const engagementScore = post.likes + post.comments + post.shares;
    const popularityScore = userFollowers;
    const rankScore =  engagementScore * engagementWeight + popularityScore * popularityWeight
    rankedPosts[index].rankScore = rankScore;
  };
  rankedPosts.sort((a, b) => b.rankScore - a.rankScore);
  return { rankedPosts };
});

/*
  const sortedPosts = await Promise.all(posts.map(async (post) => {
    const userRef = db.collection('users').doc(post.creator);
    const userDoc = await userRef.get();
    const userFollowers = userDoc.data().followers;
  return { rankedPosts };
  }));
});

function calculatePopularityScore(post) {
 return post.userFollowers;
}

/*
function calculateFreshnessScore(post) {  
  const postDate = new Date(post.timestamp);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const monthsDifference = (1000 * 3600 * 24*30) / timeDifference;
  return monthsDifference;
}*/
/*
function calculateEngagementScore(post){
  return post.likes + post.comments + post.shares;
}

function rankPosts(posts) {
    const rankedPosts = [...posts];

    rankedPosts.forEach((post, index) => {
      post.engagementScore = calculateEngagementScore(post); 
      post.popularityScore = calculatePopularityScore(post); 
  
      post.rankScore = (
        post.engagementScore * engagementWeight + post.popularityScore * popularityWeight
      );
  
      rankedPosts[index] = post;
    });
  
    rankedPosts.sort((a, b) => b.rankScore - a.rankScore);
  
    return rankedPosts;
  }

