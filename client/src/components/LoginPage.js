import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = (props) => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [showSignInBtn, setShowSignInBtn] = useState(true);

    const navigate = useNavigate();

    const onClick = (ev) => {
        ev.preventDefault();
        setShowSignInBtn(false);
        navigate("/register")
        return
    };

    const onEmailChange = (ev) => {
        ev.preventDefault();
        setEmail(ev.target.value);
    };

    const onPasswordChange = (ev) => {
        ev.preventDefault();
        setPassword(ev.target.value);
    };

    const onSubmit = async(ev) => {
        ev.preventDefault();
        let formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
    }

    return (
        <div>
            <a href={`${process.env.REACT_APP_SERVER_URL}/auth/facebook`}>Log in with facebook</a>
            <a href={`${process.env.REACT_APP_SERVER_URL}/auth/google`}> Log in with google</a> 
            <form>
                <input type="email" onChange={onEmailChange}></input>
                <input type="password" onChange={onPasswordChange}></input>
                <label>
                    Log in <input type="submit"></input>
                </label>
                <input type="submit" value="Sign in" onSubmit={onSubmit}></input>
            </form>
            {showSignInBtn ? 
            <div >
                <span>Don't have an account?</span>
                <button onClick={onClick}>Sign in</button>
            </div>
            : null}
        </div> 
    )
    
};

export { LoginPage };