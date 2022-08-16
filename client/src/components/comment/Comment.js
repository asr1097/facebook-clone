import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CommentCommentForm } from "./CommentCommentForm";
import { LikeComment } from "./LikeComment";
import { ChildComment } from "./ChildComment";
import { Details } from "../Details";

const Comment = () => {

    const [comment, setComment] = useState();
    const [renderLevel, setRenderLevel] = useState(1);
    const [commentsToRender, setCommentsToRender] = useState();
    const commentsChunk = 3;
    const params = useParams();

    const increaseLevel = () => {
        setRenderLevel(renderLevel + 1)
    };

    useEffect(() => {
        const fetchComment = async() => {
            let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/comments/${params.id}`, {
                mode: "cors",
                credentials: "include"
            });
            let comment = await response.json();
            setComment(comment)
        };

        fetchComment();

        return (() => {
            setComment()
        })

    }, [params.id]);

    useEffect(() => {
        if(comment){setCommentsToRender(comment.childrenComments.slice(0, renderLevel * commentsChunk))}
    }, [comment, renderLevel])

    if(comment && commentsToRender){
        return (
            <div>
                <p>{comment.comment.text}</p>
                <Details 
                    date={comment.comment.date} 
                    url={comment.comment.url} 
                    user={comment.comment.user}
                />
                <LikeComment id={comment.comment._id} likes={comment.comment.likes} />
                <CommentCommentForm 
                    commentOwner={comment.comment.user._id}
                    postID={comment.comment.post}
                    parentCommentID={comment.comment._id}
                />
                {commentsToRender.map(childComment => {
                    return <ChildComment key={childComment._id} childComment={childComment} />
                })}
                {commentsToRender.length === comment.childrenComments.length ? 
                null
                : <button onClick={increaseLevel}>Load more</button>
                }
            </div>
        )
    } 
}

export { Comment };