import React, { useState } from 'react';
import '../css/Polls.css';

function Polls() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userimage = userData?.userimage || '';

  const initialPollOptions = [
    { id: 1, option: 'Silent Diwali', votes: 25, color: '#ff6666' },
    { id: 2, option: 'Eco-friendly Diwali', votes: 50, color: '#66b3ff' },
    { id: 3, option: 'Traditional Diwali', votes: 75, color: '#99ff99' },
    { id: 4, option: 'Community Diwali', votes: 100, color: '#ffcc99' }
  ];

  const [pollOptions, setPollOptions] = useState(initialPollOptions);
  const [currentVote, setCurrentVote] = useState(null);
  const [showProgress, setShowProgress] = useState(false);

  const totalVotes = pollOptions.reduce((total, option) => total + option.votes, 0);

  const handleVote = (id) => {
    // Check if the user is voting for the first time or changing their vote
    if (currentVote === null || currentVote !== id) {
      // Update votes based on the current vote
      const updatedOptions = pollOptions.map(option => {
        if (option.id === currentVote) {
          return { ...option, votes: option.votes - 1 }; // Decrease votes from previous option
        }
        if (option.id === id) {
          return { ...option, votes: option.votes + 1 }; // Increase votes for the selected option
        }
        return option;
      });

      setPollOptions(updatedOptions);
      setCurrentVote(id); // Update the current vote
      setShowProgress(true); // Show progress bar
    }
  };

  return (
    <div className='Polls__container'>
      <div className='Polls__List__container'>

        <div className='Polls__list__header mb-3'>
          <span className='Polls__list__header__image'>
            <img
              src={`https://office3i.com/development/api/storage/app/${userimage}`}
              alt='User profile'
              className='Userimage__post rounded-circle'
            />
            <span>
              <p className='Polls__List__name'>Jarvis</p>
              <p className='Polls__List__department'>HR Recruiter</p>
            </span>
          </span>
          <span>
            <p className='Polls__List__time text-muted'>2 hrs ago</p>
          </span>
        </div>

        <div className='Polls__list__body'>
          <h5 className='Polls__list__title mb-4'>What type of Diwali celebration would you prefer?</h5>

          {pollOptions.map((option) => (
            <div
              key={option.id}
              className='option-container mb-3 p-3 border rounded shadow'
              onClick={() => handleVote(option.id)}
              style={{ cursor: 'pointer', transition: 'background-color 0.3s' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <p className='mb-0'>{option.option}</p>
              {showProgress && (
                <div className="progress mb-2" style={{ height: '20px' }}>
                  <div
                    
                    role="progressbar"
                    style={{
                      width: totalVotes > 0 ? `${(option.votes / totalVotes) * 100}%` : '0%',
                      backgroundColor: option.color,
                    }}
                    aria-valuenow={option.votes}
                    aria-valuemin="0"
                    aria-valuemax={totalVotes}
                  >
                    {option.votes} votes
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Polls;
