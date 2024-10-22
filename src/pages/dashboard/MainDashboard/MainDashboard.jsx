import React from 'react';
import './css/MainDashboard.css';
import img1 from './images/header_greeting1.jpeg'
import BirthdayworkAnniversary from './Components/BirthdayworkAnniversary';
import Holidays from './Components/Holidays';

function MainDashboard() {

    // ---------------------------------------------------------------------------------------------------------------
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
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
                        <img src={`https://office3i.com/development/api/storage/app/${userimage}`} alt='Userimage' className='Userimage__greetings'/>
                    </span>
                    <span>
                        <p className='greeting'>Good Morning, {username} !!</p>
                        <p className='greeting__title'>Welcome! We’re excited to have you with us on this journey!</p>
                    </span>
                </div>

            </div>
            <div className='box Checkin__checkout'>2</div>
            <div className='box Birthday__workAnniversary'>

                <BirthdayworkAnniversary />
            </div>
            <div className='box Post'>4</div>
            <div className='box Employee__Moodboard'>5</div>

            <div className='box Holidays'>
                <Holidays />
            </div>
            <div className='box SkillDevelopment__Training'>7</div>
            <div className='box Chat'>8</div>
            <div className='box Rewards__Recognition'>9</div>
        </div>
    );
}

export default MainDashboard;
