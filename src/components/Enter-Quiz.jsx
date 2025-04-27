import React, { useContext } from 'react';
import { db } from "./Firebase";
import { update, ref } from "firebase/database";
import { AppContext } from "../App";

function EnterQuiz() {
  const { setPopUpValue } = useContext(AppContext);

  const startQuiz = () => {
    update(ref(db, "users/" + localStorage.getItem("user")), {
      quizStarted: true,
      quizEndsAt: new Date().getTime() + 3600000,
    }).catch((err) => {
      console.log(err.code);
      setPopUpValue("Sorry, an error occurred while starting the quiz!");
    })
  }

  return (
    <div className="enter_quiz_container">
      <div className="title">Quiz With Me</div>
      <div className="info">
        <div className="score">Total Score <p>200</p></div>
        <div className="time">Total Time <p>60:00</p></div>
        <div className="questions">Questions Number <p>40</p></div>
        <div className="user_played_quiz">User Played The Quiz <p>10</p></div>
      </div>
      <button onClick={startQuiz} className="start_quiz">Start Quiz</button>
    </div>
  )
}

export default EnterQuiz