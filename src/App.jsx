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
import ShowAllUsers from "./components/showAllUsers";
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
  const [storedChoosedAnswers, setStoredChoosedAnswers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [allPlayedUsers, setAllPlayedUsers] = useState([]);
  const [topTenUsers, setTopTenUsers] = useState([]);
  const [otherUsers , setOtherUsers] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false);

      // useEffect(() => {
      //       const IDGenerator = () => {
      //           const id_symbols = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      //           let id = "";
      //           for (let i = 0; i < 30; i++) {
      //               id += id_symbols[Math.floor(Math.random() * id_symbols.length)];
      //           }
      //           return id;
      //       }
      //       let names = ["Ali", "Sara", "John", "Doe", "Jane", "Smith", "Michael", "Emily", "David", "Sophia"];
      //       for(let i = 0; i < 20; i++) {
      //         let userData = {
      //           username: names[Math.floor(Math.random() * names.length)],
      //           userID: IDGenerator(),
      //           score: Math.floor(Math.random() * 200),
      //         };
      //         set(ref(db, "finished_users/" + userData.userID), userData)
      //       }
      // },[])
  

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
          } else {
            if (window.location.pathname === "/see-answers" || window.location.pathname === "/quiz-page") {
              navigate("/see-answers");
            } else if (window.location.pathname === "/result") {
              navigate("/result");
            } else {
              navigate("/");
            }
          }
        } else {
          localStorage.removeItem("user");
          setUser("");
          setShowSpinner(false);
        }
      }).catch(() => {
        setPopUpValue("Something went wrong!");
      })
    } else {
      navigate("/sign-in");
    }

    get(ref(db, "finished_users")).then((snapShot) => {
      let data = snapShot.val();
      if (data) {
        let allUsers = [];
        for (let key in data) {
          allUsers.push(data[key]);
        }     

        allUsers.sort((a, b) => b.score - a.score)
        setAllPlayedUsers(allUsers);
        setTopTenUsers(allUsers.slice(0, 10));
        setOtherUsers(allUsers.slice(10, allUsers.length));
        let userRank = 0;
        for (let i = 0; i < allUsers.length; i++) {
          if (allUsers[i].userID === user) {
            userRank = i + 1;
            break;
          }
        }
        setUserRank(userRank);
      }
    })
  }, [user])

  useEffect(() => {
    let allUsers = allPlayedUsers;
    allUsers.sort((a, b) => b.score - a.score);
    setAllPlayedUsers(allUsers);
  }, [allPlayedUsers])

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
      <AppContext.Provider value={{ setShowSpinner, setPopUpValue, setShowResetPasswordMessage, setUser, userData, setUserData, setShowChat, filterName, showSpinner, setUserScore, setUserRank, userScore, userRank, storedChoosedAnswers, setStoredChoosedAnswers, questions, setQuestions, allPlayedUsers, setAllPlayedUsers , topTenUsers , otherUsers , setShowAllUsers , setTopTenUsers , setOtherUsers }}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/start-quiz" element={<EnterQuiz />} />
          <Route path="/quiz-page" element={<QuizPage />} />
          <Route path="/result" element={<Result />} />
          <Route path="/see-answers" element={<QuizPage />} />
        </Routes>
        {showAllUsers ? <ShowAllUsers /> : ""}
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
