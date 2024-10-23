import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import '../css/BirthdayworkAnniversary.css';
import { useEffect } from 'react';
import axios from 'axios';

function BirthdayworkAnniversary() {
    // State to toggle between Birthday and Work Anniversary views
    const [activeView, setActiveView] = useState('birthday');

    // State to control the visibility of the modal
    const [showModal, setShowModal] = useState(false);

    // Array for birthday data
    // const birthdayData = [
    //     { id: 1, name: 'Tony Stark', designation: 'UX UI Designer', date: 'Today', image: employee1 },
    //     { id: 2, name: 'Catherine', designation: 'Front-End Developer', date: '17 Oct, 2024', image: employee2 },
    //     { id: 3, name: 'Jessie', designation: 'Back-End Developer', date: '19 Oct, 2024', image: employee3 },
    //     { id: 4, name: 'John Smith', designation: 'Graphic Designer', date: '22 Oct, 2024', image: employee1 },
    //     { id: 5, name: 'Jane Doe', designation: 'HR Manager', date: '25 Oct, 2024', image: employee2 },
    //     { id: 6, name: 'Robert', designation: 'Software Engineer', date: '28 Oct, 2024', image: employee3 }
    // ];

    // // Array for work anniversary data
    // const anniversaryData = [
    //     { id: 1, name: 'John Doe', designation: 'Project Manager', date: 'Today', image: employee1 },
    //     { id: 2, name: 'Emily Clark', designation: 'QA Engineer', date: '21 Oct, 2024', image: employee2 },
    //     { id: 3, name: 'Mike Tyson', designation: 'Full Stack Developer', date: '23 Oct, 2024', image: employee3 },
    //     { id: 4, name: 'Sarah Connor', designation: 'Team Lead', date: '25 Oct, 2024', image: employee1 },
    //     { id: 5, name: 'Michael Scott', designation: 'Branch Manager', date: '27 Oct, 2024', image: employee2 }
    // ];

    // ---------------------------------------------------------------------------------------------------------------
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    // ---------------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------

    const [birthdayData, setBirthdayData] = useState([]);
    const [anniversaryData, setAnniversaryData] = useState([]);

    useEffect(() => {
        // Fetch data from the API
        const fetchEmployeeEvents = async () => {
            try {

                const response = await axios.get('https://office3i.com/development/api/public/api/adminIndexTodayCount', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`,
                    },
                });
                const data = response.data;
                setBirthdayData(data.current_month_birthday_list || []);
                setAnniversaryData(data.work_anniversary_list || []);
                console.log("data for holiday", response.data.holiday_list.current_holiday);

            } catch (error) {
                console.error('Error fetching employee events:', error);

            }
        };

        fetchEmployeeEvents();
    }, []);

    // -----------------------------------------------------------------------------------------------------------



    console.log("birthdayData", birthdayData)
    console.log("anniversaryData", anniversaryData)









    // Function to handle opening the modal
    const handleShowModal = () => setShowModal(true);

    // Function to handle closing the modal
    const handleCloseModal = () => setShowModal(false);

    // Conditional data for the active view (birthday or anniversary)
    const activeData = activeView === 'birthday' ? birthdayData : anniversaryData;

    return (
        <div className='BirthdayworkAnniversary__container mt-2'>
            <div className='Birthday__Work__Anniversary mt-2 mb-3'>
                <Button className={`Birthday ${activeView === 'birthday' ? 'active' : ''}`}
                    onClick={() => setActiveView('birthday')}>
                    Birthdays
                </Button>
                <Button className={`Work__Anniversary ${activeView === 'anniversary' ? 'active' : ''}`}
                    onClick={() => setActiveView('anniversary')}>
                    Work Anniversary
                </Button>
            </div>

            <div>
                <p className='thismonth mb-4'>This Month</p>

                {/* Conditionally render the birthday or work anniversary lists */}
                {activeData.slice(0, 3).map(item => (
                    <div className='Birthdaylist__container mb-2' key={item.id}>
                        <span className='Birthdaylist'>
                            <img src={`https://office3i.com/development/api/storage/app/${item.profile_img}`} alt='userimage' className='userimage' />
                            <span className='Birthdaylist__content'>
                                <p className='User__name'>{item.first_name}</p>
                                <p className='User__Designation'>{item.department_name}</p>
                            </span>
                        </span>
                        <span className='Event__day__container'>
                            <span>
                                <p className='Event__day'>{item.formatted_date}</p>
                            </span>
                            <span>
                                <p className='Event__day'>{item.years_worked}</p>
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {/* "View More" Link that opens the modal */}
            <p className='viewmore mt-3' onClick={handleShowModal}>View More</p>

            {/* Scrollable Modal for "View More" */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{activeView === 'birthday' ? 'Birthdays' : 'Work Anniversaries'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {activeData.map(item => (
                        <div className='Birthdaylist__container mb-2' key={item.id}>
                            <span className='Birthdaylist'>
                                <img src={`https://office3i.com/development/api/storage/app/${item.profile_img}`} alt='userimage' className='userimage' />
                                <span className='Birthdaylist__content'>
                                    <p className='User__name__popup'>{item.first_name} {item.last_name}</p>
                                    <p className='User__Designation'>{item.department_name}</p>
                                </span>
                            </span>
                            <span className='Event__day__container'>
                                <span>
                                    <p className='Event__day'>{item.formatted_date}</p>
                                </span>
                                <span>
                                    <p className='Event__day'>{item.years_worked}</p>
                                </span>
                            </span>

                        </div>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default BirthdayworkAnniversary;
