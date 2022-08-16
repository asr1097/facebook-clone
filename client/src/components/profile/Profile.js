import { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../App";
import { PostList } from "../post/PostList";
import { Link } from "react-router-dom";

const Profile = () => {
    const params = useParams();
    const user = useContext(UserContext);

    const [profile, setProfile] = useState();
    const [posts, setPosts] = useState();
    const [postsToRender, setPostsToRender] = useState();
    const [renderLevel, setRenderLevel] = useState(1);
    const postsChunk = 5;

    const increaseLevel = (ev) => {
        setRenderLevel(renderLevel + 1)
    };

    const likePost = (index) => {
        let newPosts = [...posts];
        newPosts[index].likes.push(user);
        setPosts(newPosts)
    };

    const unlikePost = (index) => {
        let newPosts = [...posts];
        let filteredLikes = newPosts[index].likes.filter(_user => _user._id !== user._id);
        newPosts[index].likes = filteredLikes;
        setPosts(newPosts);
    };

    const pushNewComment = (index, comment) => {
        let newPosts = [...posts];
        newPosts[index].directComments.splice(newPosts[index].directComments.length, 0, comment);
        setPosts(newPosts);
    }

    useEffect(() => {
        const fetchUser = async() => {
            let response = await fetch(`""/profile/${params.id}`, {
                mode: "cors",
                credentials: "include"
            });
            if(response.ok) {
                let fetchedProfile = await response.json();
                setProfile(fetchedProfile[0]);
                setPosts(fetchedProfile[1])
            };
        };

        fetchUser();

        return (() => {
            setProfile();
            setPosts();
        });

    }, [params.id]);

    useEffect(() => {
        if(posts){setPostsToRender(posts.slice(0, renderLevel * postsChunk))}
    }, [renderLevel, postsChunk, posts])

    if(profile && postsToRender) {
        return (
            <div>
                <img src={`""/images/${profile.profilePhoto}`} alt="Profile"/>
                <p>{profile.name.full}</p>
                <p>{profile.locaton}</p>
                <p>{profile.dateOfBirth}</p>
                <p>{profile.gender}</p>
                <p>{profile.email}</p>
                <Link to={`../chat/${profile._id}`}>Message</Link>
                <hr />
                <div>
                    {postsToRender.map((post, index) => {
                        return <PostList
                            key={post._id} 
                            index={index} 
                            user={profile} 
                            post={post} 
                            likePost={likePost}
                            unlikePost={unlikePost}
                            pushNewComment={pushNewComment}
                            />
                    })}
                    {postsToRender.length === posts.length ? 
                    null
                    : <button onClick={increaseLevel}>Load more</button>
                }
                </div>
            </div>
        )
    }
}

export { Profile };