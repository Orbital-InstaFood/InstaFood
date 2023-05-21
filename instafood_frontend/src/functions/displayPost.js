function displayPost (post) {
    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.caption}</p>
            {post.images.map((image) => {
                return (
                    <img
                        src={image}
                        alt={post.title}
                    />
                );
            })}
        </div>
    );
}

export default displayPost;