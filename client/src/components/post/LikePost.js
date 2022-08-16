import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { LikeList } from "../profile/LikeList";

const LikePost = ({ postID, likes, index, likePost, unlikePost, singlePostLiked, singlePostUnliked}) => {

    const [action, setAction] = useState();
    const user = useContext(UserContext);

    useEffect(() => {
        if(likes && user) {
            likes.some(like => like.id === user._id) ? setAction("unlike") : setAction("like")
        };
    }, [likes, user]);

    const capitalizeString = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const submitAction = async(ev) => {
        let formData = new FormData();
        formData.append("id", postID);
        let statusCode = await fetch(`/posts/${postID}/${action}`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });

        if(statusCode.ok) {
            if(action === "like") {
                /* If called from Index page or Profile page */
                if(likePost) {likePost(index)}
                /* If called from Post page */
                else{singlePostLiked()}
                setAction("unlike")
            }
            else {
                /* If called from Index page or Profile page */
                if(unlikePost) {unlikePost(index)}
                 /* If called from Post page */
                else{singlePostUnliked()}
                setAction("like")
            }
        }
    }
    
    return (
        <div>
            <LikeList likes={likes} />
            {action ? <button onClick={submitAction}>{capitalizeString(action)}</button> : null}
        </div>
        )
}

export { LikePost };