import { useEffect } from "react";
import { ChatLobby } from "./ChatLobby";
import { ChatRoom } from "./ChatRoom";
import { useParams } from "react-router-dom";

const ChatWindow = ({setActiveRoom, activeRoom, readMessages, activeUsers, messages, typing}) => {

    const params = useParams();

    useEffect(() => {
        
        setActiveRoom(params.id);
        if(params.id && messages[params.id]){readMessages(params.id)}
        
        return () => {
            setActiveRoom();
        }
    }, [params.id, setActiveRoom, readMessages, messages]);

    return (
        <div>
            <ChatLobby 
                messages={messages} 
                activeUsers={activeUsers} 
            />
            {activeRoom ? <ChatRoom  
                messages={messages[activeRoom]}
                activeRoom={activeRoom}
                typing={typing}
                /> 
            : null}
        </div>
    )
}

export { ChatWindow };