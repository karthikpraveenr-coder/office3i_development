import React, { useState } from 'react';
import '../css/Post.css';
import post from '../images/post/post.svg';
import announcement from '../images/post/announcement.svg';
import poll from '../images/post/poll.svg';
import CreatePostModal from './Addforms/CreatePostModal';
import CreatePollModel from './Addforms/CreatePollModel';
import Swal from 'sweetalert2';
import { useContext } from 'react';
import { DashboardContext } from '../../../../context/DashboardContext';
import axios from 'axios';

function Post() {
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userimage = userData?.userimage || '';
    const username = userData?.username || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';
    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------------
    // State to store the comment
    const [comment, setComment] = useState('');
    const { refreshKey, setRefreshKey } = useContext(DashboardContext);

    // Handler to update state on change
    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    // ----------------------------------------------------------------------------------------------------------

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


    // ----------------------------------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();


        const formData = new FormData();
        // formData.append('title', 'Testing One1');
        formData.append('description', comment);
        // formData.append('image', fileInputRef.current.files[0]); 
        formData.append('post_type', 'post');
        formData.append('created_by', userrole);
        formData.append('user_emp_id', userempid);

        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/createPost', formData, {
                headers: {
                    Authorization: `Bearer ${usertoken}`,
                },
            });

            // Check the response status and show appropriate message
            if (response.data.status === "success") {
                Swal.fire("Success",
                    response.data.message,
                    "success");
                setComment('')
                // Increment the refreshKey to trigger re-render
                setRefreshKey(prevKey => prevKey + 1);
            } else {
                Swal.fire("Error", response.data.message.join(', '), "error");
            }
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            const errorMessage = error.response?.data.message || "Failed to create post.";
            Swal.fire("Error", errorMessage, "error");
        }
    };

    const handlecancel = () => {
        setComment('')
    }
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
                        value={comment}
                        onChange={handleCommentChange}
                    ></textarea>
                    <div className='post__button__container'>
                        <span className='post__Announcement__Poll__container'>
                            <button className='Post__btn' onClick={() => handleShow('post')}>
                                <img src={post} alt='post' /> Post
                            </button>
                            {(userrole === '1') && (
                            <button className='Announcement__btn' onClick={() => handleShow('announcement')}>
                                <img src={announcement} alt='announcement' /> Announcement
                            </button>
                            )}
                            <button className='Poll__btn' onClick={handleShowpoll}>
                                <img src={poll} alt='poll' /> Poll
                            </button>
                        </span>
                        <span className='Upload__Cancel__container'>
                            <button className='Upload__btn' onClick={handleSubmit}>Upload</button>
                            <button className='Cancel__btn' onClick={handlecancel}>Cancel</button>
                        </span>
                    </div>
                </div>
                <CreatePostModal show={show} setShow={setShow} postType={postType} />
                <CreatePollModel showpoll={showpoll} setShowpoll={setShowpoll} handleShowpoll={handleShowpoll} />
            </div>
        </div>
    );
}

export default Post;
