import React from 'react'

function Result() {
  return (
    <div className="result_container">
        <div className="result_message">Congratulations! You scored 165/200. You're a true champion!</div>
        <div className="info">
          <div>Score <p>165</p></div>
          <div>Time <p>42:34</p></div>
          <div>Rank <p>#7</p></div>
          <div>Questions Number <p>40</p></div>
          <div>Users Played The Quiz <p>7</p></div>
          <div>Correct Answers <div className="right_side"><p>30</p> <i className="bi-chevron-right"></i></div></div>
          <div>Unanswered Questions <div className="right_side"><p>2</p> <i className="bi-chevron-right"></i></div></div>
          <div>Wrong Answers <div className="right_side"><p>8</p> <i className="bi-chevron-right"></i></div></div>
        </div>
        <button>Home Page</button>
    </div>
  )
}

/*
    1- From 150 to 200 message => "Outstanding! You scored (score)/200. You're a true champion!" 
    2- From 75 to 149 message => "Great effort! You scored (score)/200. Keep it up and aim even higher!"
    3- From 0 to 74 message => "Dont worry! Your scored (score)/200. Practice makes perfect - try again soon!"
*/

export default Result