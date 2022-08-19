import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { PostComment } from "../comment/PostComment";
import { LikePost } from "./LikePost";
import { PostCommentForm } from "../comment/PostCommentForm";
import { UserContext } from "../../App";
import { Details } from "../Details";

const Post = () => {

    const [post, setPost] = useState();
    const [renderLevel, setRenderLevel] = useState(1);
    const [commentsToRender, setCommentsToRender] = useState();
    const params = useParams();
    const user = useContext(UserContext);
    const commentsChunk = 3;
    
    const increaseLevel = (ev) => {
        setRenderLevel(renderLevel + 1)
    };

    const singlePostLiked = () => {
        let newPost = {...post};
        newPost.likes.push(user);
        setPost(newPost);
    };

    const singlePostUnliked = () => {
        let newPost = {...post};
        let newLikes = newPost.likes.filter(_user => _user._id !== user._id);
        newPost.likes = newLikes;
        setPost(newPost);
    };

    const singlePostPushComment = (comment) => {
        let newPost = {...post};
        newPost.directComments.push(comment);
        setPost(newPost);
    };

    

    useEffect(() => {
        const fetchPost = async() => {
            let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/posts/${params.id}`, {
                mode: "cors",
                credentials: "include"
            });
            let post = await response.json();
            setPost(post)
            setCommentsToRender(post.directComments.slice(0, renderLevel * commentsChunk));
        };

        if(!post) {fetchPost()};

    }, [params.id, renderLevel, post]);

    useEffect(() => {
        if(post){setCommentsToRender(post.directComments.slice(0, renderLevel * commentsChunk))}
    }, [renderLevel, commentsChunk, post])

    if(post) {
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
                    likes={post.likes}
                    singlePostLiked={singlePostLiked}
                    singlePostUnliked={singlePostUnliked} 
                />
                <PostCommentForm 
                    postID={post._id}
                    user={post.user._id}
                    singlePostPushComment={singlePostPushComment}
                />
                <div>
                    {commentsToRender.map(comment => {
                        if(!comment.parentComment){
                            return (
                                <PostComment
                                    key={comment._id} 
                                    comment={comment}
                                    postID={post._id} 
                                />
                                )
                        } else {
                            return null;
                        }})
                    }
                    {commentsToRender.length === post.directComments.length ? 
                    null
                    : <button onClick={increaseLevel}>Load more</button>
                    }
                </div>
                <hr />
            </div>
        )
    }
};

export { Post };