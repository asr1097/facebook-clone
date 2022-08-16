import { FriendRequestStatus } from "../profile/FriendRequestStatus";
import { Link } from "react-router-dom";

const SearchResults = ({ users, setsearchResult }) => {

    if(users) {
        if(!users.length) {return <p>No results found.</p>}
        else {
            return (
                users.map(profile => {
                    return (
                        <div key={profile._id}>
                            <Link to={`../${profile.url}`}>
                                <img 
                                    src={`http://localhost:3000/images/${profile.profilePhoto}`} 
                                    alt={"Profile"}
                                />
                            </Link>
                            <Link to={`../${profile.url}`}> {profile.name.full}</Link>
                            <FriendRequestStatus profile={profile} />
                            <hr/>
                        </div>
                    )
                })
            )
        }
    } else {
        return <div>Type a name into search bar to search for friends!</div>
    }
}

export { SearchResults };