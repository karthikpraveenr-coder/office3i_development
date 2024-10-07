import React, { useState } from 'react';
import { Row, Col, Form, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import Forgot from '../../assets/images/Forgot password.svg'; // Replace with your logo image
import './css/Forget.css'
import { useDispatch } from 'react-redux';

import { setEmail } from '../../Features/forgotpassword_state';

const ForgetPasswordPage = () => {

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // State for email and error message
  const [email, setEmailState] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ===========================================================================================

  // Function to handle email input change
  // const handleEmailChange = (e) => {
  //   setEmail(e.target.value);
  // };


  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmailState(newEmail);
    console.log('setEmailState', newEmail);
    // Dispatch action to update email in Redux store
    dispatch(setEmail(newEmail));
  };






  // Function to validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ===========================================================================================



  // ===========================================================================================

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setError('Enter your registered email address');
      setLoading(false);
    } else {
      setError('');

      try {
        const response = await fetch('https://office3i.com/user/api/public/api/forgot_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          throw new Error('Failed to send reset password request');
        }

        navigate('/otppage');
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        // Handle error, like displaying an error message to the user
        setError('Entered email not registered');
        setLoading(false);
      }
    }
  };

  // ===========================================================================================





  return (
    <div className="Forget__container">

      <Row className="justify-content-center">

        <Col md="auto" className="bg-light p-4 rounded shadow forget-form-container">

          <div className="text-center mb-4">
            <Image src={Forgot} alt="Logo" className="Forgot" />
          </div>

          <h3 className="text-left" style={{ color: 'white' }}>Forgot Password</h3>
          <p className="text-left mb-4" style={{ color: 'white' }}>Enter your email and we'll send an OTP to reset your password.</p>
          <Form className="forget-form">
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="email" placeholder="Enter your email" value={email} onChange={handleEmailChange} />
              {error && <p style={{ color: 'red' }}>{error}</p>}
            </Form.Group>



            <div className="w-100" style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="primary" type="submit" className="mb-3 mt-4" style={{ padding: '7px 20px' }} onClick={handleSubmit}  disabled={loading}>


                {loading ? (
                  <span style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Submit
                  </span>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          </Form>
          <div className="text-center">
            <Link to="/login" className="back-link">
              <span className="back-icon" style={{ color: 'white' }}>&lt; Go Back</span>
            </Link>
          </div>
        </Col>

      </Row>

    </div>
  );
};

export default ForgetPasswordPage;
