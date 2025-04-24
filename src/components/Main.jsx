import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../App';
import Footer from "./Footer";

function Main() {
  const [remainingDays, setRemainingDays] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [remainingMinutes, setRemainingMinutes] = useState(0);

  const getRemainingTime = () => {
    const targetDay = new Date("April 25 2025 00:00:00").getTime();
    const distance = targetDay - new Date().getTime();

    const days = Math.floor(distance / 1000 / 60 / 60 / 24);
    const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(distance / 1000 / 60) % 60;
    console.log(days , hours , minutes);
    setRemainingDays(days);
    setRemainingHours(hours)
    setRemainingMinutes(minutes);
  }

  useEffect(() => {
    getRemainingTime();
    setInterval(() => {
      getRemainingTime();
    },5000)
  },[])

  const email = "sme.dev212@gmail.com";
  const { userData, setPopUpValue, setShowChat, setUser, setUserData } = useContext(AppContext);
  const emailRef = useRef(null);

  const copy_email = () => {
    const canCopy = "clipboard" in navigator;
    if (canCopy) {
      navigator.clipboard.writeText(email);
      setPopUpValue("Email has been copied successfully!");
    } else {
      const range = document.createRange();
      const selecttion = window.getSelection();
      range.selectNodeContents(emailRef.current);
      selecttion.removeAllRanges();
      selecttion.addRange(range);
      document.execCommand("copy");
      setTimeout(() => {
        selecttion.removeAllRanges();
      }, 0)
      setPopUpValue("Email has been copied successfully!");
    }
  }

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

  const logout = () => {
    localStorage.removeItem("user");
    setUser("");
    setUserData({});
  }

  return (
    <div className="main_page">
      <div className="top">
        <div className="hello_message"><p>Hello {filterName(userData.username || "")}!</p> <button onClick={logout}>Logout</button></div>
        <div className="items">
          <div className="last_score container_p">Score <p>105</p></div>
          <div className="rank container_p">Rank <p className='ended'>Ended</p></div>
        </div>
      </div>
      <div className="chat_button">
        <button onClick={() => setShowChat(true)}><div className="left_side"><i className="bi bi-chat-dots"></i> Chat</div> <i className="bi bi-chevron-right"></i></button>
        <button className="start_quiz_button"><div className="left_side"><i className="bi-card-list"></i> Start Quiz</div> <i className="bi-chevron-right"></i></button>
      </div>
      <div className="top_10_users">
        <div className="title">Top 10 Users</div>
        <div className="users">
          <div className="user">
            <div className="left_side">
              <div className="rank">#1</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#2</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#3</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#4</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#5</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#6</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#7</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#8</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#9</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
          <div className="user">
            <div className="left_side">
              <div className="rank">#10</div>
              <div className="name">SME DEV</div>
            </div>
            <div className="right_side">
              <div className="score">150</div>
            </div>
          </div>
        </div>
        <button className="show_all_users">Show All Users</button>
      </div>
      <div className="bottom_content">
        <div className="next_quiz_after">
          <div className="title">Next Quiz Will Be After</div>
          <div className="time">
            <div className="content">
              <p>{remainingDays} Days</p>
              <p>{remainingHours} Hours</p>
              <p>{remainingMinutes} Minutes</p>
            </div>
          </div>
        </div>
        <div className="contact_with_me">
          <div className="title">Contact With The Owner</div>
          <div className="content" onClick={copy_email}>
            <div ref={emailRef} className="email">{email}</div>
            <div className="click_message">Click to copy!</div>
          </div>
        </div>
        <div className="contact_with_me">
          <div className="title">Owner Social Links</div>
          <div className="links">
            <a href="https://www.instagram.com/sme.dev" target='_blanc'><i data-name="Instagram" className='bi-instagram'></i></a>
            <i data-name="Github" className="bi-github"></i>
            <i data-name="LinkedIn" className="bi-linkedin"></i>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Main;