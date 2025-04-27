import React, { createContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
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
import EnterQuiz from "./components/Enter-Quiz";
import Result from "./components/Result";
import './App.css';

export const AppContext = createContext();

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(localStorage.getItem("user"));
  const [userData, setUserData] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [popUpValue, setPopUpValue] = useState("");
  const [connected, setConnected] = useState(true);
  const [showResetPasswordMessage, setShowResetPasswordMessage] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [allAnswers, setAllAnswers] = useState([]);
  const [storedChoosedAnswers, setStoredChoosedAnswers] = useState([]);
  const [questions , setQuestions] = useState([]);
  const [allPlayedUsers , setAllPlayedUsers] = useState([]);

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
          setStoredChoosedAnswers(data.choosedAnswers || []);
          if (data.quizStarted) {
            navigate("/quiz-page");
          }else {
            navigate("/");
          }
        } else {
          localStorage.removeItem("user");
          setUser("");
          setShowSpinner(false);
        }
      }).catch(() => {
        setPopUpValue("Something went wrong!");
      })
    }

    get(ref(db , "finished_users")).then((snapShot) => {
      let data = snapShot.val();
      if (data) {
        let allUsers = [];
        for (let key in data) {
          allUsers.push(data[key]);
        }
        allUsers.sort((a, b) => a.score < b.score)
        setAllPlayedUsers(allUsers);
      }
    })
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
      <AppContext.Provider value={{ setShowSpinner, setPopUpValue, setShowResetPasswordMessage, setUser, userData, setUserData, setShowChat, filterName, showSpinner, setUserScore, setUserRank, userScore, userRank, storedChoosedAnswers , setStoredChoosedAnswers , questions , setQuestions }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/start-quiz" element={<EnterQuiz />} />
          <Route path="/quiz-page" element={<QuizPage />} />
          <Route path="/result" element={<Result />} />
        </Routes>
        {showChat ? <Chat /> : ""}
        {showResetPasswordMessage ? <ResetPasswordMessage /> : ""}
        {popUpValue ? <PopUpMessage value={popUpValue} setPopUpValue={setPopUpValue} /> : ""}
      </AppContext.Provider>
      {connected ? "" : <NoInternetConnection />}
      {showSpinner ? <Spinner /> : ""}
    </>
  );
}

export default App;
