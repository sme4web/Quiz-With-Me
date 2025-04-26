import React from 'react'

function EnterQuiz() {
  return (
    <div className="enter_quiz_container">
        <div className="title">Quiz With Me</div>
        <div className="info">
            <div className="score">Total Score <p>200</p></div>
            <div className="time">Total Time <p>60:00</p></div>
            <div className="questions">Questions Number <p>40</p></div>
            <div className="user_played_quiz">User Played The Quiz <p>10</p></div>
        </div>
        <button className="start_quiz">Start Quiz</button>
    </div>
  )
}

export default EnterQuiz