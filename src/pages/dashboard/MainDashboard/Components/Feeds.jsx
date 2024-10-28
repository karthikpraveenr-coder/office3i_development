import React, { useState } from 'react';
import '../css/Feeds.css';
import feedimg from '../images/post/feedimage.png';
import feedimg1 from '../images/post/rcb.jpg';
import feedimg2 from '../images/post/csk.webp';
import feedimg3 from '../images/post/vijay.jpg';
import feedimg4 from '../images/post/WorkAnniversary.jpg';

import Like_user from '../images/post/footerimage/Like_user.svg';
import Love_user from '../images/post/footerimage/Love_user.svg';
import Celebrate_user from '../images/post/footerimage/Celebrate_user.svg';
import Thoughtful_user from '../images/post/footerimage/Thoughtful_user.svg';
import Funny_user from '../images/post/footerimage/Funny_user.svg';

import Like_user_active from '../images/post/footerimage/Active/Like_user_active.svg';
import Love_user_active from '../images/post/footerimage/Active/Love_user_active.svg';
import Celebrate_user_active from '../images/post/footerimage/Active/Celebrate_user_active.svg';
import Thoughtful_user_active from '../images/post/footerimage/Active/Thoughtful_user_active.svg';
import Funny_user_active from '../images/post/footerimage/Active/Funny_user_active.svg';

import Like from '../images/post/footerimage/Like.svg';
import Love from '../images/post/footerimage/Love.svg';
import Celebrate from '../images/post/footerimage/Celebrate.svg';
import Thoughtful from '../images/post/footerimage/Thoughtful.svg';
import Funny from '../images/post/footerimage/Funny.svg';

function Feeds() {
    const [activeButton, setActiveButton] = useState('All');

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
    };

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
    const userrole = userData.userrole || '';

    // Track each feed's active reaction
    const [reactions, setReactions] = useState({});

    const handleReactionClick = (feedId, reaction) => {
        setReactions((prevReactions) => ({
            ...prevReactions,
            [feedId]: prevReactions[feedId] === reaction ? '' : reaction,
        }));
    };

    const feedsData = [
        {
            id: 1,
            name: 'Jarvis',
            department: 'HR Recruiter',
            time: '2hrs ago',
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
            feedimg: `${feedimg}`,
            reactions: 20,
        },
        {
            id: 2,
            name: 'Karthik',
            department: 'Web Developer',
            time: '2hrs ago',
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            feedimg: `${feedimg1}`,
            reactions: 10,
        },
        {
            id: 3,
            name: 'Jarvis',
            department: 'HR Recruiter',
            time: '2hrs ago',
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
            feedimg: `${feedimg2}`,
            reactions: 5,
        },
        {
            id: 4,
            name: 'Vijay',
            department: 'TVK Head',
            time: '2hrs ago',
            title: "த.வெ.க மாநாடு நடைபெறும் இடத்தை ஆய்வு செய்த் பிறகு செய்தியாளர்களுக்கு பேட்டியளித்த விழுப்புரம் மாவட்ட டிஎஸ்பி சொன்னதற்கு அதிகமாகவே தண்ணீர் வசதி கழிவறை வசதி தயார் செய்து வைக்கப்பட்டுள்ளதாக தெரிவித்தார்.",
            feedimg: `${feedimg3}`,
            reactions: 5,
        },
        {
            id: 5,
            name: 'Vijay',
            department: 'TVK Head',
            time: '2hrs ago',
            title: "த.வெ.க மாநாடு நடைபெறும் இடத்தை ஆய்வு செய்த் பிறகு செய்தியாளர்களுக்கு பேட்டியளித்த விழுப்புரம் மாவட்ட டிஎஸ்பி சொன்னதற்கு அதிகமாகவே தண்ணீர் வசதி கழிவறை வசதி தயார் செய்து வைக்கப்பட்டுள்ளதாக தெரிவித்தார்.",
            reactions: 5,
        },
        {
            id: 6,
            name: 'Jarvis',
            department: 'HR Recruiter',
            time: '2hrs ago',
            title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
            feedimg: `${feedimg4}`,
            reactions: 5,
        },
    ];

    return (
        <div className='Feeds__container'>
            <div className='Feeds_Buttons_container mb-4'>
                {['All', 'Post', 'Announcement', 'Polls'].map((type) => (
                    <button
                        key={type}
                        className={`Feeds__btn ${activeButton === type ? 'active' : ''}`}
                        onClick={() => handleButtonClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>
            
            {feedsData.map((feed) => (
                <div className='Feeds__List__container mb-3' key={feed.id}>
                    <div className='Feeds__list__header mb-2'>
                        <span className='Feeds__list__header__image'>
                            <img src={`https://office3i.com/development/api/storage/app/${userimage}`} alt='Userimage' className='Userimage__post' />
                            <span>
                                <p className='Feeds__List__name'>{feed.name}</p>
                                <p className='Feeds__List__department'>{feed.department}</p>
                            </span>
                        </span>
                        <span>
                            <p className='Feeds__List__time'>{feed.time}</p>
                        </span>
                    </div>

                    <div className='Feeds__list__body'>
                        <p className='Feeds__list__title mb-2'>{feed.title}</p>
                        {feed.feedimg && <img src={feed.feedimg} alt='feedimg' className='feedimg' />}
                        <div className='mt-2'>
                            <p className='user__reactions__counts'>
                                <img src={Like} alt='Like' className='reaction__image' />
                                <img src={Love} alt='Love' className='reaction__image' />
                                <img src={Celebrate} alt='Celebrate' className='reaction__image' />
                                <img src={Thoughtful} alt='Thoughtful' className='reaction__image' />
                                <img src={Funny} alt='Funny' className='reaction__image' />
                                and {feed.reactions} others
                            </p>
                        </div>

                        <div className='mt-3 user__reactions__container'>
                            {['Like', 'Love', 'Celebrate', 'Thoughtful', 'Funny'].map((reactionType) => (
                                <button
                                    key={reactionType}
                                    className={`${reactionType}_user`}
                                    onClick={() => handleReactionClick(feed.id, reactionType)}
                                    style={{
                                        color: reactions[feed.id] === reactionType ? getColorForReaction(reactionType) : 'inherit',
                                    }}
                                >
                                    <img
                                        src={reactions[feed.id] === reactionType ? getActiveImage(reactionType) : getDefaultImage(reactionType)}
                                        alt={`${reactionType}_user`}
                                    />
                                    {reactionType}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function getColorForReaction(reactionType) {
    const colors = {
        Like: '#0A62F1',
        Love: '#FF0000',
        Celebrate: '#FF851B',
        Thoughtful: '#9D42FF',
        Funny: '#E0C300',
    };
    return colors[reactionType];
}

function getActiveImage(reactionType) {
    const images = {
        Like: Like_user_active,
        Love: Love_user_active,
        Celebrate: Celebrate_user_active,
        Thoughtful: Thoughtful_user_active,
        Funny: Funny_user_active,
    };
    return images[reactionType];
}

function getDefaultImage(reactionType) {
    const images = {
        Like: Like_user,
        Love: Love_user,
        Celebrate: Celebrate_user,
        Thoughtful: Thoughtful_user,
        Funny: Funny_user,
    };
    return images[reactionType];
}

export default Feeds;
