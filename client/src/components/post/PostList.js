import { useState, useEffect } from "react";
import { LikePost } from "./LikePost";
import { PostCommentForm } from "../comment/PostCommentForm";
import { PostComment } from "../comment/PostComment";
import { Details } from "../Details";

const PostList = ({ post, index, likePost, unlikePost, pushNewComment }) => {

    const [renderLevel, setRenderLevel] = useState(1);
    const [commentsToRender, setCommentsToRender] = useState();
    const [showComments, setShowComments] = useState(false);
    const commentsChunk = 3;

    const increaseLevel = () => {
        setRenderLevel(renderLevel + 1)
    };

    useEffect(() => {
        if(post){setCommentsToRender(post.directComments.slice(0, renderLevel * commentsChunk))}
    }, [renderLevel, commentsChunk, post, post.directComments])

    if(post && commentsToRender) {
        return (
            <div key={post._id}>
                {post.image ? <img alt="Post" src={`${process.env.REACT_APP_SERVER_URL}/images/` + post.image}></img> 
                : null}
                <p>{post.text}</p>
                <Details 
                    date={post.date}
                    url={post.url}
                    user={post.user}
                />
                <LikePost 
                    postID={post._id} 
                    index={index} 
                    likes={post.likes} 
                    likePost={likePost}
                    unlikePost={unlikePost}
                />
                
                <button onClick={() => setShowComments(!showComments)}>
                    Comments ({post.comments.length})
                </button>
                {showComments ? 
                    <div>
                        <PostCommentForm 
                            postID={post._id}
                            user={post.user._id}
                            index={index}
                            pushNewComment={pushNewComment}
                        />
                        {commentsToRender.map(comment => {
                            
                            return (
                                <PostComment
                                    key={comment._id} 
                                    comment={comment}
                                    postID={post._id}
                                    index={index}
                                    pushNewComment={pushNewComment} 
                                />
                            )
                        })}
                        {commentsToRender.length === post.directComments.length ? 
                        null
                        : <button onClick={increaseLevel}>Load more</button>
                        }
                    </div>
                    : null
                }
                <hr />
            </div>
        )
        
    }
}

export { PostList };