import { useState, useEffect, useContext } from "react";
import { UserContext, FriendsContext } from "../../App";
import { Link } from "react-router-dom";

const ChatFriendTile = ({ sender, messages, activeUsers }) => {

    const [senderData, setSenderData] = useState();
    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const user = useContext(UserContext);
    const friends = useContext(FriendsContext);
  

    useEffect(() => {
        if(user && sender) {
            if(sender === user._id){setSenderData(user)}
            else {
                let friend = friends.find(friend => friend._id === sender);
                setSenderData(friend)
            }
        }
    }, [friends, user, sender]);

    useEffect(() => {
        if(user) {
            let unreadMsgsCount = 0;
            for(let i = messages[sender].length - 1; i >= 0; i--) {
                if(!messages[sender][i].read && messages[sender][i].from._id !== user._id)
                {unreadMsgsCount++}
                else if(messages[sender][i].read && messages[sender][i].from._id !== user._id)
                {break}
            }
            setUnreadMsgs(unreadMsgsCount);
        }
    }, [activeUsers, messages, sender, user]);

    if(senderData){
        return (
            <Link to={`../chat/${senderData._id}`}>
                {senderData.name.full}
                {activeUsers.includes(senderData._id) ? <span>(active) </span> : null}
                {unreadMsgs ? " " + unreadMsgs : null}
            </Link>
        )
    }
};

export { ChatFriendTile };