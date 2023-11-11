import React, { useState } from "react";
import './App.css';
import './challengeList.css';
import './close.css';
import challenges from './challenges.json';

function level(score) {
  return Math.min(Math.floor(score / 100) + 1, 10)
}

function progress(score) {
  return (score % 100)
}

const App = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState(null);
  const [popupInstructuons, setPopupInstructions] = useState(null);
  const [userScore, setUserScore] = useState(0);

  function ProgressBar(props) {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: progress(userScore) + '%'}} />
        </div>
      </div>
    )
  }
  
  function openPopup(challenge) {
    setPopupTitle(challenge.name)
    setPopupInstructions(challenge.instructions)
    setPopupOpen(true)
  }
  
  function doChallenge() {
    setUserScore(userScore + 34)
    setPopupOpen(false)
  }

  function Popup() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => setPopupOpen(false)} className="score" style={{height: 'auto'}}>
          close
          </div>
        </div>
        <p>{popupTitle}</p>
        <p style={{padding:'3rem'}}>{popupInstructuons}</p>
        <div className="done-button" onClick={() => doChallenge()}>Done</div>
       </div>
      </div>
    );
  };
  function ChallengeList(props) {
    return (
      <div className='challenges'>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {challenges.filter((item => item.level == level(userScore))).map((item, index) => (
            <li
              key={index}
              className='challenge'
              onClick={() => openPopup(item)}
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
          <p>{level(userScore)}</p>
        </div>
      </div>
      <ChallengeList />
      <ProgressBar />
      {popupOpen ? <Popup /> : null}
      </header>
    </div>
    </>
  );
}

export default App;
