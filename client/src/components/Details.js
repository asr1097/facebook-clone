import { DateFormat } from "./Date"
import { Link } from "react-router-dom";

const Details = ({ user, date, url }) => {
    return (
        <div>
            <div>
                <Link to={`../${user.url}`}>
                    <img src={`http://localhost:3000/images/${user.profilePhoto}`} alt="Profile"></img>
                </Link>
                <Link to={`../${user.url}`}>
                    <p>{user.name.full}</p>
                </Link>
            </div>
            <DateFormat date={date} url={url} />
        </div>
    )
};

export { Details };