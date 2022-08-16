import { useState, useContext, useEffect, createRef } from "react";
import { SocketContext, UserContext } from "../../App";

const SendMessage = ({ activeRoom }) => {

    const [text, setText] = useState();
    const [isTyping, setIsTyping] = useState();

    let inputRef = createRef(null);

    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    const sendMessage = (ev) => {
        ev.preventDefault();
        socket.emit("message", {
            content: {
                text,
                
                date: Date.now()
            },
            to: activeRoom,
            from: user._id
        })
        inputRef.current.value = null;
        setText();
        setIsTyping(false);
    };

    useEffect(() => {
        if(text && !isTyping) {setIsTyping(true)}
        if(!text && isTyping) {setIsTyping(false)}
    }, [text, isTyping]);

    useEffect(() => {
        if(socket && user && activeRoom){
            if(isTyping) {socket.emit("typing", {from: user._id, to: activeRoom})}
            if(!isTyping) {socket.emit("stopped typing", {from: user._id, to: activeRoom})}
        }
    }, [isTyping, socket, user, activeRoom])

    return (
        <form onSubmit={sendMessage}>
            <input ref={inputRef} type="text" onChange={(ev) => {setText(inputRef.current.value)}} />
            <input type="submit" value="Send"></input>
        </form>
    )
}

export { SendMessage };