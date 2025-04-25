import { useEffect, useState, useContext, use } from 'react';
import { AppContext } from "../App";

function QuizPage() {
    const { showSpinner, setPopUpValue } = useContext(AppContext);
    const [questions, setQuestions] = useState([]);
    const [totalTime, setTotalTime] = useState(60 / 6);
    const minutes = Math.floor(totalTime / 60);
    const seconds = Math.floor(totalTime % 60);
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!showSpinner) {
                setTotalTime(prev => {
                    if (prev === 1) {
                        clearInterval(interval);
                        setShowTimeout(true);
                        return 0;
                    }

                    return prev - 1;
                });
            }
        }, 1000)
    }, [])

    useEffect(() => {
        if(showTimeout) {
            setPopUpValue("Time is up!");
            setShowTimeout(false);
        }
    },[showTimeout])

    return (
        <div className="quiz_page_container">
            <div className="header">
                <div className="content">04/40</div>
                <div className="content website_name">Quiz With Me</div>
                <div className="content"><i className="bi bi-clock"></i> {minutes >= 10 ? minutes : "0" + minutes}:{seconds >= 10 ? seconds : "0" + seconds}</div>
            </div>
            <div className="question_container">
                <div className="content">
                    <div className="question"><p>What is the capital of France Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, eveniet.?</p></div>
                    <div className="answers">
                        <button className="answer">Paris</button>
                        <button className="answer">London</button>
                        <button className="answer">Cairo</button>
                        <button className="answer">Alkhartom</button>
                    </div>
                </div>
            </div>
            <div className="controls_container">
                <button disabled className="control"><i className="bi bi-chevron-left"></i> Prev</button>
                <button className="control">Next <i className="bi bi-chevron-right"></i></button>
            </div>
        </div>
    );
}

export default QuizPage;