import { useContext, useState } from "react";
import { UserContext } from "../../App";
import { Details } from "../Details";
import { LikePost } from "./LikePost";
import { Link } from "react-router-dom";

const PostPreview = ({ _post }) => {
    
    const user = useContext(UserContext);

    const [post, setPost] = useState(_post)

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
            <Link to={`../posts/${post._id}`}>Comments (post.comments.length)</Link>
        </div>
    )
};

export { PostPreview };