import { useState, useContext } from "react";
import { UserContext } from "../../App";

const Message = ({ msg }) => {
    const [showDetails, setShowDetails] = useState(false);
    const user = useContext(UserContext);
    
    const detailsSwitch = () => {
        setShowDetails(!showDetails);
    };

    let style = msg.from._id === user._id ? {"textAlign": "left"} : {"textAlign": "right"};

    return (
        <div onClick={detailsSwitch} style={style}>
            {showDetails ? <span>{msg.date}</span> : null}
            <p>{msg.text}</p>
            {showDetails && msg.read && (msg.from._id === user._id) ? 
                <span>Seen</span> 
                : null}
        </div>
    )
};

export { Message };