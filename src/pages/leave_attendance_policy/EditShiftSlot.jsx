import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function EditShiftSlot() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitaddshiftslot = () => {
        navigate(`/admin/addshiftslot`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Shift Slot Save

    const [shift, setShift] = useState();
    const [status, setStatus] = useState();
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});


    const handleSave = (e) => {
        e.preventDefault();

        const errors = {};

        if (!shift) {
            errors.shift = 'Shift Slot is required.';
        }

        if (!status) {
            errors.status = 'Status is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            id: id,
            shiftslot_name: shift,
            shiftslot_status: status,
            updated_by: userempid
        };


        axios.put(`https://office3i.com/development/api/public/api/update_shiftslot`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Shift slot has been updated successfully!',
                    });
                    handleVisitaddshiftslot()
                    setRefreshKey(prevKey => prevKey + 1);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the shift slot. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {
        setShift(data.shift_slot);
        setStatus(data.status);
        setFormErrors({});

    };

    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };

    // ------------------------------------------------------------------------------------------------
    // edit shift

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/editview_shiftslot/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setShift(res.data.data.shift_slot);
                    setStatus(res.data.data.status);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

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
                    <h3 className='mb-5'>Edit Shift Slot</h3>

                    {/* shift slot add form */}

                    <Row className='mb-5 shift__row'>
                        <Col>
                            <Form>
                                <Form.Group controlId="formShift">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Shift Slot <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="text" placeholder="Enter shift slot" value={shift} onChange={(e) => handleInputChange(setShift)(e)} />
                                    {formErrors.shift && <span className="text-danger">{formErrors.shift}</span>}
                                </Form.Group>

                            </Form>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label style={{ fontWeight: 'bold' }}> Status <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>

                        </Col>
                        <div className='submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                Save
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>
                    </Row>

                </Container>
            )}
        </>
    )
}

export default EditShiftSlot