import { useContext } from "react";
import { FriendsContext } from "../../App";
import { Link } from "react-router-dom";

const FriendsList = ({ activeUsers, setShowFRList }) => {
    const friends = useContext(FriendsContext);

    if(friends) {
        return (
            <div>
                {friends.map(friend => {
                    return (
                        <div>
                            <img src={`${process.env.REACT_APP_SERVER_URL}/images/${friend.profilePhoto}`} alt="Profile"/>
                            <p>{friend.name.full}</p>
                            {activeUsers.includes(friend._id) ? <p>(Active)</p> : null}
                            <Link onClick={() => setShowFRList(false)} to={`/chat/${friend._id}`}>
                                Send message
                            </Link>
                        </div>
                    )
                })}
                <button onClick={() => setShowFRList(false)}>Close</button>
            </div>
        )
    }    
};

export { FriendsList };