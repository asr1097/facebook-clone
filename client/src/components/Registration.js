import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Registration = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [location, setLocation] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        checkPassword();
    }, [passwordConfirmation]);

    const onEmailChange = (ev) => {
        setEmail(ev.target.value);
    };

    const onPasswordChange = (ev) => {
        setPassword(ev.target.value);
    };

    const onPasswordConfirmationChange = (ev) => {
        setPasswordConfirmation(ev.target.value);
    };

    const onNameChange = (ev) => {
        setFirstName(ev.target.value);
    };

    const onLastNameChange = (ev) => {
        setLastName(ev.target.value);
    };

    const onLocationChange= (ev) => {
        setLocation(ev.target.value);
    };

    const checkPassword = () => {
        if(password === passwordConfirmation) {return setDoPasswordsMatch(true)}
        else{return setDoPasswordsMatch(false)};
    };

    const onSubmit = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("firstName", firstName);
        formData.append("lastName", surname);
        formData.append("location", location);
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/auth/registration`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });
        if(response.ok) {
            navigate("../login")
        }
    };

    return (
        <div>
            <form>
                <input type="email" onChange={onEmailChange}></input>
                <input type="password" onChange={onPasswordChange}></input>
                <input type="password" onChange={onPasswordConfirmationChange}></input>
                <input type="text" placeholder="Name" onChange={onNameChange}></input>
                <input type="text" placeholder="Surname" onChange={onLastNameChange}></input>
                <input type="text" placeholder="Location" onChange={onLocationChange}></input>
                <select>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="date"></input>
                {!doPasswordsMatch ? <span>Passwords do not match</span> : null}
                <input type="submit" value={"Register"}></input>
            </form>
        </div>
    )
};

export { Registration };