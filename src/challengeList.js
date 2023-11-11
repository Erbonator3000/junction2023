import React from 'react';
import './challengeList.css';

const challengeList = () => {
  // Sample list of items
  const items = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

  return (
    <div className='challenges'>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} className='challenge'>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default challengeList;
