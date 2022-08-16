import { CommentCommentForm } from "./CommentCommentForm";
import { LikeComment } from "./LikeComment";
import { Link } from "react-router-dom";
import { Details } from "../Details";

const PostComment = ({ comment, postID }) => {
    return (
        <div>
            <p>{comment.text}</p>
            <Details date={comment.date} url={comment.url} user={comment.user} />
            <LikeComment id={comment._id} likes={comment.likes} />
            <CommentCommentForm 
                postID={postID} 
                parentCommentID={comment._id}
                commentOwner={comment.user._id}
            />
            {comment.childrenComments.length ? 
                <Link to={`../../comments/${comment._id}`}>{comment.childrenComments.length} replies</Link>
                : null
            }
        </div>
    )
}

export { PostComment };