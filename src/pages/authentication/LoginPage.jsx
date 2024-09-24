import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import logo from '../../assets/images/Office3iLogo.jpg';
import poweredByLogo from '../../assets/images/poweredby.png';
import './css/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Loginpage = () => {


  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [employeeIdError, setEmployeeIdError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);




  // ------------------------------------ password show and hidden------------------------------------
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  // ------------------------------------ password show and hidden------------------------------------


  // ------------------------------------ keyboard enter login start------------------------------------

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     handleLogin();
  //   }
  // };

  // ------------------------------------ keyboard enter login end------------------------------------


  // ------------------------------------ handleLogin start------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    
    try {
      // Validation
      if (!employeeId) {
        setEmployeeIdError('Employee Email ID is required');
        setLoading(false);
        return;
      } else {
        setEmployeeIdError('');
      }

      if (!password) {
        setPasswordError('Password is required');
        setLoading(false);
        return;
      } else {
        setPasswordError('');
      }

      const apiUrl = `https://office3i.com/user/api/public/api/login`;

      const response = await axios.post(apiUrl, {
        user_login: employeeId,
        password: password
      });

      const data = response.data;
      console.log("data--------->", data)

      if (data.status === "error" && data.message === "Incorrect passwords") {
        setPasswordError('Password or ID Incorrect');

        setLoading(false);

        return;



      }

      if (data !== 0) {
        // Handle successful login
        localStorage.setItem('userData', JSON.stringify(data));
        localStorage.setItem('isAuthenticated', true); 
        navigate('/admin');

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Login successful!',
          timer: 2000,
          showConfirmButton: false,
        });
        setLoading(false);
      } else {
        // Handle other errors
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An unexpected error occurred. Please try again later.',
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      // Handle network errors
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response ? error.response.data.message : 'An unexpected error occurred. Please try again later.',

      });
      setLoading(false);
    }
  };

  // ------------------------------------ handleLogin End------------------------------------

  const imgstyle = {
    width: '100%',
    maxWidth: '200px', // Set the maximum width for the image
    height: 'auto', // Maintain aspect ratio
    background: 'white',
    padding: '0px 25px',
    borderRadius: '35px',
  };
  

  return (
    <div className="login-container">


      <Row className="justify-content-md-center">


        <Col md="auto">

          {/* ----------------------------------------------------------- */}

          <Form className="login-form">

            {/* --------------logo start -------------- */}
            <Row className="justify-content-md-center">
              <Col md="auto" style={{display:'flex', justifyContent:'center'}}>
                <img src={logo} alt="Logo" style={imgstyle} className="img-fluid"/>
              </Col>
            </Row>
            {/* --------------logo ENd -------------- */}

            {/* -------------- login user id and password start -------------- */}
            <h4 className='login__title'>Login</h4>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Email ID"
                className="form-input" />

              <p className="error-text">{employeeIdError}</p>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">

              <div className='pwd_eye'>
                <Form.Control
                  type={passwordVisible ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                  // onKeyDown={handleKeyDown}
                  placeholder="Password"
                  className="form-input" />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  style={{ background: 'transparent', borderColor: 'transparent' }}
                >
                  {passwordVisible ? <FontAwesomeIcon icon={faEye} style={{ color: 'black' }} /> : <FontAwesomeIcon icon={faEyeSlash} style={{ color: 'black' }} />}
                </button>
              </div>

              <p className="error-text">{passwordError}</p>
            </Form.Group>

            {/* --------------login user id and password start -------------- */}

            {/*  --------------forget password & login start  --------------*/}

            <div style={{ display: 'flex' }}>
              <Form.Text className="text-muted">
                <Link to="/forgetpasswordpage" className="forget-password">Forgot password?</Link>
              </Form.Text>
              {/* <Button variant="primary" type="submit" className="login-button" onClick={handleLogin}>
                Login
              </Button> */}

              {/* ------------------------------------ */}

              <Button
                variant="primary"
                type="submit"
                className="login-button btn-loading"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <span style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Login
                  </span>
                ) : (
                  'Login'
                )}
              </Button>

              {/* ------------------------------------ */}
            </div>
            {/* <Row className="justify-content-md-center">
              <Col md="auto">
                <span style={{ color: 'white', fontWeight: '600' }}>Powered By</span>
              </Col>
              <Col md="auto">
                <img src={poweredByLogo} alt="Powered By Logo" className="powered-by-logo" />
              </Col>
            </Row> */}

            {/* -------------- forget password & login start  --------------*/}

            <Row className="justify-content-md-center Cookie_Policy">
              <Col md="auto" className="footer-links">
                <a href="#" className="footer-link">Cookie Policy</a> | <a href="#" className="footer-link">Terms of Use</a> | <a href="#" className="footer-link">Privacy Policy</a>
              </Col>
            </Row>

          </Form>


          {/* ----------------------------------------------------------- */}


        </Col>


      </Row>


    </div>
  );
};

export default Loginpage;
