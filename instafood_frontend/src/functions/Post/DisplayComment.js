import DisplayUserLink from '../DisplayUserLink';

function DisplayComment ({ comment, userOwnID, deleteComment }) {


    const handleDeleteComment = async (e) => {
        deleteComment(comment.commentID);
    };

    if ( comment.commenterID === userOwnID ) {
        return (
        <div>
            <p>{comment.commenterID}: {comment.commentText}</p>
            <button onClick={ () => handleDeleteComment() }>Delete Comment</button>
        </div>
        );
    }

    return (
        <div>
            <p><DisplayUserLink userID={comment.commenterID} />: {comment.commentText}</p>
        </div>
    );
}

export default DisplayComment;