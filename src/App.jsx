import React, { createContext, useEffect, useState } from "react";
import './App.css';
import SignUp from "./components/Sign_Up";
import SignIn from "./components/Sign_In";
import Spinner from "./components/Spinner";
import PopUpMessage from "./components/Pop_Up_Message";
import NoInternetConnection from "./components/No_Internet_Connection";
import ResetPasswordMessage from "./components/Reset_Password_Message";
import Main from "./components/Main";
import { get, ref } from "firebase/database";
import { db } from "./components/Firebase";
import Chat from "./components/Chat";
import QuizPage from "./components/Quiz-page";

export const AppContext = createContext();

console.log(process.env.REACT_APP_GET_QUESTIONS_API);

function App() {
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userData, setUserData] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [popUpValue, setPopUpValue] = useState("");
  const [currentPage, setCurrentPage] = useState("sign up");
  const [connected, setConnected] = useState(true);
  const [showResetPasswordMessage, setShowResetPasswordMessage] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (navigator.onLine) {
      setConnected(true);
    } else {
      setConnected(false);
    }

    window.addEventListener("offline", (e) => {
      setConnected(false);
    })

    window.addEventListener("online", () => {
      setConnected(true);
    })
  }, [])

  useEffect(() => {
    if (user) {
      setShowSpinner(true);
      get(ref(db, "users/" + user)).then((snapShot) => {
        let data = snapShot.val();
        if (data) {
          setUserData(data);
          setShowSpinner(false);
        }else {
          localStorage.removeItem("user");
          setUser("");
          setShowSpinner(false);
        }
      }).catch(() => {
        setPopUpValue("Something went wrong!");
      })
    }
  }, [user])

  const filterName = (name) => {
    let maxLength = 13;
    let newName = "";
    if (name.length > maxLength) {
      for (let i = 0; i < 10; i++) {
        newName += name[i];
      }
      newName += "...";
    } else {
      return name;
    }
    return newName;
  }

  return (
    <>
      <AppContext.Provider value={{ setShowSpinner, setPopUpValue, setCurrentPage, setShowResetPasswordMessage, setUser, userData, setUserData, setShowChat , filterName , showSpinner }}>
        {/* {user ? <Main /> : (currentPage === "sign in" ? <SignIn /> : <SignUp />)}
        {showResetPasswordMessage && <ResetPasswordMessage />}
        {showChat && <Chat />} */}
        {popUpValue && <PopUpMessage value={popUpValue} />}
        <QuizPage />
      </AppContext.Provider>
      {connected ? "" : <NoInternetConnection />}
      {showSpinner ? <Spinner /> : ""}
    </>
  );
}

export default App;
