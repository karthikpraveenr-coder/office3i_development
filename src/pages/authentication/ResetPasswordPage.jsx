import React, { useState } from 'react';
import { Row, Col, Form, Button, Image } from 'react-bootstrap';
import resetPassword from '../../assets/images/Reset_password.png';
import './css/ResetPassword.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ResetPasswordPage = () => {

    const forgot = useSelector(state => state.forgotpassword);

    const userEmail = forgot.email;

    // ====================================================================================================

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmpasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // ------------------------------------ password show and hidden------------------------------------
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmpasswordVisible);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    // ------------------------------------ password show and hidden------------------------------------

    const navigate = useNavigate();

    const [newpasswordError, setNewpasswordError] = useState('');
    const [pwdError, setPwdError] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {

            console.error('Passwords do not match');

            setNewpasswordError('Passwords do not match')
            return;
        }

        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/forgot_change_password', {
                email: userEmail,
                change_password: password // assuming password state contains the new password
            });

            console.log('Password reset successful:', response.data);

            const data = response.data;

            if (data.status === "error") {
                setPwdError(data.message);
                return;
            } else {
                setPwdError('');
            }

            if (data.status === "success") {


                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed',
                    text: 'You Are password changed successfully',
                    timer: 2000,
                    showConfirmButton: false,
                });

                navigate('/login');

                return;
            }





        } catch (error) {
            console.error('Password reset failed:', error);
            // Handle error, show error message to the user, etc.
        }
    };


    return (
        <div className="resetpassword__container">


            <Row className="justify-content-center">
                <Col md="auto" className='reset-form-container'>

                    <div className="image-container">
                        <Image src={resetPassword} alt="Reset Password" />
                    </div>

                    <div className="form-container">
                        <h3 className="text-left mb-2" style={{ color: 'white' }}>Reset Password</h3>


                        <Form onSubmit={handleResetPassword}>


                            <Form.Group controlId="formBasicPassword" className='new-eye'>
                                <Form.Control
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder="New Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className='form-control__resetpassword'
                                    required
                                />
                                <button
                                    type="button"
                                    className="new-password-toggle-btn"
                                    onClick={togglePasswordVisibility}
                                    style={{ background: 'transparent', borderColor: 'transparent' }}
                                >
                                    {passwordVisible ? <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} /> : <FontAwesomeIcon icon={faEyeSlash} style={{ color: 'black' }} />}
                                </button>
                            </Form.Group>


                            <Form.Group controlId="formBasicConfirmPassword" className='confirm-eye'>
                                <Form.Control
                                    type={confirmpasswordVisible ? 'text' : 'password'}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="confirm-password-toggle-btn"
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{ background: 'transparent', borderColor: 'transparent' }}
                                >
                                    {confirmpasswordVisible ? <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} /> : <FontAwesomeIcon icon={faEyeSlash} style={{ color: 'black' }} />}
                                </button>
                            </Form.Group>
                            <p className="error-text">{newpasswordError}</p>
                            <p className="error-text">{pwdError}</p>


                            <div className='Reset_Password'>
                                <Button variant="primary" type="submit" className="reset-button">
                                    Reset Password
                                </Button>
                            </div>
                        </Form>


                    </div>
                </Col>
            </Row>



        </div>
    );
};

export default ResetPasswordPage;
