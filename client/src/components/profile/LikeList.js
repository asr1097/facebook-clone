import { useState } from "react";
import { FriendRequestStatus } from "./FriendRequestStatus";
import { Link } from "react-router-dom";

const LikeList = ({ likes }) => {
    const [showList, setShowList] = useState(false);
    
    if(likes && showList) {
        return (
            <div>
                {likes.map(user => {
                    return (
                        <div key={user._id}>
                            <Link to={`../${user.url}`}>
                                <img src={`""/images/${user.profilePhoto}`} alt="Profile"/>
                            </Link>
                            <Link to={`../${user.url}`}>{user.name.full}</Link>
                            <FriendRequestStatus profile={user} />
                        </div>
                    )
                })}
                <button onClick={() => setShowList(false)}>Close</button>
            </div>
        )
    } else if(likes && likes.length) {
        return <button onClick={() => setShowList(true)}>{likes.length} likes</button>
    } else {return null}
};

export { LikeList };