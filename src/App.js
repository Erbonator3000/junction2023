import React, { useState } from "react";
import './App.css';
import './challengeList.css';
import './close.css';
import challenges from './challenges.json';

function level(score) {
  return Math.floor(score / 20)
}

function progress(score) {
  return (score % 20) / 20
}

const player = {
  score: 100
}

function ProgressBar(props) {
  return (
    <div className="progress">

    </div>
  )
}

const App = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState(null);
  const [popupInstructuons, setPopupInstructions] = useState(null);

  function openPopup(challenge) {
    console.log(challenge)
    setPopupTitle(challenge.name)
    setPopupInstructions(challenge.instructions)
    setPopupOpen(true)
  }
  
  function Popup() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{margin: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div
            onClick={() => setPopupOpen(false)}
            className="close"
          >
          close
          </div>
        </div>
        <p>{popupTitle}</p>
        <p style={{padding:'3rem'}}>{popupInstructuons}</p>
       </div>
      </div>
    );
  };
  function ChallengeList(props) {
    return (
      <div className='challenges'>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {challenges.map((item, index) => (
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
          <p>{level(player.score)}</p>
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
