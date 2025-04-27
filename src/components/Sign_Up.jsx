import React, { useRef, useContext, useState } from 'react';
import { db, auth } from "./Firebase";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { set, ref } from "firebase/database";
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const emailInpRef = useRef(null);
    const passwordInpRef = useRef(null);
    const userNameInpRef = useRef(null);

    const { setShowSpinner, setPopUpValue, setCurrentPage, setUser, setUserData } = useContext(AppContext);

    const IDGenerator = () => {
        const id_symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let id = "";
        for (let i = 0; i < 30; i++) {
            id += id_symbols[Math.floor(Math.random() * id_symbols.length)];
        }
        return id;
    }

    const sign_up = (e) => {
        e.preventDefault();
        setShowSpinner(true);
        const userData = {
            username: userNameInpRef.current.value.trim(),
            email: emailInpRef.current.value.trim().toLowerCase(),
            userID: IDGenerator(),
        };
        createUserWithEmailAndPassword(auth, userData.email, passwordInpRef.current.value).then((credential) => {
            setPopUpValue("Signing you up... This’ll just take some seconds!");
            set(ref(db, "users/" + userData.userID), userData).then(() => {
                setShowSpinner(false);
                setPopUpValue("Success! Thanks for joining us, " + userData.username + "!");
                localStorage.setItem("user", userData.userID);
                setUser(userData.userID);
                setUserData(userData);
            }).catch((err) => {
                if (err.code) {
                    setPopUpValue("Something went wrong!");
                }
            })
        }).catch((err) => {
            if (err.code === "auth/email-already-in-use") {
                setPopUpValue("This email is already registered. Please sign in or use a different email.");
            }
            setShowSpinner(false);
        })
    }

    return (
        <div className="sign_up_form">
            <form autoComplete='off' onSubmit={sign_up}>
                <div className="form_group">
                    <label htmlFor="user_name"><div className="dot"></div> <p className="name">Username</p></label>
                    <input ref={userNameInpRef} spellCheck="false" autoComplete='off' type="text" id="user_name" placeholder='Username' required />
                </div>
                <div className="form_group">
                    <label htmlFor="email"><div className="dot"></div> <p className="email">Email</p></label>
                    <input ref={emailInpRef} type="email" spellCheck="false" id="email" autoComplete='off' placeholder='Email' required />
                </div>
                <div className="form_group">
                    <label htmlFor="password"><div className="dot"></div> <p className="password">Password</p></label>
                    <input ref={passwordInpRef} spellCheck="false" type={showPassword ? "text" : "password"} id="password" autoComplete='new-password' minLength="8" placeholder='Password' required />
                    <i onClick={() => setShowPassword(!showPassword)} className={showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}></i>
                </div>
                <button className="sign_up" type="submit">Submit</button>
                <div className="account_state">I already have an account. <button type='button' className="change_page" onClick={() => navigate('/sign-in')}>Sign In</button></div>
            </form>
        </div>
    )
}

export default SignUp;