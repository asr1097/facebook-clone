import { ChatFriendTile } from "./ChatFriendTile";

const ChatLobby = ({ activeUsers, messages, renderChatroom }) => {

    const renderComp = () => {

        let sortedMessages = [];
        for (const sender in messages) {
            sortedMessages.push(sender)
        };

        sortedMessages.sort((a, b) => {
            return a[a.length-1].date - b[b.length-1].date
        });

        return (
            sortedMessages.map((sender, index) => {
                return (
                    <ChatFriendTile
                        key={index} 
                        sender={sender} 
                        activeUsers={activeUsers}
                        messages={messages}
                        renderChatroom={renderChatroom}
                    />  
                )
            })  
        )
    };

    return (
        <div>
            {renderComp()}
        </div>
    )
}

export { ChatLobby };