import { useEffect, useState } from "react";

const Registration = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirmation, setPasswordConfirmation] = useState();
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    const onEmailChange = (ev) => {
        setEmail(ev.target.value);
    };

    const onPasswordChange = (ev) => {
        setPassword(ev.target.value);
    };

    const onPasswordConfirmationChange = (ev) => {
        setPasswordConfirmation(ev.target.value);
        checkPassword();
    };

    const checkPassword = () => {
        if(password !== passwordConfirmation) {setDoPasswordsMatch(false)}
        else{setDoPasswordsMatch(true)};
    };

    const onSubmit = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        let response = await fetch(`${process.env.REACT_APP_SERVER_URL}/registration`, {
            mode: "cors",
            credentials: "include",
            method: "post",
            body: formData
        });
        if(response.ok) {}
    };

    return (
        <div>
            <form>
                <input type="email" onChange={onEmailChange}></input>
                <input type="password" onChange={onPasswordChange}></input>
                <input type="password" onChange={onPasswordConfirmationChange}></input>
                <input type="text" placeholder="Name"></input>
                <input type="text" placeholder="Surname"></input>
                <select>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <input type="date"></input>
                {passwordConfirmation !== null && !doPasswordsMatch ? <span>Passwords do not match</span> : null}
                <input type="submit" value={"Register"}></input>
            </form>
        </div>
    )
};

export { Registration };