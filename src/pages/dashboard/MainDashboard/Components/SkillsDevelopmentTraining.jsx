import React, { useEffect, useState } from 'react'
import '../css/SkillsDevelopmentTraining.css';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SkillsDevelopmentTraining() {

  // const trainingData = [
  //   { name: 'UX UI Design Training', date: 'Oct - Dec 2024', status: 'In Progress' },
  //   { name: 'React Development Training', date: 'Jan - Mar 2025', status: 'Upcoming' },
  //   { name: 'Project Management Training', date: 'Apr - Jun 2025', status: 'Completed' },
  //   { name: 'Data Science Fundamentals', date: 'Jul - Sep 2025', status: 'Completed' },
  //   { name: 'Digital Marketing Strategies', date: 'Oct - Dec 2025', status: 'Upcoming' },
  //   { name: 'Agile Methodologies', date: 'Jan - Mar 2026', status: 'In Progress' },
  //   { name: 'Full Stack Development', date: 'Apr - Jun 2026', status: 'Completed' },
  //   { name: 'Cybersecurity Awareness', date: 'Jul - Sep 2026', status: 'Completed' },
  //   { name: 'Cloud Computing Basics', date: 'Oct - Dec 2026', status: 'Upcoming' },
  //   { name: 'Machine Learning Techniques', date: 'Jan - Mar 2027', status: 'In Progress' },
  // ];

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoToEditPage = () => {
    navigate(`/admin/addSkillsdevelopmenttraining`);
  };

  // ---------------------------------------------------------------------------------------------------------------
  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';
  // ---------------------------------------------------------------------------------------------------------------


  const [trainingData, setTrainingData] = useState([]);

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
        setTrainingData(data.skill_dev_training || []);
        console.log("data for skill_dev_training", data.skill_dev_training);

      } catch (error) {
        console.error('Error fetching employee events:', error);

      }
    };

    fetchEmployeeEvents();
  }, []);
  console.log("trainingData--------->", trainingData)

  // Function to apply background color based on status
  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Progress':
        return { backgroundColor: '#D9F4FF', color: '#007BAE' }; // Blue for In Progress
      case 'Upcoming':
        return { backgroundColor: '#D1FFD0', color: '#00B928' }; // Light green for Upcoming
      case 'Completed':
        return { backgroundColor: '#FFEAC4', color: '#E99800' }; // Light orange for Completed
      case 'Tomorrow':
        return { backgroundColor: '#FFDADA', color: '#890000' }; // Light orange for Completed
      default:
        return {};
    }
  };

  const [showModal, setShowModal] = useState(false);

  // Function to handle opening the modal
  const handleShowModal = () => setShowModal(true);

  // Function to handle closing the modal
  const handleCloseModal = () => setShowModal(false);


  // ----------------------------------------------------------------------------------------------------

  const handleDownload = (url, filename) => {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(console.error);
  };

  return (
    <div className='Development__training__container'>
      <div className='Skill__Development__title_container'>
        <p className='Skill__Development__title mt-3 mb-2'>Skill Development / Training</p>
        {(userrole === '1') && (
        <button className='Add_plus' onClick={GoToEditPage}><FontAwesomeIcon icon={faPlus} /></button>
        )}
      </div>
      <hr className='horizontal__rule' />
      {trainingData.slice(0, 4).map((training, index) => (
        <div key={index} className='Development__training__text__container mt-2'>
          <div>
            <p className='Development__training__name'>{training.event_name}
              {training.attachment !== null &&
                <FontAwesomeIcon icon={faDownload} className='training__download ml-1'
                  onClick={() => handleDownload(`https://office3i.com/development/api/storage/app/${training.attachment}`, training.attachment.split('/').pop())} />
              }
            </p>
            <p className='Development__training__date'>{training.formatted_date}</p>
          </div>
          <p className='Development__training__status' style={getStatusStyle(training.status)}>{training.status}</p>
        </div>
      ))}
      <p className='viewmore mt-2' onClick={handleShowModal}>View More</p>

      {/* Scrollable Modal for "View More" */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Skill Development / Training</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {trainingData.map((training, index) => (
            <div key={index} className='Development__training__text__container mt-2'>
              <div>
                <p className='Development__training__name'>{training.event_name}
                  {training.attachment !== null &&
                    <FontAwesomeIcon icon={faDownload} className='training__download ml-1'
                      onClick={() => handleDownload(`https://office3i.com/development/api/storage/app/${training.attachment}`, training.attachment.split('/').pop())} />
                  }
                </p>
                <p className='Development__training__date'>{training.formatted_date}</p>
              </div>
              <p className='Development__training__status' style={getStatusStyle(training.status)}>{training.status}</p>
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
  )
}

export default SkillsDevelopmentTraining