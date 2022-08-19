import { DateFormat } from "./Date"
import { Link } from "react-router-dom";

const Details = ({ user, date, url }) => {
    return (
        <div>
            <div>
                <Link to={`../${user.url}`}>
                    <img src={`${process.env.REACT_APP_SERVER_URL}/images/${user.profilePhoto}`} alt="Profile"></img>
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