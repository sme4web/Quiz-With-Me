import { useEffect, useState, useContext } from 'react';
import { AppContext } from "../App";
import { update , ref } from "firebase/database";
import { db } from "./Firebase";

function QuizPage() {
    const { showSpinner, setPopUpValue , userData , StoredChoosedAnswers } = useContext(AppContext);
    const [questions, setQuestions] = useState([]);
    const endsAt = parseInt(userData.quizEndsAt);
    const [showTimeout, setShowTimeout] = useState(false);
    const [questionIndex, setQuestionIndex] = useState(1);
    const [choosedAnswers , setChoosedAnswers] = useState(StoredChoosedAnswers || []);
    const [score , setScore] = useState(0);
    const [notAnsweredQuestions , setNotAnsweredQuestions] = useState([]);
    const [wrongAnswers , setWrongAnswers] = useState([]);

    const [minutes , setMinutes] = useState(Math.floor((endsAt - new Date().getTime()) / 1000 / 60));
    const [seconds , setSeconds] = useState(Math.floor((endsAt - new Date().getTime()) / 1000 % 60));

    useEffect(() => {
            fetch(process.env.REACT_APP_GET_QUESTIONS_API).then((res) => {
                return res.json();
            }).then((data) => {
                let questions = data.data;
                for(let i = 0; i < questions.length; i++) {
                    let answers = [questions[i].correct_answer, questions[i].wrong_answer_1, questions[i].wrong_answer_2, questions[i].wrong_answer_3];
                    const randomAnswers = () => {
                        const newAnswers = [];
                        while(newAnswers.length < 4) {
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
            }).catch((err) => {
                console.log(err);
                setPopUpValue("Sorry, an error occurred while fetching the questions!");
            })
    }, [])

    useEffect(() => {
        let interval;
        
        if (!showSpinner) {
            interval = setInterval(() => {
                setSeconds(Math.floor((endsAt - new Date().getTime()) / 1000 % 60));
                setMinutes(Math.floor((endsAt - new Date().getTime()) / 1000 / 60));
            }, 1000);
        }
    
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showSpinner]);

    useEffect(() => {
        if(showTimeout) {
            setPopUpValue("Time is up!");
            setShowTimeout(false);
        }
    },[showTimeout])

    const finish = () => {
        let socre = 0;
        let correctQuestionPoints = 5;
        let wrongAnswers = [];
        let unAnsweredQuestions = [];

        for(let i = 0; i < questions.length; i++) {
            if(choosedAnswers[i] === questions[i].correct_answer) {
                socre += correctQuestionPoints;
            }else {
                if(choosedAnswers[i] === undefined) {
                    unAnsweredQuestions.push(questions[i]);
                }else {
                    wrongAnswers.push(questions[i]);
                }
            }
        }
        setScore(socre);
        setWrongAnswers(wrongAnswers);
        setNotAnsweredQuestions(unAnsweredQuestions);
        update(ref(db, "users/" + localStorage.getItem("user")), {
            finished: true,
            finishedAt: new Date().getTime(),
            score: socre,
        })
    }

    const setAnswer = (index) => {
        const the_answer = questions[questionIndex - 1].answers[index];
        let answers = choosedAnswers;
        answers[questionIndex - 1] = the_answer;
        setChoosedAnswers(answers);
        update(ref(db, "users/" + localStorage.getItem("user")), {
            choosedAnswers: choosedAnswers, 
        }).catch((err) => {
            console.log(err.code);
            console.log("Cannot save the answers in the database!");;
        })

    }

    return (
        <div className="quiz_page_container">
            <div className="header">
                <div className="content">{questionIndex < 10 ? "0" + questionIndex : questionIndex}/{questions.length}</div>
                <div className="content website_name">Quiz With Me</div>
                <div className="content"><i className="bi bi-clock"></i> {minutes >= 10 ? minutes : "0" + minutes}:{seconds >= 10 ? seconds : "0" + seconds}</div>
            </div>
            <div className="question_container">
                <div className="content">
                    <div className="question"><p>{questions.length && questions[questionIndex - 1].question}</p></div>
                    <div className="answers">
                        <button onClick={() => setAnswer(0)} className={"answer " + (choosedAnswers[questionIndex - 1] && choosedAnswers[questionIndex - 1] === questions[questionIndex - 1].answers[0] ? "active" : "")}>{questions.length && questions[questionIndex - 1].answers[0]}</button>
                        <button onClick={() => setAnswer(1)} className={"answer " + (choosedAnswers[questionIndex - 1] && choosedAnswers[questionIndex - 1] === questions[questionIndex - 1].answers[1] ? "active" : "")}>{questions.length && questions[questionIndex - 1].answers[1]}</button>
                        <button onClick={() => setAnswer(2)} className={"answer " + (choosedAnswers[questionIndex - 1] && choosedAnswers[questionIndex - 1] === questions[questionIndex - 1].answers[2] ? "active" : "")}>{questions.length && questions[questionIndex - 1].answers[2]}</button>
                        <button onClick={() => setAnswer(3)} className={"answer " + (choosedAnswers[questionIndex - 1] && choosedAnswers[questionIndex - 1] === questions[questionIndex - 1].answers[3] ? "active" : "")}>{questions.length && questions[questionIndex - 1].answers[3]}</button>
                    </div>
                </div>
            </div>
            <div className="controls_container">
                <button disabled={questionIndex === 1 && true} className="control" onClick={() => setQuestionIndex(questionIndex - 1)}><i className="bi bi-chevron-left"></i> Prev</button>
                <button className="control" onClick={() => {questionIndex === questions.length ? finish() : setQuestionIndex(questionIndex + 1)}}>{questionIndex === questions.length ? "Finish" : "Next"} {questionIndex === questions.length ? "" : <i className="bi bi-chevron-right"></i>}</button>
            </div>
        </div>
    );
}

export default QuizPage;