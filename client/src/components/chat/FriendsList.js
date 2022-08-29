import { useContext, useState, useEffect } from "react";
import { FriendsContext } from "../../App";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const FriendsList = ({ activeUsers, setShowFRList }) => {
    const friends = useContext(FriendsContext);
    const user = useContext(UserContext);

    const [search, setSearch] = useState("");
    const [list, setList] = useState([]);

    useEffect(() => {
        if(friends && user && !list.length) {
            setList([...friends, user])
        }
    }, [friends, user, list]);

    if(list.length) {
        return (
            <div>
                <input type="text" onChange={(ev) => setSearch(ev.target.value)}></input>
                {list.filter(friend => friend.name.full.match(new RegExp(search, "gi")))
                    .map(friend => {
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