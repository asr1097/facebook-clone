import { useState, useEffect } from "react";
import { PostList } from "./PostList";
import { NewPost } from "./NewPost";

const IndexPage = ({loggedIn, user}) => {
    const [data, setData] = useState();
    const [postsToRender, setPostsToRender] = useState();
    const [renderLevel, setRenderLevel] = useState(1);
    const postsChunk = 5;

    const pushNewPost = (post) => {
        let newData = [post, ...data];
        setData(newData);
    }

    const likePost = (index) => {
        let newData = [...data];
        newData[index].likes.push(user);
        setData(newData);
    }

    const unlikePost = (index) => {
        let newData = [...data];
        let filteredPostLikes = newData[index].likes.filter(_user => _user._id !== user._id);
        newData[index].likes = filteredPostLikes;
        setData(newData);
    }

    const pushNewComment = (index, comment) => {
        let newData = [...data];
        newData[index].directComments.splice(newData[index].comments.length, 0, comment);
        setData(newData);
    };

    const increaseLevel = () => {
        setRenderLevel(renderLevel + 1)
    };

    useEffect(() => {
        if(loggedIn){
          fetch(`${process.env.REACT_APP_SERVER_URL}/index`, {
            credentials: "include",
            mode: "cors"  
          })
            .then(res => res.json())
            .then(res => {setData(res.posts)})
            .catch(err => console.log(err))
        }
    }, [loggedIn]);

    useEffect(() => {
        if(data){setPostsToRender(data.slice(0, renderLevel * postsChunk))}
    }, [renderLevel, postsChunk, data])

    if(postsToRender) {
        return (
            <div>
                <NewPost pushPost={pushNewPost}/>
                {postsToRender.map((post, index) => <PostList 
                        key={post._id} 
                        index={index} 
                        post={post}
                        likePost={likePost}
                        unlikePost={unlikePost}
                        pushNewComment={pushNewComment} 
                    />)
                }
                {postsToRender.length === data.length ? 
                    null
                    : <button onClick={increaseLevel}>Load more</button>
                }
            </div>
        )
    }
}

export { IndexPage };