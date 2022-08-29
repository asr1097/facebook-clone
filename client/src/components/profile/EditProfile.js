import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {

    const user = useContext(UserContext);
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [gender, setGender] = useState();
    const [DOB, setDOB] = useState();
    const [location, setLocation] = useState();

    const onSubmit = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("gender", gender);
        formData.append("DOB", DOB);
        formData.append("location", location);

        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/profile/edit`, {
            method: "put",
            credentials: "include",
            mode: "cors",
            body: formData
        })
        if(response.ok) {
            navigate(`/profile/${user._id}`)
        }
    }

    useEffect(() => {
        if(user && !firstName) {
            setFirstName(user.name.first);
            setLastName(user.name.last);
            setGender(user.gender);
            setDOB(user.dateOfBirth);
            setLocation(user.location)
        }
    }, [user, firstName]);

    if(user) {
        return (
            <form onSubmit={onSubmit}>
                <input onChange={(ev) => setFirstName(ev.target.value)} type="text" maxLength="99" defaultValue={firstName}></input>
                <input onChange={(ev) => setLastName(ev.target.value)} type="text" maxLength="99" defaultValue={lastName}></input>
                <select value={gender} onChange={(ev) => setGender(ev.target.value)}>
                    <option value={"Male"}>Male</option>
                    <option value={"Female"}>Female</option>
                    <option value={"Other"}>Other</option>
                </select> 
                <input onChange={(ev) => setDOB(new Date(ev.target.value).toISOString())} type="date" value={DOB ? new Date(DOB).toISOString().substring(0, 10) : ""}></input>
                <input type="text" maxLength="99" onChange={(ev) => setLocation(ev.target.value)} defaultValue={location}></input>
                <input type="submit" value="Edit info"></input>
            </form>
        )
    }
};

export { EditProfile };