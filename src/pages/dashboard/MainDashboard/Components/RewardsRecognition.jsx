import React, { useEffect, useState } from 'react';
import '../css/RewardsRecognition.css';
import Employeeofthemonth from '../images/RewardsRecognition/Employeeofthemonth.jpeg';
import innovativeminds from '../images/RewardsRecognition/innovativeminds.jpeg';
import Attendancechampions from '../images/RewardsRecognition/Attendancechampions.jpeg';
import RisingStars from '../images/RewardsRecognition/RisingStars.jpeg';
import LeadershipExcellence from '../images/RewardsRecognition/LeadershipExcellence.jpeg';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function RewardsRecognition() {

  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoToEditPage = () => {
    navigate(`/admin/addrewardsrecognition`);
  };

  // ---------------------------------------------------------------------------------------------------------------
  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  // ---------------------------------------------------------------------------------------------------------------



  // Define an array of reward data
  // const rewards = [
  //   { img: Employeeofthemonth, name: 'Employee Of The Month', count: 5 },
  //   { img: innovativeminds, name: 'Innovative Minds', count: 3 },
  //   { img: Attendancechampions, name: 'Attendance Champions', count: 4 },
  //   { img: RisingStars, name: 'Rising Stars', count: 6 },
  //   { img: LeadershipExcellence, name: 'Leadership Excellence', count: 2 }
  // ];


  // Fetch rewards data from API
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await axios.get('https://office3i.com/development/api/public/api/adminIndexTodayCount', {
          headers: {
            Authorization: `Bearer ${usertoken}`,
          }
        });
        setRewards(response.data.rewards_recognition);
        console.log("setRewards", response.data.rewards_recognition)
      } catch (error) {
        console.error("Error fetching rewards data:", error);
      }
    };
    fetchRewards();
  }, []);
const [selectedtitle, setSelectedtitle] = useState('')
const [selectedimage, setSelectedimage] = useState('')
  // Handle modal open
  const handleOpenModal = (employeeDetails, title, image) => {
    setSelectedEmployees(employeeDetails);
    setSelectedtitle(title)
    setSelectedimage(image)
    setShowModal(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEmployees([]);
  };

  console.log("selectedEmployees---->", selectedEmployees)
  console.log("rewards---->", rewards)
  return (
    <div className='RewardsRecognition__container'>
      <div className='RewardsRecognition__title_container'>
        <p className='RewardsRecognition__title mt-3 mb-2'>Rewards & Recognition</p>
        <button className='Add_plus' onClick={GoToEditPage}><FontAwesomeIcon icon={faPlus} /></button>
      </div>
      <hr className='horizontal__rule' />

      {/* Map through the rewards array to display each item */}
      {rewards.map((reward, index) => (
        <div 
        key={reward.id} 
        className='RewardsRecognitionlist__container mb-2 mt-2'
        onClick={() => handleOpenModal(reward.employee_details , reward.title, reward.image)}
        style={{ cursor: 'pointer' }} // Add pointer cursor for better UX
      >
          <div>
            <img src={`https://office3i.com/development/api/storage/app/${reward.image}`} alt={reward.image} className='RewardsRecongnitionimg' />
          </div>
          <div>
            <p className='RewardsRecognition__name'>{reward.title}</p>
            <p className='RewardsRecognition__count'>{reward.count}</p>
          </div>
        </div>
      ))}


   {/* Modal for displaying employee details */}
   <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className='RewardsRecongnitionimg__title'><img src={`https://office3i.com/development/api/storage/app/${selectedimage}`} alt='selectedimage' className='RewardsRecongnitionimg'/>{selectedtitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          {selectedEmployees.length > 0 ? (
            selectedEmployees.map((employee) => (
              <div key={employee.id} className='EmployeeDetails mb-3'>
                <div>
                  <img 
                    src={`https://office3i.com/development/api/storage/app/${employee.profile_img}`} 
                    alt={`${employee.first_name} ${employee.last_name}`} 
                    className='EmployeeProfileImg' 
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                </div>
                <div>
                  <p>{employee.first_name} {employee.last_name}</p>
                  <p className='EmployeeDetails__department'>{employee.department_name}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No employee details available.</p>
          )}
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

export default RewardsRecognition;
