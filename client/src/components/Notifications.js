import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateFormat } from "./Date";

const Notifications = ({ notifs, setNotifsActive }) => {

    const [notifsToRender, setNotifsToRender] = useState();
    const [renderLevel, setRenderLevel] = useState(1);
    const notifsChunk = 5;

    const increaseLevel = () => {
        setRenderLevel(renderLevel + 1)
    };

    useEffect(() => {
        setNotifsActive(true);

        return () => {
            setNotifsActive(false)
        }
    }, [setNotifsActive]);

    useEffect(() => {
        if(notifs){setNotifsToRender(notifs.slice(0, renderLevel * notifsChunk))}
    }, [notifs, renderLevel]);

    const renderSwitch = (notif, index) => {
        switch(notif.type) {
            case "liked post":
                return (
                <div key={index}>
                    <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                    has liked your <Link to={"../" + notif.postID.url}>post</Link>.
                    <DateFormat date={notif.date} />
                </div>
                )
            case "post comment":
                return(
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has <Link to={"../" + notif.newCommentID.url}>commented</Link> 
                        on your <Link to={"../" + notif.postID.url}>post</Link>.
                        <DateFormat date={notif.date} />
                    </div>
                )
            
            case "comment comment":
                return(
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has <Link to={"../" + notif.newCommentID.url}>replied</Link>
                        to your <Link to={"../" + notif.parentCommentID.url}>comment</Link>.
                        <DateFormat date={notif.date} />
                    </div>
                )
            case "liked comment":
                return (
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full} </Link>
                        has liked your <Link to={"../" + notif.commentID.url}>comment</Link>.
                        <DateFormat date={notif.date} />
                    </div>
                )

            case "friend request accepted":
                return (
                    <div key={index}>
                        <Link to={"../" + notif.profileID.url}>{notif.profileID.name.full}</Link>
                         has accepted your friend request.
                         <DateFormat date={notif.date} />
                    </div>
                )
            
            default:
                return;
        }
    }

    if(notifsToRender && notifsToRender.length){
        return (
            <div>
                {notifsToRender.length ? notifsToRender.map((notif, index) => renderSwitch(notif, index)) : null}
                {notifsToRender.length === notifs.length ? null : <button onClick={increaseLevel}>Load more</button>}
            </div>
        )
    } else {return <p>No notifications to show</p>}
};

export { Notifications };