import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import face_shy from '../../../../assets/admin/assets/img/emoji/face_shy.png'
import happy from '../../../../assets/admin/assets/img/emoji/happy.png'
import happy_positive from '../../../../assets/admin/assets/img/emoji/happy_positive.png'
import love_happy from '../../../../assets/admin/assets/img/emoji/love_happy.png'
import sad_smiley from '../../../../assets/admin/assets/img/emoji/sad_smiley.png'
import Swal from 'sweetalert2';
import axios from 'axios';
import '../css/MoodBoard.css'

function UserMoodBoard() {

    // ===========================================================================

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ===========================================================================

    // ===========================================================================

    // moodboard

    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleEmojiClick = (emoji) => {
        setSelectedEmoji(emoji);
    };



    const [refreshKeymood, setRefreshKeymood] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (!selectedEmoji) {
            Swal.fire('Error', 'Please select your mood before submitting', 'error');
            setLoading(false);
            return;

        }

        const requestData = {
            mood_name: selectedEmoji,
            created_by: userempid
        };

        let successMessage;

        axios.post('https://office3i.com/development/api/public/api/addmoodboard', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;



                if (status === 'success') {

                    switch (selectedEmoji) {
                        case 'face_shy':
                            successMessage = 'Your mood is shy today!';
                            break;
                        case 'happy':
                            successMessage = 'Your mood is happy today!';
                            break;
                        case 'happy_positive':
                            successMessage = 'You are positively happy today!';
                            break;
                        case 'love_happy':
                            successMessage = 'You are lovingly happy today!';
                            break;
                        case 'sad_smiley':
                            successMessage = 'Your mood is sad today!';
                            break;
                        default:
                            successMessage = 'Your mood has been submitted!';
                    }
                    Swal.fire('Success', successMessage, 'success');
                    setRefreshKeymood(prevKey => prevKey + 1);
                    setLoading(false);


                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message
                    });
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error with the API:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the Mood Board. Please try again later.'
                });
                setLoading(false);
            });
    };

    const handleCancel = () => {
        setSelectedEmoji(null);
    };


    const [storeselectedmood, setStoreselectedmood] = useState([]);


    const handlegotoprevious = () => {
        setStoreselectedmood([])
    }

    useEffect(() => {
        fetchDatamood();
    }, [refreshKeymood]);

    const fetchDatamood = async () => {
        try {
            const response = await fetch(`https://office3i.com/development/api/public/api/editview_moodboard/${userempid}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setStoreselectedmood(responseData.data);
                console.log("setStoreselectedmood", responseData.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const [moodname, setMoodname] = useState('');


    useEffect(() => {
        let moodMessage;

        switch (storeselectedmood.mood_name) {
            case 'face_shy':
                moodMessage = <span>Your mood is <img src={face_shy} style={{ width: '10%' }} alt="face shy" /> today</span>;
                break;
            case 'happy':
                moodMessage = <span>Your mood is <img src={happy} style={{ width: '10%' }} alt="happy" /> today</span>;
                break;
            case 'happy_positive':
                moodMessage = <span>You are <img src={happy_positive} style={{ width: '10%' }} alt="happy positive" /> happy today</span>;
                break;
            case 'love_happy':
                moodMessage = <span>You are <img src={love_happy} style={{ width: '10%' }} alt="love happy" /> happy today</span>;
                break;
            case 'sad_smiley':
                moodMessage = <span>Your mood is <img src={sad_smiley} style={{ width: '10%' }} alt="sad smiley" /> today</span>;
                break;
            default:
                moodMessage = 'Your mood has been Empty';
        }

        setMoodname(moodMessage);
    }, [storeselectedmood]);



    const moodNames = ['face_shy', 'happy', 'happy_positive', 'love_happy', 'sad_smiley'];


    // ===========================================================================


    return (
        <div>

            {/* Employee__mood__board */}

            <div className='mb-3 Employee__mood__board__mainadmin'>

                <div className='mood__title'>
                    <h5 className='mb-2'>Employee's Mood Board</h5>
                    <hr className='mood__rule' />

                </div>


                {
                    moodNames.includes(storeselectedmood.mood_name) ? (


                        <div className='updated__mood'>


                            <h6 className='mb-3'>{moodname}</h6>
                            <div className='Mood_update_btn'>
                                <Button className='mood__Change' onClick={handlegotoprevious}>Change</Button>
                            </div>

                        </div>

                    ) : (
                        <>
                            <div className='mood__reactions'>
                                <h6 className='mb-3'>What's Your Mood Today?</h6>
                                <Row className='mb-3' style={{ display: 'flex', gap: '0px' }}>
                                    <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'face_shy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                                        <span onClick={() => handleEmojiClick('face_shy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={face_shy} alt="face_shy" className='emoji-icon-user' /></span>
                                    </Col>
                                    <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'happy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                                        <span onClick={() => handleEmojiClick('happy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={happy} alt="happy" className='emoji-icon-user' /></span>
                                    </Col>
                                    <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'happy_positive' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                                        <span onClick={() => handleEmojiClick('happy_positive')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={happy_positive} alt="happy_positive" className='emoji-icon-user' /></span>
                                    </Col>
                                    <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'love_happy' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                                        <span onClick={() => handleEmojiClick('love_happy')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={love_happy} alt="love_happy" className='emoji-icon-user' /></span>
                                    </Col>
                                    <Col xs={6} md={2} lg={2} xl={2} className={selectedEmoji === 'sad_smiley' ? 'selected' : ''} style={{ padding: '0px', width: '20%' }}>
                                        <span onClick={() => handleEmojiClick('sad_smiley')} style={{ display: 'flex', justifyContent: 'center', padding: '7px 0px' }}><img src={sad_smiley} alt="sad_smiley" className='emoji-icon-user' /></span>
                                    </Col>

                                </Row>
                            </div>

                            <div className='reaction__submit__btns'>
                                <Button onClick={handleSubmit} className='mood__submit' disabled={loading}>
                                    {loading ? (
                                        <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Submit
                                        </span>
                                    ) : (
                                        'Submit'
                                    )}
                                </Button>
                                <Button onClick={handleCancel} className='mood__Cancel'>Cancel</Button>
                            </div>
                        </>

                    )}


            </div>
        </div>
    )
}

export default UserMoodBoard