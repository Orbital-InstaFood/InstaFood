const engagementWeight = 1.0;

function rankPosts(posts) {
  const rankedPosts = [...posts]; 

  rankedPosts.forEach((post, index) => {
    const engagementScore = post.comments.length + post.likes.length;

    post.rankScore = engagementScore * engagementWeight;

    rankedPosts[index] = post;
  });

  rankedPosts.sort((a, b) => b.rankScore - a.rankScore);

  return rankedPosts;
}

export default rankPosts;