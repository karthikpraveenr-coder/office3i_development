import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap';
import Enter_OTP from '../../assets/images/Enter_OTP.png';
import './css/OTPPage.css'; // Import the CSS file here
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';

const OTPPage = () => {

    const forgot = useSelector(state => state.forgotpassword);

    console.log("forgot", forgot)

    const userEmail = forgot.email;


    // ===========================================================================

    const navigate = useNavigate();


    const initialOtpState = { otp1: '', otp2: '', otp3: '', otp4: '' };
    const [otp, setOtp] = useState(initialOtpState);
    const [timeLeft, setTimeLeft] = useState(60);

    useEffect((e) => {
        if (!timeLeft) return;

        const intervalId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timeLeft]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === "" || /^[0-9\b]+$/.test(value)) {
            setOtp({ ...otp, [name]: value });
        }
    };

    const focusNextInput = (e) => {
        const form = e.target.form;
        const index = Array.prototype.indexOf.call(form, e.target);
        if (index >= 0 && index < form.length - 1) { // Avoid focusing the "Verify" button
            form.elements[index + 1].focus();
        }
    };


    // ======================================================================================================

    // Reset

    const [OtpError, setOtpError] = useState('');
    const [emptyOTPError, setEmptyOTPError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fullOtp = Object.values(otp).join('');
        console.log('Submitted OTP:', fullOtp);

         if (!fullOtp) {
            setEmptyOTPError('An OTP is required.');
        } else {
            setEmptyOTPError('');
        }

        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/forgot_otp_verifiy', {
                email: userEmail,
                otp: fullOtp
            });

            const data = response.data;

            if (data.status === "error") {
                setOtpError(data.message);
                return;
            } else {
                setOtpError('');
            }

            console.log('Response:', response.data);

            if (data.status === "success") {


                Swal.fire({
                    icon: 'success',
                    title: 'OTP Verified',
                    text: 'You have successfully verified the OTP!',
                    timer: 2000,
                    showConfirmButton: false,
                });

                navigate('/resetpassword');

                return;
            }

            // Handle other response cases if needed

        } catch (error) {
            console.error('Error:', error);
            // Handle errors here
        }
    };




    // ======================================================================================================



    // ======================================================================================================

    // Resent OTP

    const [error, setError] = useState('');

    // Function to validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const resendOtp = async (e) => {
        e.preventDefault();

        const email = userEmail;

        if (!validateEmail(email)) {
            setError('Invalid email address');
        } else {
            setError('');
        
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/forgot_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Failed to send reset password request');
            }

            const data = await response.json();

            if (data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message,
                });
                setTimeLeft(60);
                // Navigate to OTP page
                navigate('/otppage');
            } else {
                // Handle error from the response
                setError('Failed to send reset password request');
            }
        } catch (error) {
            console.error('Error:', error);
            // Handle error, like displaying an error message to the user
            setError('Failed to send reset password request');
        }
    }
};


// ======================================================================================================

//  On key up backsapce delete

function focusPreviousInput(event) {
    const target = event.target;
    const inputs = document.getElementsByClassName("otp-input");
    const index = Array.prototype.indexOf.call(inputs, target);
    if (index > 0) {
        inputs[index - 1].focus();
    }
}

// ======================================================================================================


return (
    <div className="OTP__container">
        <Row className="justify-content-center otp-container">
            <Col md="auto">
                <div className="text-center image-bottom-padding">
                    <Image src={Enter_OTP} alt="OTP Verification" className="Forgot" />
                </div>

                <h2 className="text-center" style={{ color: 'white' }}>One Time Password</h2>
                <p style={{ color: 'white' }}>Please enter the OTP sent to your email.</p>
                <Form>
                    <Row className="otp-form-row">
                        {Object.keys(initialOtpState).map((key, index) => (
                            <Col xs={3} key={key}>
                                <Form.Control
                                    type="text"
                                    name={key}
                                    maxLength="1"
                                    value={otp[key]}
                                    onChange={handleChange}

                                    onKeyUp={(e) => {
                                        if (e.key === "Backspace" && !otp[key].length) {
                                            focusPreviousInput(e);
                                        } else if (e.key !== "Backspace" && otp[key].length === 1) {
                                            focusNextInput(e);
                                        }
                                    }}

                                    autoComplete="off"
                                    className="otp-input"
                                />
                            </Col>
                        ))}
                    </Row>
                    <p className="error-text">{OtpError}</p>
                    <p className="error-text">{emptyOTPError}</p>
                    <div className="text-center">
                        <Button variant="primary" type="submit" className="mt-3 Verify" onClick={handleSubmit}>
                            Verify
                        </Button>
                    </div>
                </Form>


                <div className="resend-btn">
                    <Button variant="link" onClick={resendOtp} disabled={timeLeft > 0} className={timeLeft > 0 ? 'disabled' : ''}>
                        Resend OTP{timeLeft > 0 ? ` in 0:${timeLeft.toString().padStart(2, '0')}s` : ''}
                    </Button>
                </div>


            </Col>
        </Row>
    </div>
);
};

export default OTPPage;
