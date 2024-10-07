import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useRef } from 'react';
import Webcam from 'react-webcam';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faPenToSquare, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import './VisitorLog/css/AddVisitor.css'

const AddVisitor = () => {
    // ------------------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToTaskListPage = () => {
        navigate(`/admin/visitorlog`);
    };



    // -------------------------------------------------------------------------------------------------------------



    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    // const [idProof, setIdProof] = useState('');
    const [idProofNumber, setIdProofNumber] = useState('');
    const [email, setEmail] = useState('');
    // const [department, setDepartment] = useState('');
    // const [whomToVisit, setWhomToVisit] = useState('');
    const [location, setLocation] = useState('');
    const [inTime, setInTime] = useState('');
    const [outTime, setOutTime] = useState('');
    const [image, setImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const webcamRef = useRef(null);
    const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
    // const fileInputRef = useRef(null);

    useEffect(() => {
        // Check for camera permission
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(() => {
                setCameraPermissionGranted(true);
            })
            .catch(() => {
                setCameraPermissionGranted(false);
            });
    }, []);

    const generateFileName = () => {
        const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
        return `captured-image-${timestamp}.jpg`;
    };

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const fileName = generateFileName();
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                setImage(file);
            });
    }, [webcamRef]);

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    // ----------------------------------------------------------------------------------------------------
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userempid = userData?.userempid || '';
    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!name) {
            errors.name = 'Name is required.';
        }
        if (selectedMember.length == 0) {
            errors.selectedMember = 'Whom To Visit is required.';
        }
        if (!location) {
            errors.location = 'Location is required.';
        }
        if (!idProofNumber) {
            errors.idProofNumber = 'ID Proof Number is required.';
        }
        if (!inTime) {
            errors.inTime = 'In Time is required.';
        }
        if (!image) {
            errors.image = 'Capture Image is required.';
        }


        // if (!email) {
        //     errors.email = 'Email is required';
        // } else if (/^\d/.test(email)) {
        //     errors.email = 'Email must not start with a number';
        // } else if (!/^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
        //     errors.email = 'Invalid email address';
        // }
        if (!email) {
            errors.email = 'Email is required.';
        } else if (!/^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.email = 'A valid Email is required.';
        }

        if (!mobileNumber) {
            errors.mobileNumber = 'Mobile Number is required';
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            errors.mobileNumber = 'Mobile Number must be 10 digits';
        }

        if (selectedDepartment.length == 0) {
            errors.selectedDepartment = 'Department  is required.';
        }
        if (selectedIdProof.length == 0) {
            errors.selectedIdProof = 'Select ID Proof  is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('visitor_name', name);
        formData.append('mobile_number', mobileNumber);
        formData.append('id_proof', selectedIdProof);
        formData.append('id_number', idProofNumber);
        formData.append('email_id', email);
        formData.append('department', selectedDepartment);
        formData.append('whom_to_visit', selectedMember);
        formData.append('location', location);
        formData.append('in_time', inTime);
        formData.append('out_time', outTime);
        formData.append('profile_img', image);
        formData.append('created_by', userempid);

        axios.post('https://office3i.com/development/api/public/api/add_visitor', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;

                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });

                    setName('')
                    setMobileNumber('')
                    setSelectedIdProof('')
                    setIdProofNumber('')
                    setEmail('')
                    setSelectedDepartment('')
                    setSelectedMember('')
                    setLocation('')
                    setInTime('')
                    setOutTime('')
                    setImage(null)

                    GoToTaskListPage()
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });
                }
            })
            .catch(error => {
                const errorMessage = error.response?.data?.message || 'An unexpected error occurred';

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorMessage,
                });

                console.error('There was an error with the API:', error);
            });
    };

    // useEffect(() => {
    //     console.log('Image state updated:', image);
    // }, [image]);




    // Handle form cancellation
    const fileInputRef = useRef(null);
    const handleCancel = () => {
        setName('')
        setMobileNumber('')
        setSelectedIdProof('')
        setIdProofNumber('')
        setEmail('')
        setImage(null)
        setSelectedDepartment('')
        setSelectedMember('')
        setLocation('')
        setInTime('')
        setOutTime('')
        setFormErrors({});
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCaptureCancel = () => {
        setImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
    // ----------------------------------------------------------------------------------------------------


    // ---------------------------------- Fetch Department ------------------------------------------------
    // Fetch Department
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                // console.log("Fetched department data:", data);
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // console.log("selectedDepartment", selectedDepartment)



    // ---------------------------------------------------------------------------------------------------


    // -------------------------------  Fetch Whom To Visit -------------------------------------------
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        if (selectedDepartment) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(`https://office3i.com/development/api/public/api/employee_dropdown_list/${selectedDepartment}`, {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data;
                    // console.log("Fetched supervisor list:", data);
                    setMembers(data);
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
            };

            fetchMembers();
        }
    }, [selectedDepartment, usertoken]);

    // console.log("members", members)
    // ----------------------------------------------------------------------------------------------------

    // ---------------------------------- Select ID Proof ------------------------------------------------
    // Select ID Proof
    const [idProof, setIdProof] = useState([]);
    const [selectedIdProof, setSelectedIdProof] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/employee_document_typelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                // console.log("Fetched department data:", data);
                setIdProof(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // console.log("selectedDepartment", selectedIdProof)



    // ---------------------------------------------------------------------------------------------------

    return (

        <Form onSubmit={handleSubmit} style={{ padding: '20px 30px 0px 30px' }}>
            <h3 className='mb-4' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Visitor</h3>
            <div style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '30px 43px' }}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {formErrors.name && <span className="text-danger">{formErrors.name}</span>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formMobileNumber">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter mobile number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                            />
                            {formErrors.mobileNumber && <span className="text-danger">{formErrors.mobileNumber}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formIdProof">
                            <Form.Label>Select ID Proof</Form.Label>
                            <Form.Control
                                as="select"
                                name="idProof"
                                value={selectedIdProof}
                                onChange={(e) => setSelectedIdProof(e.target.value)}
                            >
                                <option value="">Select Id Proof</option>
                                {idProof.map((option) => (
                                    <option key={option.id} value={option.id}>{option.document_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedIdProof && <span className="text-danger">{formErrors.selectedIdProof}</span>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formIdProofNumber">
                            <Form.Label>ID Proof Number</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter ID proof number"
                                value={idProofNumber}
                                onChange={(e) => setIdProofNumber(e.target.value)}
                            />
                            {formErrors.idProofNumber && <span className="text-danger">{formErrors.idProofNumber}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formDepartment">
                            <Form.Label>Department</Form.Label>
                            <Form.Control
                                as="select"
                                name="department"
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                            >
                                <option value="">Select a department</option>
                                {departments.map((option) => (
                                    <option key={option.id} value={option.id}>{option.role_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formWhomToVisit">
                            <Form.Label>Whom To Visit</Form.Label>
                            <Form.Control
                                as="select"
                                name="empName"
                                value={selectedMember}
                                onChange={(e) => setSelectedMember(e.target.value)}
                            >
                                <option value="">Select a member</option>
                                {members.map((option) => (
                                    <option key={option.emp_id} value={option.emp_id}>{option.emp_name}</option>
                                ))}
                            </Form.Control>
                            {formErrors.selectedMember && <span className="text-danger">{formErrors.selectedMember}</span>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formLocation">
                            <Form.Label>Location</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            {formErrors.location && <span className="text-danger">{formErrors.location}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="formInTime">
                            <Form.Label>In Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={inTime}
                                onChange={(e) => setInTime(e.target.value)}
                            />
                            {formErrors.inTime && <span className="text-danger">{formErrors.inTime}</span>}
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="formOutTime">
                            <Form.Label>Out Time</Form.Label>
                            <Form.Control
                                type="time"
                                value={outTime}
                                onChange={(e) => setOutTime(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">

                    <Col md={6}>
                        <Form.Group controlId="formCaptureImage">
                            <Form.Label>Capture Image</Form.Label>
                            {cameraPermissionGranted ? (
                                <>
                                    <div className='webcam mb-5'>
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            width="100%"

                                        />
                                        <Button variant="primary" className='capture__btn'>

                                            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '40px' }} onClick={handleCapture} />
                                        </Button>
                                    </div>
                                    {image && (
                                        <div className='webcamclear mb-5'>
                                            <img src={URL.createObjectURL(image)} alt="Captured" width="100%" />
                                            <Button variant="primary" className='captureclear__btn'>
                                                <FontAwesomeIcon icon={faTrash} className='faTrash__captured' onClick={handleCaptureCancel} />
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>
                                    <p>Camera permission is not granted. Please allow access to the camera.</p>
                                </div>
                            )}
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {formErrors.image && <span className="text-danger">{formErrors.image}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit"> Submit</Button>{' '}
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            </div>

        </Form>
    );
};

export default AddVisitor;
