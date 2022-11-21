import { useState } from "react";
import SignIn from "./UserAuth/SignIn";
import SignUp from "./UserAuth/SignUp";
import '../styles/AuthWindow.css';

export default function AuthWindow() {
    // ------ INIT VARIABLE ------
    const [authType, setAuthType] = useState("login");

    return (
        <>
            {authType == 'login' &&
                <div className="authContainer">
                    <h3>AUTHENTICATION REQUIRED</h3>
                    <SignIn />
                    <button className="signUpInsteadBtn" onClick={() => { setAuthType('signup') }}>Sign Up Instead</button>
                </div>
            }

            {authType == 'signup' &&
                <div className="authContainer">
                    <h3>AUTHENTICATION REQUIRED</h3>
                    <SignUp />
                    <button className="signInInsteadBtn" onClick={() => { setAuthType('login') }}>Sign In Instead</button>
                </div>
            }
        </>
    );
}