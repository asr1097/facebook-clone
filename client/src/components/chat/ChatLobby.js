import { ChatFriendTile } from "./ChatFriendTile";
import { FriendsList } from "./FriendsList";
import { useState } from "react";

const ChatLobby = ({ activeUsers, messages, renderChatroom }) => {

    const [showFRList, setShowFRList] = useState(false);

    const renderComp = () => {

        let sortedMessages = [];
        for (const sender in messages) {
            sortedMessages.push(sender)
        };

        sortedMessages.sort((a, b) => {
            return a[a.length-1].date - b[b.length-1].date
        });

        return (
            <div>
                {sortedMessages.map((sender, index) => {
                    return (
                        <ChatFriendTile
                            key={index} 
                            sender={sender} 
                            activeUsers={activeUsers}
                            messages={messages}
                            renderChatroom={renderChatroom}
                        />  
                    )
                })}
                <button onClick={() => setShowFRList(true)}>Send new message</button>
                {showFRList ? <FriendsList setShowFRList={setShowFRList} activeUsers={activeUsers} />
                : null} 
            </div>
        )
    };

    return (
        <div>
            {renderComp()}
        </div>
    )
}

export { ChatLobby };