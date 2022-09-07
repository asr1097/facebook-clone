import { SendMessage } from "./SendMessage";
import { Message} from "./Message";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FriendsContext, UserContext } from "../../App";

const ChatRoom = ({ activeRoom, messages, typing, isMobile }) => {

    const [friendName, setFriendName] = useState();
    const friends = useContext(FriendsContext);
    const user = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(user && params.id && friends && activeRoom && (params.id !== user._id)){
            let friend = friends.find(friend => friend._id === params.id);
            if(friend.name.first){setFriendName(friend.name.first);}
        }
    }, [params.id, user, activeRoom, friends])
    
    if(messages) {
        return (
            <div>
                {isMobile ? <button onClick={() => navigate(-1)}>Back</button> : null}
                {messages.map(msg => {
                    return <Message key={msg._id} msg={msg} />
                })}
                {typing.includes(activeRoom) ? 
                    <p style={{"textAlign": "right"}}>{friendName} is typing...</p> 
                    : null
                }
                <SendMessage activeRoom={activeRoom}/>
            </div>
        )
    } else if(!messages || !messages.length) {
        return (
            <div>
                <p>Write something to start chatting!</p>
                <SendMessage activeRoom={activeRoom}/>
            </div>
        )
    }
}

export { ChatRoom };