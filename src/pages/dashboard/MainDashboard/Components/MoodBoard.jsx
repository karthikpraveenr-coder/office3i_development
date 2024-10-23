import React from 'react'
import { Container, Row, Col, Card, Modal, Button } from 'react-bootstrap';
import face_shy from '../../../../assets/admin/assets/img/emoji/face_shy.png'
import happy from '../../../../assets/admin/assets/img/emoji/happy.png'
import happy_positive from '../../../../assets/admin/assets/img/emoji/happy_positive.png'
import love_happy from '../../../../assets/admin/assets/img/emoji/love_happy.png'
import sad_smiley from '../../../../assets/admin/assets/img/emoji/sad_smiley.png'
import { useState } from 'react';
import { useEffect } from 'react';
import '../css/MoodBoard.css'

function MoodBoard() {

    const [moodboardlist, setModboardlist] = useState([]);
    const [loading, setLoading] = useState(true);


    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    useEffect(() => {
        fetchmoodboardData();
    }, []);

    const fetchmoodboardData = async () => {
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/view_moodboard', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setModboardlist(responseData.data.moodboard);
                console.log("-----------", responseData.data);

                setAllemojicount(responseData.data.total_count)
                setShyCount(responseData.data.mood_counts.face_shy)
                setHappyCount(responseData.data.mood_counts.happy)
                setHappyPositiveCount(responseData.data.mood_counts.happy_positive)
                setLoveHappyCount(responseData.data.mood_counts.love_happy)
                setSadSmileyCount(responseData.data.mood_counts.sad_smiley)
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ===========================================================================

    // moodboard popup

    const [moodboardModel, setMoodboardModel] = useState(false);
    const handleClosemoodboard = () => setMoodboardModel(false);
    const handleShowmoodboard = () => setMoodboardModel(true);


    const [allemojicount, setAllemojicount] = useState(30);
    const [shyCount, setShyCount] = useState(10);
    const [happyCount, setHappyCount] = useState(0);
    const [happyPositiveCount, setHappyPositiveCount] = useState(5);
    const [loveHappyCount, setLoveHappyCount] = useState(10);
    const [sadSmileyCount, setSadSmileyCount] = useState(5);

    // ===========================================================================

    return (
        <div>

            <div className='mb-3 Employee__mood__board__mainadmin'>

                <div className='mood__title'>
                    <h5 className='mb-2'>Employee's Mood Board</h5>
                    <hr className='mood__rule' />
                </div>

                <div className='mood__reactions mb-4'>
                    <Row className='mb-3' style={{ display: 'flex', alignItems: 'center' }}>
                        <Col>
                            <h5 className='mood__all'>All</h5>
                        </Col>

                        <Col>
                            <span><img src={face_shy} alt="face_shy" className='emoji-icon' /></span>
                        </Col>

                        <Col>
                            <span><img src={happy} alt="face_shy" className='emoji-icon' /></span>
                        </Col>

                        <Col>
                            <span><img src={happy_positive} alt="face_shy" className='emoji-icon' /></span>
                        </Col>

                        <Col>
                            <span><img src={love_happy} alt="face_shy" className='emoji-icon' /></span>
                        </Col>

                        <Col>
                            <span><img src={sad_smiley} alt="face_shy" className='emoji-icon' /></span>
                        </Col>

                    </Row>
                    <Row>

                        {moodboardlist.slice(-2).map(item => (
                            <Col key={item.id} sm={12} md={12} lg={12} xl={12} className='mb-3 Reacted__emoji'>
                                <p className='reacted__name__emoji'>
                                    <span className='reacted__name'>{item.emp_name}</span>
                                    {item.mood_name === 'face_shy' && <img src={face_shy} alt="face_shy" className='emoji-icon-reacted' />}
                                    {item.mood_name === 'happy' && <img src={happy} alt="happy" className='emoji-icon-reacted' />}
                                    {item.mood_name === 'happy_positive' && <img src={happy_positive} alt="happy_positive" className='emoji-icon-reacted' />}
                                    {item.mood_name === 'love_happy' && <img src={love_happy} alt="love_happy" className='emoji-icon-reacted' />}
                                    {item.mood_name === 'sad_smiley' && <img src={sad_smiley} alt="sad_smiley" className='emoji-icon-reacted' />}


                                </p>
                            </Col>
                        ))}
                    </Row>

                </div>

                <div className='show__more__mainadmin'>
                    <span onClick={handleShowmoodboard}>View All</span>
                </div>

            </div>

            {/* ========================================================================== */}

            {/* Modal for showing mood board */}

            <Modal show={moodboardModel} onHide={handleClosemoodboard}>
                <Modal.Header closeButton>
                    <Modal.Title>Employee's Mood Board</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ maxHeight: '50vh', overflowY: 'auto' }}>

                    <div className='mood__reactions__popup'>
                        <Row className='mb-3'>
                            <Col className='ALL__design'>
                                <h5 className='mood__all__popup'>All{'\u00a0'}{allemojicount}</h5>
                            </Col>

                            <Col>
                                <span className='emoji__count'><img src={face_shy} alt="face_shy" className='emoji-icon__popup' /> <h5 className='emoji__count__value'>{shyCount}</h5></span>
                            </Col>

                            <Col>
                                <span className='emoji__count'><img src={happy} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{happyCount}</h5></span>
                            </Col>

                            <Col>
                                <span className='emoji__count'><img src={happy_positive} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{happyPositiveCount}</h5></span>
                            </Col>

                            <Col>
                                <span className='emoji__count'><img src={love_happy} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{loveHappyCount}</h5></span>
                            </Col>

                            <Col>
                                <span className='emoji__count'><img src={sad_smiley} alt="face_shy" className='emoji-icon__popup' /><h5 className='emoji__count__value'>{sadSmileyCount}</h5></span>
                            </Col>

                        </Row>


                        {/* ======================================= */}

                        <Row>
                            <Col sm={12} md={12} lg={12} xl={12} className='mb-3 Reacted__emoji__popup'>
                                {moodboardlist.map(item => (
                                    <p className='reacted__name__emoji__popup mb-3'>

                                        <img src={`https://office3i.com/development/api/storage/app/${item.profile_img}`} alt='' className='profile__popup' />
                                        <span className='reacted__name__popup'>{item.emp_name}</span>
                                        {item.mood_name === 'face_shy' && <img src={face_shy} alt="face_shy" className='emoji-icon-reacted' />}
                                        {item.mood_name === 'happy' && <img src={happy} alt="happy" className='emoji-icon-reacted' />}
                                        {item.mood_name === 'happy_positive' && <img src={happy_positive} alt="happy_positive" className='emoji-icon-reacted' />}
                                        {item.mood_name === 'love_happy' && <img src={love_happy} alt="love_happy" className='emoji-icon-reacted' />}
                                        {item.mood_name === 'sad_smiley' && <img src={sad_smiley} alt="sad_smiley" className='emoji-icon-reacted' />}
                                    </p>
                                ))}
                            </Col>


                        </Row>

                        {/* ======================================= */}
                    </div>
                </Modal.Body>

            </Modal>

            {/* ========================================================================== */}
        </div>
    )
}

export default MoodBoard