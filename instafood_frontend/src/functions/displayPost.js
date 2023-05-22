import { generateUniqueID } from "web-vitals/dist/modules/lib/generateUniqueID";

function displayPost (post) {

    if (post.images.length === 0) {
        return;
    }

    const images = post.images.map((image) => {
        return {
            content: image,
            uniqueID: generateUniqueID()
        };
    });

    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.caption}</p>
            <ul>
                {images.map((image) => {
                    return (
                        <li key={image.uniqueID}>
                            <img src={image.content} alt="post" />
                        </li>
                    );
                }
                )}
            </ul>
        </div>
    );
}

export default displayPost;