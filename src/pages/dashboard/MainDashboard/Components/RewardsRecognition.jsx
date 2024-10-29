import React from 'react';
import '../css/RewardsRecognition.css';
import Employeeofthemonth from '../images/RewardsRecognition/Employeeofthemonth.jpeg';
import innovativeminds from '../images/RewardsRecognition/innovativeminds.jpeg';
import Attendancechampions from '../images/RewardsRecognition/Attendancechampions.jpeg';
import RisingStars from '../images/RewardsRecognition/RisingStars.jpeg';
import LeadershipExcellence from '../images/RewardsRecognition/LeadershipExcellence.jpeg';

function RewardsRecognition() {
  // Define an array of reward data
  const rewards = [
    { img: Employeeofthemonth, name: 'Employee Of The Month', count: 5 },
    { img: innovativeminds, name: 'Innovative Minds', count: 3 },
    { img: Attendancechampions, name: 'Attendance Champions', count: 4 },
    { img: RisingStars, name: 'Rising Stars', count: 6 },
    { img: LeadershipExcellence, name: 'Leadership Excellence', count: 2 }
  ];

  return (
    <div className='RewardsRecognition__container'>
      <p className='RewardsRecognition__title mt-3 mb-2'>Rewards & Recognition</p>
      <hr className='horizontal__rule' />
      
      {/* Map through the rewards array to display each item */}
      {rewards.map((reward, index) => (
        <div key={index} className='RewardsRecognitionlist__container mb-2 mt-2'>
          <div>
            <img src={reward.img} alt={reward.name} className='RewardsRecongnitionimg'/>
          </div>
          <div>
            <p className='RewardsRecognition__name'>{reward.name}</p>
            <p className='RewardsRecognition__count'>{reward.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RewardsRecognition;
