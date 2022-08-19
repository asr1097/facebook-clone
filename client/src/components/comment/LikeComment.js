import { useContext, useState, useEffect } from "react";
import { UserContext } from "../../App";
import { LikeList } from "../profile/LikeList";

const LikeComment = ({ id, likes }) => {

    const [action, setAction] = useState();
    const [commentLikes, setCommentLikes] = useState()
    const user = useContext(UserContext);

    useEffect(() => {
        if(likes) {setCommentLikes(likes)}
    }, [likes]);

    useEffect(() => {
        if(commentLikes && user){
            commentLikes.some(like => like.id === user._id) ? 
            setAction("unlike") 
            : setAction("like")
        }
    }, [commentLikes, user]);

    const capitalizeString = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const updateLikes = () => {
        let newLikes = [...commentLikes];
        if(action === "like") {
            newLikes.push(user)
        } else {
            newLikes.splice(newLikes.indexOf(user), 1);
        }
        setCommentLikes(newLikes);
    }

    const submitAction = async(ev) => {
        let formData = new FormData();
        formData.append("id", id);
        let statusCode = await fetch(`${process.env.REACT_APP_SERVER_URL}/comments/${id}/${action}`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });

        if(statusCode.ok) {
            if(action === "like") {
                updateLikes();
                setAction("unlike")
            }
            else {
                updateLikes();
                setAction("like")
            }
        }
    }

    return (
        <div>
            <LikeList likes={commentLikes} />
            {action ? <button onClick={submitAction}>{capitalizeString(action)}</button> : null}
        </div>
    )
}

export { LikeComment };