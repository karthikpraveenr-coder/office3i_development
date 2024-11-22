import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../css/Polls.css';
import axios from 'axios';

function Polls({ pollData }) {
  console.log("pollData------------------->", pollData);
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userImage = userData?.userimage || '';
  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';

  // Add unique colors dynamically if not already provided
  const defaultColors = ['#ff9999', '#99ccff', '#ffcc99', '#cfcfcf', '#99ff99'];
  const enrichedOptions = pollData.options.map((option, index) => ({
    ...option,
    color: option.color || defaultColors[index % defaultColors.length], // Assign a default color if not provided
  }));

  const hasPollEnded = new Date() > new Date(pollData.end_date);

  const [pollOptions, setPollOptions] = useState(enrichedOptions);  // Ensure the state is populated from pollData
  const [currentVote, setCurrentVote] = useState(null);
  const [showProgress, setShowProgress] = useState(!!pollData.current_user_polled || false);
  const [hasVoted, setHasVoted] = useState(!!pollData.current_user_polled || false);
  console.log("hasVoted------------->", hasVoted)
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [pollDetails, setPollDetails] = useState(null); // State to store detailed poll responses
  

  const totalVotes = pollData.options.reduce((total, option) => total + option.response_count, 0);



console.log("pollDetails-------------------id", pollDetails)

const handleVote = async (id) => {  // Make the function async
  const userData = JSON.parse(localStorage.getItem('userData'));  // Assuming you are storing user data in localStorage
  const userEmpId = userData?.emp_id;  // Get employee ID from the user data
  if (hasPollEnded) return; // Prevent voting if poll has ended

  if (currentVote === id) {
    // If user clicks on the same option again, remove the vote
    const updatedOptions = pollOptions.map(option => {
      if (option.id === id) {
        return { ...option, response_count: option.response_count - 1 };
      }
      return option;
    });
    setPollOptions(updatedOptions);
    setCurrentVote(null);
    setHasVoted(false);
  } else {
    // If the user selects a different option, update the votes
    const updatedOptions = pollOptions.map(option => {
      if (option.id === currentVote) {
        return { ...option, response_count: option.response_count - 1 };
      }
      if (option.id === id) {
        return { ...option, response_count: option.response_count + 1 };
      }
      return option;
    });
    setPollOptions(updatedOptions);
    setCurrentVote(id);
    setHasVoted(true);
    setShowProgress(true);

    // Send API request to submit the vote
    try {
      const response = await axios.post('https://office3i.com/development/api/public/api/submitPollResponse', {
        poll_id: pollData.id,   // Assuming pollData contains the poll ID
        option_id: id,
        user_emp_id: userempid,
      }, {
        headers: {
          Authorization: `Bearer ${usertoken}`, // Add token for authentication
        },
      });

      if (response.data.status === 'success') {
        console.log("Poll response recorded successfully.");
      } else {
        console.error("Failed to record poll response:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting poll response:", error);
    }
  }
};


  const fetchPollDetails = async (pollId) => {
    try {
      const response = await axios.get(`https://office3i.com/development/api/public/api/getPollDetails/${pollId}`, {
        headers: { Authorization: `Bearer ${usertoken}` },
      });
      if (response.data) {
        const enrichedDetails = {
          ...response.data,
          options: response.data.options.map((option, index) => ({
            ...option,
            color: option.color || defaultColors[index % defaultColors.length], // Assign default colors if missing
          })),
        };
        setPollDetails(enrichedDetails);
      }
    } catch (error) {
      console.error("Error fetching poll details:", error);
    }
  };

  const handleShowModal = (pollId) => {
    setShowModal(true);
    fetchPollDetails(pollId);  // Fetch poll details when modal opens
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOption(null);  // Clear selected option when closing the modal
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className='Polls__container'>
      <div className='Polls__List__container'>
        <div className='Polls__list__header mb-3'>
          <span className='Polls__list__header__image'>
            <img
              src={`https://office3i.com/development/api/storage/app/${pollData.created_by.profile_img}`}
              alt='User profile'
              className='Userimage__post rounded-circle'
            />
            <span>
              <p className='Polls__List__name'>{pollData.created_by.first_name}</p>
              <p className='Polls__List__department'>{pollData.created_by.hrms_emp_id}</p>
            </span>
          </span>
          <span>
            <p className='Polls__List__time text-muted'>{pollData.created_at}</p>
          </span>
        </div>

        <div className='Polls__list__body'>
          <p className='Polls__list__title mb-4'>{pollData.title}</p>

          {pollOptions.map((option) => (
            <div
              key={option.id}
              className={`option-container mb-3 p-3 border rounded shadow ${currentVote === option.id || pollData.current_user_polled === option.id ? 'highlighted-option' : ''
                }`}
              onClick={() => handleVote(option.id)}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s',
                borderColor: currentVote === option.id ? 'gold' : 'transparent',
                borderWidth: currentVote === option.id ? '2px' : '1px',
                borderStyle: 'solid',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              {!hasVoted && <p className='first__time__visible mb-0'>{option.title}</p>}
              {/* -------------------------------------------------------------------------------------------------- */}
              {showProgress && (
                <div className="progress mb-2" style={{ height: '50px' }}>

                  <div
                    role="progressbar"
                    style={{
                      width: totalVotes > 0 ? `${(option.response_count / totalVotes) * 100}%` : '0%',
                      backgroundColor: option.color,
                    }}
                    aria-valuenow={option.response_count}
                    aria-valuemin="0"
                    aria-valuemax={totalVotes}
                    className='progressbar'
                  >
                    <p className='option__name mb-0'>{option.title}</p>
                  </div>

                  <div className='votes'>
                    {option.response_count} votes
                  </div>
                </div>
              )}
              {/* -------------------------------------------------------------------------------------------------- */}
            </div>
          ))}
        </div>

        <div className='Polls__list__footer'>
          <p className='Poll__ends__on'>Poll ends on {pollData.end_date}</p>
          <p className='View__response' onClick={() => handleShowModal(pollData.id)}>
            View Responses
          </p>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Responses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pollDetails?.options.map((option) => (
            <div key={option.id} onClick={() => handleOptionClick(option)} style={{ cursor: 'pointer' }}>
              <div className="progress mb-2" style={{ height: '50px' }}>
                <div
                  role="progressbar"
                  style={{
                    width: totalVotes > 0 ? `${(option.response_count / totalVotes) * 100}%` : '0%',
                    backgroundColor: option.color,
                  }}
                  aria-valuenow={option.response_count}
                  aria-valuemin="0"
                  aria-valuemax={totalVotes}
                  className='progressbar'
                >
                  <p className='option__name mb-0'>{option.title}</p>
                </div>
                <div className='votes'>
                  {option.response_count} votes
                </div>
              </div>
            </div>
          ))}

          {selectedOption && (
            <div className="voters-list">
              <p className='voters-list-title mb-3'>{selectedOption.response_count} votes</p>
              {selectedOption.responses.map((voter, index) => (
                <div key={index} className='polls__voted__list__profile__container mb-2'>
                  <img
                    src={`https://office3i.com/development/api/storage/app/${voter.profile_img}`}
                    alt='userimage'
                    className='polls_voted__userimage'
                  />
                  <div>
                    <p className='polls_voted__username'>{voter.first_name}</p>
                    <p className='polls_voted__userdepartment'>{voter.department_name}</p>
                  </div>
                </div>
              ))}
            </div>
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

export default Polls;
