import React, { useEffect, useState } from 'react';
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
import Polls from './Polls';
import axios from 'axios';
import Swal from 'sweetalert2';
import { DashboardContext } from '../../../../context/DashboardContext';
import { useContext } from 'react';


import { Popover, OverlayTrigger, Button } from 'react-bootstrap';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReadMoreArea from '@foxeian/react-read-more';
import EditPostModal from './Addforms/EditPostModal';

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
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // Track each feed's active reaction
    const [reactions, setReactions] = useState({});
    const [animatedReaction, setAnimatedReaction] = useState(null);
    const { refreshKey, setRefreshKey } = useContext(DashboardContext);

    const handleReactionClick = async (feedId, reaction, post_type, index) => {
        console.log("index:", index, 'feedId:', feedId)


        let MutedfeedsData = feedsData[index];
        MutedfeedsData.current_user_liked = reaction;

        // let MutedfeedsDatareactions = feedsData[index];
        // MutedfeedsDatareactions.like_options = [reaction];
        // console.log('----', MutedfeedsDatareactions);

        // Check if the reaction is the same as the current one, if yes, remove it
        setReactions((prevReactions) => ({
            ...prevReactions,
            [feedId]: prevReactions[feedId] === reaction ? '' : reaction,
        }));

        // Create a unique identifier based on feedId and reactionType
        const uniqueReactionId = `${feedId}-${reaction}`;
        setAnimatedReaction(uniqueReactionId);

        // Send the reaction to the backend
        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/reactToPost', {
                post_id: feedId,
                likeable_type: post_type,
                reaction: reaction,
                user_emp_id: userempid, // Assuming the user_emp_id is 2. Replace it with the actual user ID from the context
            }, {
                headers: {
                    Authorization: `Bearer ${usertoken}`, // Add token for authentication
                },
            });

            if (response.data.status === "success") {

                console.log(response.data.message);  // Reaction updated

            } else {
                console.error('Error updating reaction:', response.data.message);
                Swal.fire("Error",
                    response.data.message,
                    "error");

            }
        } catch (error) {
            console.error('Error reacting to post:', error);
        }

        // Remove the animation class after the animation completes
        setTimeout(() => setAnimatedReaction(null), 300);
    };





    // const feedsData = [
    //     {
    //         id: 1,
    //         name: 'Jarvis',
    //         department: 'HR Recruiter',
    //         time: '2hrs ago',
    //         title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    //         feedimg: `${feedimg}`,
    //         reactions: 20,
    //     },
    //     {
    //         id: 2,
    //         name: 'Karthik',
    //         department: 'Web Developer',
    //         time: '2hrs ago',
    //         title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    //         feedimg: `${feedimg1}`,
    //         reactions: 10,
    //     },
    //     {
    //         id: 3,
    //         name: 'Jarvis',
    //         department: 'HR Recruiter',
    //         time: '2hrs ago',
    //         title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    //         feedimg: `${feedimg2}`,
    //         reactions: 5,
    //     },
    //     {
    //         id: 4,
    //         name: 'Vijay',
    //         department: 'TVK Head',
    //         time: '2hrs ago',
    //         title: "த.வெ.க மாநாடு நடைபெறும் இடத்தை ஆய்வு செய்த் பிறகு செய்தியாளர்களுக்கு பேட்டியளித்த விழுப்புரம் மாவட்ட டிஎஸ்பி சொன்னதற்கு அதிகமாகவே தண்ணீர் வசதி கழிவறை வசதி தயார் செய்து வைக்கப்பட்டுள்ளதாக தெரிவித்தார்.",
    //         feedimg: `${feedimg3}`,
    //         reactions: 5,
    //     },
    //     {
    //         id: 5,
    //         name: 'Vijay',
    //         department: 'TVK Head',
    //         time: '2hrs ago',
    //         title: "த.வெ.க மாநாடு நடைபெறும் இடத்தை ஆய்வு செய்த் பிறகு செய்தியாளர்களுக்கு பேட்டியளித்த விழுப்புரம் மாவட்ட டிஎஸ்பி சொன்னதற்கு அதிகமாகவே தண்ணீர் வசதி கழிவறை வசதி தயார் செய்து வைக்கப்பட்டுள்ளதாக தெரிவித்தார்.",
    //         reactions: 5,
    //     },
    //     {
    //         id: 6,
    //         name: 'Jarvis',
    //         department: 'HR Recruiter',
    //         time: '2hrs ago',
    //         title: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
    //         feedimg: `${feedimg4}`,
    //         reactions: 5,
    //     },
    // ];


    // ------------------------------------------------------------------------------------------


    const [feedsData, setFeedsData] = useState([]);
    console.log("feedsData---------------------------------------**", feedsData)

    useEffect(() => {
        const fetchFeeds = async () => {
            try {
                const response = await axios.post('https://office3i.com/development/api/public/api/getUserFeed', {
                    type: activeButton.toLowerCase(), // Query parameters
                    user_emp_id: userempid,
                }, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`, // Authorization header
                    },
                });
                if (response.data && response.data.data) {
                    setFeedsData(response.data.data); // Directly set feeds data
                } else {
                    console.error('Unexpected API response format:', response);
                }
            } catch (error) {
                console.error('Error fetching feeds:', error);
            }
        };

        // Only fetch if necessary dependencies are present
        if (userempid && usertoken) {
            fetchFeeds();
        }
    }, [userempid, usertoken, activeButton, refreshKey]); // Include all dependencies that affect the fetch

    // ------------------------------------------------------------------------------------------


    // const handleEdit = (feedId) => {
    //     console.log(`Edit clicked for feed ${feedId}`);
    //     // Implement edit functionality
    // };





    const handleDelete = (postId, posttype) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to delete this post? This action cannot be reversed.',
            icon: 'warning',
            input: 'text',
            inputPlaceholder: 'Enter the reason for deletion...',
            inputAttributes: {
                'aria-label': 'Enter the reason for deletion'
            },
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            preConfirm: (value) => {
                if (!value) {
                    Swal.showValidationMessage('Reason is required for deletion.');
                }
                return value;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const reason = result.value || 'No reason provided';

                // Optimistically remove the feed item from the state
                setFeedsData(feedsData.filter(feed => feed.id !== postId));

                // Make the API call to delete the post from the backend
                axios
                    .post(
                        'https://office3i.com/development/api/public/api/delete_post',
                        {
                            id: postId,
                            comment: reason,
                            user_emp_id: userempid,
                            post_type: posttype,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${usertoken}`,
                            },
                        }
                    )
                    .then((response) => {
                        if (response.data.status === 'success') {
                            Swal.fire('Deleted!', response.data.message, 'success');
                        } else {
                            Swal.fire('Error!', response.data.message.join(' '), 'error');
                        }
                    })
                    .catch((error) => {
                        // If the API call fails, revert the optimistic update
                        console.error('Error deleting post:', error);
                        setFeedsData(prevFeeds => [...prevFeeds, { id: postId }]); // Re-add the deleted item if needed

                        const errorMessage =
                            error.response?.data?.message?.join(' ') || 'Failed to delete the post.';
                        Swal.fire('Error!', errorMessage, 'error');
                    });
            }
        });
    };


    // ----------------------------------------------------------------------------------------------------------
    const [show, setShow] = useState(false);
    const [postid, setPostid] = useState('');
    const [postType, setPostType] = useState('post');

    const handleEdit = (id, type) => {
        setPostid(id);
        setPostType(type); // Set the post type based on button clicked
        setShow(true);
        console.log("type---------------------------->", id, type)
    };
    // ----------------------------------------------------------------------------------------------------------





    return (
        <div className='Feeds__container'>
            <div className='Feeds_Buttons_container mb-4'>
                {['All', 'Post', 'Announcement', 'Poll'].map((type) => (
                    <button
                        key={type}
                        className={`Feeds__btn ${activeButton === type ? 'active' : ''}`}
                        onClick={() => handleButtonClick(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {feedsData.map((feed, index) => (
                <div key={`${feed.id}-${index}`} className="Feeds__List__container mb-3">
                    {/* Post Type: Announcement or Regular Post */}
                    {feed.post_type === 'post' || feed.post_type === 'announcement' ? (
                        <>
                            <div className="Feeds__list__header mb-2">
                                <span className="Feeds__list__header__image">
                                    <img
                                        src={`https://office3i.com/development/api/storage/app/${feed.created_by.profile_img}`}
                                        alt="Userimage"
                                        className="Userimage__post"
                                    />
                                    <span>
                                        <p className="Feeds__List__name">{feed.created_by.first_name}</p>
                                        <p className="Feeds__List__department">{feed.created_by.department_name}</p>
                                    </span>
                                </span>
                                <span className="createdat__ellips">
                                    <p className="Feeds__List__time">{feed.created_at}</p>
                                    {/* Vertical Ellipsis and Popover */}
                                    <OverlayTrigger
                                        trigger="click"
                                        placement="bottom"
                                        overlay={
                                            <Popover id={`popover-${feed.id}`}>
                                                <Popover.Body>
                                                    <Button onClick={() => handleEdit(feed.id, feed.post_type)} className="dropdown-item">
                                                        Edit
                                                    </Button>
                                                    <hr className="faEllipsisVertical__rule" />
                                                    <Button onClick={() => handleDelete(feed.id, feed.post_type)} className="dropdown-item">
                                                        Delete
                                                    </Button>
                                                </Popover.Body>
                                            </Popover>
                                        }
                                        rootClose
                                    >
                                        <FontAwesomeIcon icon={faEllipsisVertical} className="faEllipsisVertical" />
                                    </OverlayTrigger>
                                </span>
                            </div>

                            <div className="Feeds__list__body">
                                <p className="Feeds__list__title mb-2">
                                    <ReadMoreArea
                                        lettersLimit={100}
                                        expandLabel="Read more"
                                        collapseLabel="Read less"
                                    >
                                        {feed.description_or_title}
                                    </ReadMoreArea>
                                </p>

                                {/* {feed.image && (
                                    <img
                                        src={`https://office3i.com/development/api/storage/app/${feed.image}`}
                                        alt="feedimg"
                                        className="feedimg"
                                    />
                                )}
                                {feed.template_image_url && (
                                    <img
                                        src={`https://office3i.com/development/api/storage/app/${feed.template_image_url}`}
                                        alt="template_image_url"
                                        className="feedimg"
                                    />
                                )} */}
                                {feed.template_image_url && (
                                    <div className="image-container">
                                        <img
                                            src={`https://office3i.com/development/api/storage/app/${feed.template_image_url}`}
                                            alt="template_image_url"
                                            className="template-image"
                                        />
                                        {feed.image && (
                                            <img
                                                src={`https://office3i.com/development/api/storage/app/${feed.image}`}
                                                alt="feedimg"
                                                className="feedimg"
                                            />
                                        )}
                                        <p className='feed_user_name'>{feed.user_name}</p>
                                        <p className='feed_department'>{feed.department}</p>
                                    </div>
                                )}

                                <div className="mt-2">
                                    <p className="user__reactions__counts">
                                        {Array.isArray(feed.like_options) &&
                                            feed.like_options.map((reactionType) => (
                                                <img
                                                    key={reactionType}
                                                    src={getDefaultImage(reactionType)}
                                                    alt={reactionType}
                                                    className="reaction__image"
                                                />
                                            ))}
                                        {Array.isArray(feed.like_options) && feed.like_options.length > 0 && `and ${feed.total_likes} others`}
                                    </p>
                                </div>

                                <div className="mt-3 user__reactions__container">
                                    {['Like', 'Love', 'Celebrate', 'Thoughtful', 'Funny'].map((reactionType) => {
                                        const uniqueReactionId = `${feed.id}-${reactionType}`;
                                        const isActive = reactions[feed.id] === reactionType || feed.current_user_liked === reactionType;

                                        return (
                                            <button
                                                key={reactionType}
                                                className={`${reactionType}_user ${isActive ? 'active' : ''}`}
                                                onClick={() => handleReactionClick(feed.id, reactionType, feed.post_type, index)}
                                                style={{
                                                    color: isActive ? getColorForReaction(reactionType) : 'inherit',
                                                }}
                                            >
                                                <img
                                                    src={isActive ? getActiveImage(reactionType) : getInActiveImage(reactionType)}
                                                    alt={`${reactionType}_user`}
                                                    className={`${animatedReaction === uniqueReactionId ? 'reaction-button-pop' : ''}`}
                                                />
                                                {reactionType}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : feed.post_type === 'Poll' ? (
                        <>
                            <Polls pollData={feed} />
                        </>
                    ) : null}
                </div>
            ))}

            <EditPostModal show={show} setShow={setShow} postType={postType} postid={postid} feedsData={feedsData} setFeedsData={setFeedsData} />

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



function getInActiveImage(reactionType) {
    const images = {
        Like: Like_user,
        Love: Love_user,
        Celebrate: Celebrate_user,
        Thoughtful: Thoughtful_user,
        Funny: Funny_user,
    };
    return images[reactionType];
}
function getDefaultImage(reactionType) {
    const images = {
        Like: Like,
        Love: Love,
        Celebrate: Celebrate,
        Thoughtful: Thoughtful,
        Funny: Funny,
    };
    return images[reactionType];
}

export default Feeds;