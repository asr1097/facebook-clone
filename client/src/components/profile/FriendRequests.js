import { FriendRequestStatus } from "./FriendRequestStatus";

const FriendRequests = ({ requests }) => {

    if(requests && requests.length){
        return (
            <div>
                {requests.map(profile => {
                    return (
                        <div>
                            <img 
                                src={`http://localhost:3000/images/${profile.profilePhoto}`} 
                                alt="Profile"
                            />
                            <p>{profile.name.full}</p>
                            <FriendRequestStatus profile={profile} />
                            <hr />
                        </div>
                    )
                })}
            </div>
        )
    } else {
        return <p>No new requests.</p>
    }
};

export { FriendRequests };