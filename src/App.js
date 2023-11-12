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

const doneSynonymes = [
  'Crushed it',
  'Nailed it',
  'Slapped it',
  'Bossed it',
  'Wrapped',
  'Killed it',
  'Smashed it',
  'Owned it',
  'Locked in',
  'Flawless',
  'Minted',
  'Wrapped up',
  'Sorted',
  'Vibing',
  'Completed it',
  'Signed, sealed, delivered',
  'Checked off',
  'Crushed the challenge',
  'Locked and loaded',
  'Aced it',
]

const App = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [levelup, setLevelup] = useState(false);
  const [displayScore, setDisplayScore] = useState(null);
  const [trophies, setTrophies] = useState(false);
  const [askCookies, setAskCookies] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [tmpUser, setTmpUser] = useState({score: 0, completed: []});

  const [isExploding, setIsExploding] = React.useState(false);

  function level(score) {
    return Math.min(Math.floor(score / 100) + 1, 10)
  }
  let resetClicks = 0

  let acceptedCookies = false;


  // function tmpUser {
  //   if (acceptedCookies && cookies.user !== undefined) {
  //     return cookies.user
  //   }
  //   return tmpUser
  // }

  function setUser(user) {
    setTmpUser(user)
    if (cookies.user !== undefined) {
      setCookie('user', user)
    }
  }


  useEffect(() => {
    resetClicks = 0
    if (cookies.user !== undefined) {
      const user = cookies.user
      setTmpUser(user)
    }
  })

  function ProgressBar(props) {
    return (
      <div className="progress-container" onClick={() => {
        if(resetClicks > 5) setUser({score: 0, completed: []})
        else resetClicks++
      }}>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: (tmpUser.score%100) + '%'}} />
        </div>
      </div>
    )
  }
  
  function openPopup(challenge) {
    setSelectedChallenge(challenge)
  }
  
  function doChallenge() {
    const originalLevel = level(tmpUser.score)
    const newScore = tmpUser.score + 20

    setUser({score: newScore, completed: tmpUser.completed.concat([selectedChallenge.id])})
    setSelectedChallenge(null)
    if (level(newScore) !== originalLevel) {
      setLevelup(true)
      setIsExploding(true)
    }
  }

  function PopupCookies() {
      return (
        <div className="popup-container">
         <div className="popup-body">
          <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'row', justifyContent:'flex-end'}}>
            <div onClick={() => {
              setAskCookies(false)
            }} className="close-button">
            close
            </div>
          </div>
          <p>{'May we give you a cookie to save your progress?'}</p>
          <div className="done-button" onClick={() => {
            setAskCookies(false)
            setCookie('user', {score: 0, completed: []})
            setUser({score: 0, completed: []})
          }}>Accept</div>
         </div>
        </div>
      );
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
        {trophiesImages.slice(0, level(tmpUser.score))
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
        <img src={trophiesImages[level(tmpUser.score) - 1]}/>
        <p>{'You reached level '+ level(tmpUser.score) + '!'}</p>
        <div className="done-button" onClick={() => {
          setLevelup(false)
          setIsExploding(false)
          shareOnMobile({
            url: "https://crushing-it-daily.netlify.app/",
            title: "Hey! I just reached level " + level(tmpUser.score) + ', Your turn to get moving! ',
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
        <div className="done-button" onClick={() => doChallenge()}>{doneSynonymes[Math.floor(Math.random()*doneSynonymes.length)]}</div>
       </div>
      </div>
    );
  };
  function ChallengeList(props) {
    return (
      <div className='challenges'>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {challenges
            .filter((item => item.level == level(tmpUser.score) && !tmpUser.completed.includes(item.id)))
            .concat(challenges.filter((item => item.level == level(tmpUser.score) && tmpUser.completed.includes(item.id))))
            .map((item, index) => (
            <li
              key={index}
              className='challenge'
              onClick={() => {if(!tmpUser.completed.includes(item.id)) openPopup(item)}}
              style={
                tmpUser.completed.includes(item.id) ?
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
            <p>{level(tmpUser.score)}</p>
          </div>
        </div>
        <ChallengeList />
        <ProgressBar />
        {selectedChallenge ? <Popup /> : null}
        {levelup ? <PopupLevelup /> : null}
        {trophies ? <PopupTrophies /> : null}
        {askCookies && cookies.user === undefined ? <PopupCookies /> : null}
        </div>
      </div>
    </div>
    </>
  );
}

export default App;
