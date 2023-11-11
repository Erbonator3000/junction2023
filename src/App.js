import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import './App.css';
import './challengeList.css';
import './close.css';
import challenges from './challenges.json';

const App = () => {
  // const [popupOpen, setPopupOpen] = useState(false);
  // const [popupTitle, setPopupTitle] = useState(null);
  // const [popupInstructuons, setPopupInstructions] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  // const [userScore, setUserScore] = useState(0);

  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  function level() {
    if (cookies.user?.score)
      return Math.min(Math.floor(cookies.user.score / 100) + 1, 10)
    return 1
  }
  
  function progress() {
    if (cookies.user?.score)
      return (cookies.user.score % 100)
    return 0
  }

  // Set initial cookie
  if (cookies.user === undefined) {
    console.log("asdasdasd")
    setCookie('user', {score: 0, completed: []})
  }

  function ProgressBar(props) {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: progress() + '%'}} />
        </div>
      </div>
    )
  }
  
  function openPopup(challenge) {
    setSelectedChallenge(challenge)
  }
  
  function doChallenge() {
    console.log(cookies.user)
    console.log(selectedChallenge)
    setCookie('user', {score: cookies.user.score + 20, completed: cookies.user.completed.concat([selectedChallenge.id])})
    setSelectedChallenge(null)
    console.log(cookies.user)
  }

  function Popup() {
    return (
      <div className="popup-container" onClick={() => setSelectedChallenge(null)}>
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => setSelectedChallenge(null)} className="score" style={{height: 'auto', paddingBottom: '3px', paddingTop: '3px'}}>
          close
          </div>
        </div>
        <p>{selectedChallenge.name}</p>
        <p style={{padding:'3rem'}}>{selectedChallenge.instructions}</p>
        <div className="done-button" onClick={() => doChallenge()}>Done</div>
       </div>
      </div>
    );
  };
  function ChallengeList(props) {
    return (
      <div className='challenges'>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {challenges
            .filter((item => item.level == level() && !cookies.user.completed.includes(item.id)))
            .concat(challenges.filter((item => item.level == level() && cookies.user.completed.includes(item.id))))
            .map((item, index) => (
            <li
              key={index}
              className='challenge'
              onClick={() => openPopup(item)}
              style={cookies.user.completed.includes(item.id) ? {backgroundColor: 'lightgrey'} : {}}
            >
                {item.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  
  return (
    <>
    <div className="App">
      <header className="body">
      <div className="top-bar">
        <div className="title">
          <p>My daily challenges</p>
        </div>
        <div className="score">
          <p>{level()}</p>
        </div>
      </div>
      <ChallengeList />
      <ProgressBar />
      {selectedChallenge ? <Popup /> : null}
      </header>
    </div>
    </>
  );
}

export default App;
