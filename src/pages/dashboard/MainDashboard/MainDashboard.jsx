import React from 'react';
import './css/MainDashboard.css';
import img1 from './images/sunset.jpg'
import BirthdayworkAnniversary from './Components/BirthdayworkAnniversary';
import Holidays from './Components/Holidays';
import CheckinCheckout from './Components/CheckinCheckout';
import SkillsDevelopmentTraining from './Components/SkillsDevelopmentTraining';
import MoodBoard from './Components/MoodBoard';
import UserMoodBoard from './Components/UserMoodBoard';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import RewardsRecognition from './Components/RewardsRecognition';
import Post from './Components/Post';
import Feeds from './Components/Feeds';

function MainDashboard() {

    // ---------------------------------------------------------------------------------------------------------------
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
    const userrole = userData.userrole || '';
    // ---------------------------------------------------------------------------------------------------------------

    return (
        <div className='MainDashboard__container' >
            <div className='box Header__quote' style={{
                position: 'relative',
                backgroundImage: `url(${img1})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center', // Center the image

            }}>
                <div className='gradient-overlay'></div>
                <div className='Header__quote__container'>
                    <span>
                        <img src={`https://office3i.com/development/api/storage/app/${userimage}`} alt='Userimage' className='Userimage__greetings' />
                    </span>
                    <span>
                        <p className='greeting'>Good Day, {username} !!</p>
                        <p className='greeting__title'>Welcome! We’re excited to have you with us on this journey!</p>
                    </span>
                </div>

            </div>
            <div className='box Checkin__checkout'>
                <CheckinCheckout />
            </div>
            <div className='box Birthday__workAnniversary'>

                <BirthdayworkAnniversary />
            </div>

            <div className='box Post'>
                <Post />
                <Feeds />
            </div>

            <div className='box Employee__Moodboard'>
                {userrole === '1' && <MoodBoard />}
                {!['1', '2'].includes(userrole) && <UserMoodBoard />}
            </div>

            <div className='box Holidays'>
                <Holidays />
            </div>
            <div className='box SkillDevelopment__Training'>
                <SkillsDevelopmentTraining />
            </div>
            <div className='box Chat'>8</div>
            <div className='box Rewards__Recognition'>
                <RewardsRecognition />
            </div>
        </div>
    );
}

export default MainDashboard;
