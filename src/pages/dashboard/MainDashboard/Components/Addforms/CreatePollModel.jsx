import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import createpoll from './Images/createpoll.svg';
import './css/CreatePollModel.css';

const CreatePollModel = ({ showpoll, setShowpoll }) => {
  const userData = JSON.parse(localStorage.getItem('userData'));
  const userimage = userData?.userimage || '';
  const username = userData?.username || '';
  const usertoken = userData?.token || '';
  const userdepartmentname = userData?.userdepartmentname || '';

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with two options
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleClose = () => setShowpoll(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const pollData = {
      title: question,
      image: "", // Adjust if there's an image input
      start_date: startDate,
      end_date: endDate,
      user_emp_id: userData?.user_emp_id || 1, // Make sure to set a valid user ID
      options: options
    };

    try {
      const response = await axios.post('https://office3i.com/development/api/public/api/createPoll', pollData, {
        headers: {
          Authorization: `Bearer ${usertoken}`,
        }
      });

      if (response.data.status === "success") {
        Swal.fire({
          title: 'Success!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        handleClose();
        handlecancel()
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: error.response?.data?.message || 'There was an issue creating the poll. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handlecancel=()=>{
    setQuestion('')
    setOptions(['', ''])
    setStartDate('')
    setEndDate('')
  }


  return (
    <Modal show={showpoll} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <img
          src={`https://office3i.com/development/api/storage/app/${userimage}`}
          alt="Profile"
          style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10, border: '1px solid #0A62F1' }}
        />
        <span>
          <p className='createpoll__List__name'>{username}</p>
          <p className='createpoll__List__department'>{userdepartmentname}</p>
        </span>
      </Modal.Header>

      <Modal.Body>
        <Button className='Create_Poll mb-3'>
          <img src={createpoll} alt='createpoll' />
          Create Poll
        </Button>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formQuestion">
            <Form.Label>Question for poll</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter poll question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </Form.Group>

          {options.map((option, index) => (
            <Form.Group key={index} controlId={`formOption${index}`}>
              <Form.Label>Option {index + 1}</Form.Label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Control
                  type="text"
                  placeholder={`Enter option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <Button
                  variant="outline-primary"
                  onClick={addOption}
                  style={{
                    marginLeft: '10px',
                    width: '35px',
                    height: '35px',
                    padding: '0',
                    display: index === options.length - 1 ? 'block' : 'none',
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
                {index > 1 && (
                  <Button
                    variant="outline-danger"
                    onClick={() => removeOption(index)}
                    style={{
                      marginLeft: '5px',
                      width: '35px',
                      height: '35px',
                      padding: '0',
                    }}
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </Button>
                )}
              </div>
            </Form.Group>
          ))}

          <Row>
            <Col>
              <Form.Group controlId="formStartDate">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formEndDate">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePollModel;
