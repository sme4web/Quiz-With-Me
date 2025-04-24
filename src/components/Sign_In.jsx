import React, { useRef, useContext, useState } from 'react';
import { db, auth } from "./Firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from "firebase/database";
import { AppContext } from '../App';

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);

    const emailInpRef = useRef(null);
    const passwordInpRef = useRef(null);

    const { setShowSpinner, setPopUpValue, setCurrentPage, setShowResetPasswordMessage, setUser, setUserData } = useContext(AppContext);

    const sign_in = (e) => {
        e.preventDefault();
        setShowSpinner(true);
        const userData = {
            email: emailInpRef.current.value.trim().toLowerCase(),
        };
        signInWithEmailAndPassword(auth, userData.email, passwordInpRef.current.value).then((credential) => {
            setPopUpValue("Signing you in... This’ll just take some seconds!");
            get(ref(db, "users")).then((res) => {
                const data = res.val();
                let dataKeys = Object.keys(data);
                for (let i = 0; i < dataKeys.length; i++) {
                    let currentUser = data[dataKeys[i]];
                    if (currentUser.email === userData.email) {
                        localStorage.setItem("user", dataKeys[i]);
                        setPopUpValue("Success! You have signed in successfully " + currentUser.username + ".");
                        setShowSpinner(false);
                        setUser(dataKeys[i]);
                        setUserData(currentUser);
                    }
                }
            })
        }).catch((err) => {
            console.log(err.code);
            if (err.code === "auth/invalid-credential") {
                setPopUpValue("Something went wrong. Please, check the email or the password that you have entered.");
            } else if (err.code === "auth/network-request-failed") {
                setPopUpValue("Sorry, but the internet connecting is week.");
            }
            setShowSpinner(false);
        })
    }

    return (
        <div className="sign_in_form">
            <form autoComplete='off' onSubmit={sign_in}>
                <div className="form_group">
                    <label htmlFor="email"><div className="dot"></div> <p className="email">Email</p></label>
                    <input ref={emailInpRef} type="email" spellCheck="false" id="email" autoComplete='off' placeholder='Email' required />
                </div>
                <div className="form_group">
                    <label htmlFor="password"><div className="dot"></div> <p className="password">Password</p></label>
                    <input ref={passwordInpRef} spellCheck="false" type={showPassword ? "text" : "password"} id="password" autoComplete='new-password' minLength="8" placeholder='Password' required />
                    <i onClick={() => setShowPassword(!showPassword)} className={showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}></i>
                    <p className="forget_password" onClick={() => setShowResetPasswordMessage(true)}>Forget Password?</p>
                </div>
                <button className="sign_in" type="submit">Submit</button>
                <div className="account_state">I don't have an account. <button type='button' className="change_page" onClick={() => setCurrentPage("sign up")}>Sign Up</button></div>
            </form>
        </div>
    )
}

export default SignIn;