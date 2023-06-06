import DisplayArray from "./DisplayArray";
import displayImage from "./displayImage";

function DisplayPost (post) {
    return (
        <div>
            <h3>{post.title}</h3>
            <p>{post.caption}</p>
            <DisplayArray array={post.images} displayObjectFunc={displayImage} />
        </div>
    );
}

export default DisplayPost;