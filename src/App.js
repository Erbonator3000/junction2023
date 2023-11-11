import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import './App.css';
import './challengeList.css';
import './close.css';
import challenges from './challenges.json';
import { shareOnMobile } from 'react-mobile-share';
import orang from './orang.jpeg';

const App = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [levelup, setLevelup] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  function level(score) {
    if (cookies.user?.score)
      return Math.min(Math.floor(score / 100) + 1, 10)
    return 1
  }
  
  function progress() {
    if (cookies.user?.score)
      return (cookies.user.score % 100)
    return 0
  }

  // Set initial cookie
  if (cookies.user === undefined) {
    setCookie('user', {score: 0, completed: []})
  }

  function ProgressBar(props) {
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: progress() + '%', transitionDuration: '2s'}} />
        </div>
      </div>
    )
  }
  
  function openPopup(challenge) {
    setSelectedChallenge(challenge)
  }
  
  function doChallenge() {
    const originalLevel = level(cookies.user.score)
    const newScore = cookies.user.score + 20

    setCookie('user', {score: newScore, completed: cookies.user.completed.concat([selectedChallenge.id])})
    setSelectedChallenge(null)
    if (level(newScore) !== originalLevel) {
      setLevelup(true)
    }
  }


  function PopupLevelup() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => setLevelup(false)} className="score" style={{height: 'auto', paddingBottom: '3px', paddingTop: '3px'}}>
          close
          </div>
        </div>
        <p>{'You reached level '+ level(cookies.user.score) + '!'}</p>
        <div className="done-button" onClick={() => {
          setLevelup(false)
          shareOnMobile({
            url: "https://master--tranquil-cobbler-a5bc99.netlify.app/",
            title: "Hey! I just reached level " + level(cookies.user.score) + ', Your turn to get moving! ',
            image: orang
          })
        }}>Share with friends!</div>
       </div>
      </div>
    );
  };

  function Popup() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => setSelectedChallenge(null)} className="score" style={{height: 'auto', paddingBottom: '3px', paddingTop: '3px'}}>
          close
          </div>
        </div>
        <p>{selectedChallenge.name}</p>
        <p>{selectedChallenge.icon}</p>
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
            .filter((item => item.level == level(cookies.user.score) && !cookies.user.completed.includes(item.id)))
            .concat(challenges.filter((item => item.level == level(cookies.user.score) && cookies.user.completed.includes(item.id))))
            .map((item, index) => (
            <li
              key={index}
              className='challenge'
              onClick={() => openPopup(item)}
              style={cookies.user.completed.includes(item.id) ? {backgroundColor: 'lightgrey'} : {}}
            >
                {item.name + item.icon}
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
          <p>{level(cookies.user.score)}</p>
        </div>
      </div>
      <ChallengeList />
      <ProgressBar />
      {selectedChallenge ? <Popup /> : null}
      {levelup ? <PopupLevelup /> : null}
      </header>
    </div>
    </>
  );
}

export default App;
