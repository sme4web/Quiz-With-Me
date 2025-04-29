import React, { useContext, useEffect } from 'react';
import { db } from "./Firebase";
import { update, ref } from "firebase/database";
import { AppContext } from "../App";
import { useNavigate } from 'react-router-dom';

function EnterQuiz() {
  const navigate = useNavigate();
  const { setPopUpValue, setQuestions , setShowSpinner , questions , setUserData , userData , allPlayedUsers } = useContext(AppContext);

  useEffect(() => {
    setShowSpinner(true);
    fetch(process.env.REACT_APP_GET_QUESTIONS_API).then((res) => {
      return res.json();
    }).then((data) => {
      let questions = data.data;
      for (let i = 0; i < questions.length; i++) {
        let answers = [questions[i].correct_answer, questions[i].wrong_answer_1, questions[i].wrong_answer_2, questions[i].wrong_answer_3];
        const randomAnswers = () => {
          const newAnswers = [];
          while (newAnswers.length < 4) {
            const randomIndex = Math.floor(Math.random() * answers.length);
            newAnswers.push(answers[randomIndex]);
            answers.splice(randomIndex, 1);
          }
          answers = newAnswers;
        }
        randomAnswers();
        const newQuestionObject = {
          question: questions[i].the_question,
          answers: answers.sort(() => Math.random() - 0.5),
          correct_answer: questions[i].correct_answer,
        };
        questions[i] = newQuestionObject;
      }
      setQuestions(questions);
      setShowSpinner(false);
    }).catch((err) => {
      console.log(err);
      setShowSpinner(false);
      setPopUpValue("Sorry, an error occurred while fetching the questions!");
      navigate("/");
    })
  }, [])

  const startQuiz = () => {
    let user = userData;
    update(ref(db, "users/" + localStorage.getItem("user")), {
      quizStarted: true,
      quizEndsAt: new Date().getTime() + 3600000,
    }).then(() => {
      let quizEndsAt = new Date().getTime() + 3600000;
      user.quizStarted = true;
      user.quizEndsAt = quizEndsAt;
      setUserData(user);
      navigate("/quiz-page");
    }).catch((err) => {
      setPopUpValue("Sorry, an error occurred while starting the quiz!");
    })
  }

  return (
    <div className="enter_quiz_container">
      <div className="title"><i onClick={() => navigate("/")} className='bi bi-house-door-fill'></i>Quiz With Me</div>
      <div className="info">
        <div className="score">Total Score <p>{questions.length * 5}</p></div>
        <div className="time">Total Time <p>60:00</p></div>
        <div className="questions">Questions Number <p>{questions.length}</p></div>
        <div className="user_played_quiz">User Played The Quiz <p>{allPlayedUsers.length}</p></div>
      </div>
      <button onClick={startQuiz} className="start_quiz">Start Quiz</button>
    </div>
  )
}

export default EnterQuiz