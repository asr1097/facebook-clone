import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {

    const [searchInput, setsearchInput] = useState();

    const navigate = useNavigate();
    
    const searchUsers = async (ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("name", searchInput)
        const rawData = await fetch(`${process.env.REACT_APP_SERVER_URL}/profile/search`, {
          credentials: "include",
          mode: "cors",
          method: "post",
          body: formData
        })
        const data = await rawData.json();
        props.setsearchResult(data);
        navigate("/search");
    }

    return (
        <form onSubmit={searchUsers}>
            <input type="text" onChange={(ev) => setsearchInput(ev.target.value)}></input>
            <input type="submit" value={"Search"}></input>
        </form>
    )
}

export { SearchBar };