import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import './App.css';
import './challengeList.css';
import './close.css';
import challenges from './challenges.json';
import { shareOnMobile } from 'react-mobile-share';
import ConfettiExplosion from 'react-confetti-explosion';

import sports01 from './img/sports01.jpg';
import sports02 from './img/sports02.jpg';
import sports03 from './img/sports03.jpg';
import sports04 from './img/sports04.jpg';
import sports05 from './img/sports05.jpg';
import sports06 from './img/sports06.jpg';
import sports07 from './img/sports07.jpg';
import sports08 from './img/sports08.jpg';
import sports09 from './img/sports09.jpg';
import sports10 from './img/sports10.jpg';

const trophiesImages = [
  sports01,
  sports02,
  sports03,
  sports04,
  sports05,
  sports06,
  sports07,
  sports08,
  sports09,
  sports10
]

const levelColors = [
  '#FFADAD',
  '#FFD6A6',
  '#ffb2cd',
  '#CFFC8E',
  '#95FDBF',
  '#3FEDFF',
  '#A0C4FF',
  '#BDB2FF',
  '#DABCF6',
  '#BDB2FF',
]

const App = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [levelup, setLevelup] = useState(false);
  const [displayScore, setDisplayScore] = useState(null);
  const [trophies, setTrophies] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);

  const [isExploding, setIsExploding] = React.useState(false);

  // Set initial cookie
  if (cookies.user === undefined) {
    setCookie('user', {score: 0, completed: []})
  }

  function level(score) {
    return Math.min(Math.floor(score / 100) + 1, 10)
  }

  useEffect(() => {
    setDisplayScore(cookies.user.score)
  })

  function ProgressBar(props) {
    return (
      <div className="progress-container" onClick={() => setCookie('user', {score: 0, completed: []})}>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: (cookies.user.score%100) + '%'}} />
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
      setIsExploding(true)
    }
  }

  function PopupTrophies() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => setTrophies(false)} className="close-button">
          close
          </div>
        </div>
        <p>Badges</p>
        <div className="trophy-grid">
        {trophiesImages.slice(0, level(cookies.user.score))
            .map((item, index) => (
            <img key={index} src={item}/>
          ))}
        </div>
       </div>
      </div>
    );
  };

  function PopupLevelup() {
    return (
      <div className="popup-container">
       <div className="popup-body">
        <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
          <div onClick={() => {
            setLevelup(false)
            setIsExploding(false)
          }} className="close-button">
          close
          </div>
        </div>
        <img src={trophiesImages[level(cookies.user.score) - 1]}/>
        <p>{'You reached level '+ level(cookies.user.score) + '!'}</p>
        <div className="done-button" onClick={() => {
          setLevelup(false)
          setIsExploding(false)
          shareOnMobile({
            url: "https://master--tranquil-cobbler-a5bc99.netlify.app/",
            title: "Hey! I just reached level " + level(cookies.user.score) + ', Your turn to get moving! ',
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
          <div onClick={() => setSelectedChallenge(null)} className="close-button" >
          close
          </div>
        </div>
        <p>{selectedChallenge.name}</p>
        <p style={{fontSize: '50px'}}>{selectedChallenge.icon}</p>
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
              onClick={() => {if(!cookies.user.completed.includes(item.id)) openPopup(item)}}
              style={
                cookies.user.completed.includes(item.id) ?
                  {backgroundColor: 'lightgrey', color: 'gray', border: '5px solid grey'} :
                  {border: '5px solid' + levelColors[item.level - 1]}
              }
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
      <div className="app-container">
        <div className="body">
        <div className="top-bar">
          <div className="title">
            <p>My daily challenges</p>
          </div>
          <div className="score" onClick={() => setTrophies(true)}>
            {isExploding && <ConfettiExplosion />}
            <p>{level(displayScore)}</p>
          </div>
        </div>
        <ChallengeList />
        <ProgressBar />
        {selectedChallenge ? <Popup /> : null}
        {levelup ? <PopupLevelup /> : null}
        {trophies ? <PopupTrophies /> : null}
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
