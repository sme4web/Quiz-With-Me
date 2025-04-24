import React, { useContext , useRef } from 'react';
import { AppContext } from '../App';
import {auth} from "./Firebase";
import { sendPasswordResetEmail } from 'firebase/auth';

function ResetPasswordMessage() {
    const { setShowResetPasswordMessage , setPopUpValue , setShowSpinner } = useContext(AppContext);
    
    const emailInpRef = useRef(null);

    const send_reset_password_email = (e) => {
        e.preventDefault();
        setShowSpinner(true);
        sendPasswordResetEmail(auth , emailInpRef.current.value).then((credential) => {
            setPopUpValue("Email has been sent to " + emailInpRef.current.value + ". Go and check the Spam in your Gmail.");
            setShowSpinner(false);
        }).catch((err) => {
            setPopUpValue("Something went wrong, try again later.");
        })
    }

    return (
        <div className="reset_password_message_container">
            <form onSubmit={send_reset_password_email}>
                <div className="title">Reset Password</div>
                <div className="form_group">
                    <label htmlFor="email_inp"><div className="dot"></div> <p>Email</p></label>
                    <input ref={emailInpRef} type="email" autoComplete='off' id="email_inp" placeholder='Enter your email...' required />
                    <div className="buttons">
                        <button>Send</button>
                        <button type='button' onClick={() => setShowResetPasswordMessage(false)}>Close</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default ResetPasswordMessage