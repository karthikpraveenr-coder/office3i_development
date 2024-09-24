import React from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';



function EditAttendancePolicy() {


    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoTopolicyPage = () => {
        navigate(`/admin/addattendancepolicy`);
    };


    // ------------------------------------------------------------------------------------------------

    const { id } = useParams();
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------
    // Edit Attendance slot submit

    const [formData, setFormData] = useState({
        shift_slot: '',
        form_time: '',
        to_time: '',
        total_hrs: '',
        fp_form_time: '',
        fp_to_time: '',
        ap_form_time: '',
        ap_to_time: '',
        fhalf_day_form_time: '',
        fhalf_day_to_time: '',
        ahalf_day_form_time: '',
        ahalf_day_to_time: '',
        late_form_time: '',
        late_to_time: '',
        late1: '',
        late1_deduction: '',
        late2: '',
        late2_deduction: '',
        late3: '',
        late3_deduction: ''
    });

    const [formErrors, setFormErrors] = useState({
        shiftSlot: '',

    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({ ...prevState, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};


        // Validate shift slot
        if (!formData.shift_slot) {
            errors.shiftSlot = 'Shift Slot is required';
        }

        // Validate late 1
        if (!formData.late1) {
            errors.late1 = 'Late 1 is required';
        }

        // Validate late 1 deduction
        if (!formData.late1_deduction) {
            errors.late1_deduction = 'Late 1 deduction is required';
        }
        // Validate late 2
        if (!formData.late2) {
            errors.late2 = 'Late 2 is required';
        }

        // Validate late 2 deduction
        if (!formData.late2_deduction) {
            errors.late2_deduction = 'Late 2 deduction is required';
        }

        // Validate late 3
        if (!formData.late3) {
            errors.late3 = 'Late 3 is required';
        }

        // Validate late 3 deduction
        if (!formData.late3_deduction) {
            errors.late3_deduction = 'Late 3 deduction is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear form errors if there are no errors
        setFormErrors({});

        const requestData = {
            id: id,
            shift_slot: formData.shift_slot,
            form_time: formData.form_time,
            to_time: formData.to_time,
            total_hrs: formData.total_hrs,
            fp_form_time: formData.fp_form_time,
            fp_to_time: formData.fp_to_time,
            ap_form_time: formData.ap_form_time,
            ap_to_time: formData.ap_to_time,
            fhalf_day_form_time: formData.fhalf_day_form_time,
            fhalf_day_to_time: formData.fhalf_day_to_time,
            ahalf_day_form_time: formData.ahalf_day_form_time,
            ahalf_day_to_time: formData.ahalf_day_to_time,
            late_form_time: formData.late_form_time,
            late_to_time: formData.late_to_time,
            late1: formData.late1,
            late2: formData.late2,
            late3: formData.late3,
            late1_deduction: formData.late1_deduction,
            late2_deduction: formData.late2_deduction,
            late3_deduction: formData.late3_deduction,
            policy_status: "Active",
            updated_by: userempid
        };

        // console.log("requestData--->", requestData)

        axios.put('https://office3i.com/user/api/public/api/update_attendancepolicy', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {

                const { status, message } = response.data;

                if (status === 'success') {
                    setData(response.data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });

                    GoTopolicyPage()

                } else {

                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });

                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the Attendance Slot. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };


    const handleCancel = () => {

        setFormData({
            ...formData,
            shift_slot: data.shift_slot,
            form_time: data.form_time,
            to_time: data.to_time,
            total_hrs: data.total_hrs,
            fp_form_time: data.fp_form_time,
            fp_to_time: data.fp_to_time,
            ap_form_time: data.ap_form_time,
            ap_to_time: data.ap_to_time,
            fhalf_day_form_time: data.fhalf_day_form_time,
            fhalf_day_to_time: data.fhalf_day_to_time,
            ahalf_day_form_time: data.ahalf_day_form_time,
            ahalf_day_to_time: data.ahalf_day_to_time,
            late_form_time: data.late_form_time,
            late_to_time: data.late_to_time,
            late1: data.late1,
            late2: data.late2,
            late3: data.late3,
            late1_deduction: data.late1_deduction,
            late2_deduction: data.late2_deduction,
            late3_deduction: data.late3_deduction,
        });
        setFormErrors({});
    };


    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // edit Edit Attendance slot

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/editview_attendancepolicy/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setFormData(res.data.data);

                    console.log('setFormData ---> ', res.data.data);

                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // console.log("data", formData)

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------



    // Shift Slot view api

    const [shiftslot, setShiftslot] = useState([]);


    useEffect(() => {
        fetchShiftSlot();
    }, []);

    const fetchShiftSlot = async () => {
        try {
            const response = await axios.get('https://office3i.com/user/api/public/api/shiftslotlist', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.status === 200) {
                setShiftslot(response.data.data);
                setLoading(false); // Update loading state
                //  console.log('Shift slot view ---> ', response.data.data);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // ------------------------------------------------------------------------------------------------

    return (

        <>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (


                <Container fluid className='shift__container'>
                    <h3 className='mb-5'>Edit Attendance Slot</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* shift slot add form */}

                    <div className='mb-5 shift__row'>
                        <Row className='mb-5 '>
                            <Col>
                                <Form.Group controlId="shift_slot">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Shift Slot <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.shift_slot}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="">Select Shifts</option>
                                        {/* Map over the shiftslot array to dynamically generate options */}
                                        {shiftslot.map(slot => (
                                            <option key={slot.id} value={slot.id}>{slot.shift_slot}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.shiftSlot && <span className="text-danger">{formErrors.shiftSlot}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>From Time <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="From Time"
                                        value={formData.form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>To Time <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="To Time"
                                        value={formData.to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="total_hrs">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Total Hours <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Total Hours"
                                        value={formData.total_hrs}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="fp_form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (1st Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Permission (1st Half) From Time"
                                        value={formData.fp_form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="fp_to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (1st Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Permission (1st Half) From To"
                                        value={formData.fp_to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="ap_form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (2nd Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Permission (2nd Half) From Time"
                                        value={formData.ap_form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="ap_to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (2nd Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Permission (2nd Half) From To"
                                        value={formData.ap_to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="fhalf_day_form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (1st Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (1st Half) From Time"
                                        value={formData.fhalf_day_form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="fhalf_day_to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (1st Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (1st Half) From To"
                                        value={formData.fhalf_day_to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="ahalf_day_form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (2nd Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (2nd Half) From Time"
                                        value={formData.ahalf_day_form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="ahalf_day_to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (2nd Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (2nd Half) From To"
                                        value={formData.ahalf_day_to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="late_form_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Late From"
                                        value={formData.late_form_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="late_to_time">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Late To"
                                        value={formData.late_to_time}
                                        onChange={handleChange}

                                    />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group controlId="late1">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 1 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 1"
                                        value={formData.late1}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late1 && <span className="text-danger">{formErrors.late1}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late1_deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 1 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 1 Deduction"
                                        value={formData.late1_deduction}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late1_deduction && <span className="text-danger">{formErrors.late1_deduction}</span>}
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="late2">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 2 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 2"
                                        value={formData.late2}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late2 && <span className="text-danger">{formErrors.late2}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late2_deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 2 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 2 Deduction"
                                        value={formData.late2_deduction}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late2_deduction && <span className="text-danger">{formErrors.late2_deduction}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late3">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 3 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 3"
                                        value={formData.late3}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late3 && <span className="text-danger">{formErrors.late3}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late3_deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 3 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Late 3 Deduction"
                                        value={formData.late3_deduction}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.late3_deduction && <span className="text-danger">{formErrors.late3_deduction}</span>}
                            </Col>

                        </Row>


                        <div className='submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>

                    </div>
                </Container>
            )}
        </>
    )
}

export default EditAttendancePolicy