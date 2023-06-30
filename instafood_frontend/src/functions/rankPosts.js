const engagementWeight = 0.5;

function rankPosts(posts) {
  const rankedPosts = [...posts]; // Create a copy of the posts array

  rankedPosts.forEach((post, index) => {
    const engagementScore = post.likes.length + post.comments.length;

    post.rankScore = engagementScore * engagementWeight;

    rankedPosts[index] = post;
  });

  rankedPosts.sort((a, b) => b.rankScore - a.rankScore);

  return rankedPosts;
}

/*function calculatePopularityScore(post) {
    const now = new Date();
    const postDate = new Date(post.date_created);
    const timeDifference = now.getTime() - postDate.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);

    return post.likes / hoursDifference;
}*/

export default rankPosts;