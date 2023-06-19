const engagementWeight = 0.5;
//const popularityWeight = 0.5;

//function calculatePopularityScore(post) {
 // return post.userFollowers;
//}
/*
function calculateFreshnessScore(post) {  
  const postDate = new Date(post.timestamp);
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - postDate.getTime();
  const monthsDifference = (1000 * 3600 * 24*30) / timeDifference;
  return monthsDifference;
}*/

function calculateEngagementScore(post){
  return post.likes + post.comments + post.shares;
}

function rankPosts(posts) {
    const rankedPosts = [...posts];

    rankedPosts.forEach((post, index) => {
      post.engagementScore = calculateEngagementScore(post); 
//      post.popularityScore = calculatePopularityScore(post); 
  
      post.rankScore = (
        post.engagementScore * engagementWeight +
   //     post.popularityScore * popularityWeight +
      );
  
      rankedPosts[index] = post;
    });
  
    rankedPosts.sort((a, b) => b.rankScore - a.rankScore);
  
    return rankedPosts;
  }
