import { useState } from "react";

const PostCommentForm = ({ postID, user, index, pushNewComment, singlePostPushComment }) => {

    const [text, setText] = useState();

    const onTextChange = (ev) => {
        setText(ev.target.value);
    };

    const fetchComment = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("postID", postID);
        formData.append("user", user);
        formData.append("text", text);
        let response = await fetch(`http://localhost:3000/posts/${postID}/comments/new`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });
        if(response.ok) {
            let comment = await response.json();
            if(pushNewComment) {pushNewComment(index, comment)}
            else{singlePostPushComment(comment)}
        };
    };

    return (
        <form onSubmit={fetchComment}>
            <input type="text" maxLength="999" onChange={onTextChange}></input>
            <input type="submit" value="Post comment"></input>
        </form>
    )
};

export { PostCommentForm };