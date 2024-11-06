import React, { useState } from 'react';
import '../css/Post.css';
import post from '../images/post/post.svg';
import announcement from '../images/post/announcement.svg';
import poll from '../images/post/poll.svg';
import CreatePostModal from './Addforms/CreatePostModal';
import CreatePollModel from './Addforms/CreatePollModel';

function Post() {
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
    const userrole = userData?.userrole || '';

    // ----------------------------------------------------------------------------------------------------------
    const [show, setShow] = useState(false);
    const [postType, setPostType] = useState('post'); 

    const handleShow = (type) => {
        setPostType(type); // Set the post type based on button clicked
        setShow(true);
    };
    // ----------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------

    const [showpoll, setShowpoll] = useState(false);
    const handleShowpoll = () => setShowpoll(true);

    // ----------------------------------------------------------------------------------------------------------

    return (
        <div className='Post__container'>
            <div className='post__textbox__container'>
                <div>
                    <img 
                        src={`https://office3i.com/development/api/storage/app/${userimage}`} 
                        alt='Userimage' 
                        className='Userimage__post' 
                    />
                </div>
                <div>
                    <textarea 
                        name="comments" 
                        rows="4" 
                        cols="48" 
                        placeholder="What's on your mind?" 
                        className="custom-textarea mb-3"
                    ></textarea>
                    <div className='post__button__container'>
                        <span className='post__Announcement__Poll__container'>
                            <button className='Post__btn' onClick={() => handleShow('post')}>
                                <img src={post} alt='post' /> Post
                            </button>
                            <button className='Announcement__btn' onClick={() => handleShow('announcement')}>
                                <img src={announcement} alt='announcement' /> Announcement
                            </button>
                            <button className='Poll__btn' onClick={handleShowpoll}>
                                <img src={poll} alt='poll' /> Poll
                            </button>
                        </span>
                        <span className='Upload__Cancel__container'>
                            <button className='Upload__btn'>Upload</button>
                            <button className='Cancel__btn'>Cancel</button>
                        </span>
                    </div>
                </div>
                <CreatePostModal show={show} setShow={setShow} postType={postType} />
                <CreatePollModel showpoll={showpoll} setShowpoll={setShowpoll} handleShowpoll={handleShowpoll}/>
            </div>
        </div>
    );
}

export default Post;
