import { Link } from "react-router-dom";
import { SearchBar } from "../search/SearchBar";
import { LoginPage } from "../LoginPage";
import { Registration } from "../Registration";


const NavBar = ({ setsearchResult, unreadNotifsCount, unreadMsgsGlobal, user, friendRequests }) => {

        return (
            <nav>
                <a href={`${process.env.REACT_APP_SERVER_URL}/logout`}>Log out</a>
                {user ?
                <div>
                  <SearchBar setsearchResult={setsearchResult}/>
                  <Link to={"/"}>
                    <button>Home</button>
                  </Link>
                  <Link to={"/requests"}>
                    <button>Friend requests {friendRequests ? friendRequests : null}</button>
                  </Link>
                  <Link to={"/chat"}>
                    <button>Message {unreadMsgsGlobal ? unreadMsgsGlobal : null}</button>
                  </Link>
                  <Link to={"/notifications"}>
                    <button>Notifications {unreadNotifsCount ? unreadNotifsCount : null}</button>
                  </Link>
                  <Link to={`/profile/${user._id}`}>{user.name.full}</Link>
                </div>
                : null}          
            </nav>
        )
};

export { NavBar };