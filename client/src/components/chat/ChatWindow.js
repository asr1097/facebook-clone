import { useEffect, useState } from "react";
import { ChatLobby } from "./ChatLobby";
import { ChatRoom } from "./ChatRoom";
import { useParams } from "react-router-dom";

const ChatWindow = ({setActiveRoom, activeRoom, readMessages, activeUsers, messages, typing}) => {

    const [width, setWidth] = useState(window.innerWidth);

    const params = useParams();

    useEffect(() => {
        setActiveRoom(params.id);
        if(params.id && messages[params.id]){readMessages(params.id)}
        
        return () => {
            setActiveRoom();
        }
    }, [params.id, setActiveRoom, readMessages, messages]);

    useEffect(() => {
        const resizeWidth = () => {setWidth(window.innerWidth)};
        window.addEventListener("resize", resizeWidth);

        return () => window.removeEventListener("resize", resizeWidth)
    }, []);

    if(width > 800) {
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
                    isMobile={false}
                    /> 
                : null}
            </div>
        )
    } else {
        return (
            <div>
                {activeRoom ? 
                <ChatRoom  
                messages={messages[activeRoom]}
                activeRoom={activeRoom}
                typing={typing}
                isMobile={true}
                /> 
                :
                <ChatLobby 
                    messages={messages} 
                    activeUsers={activeUsers} 
                />      
                }
            </div>
        )
    }
}

export { ChatWindow };