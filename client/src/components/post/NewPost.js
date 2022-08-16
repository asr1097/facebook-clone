import { useState } from "react";

const NewPost = ({ pushPost }) => {
    const [text, setText] = useState();
    const [file, setFile] = useState();

    const submitPost = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("text", text);
        formData.append("imageField", file);
        let response = await fetch(`/posts/new`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });
        if(response.ok){
            let post = await response.json();
            pushPost(post);
        }
    };

    const onFileChange = (ev) => {
        setFile(ev.target.files[0]);
    };

    const onTextChange = (ev) => {
        setText(ev.target.value);
    };

    return (
        <form onSubmit={submitPost}>
            <input type="text" onChange={onTextChange}></input>
            <input type="file" onChange={onFileChange}></input>
            <input type="submit" value="Post"></input>
        </form>
    )
};

export { NewPost };