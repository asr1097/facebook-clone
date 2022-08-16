import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Photo } from "./Photo";

const Photos = () => {

    const [posts, setPosts] = useState();
    const params = useParams();

    useEffect(() => {
        const fetchPosts = async() => {
            let response = await fetch(`/profile/${params.id}/photos`, {
                mode: "cors",
                credentials: "include"
            });
            if(response.ok) {
                let fetchedPosts = await response.json();
                setPosts(fetchedPosts);
            }
        }

        if(!posts) {fetchPosts()};

    }, [posts, params.id])

    if(posts && posts.length) {
        return (
            <div>
                {posts.map(post => {
                    return <Photo key={post._id} post={post} />
                })}
            </div>
        )
    } else {return <p>No photos.</p>}
};

export { Photos };