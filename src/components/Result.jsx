import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

function Result() {
  const navigate = useNavigate();

  const { userData, questions, setQuestions, setPopUpValue, userRank, allPlayedUsers , setAllPlayedUsers , setUserRank , setTopTenUsers , setOtherUsers} = useContext(AppContext);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [notAnsweredQuestions, setNotAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [passedMinutes, setPassedMinutes] = useState([]);
  const [passedSeconds, setPassedSeconds] = useState([]);

  useEffect(() => {
    if (!questions.length) {
      fetch(process.env.REACT_APP_GET_QUESTIONS_API).then((res) => res.json()).then((data) => {
        let questions = data.data;
        setQuestions(questions);
      }).catch((err) => {
        console.log(err.code);
        setPopUpValue("Sorry, an error occurred while fetching the questions!");
        navigate("/");
      })
    } else {
      if (!questions[0].answers) {
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
            answers: answers,
            correct_answer: questions[i].correct_answer,
          };
          questions[i] = newQuestionObject;
        }
        setQuestions(questions);
      }
    }
  }, [questions])

  useEffect(() => {
    if(userData.finished) {
      let allUsers = allPlayedUsers;
      let newUser = {
        userID: localStorage.getItem("user"),
        username: userData.username,
        score: userData.score,
      };
      allUsers.push(newUser);
      allUsers.sort((a, b) => b.score - a.score);
      setAllPlayedUsers(allUsers);
      setTopTenUsers(allUsers.slice(0, 10));
      setOtherUsers(allUsers.slice(10, allUsers.length));
      
      for(let i = 0; i < allUsers.length; i++) {
        if(allUsers[i].userID === localStorage.getItem("user")) {
          setUserRank(i + 1);
          break;
        }
      }
    }else {
      navigate("/");
    }
  },[])

  useEffect(() => {
    if (userData.finished) {
      let correctAnswers = [];
      let wrongAnswers = [];
      let notAnsweredQuestions = [];

      correctAnswers.length = questions.length;

      for (let i = 0; i < questions.length; i++) {
        if (userData.choosedAnswers[i] === questions[i].correct_answer) {
          correctAnswers[i] = questions[i];
        } else {
          if (userData.choosedAnswers[i] === undefined) {
            notAnsweredQuestions.push(questions[i]);
          } else {
            wrongAnswers.push(questions[i]);
          }
        }
      }

      for (let i = 0; i < correctAnswers.length; i++) {
        if (correctAnswers[i] === undefined) {
          correctAnswers.splice(i, 1);
          i--;
        }
      }

      setCorrectAnswers(correctAnswers);
      setWrongAnswers(wrongAnswers);
      setNotAnsweredQuestions(notAnsweredQuestions);
    }
  }, [userData, questions])

  useEffect(() => {
    setPassedMinutes(Math.floor((userData.finishedAt - (userData.quizEndsAt - 3600000)) / 1000 / 60));
    setPassedSeconds(Math.floor((userData.finishedAt - (userData.quizEndsAt - 3600000)) / 1000 % 60));
  }, [userData])

  return (
    <div className="result_container">
      <div className="result_message">{userData.score >= 150 ? `Congratulations! You scored ${userData.score}/200. You're a true champion!` : (userData.score >= 75 && userData.score <= 149 ? `Great effort! You scored ${userData.score}/200. Keep it up and aim even higher!` : `Dont worry! Your scored ${userData.score}/200. Practice makes perfect - try again soon!`)}</div>
      <div className="info">
        <div>Score <p>{userData.score}</p></div>
        <div>Time <p>{passedMinutes > 9 ? passedMinutes : "0" + passedMinutes}:{passedSeconds < 10 ? "0" + passedSeconds : passedSeconds}</p></div>
        <div>Rank <p>#{userRank}</p></div>
        <div>Questions Number <p>{questions.length}</p></div>
        <div>Users Played The Quiz <p>{allPlayedUsers.length}</p></div>
        <div>Correct Answers <div className="right_side"><p>{correctAnswers.length}</p> <i className="bi-chevron-right" onClick={() => navigate("/see-answers")}></i></div></div>
        <div>Unanswered Questions <div className="right_side"><p>{notAnsweredQuestions.length}</p> <i className="bi-chevron-right" onClick={() => navigate("/see-answers")}></i></div></div>
        <div>Wrong Answers <div className="right_side"><p>{wrongAnswers.length}</p> <i className="bi-chevron-right" onClick={() => navigate("/see-answers")}></i></div></div>
      </div>
      <button onClick={() => navigate("/")}>Home Page</button>
    </div>
  )
}

/*
    1- From 150 to 200 message => "Outstanding! You scored (score)/200. You're a true champion!" 
    2- From 75 to 149 message => "Great effort! You scored (score)/200. Keep it up and aim even higher!"
    3- From 0 to 74 message => "Dont worry! Your scored (score)/200. Practice makes perfect - try again soon!"
*/

export default Result