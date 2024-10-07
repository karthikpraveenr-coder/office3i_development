import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditGoodsServices() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add employe  level category page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitgoodsservices = () => {
        navigate(`/admin/addgoodsservices`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Goods & Services Save

    const [goodservicesname, setGoodsServices] = useState('');
    const [hsn, setHsn] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    const handleSave = (e) => {
        e.preventDefault();

        //Form validation
        const errors = {};
        if (!goodservicesname) {
            errors.goodservicesname = 'Goods & Services Name is required.';
        }
        if (!hsn) {
            errors.hsn = 'HSN / SAC  is required.';
        }
        // if (!description) {
        //     errors.description = 'Description is required.';
        // }
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
            good_service_name: goodservicesname,
            hsn_sac: hsn,
            description: description || '-',
            status: status,
            updated_by: userempid
        };


        axios.put(`https://office3i.com/development/api/public/api/update_goodservice`, requestData, {
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
                        text: 'Goods & Services has been updated successfully!',
                    });
                    handleVisitgoodsservices()

                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Goods & Services. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {
        handleVisitgoodsservices()
        // setEmpLevelcat('');
        // setStatus('');
        // setFormErrors({});
    };

    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };

    // ------------------------------------------------------------------------------------------------
    // edit Emp Level Category

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/editview_goodservice/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setGoodsServices(res.data.data.good_service_name);
                    setHsn(res.data.data.hsn_sac);
                    setDescription(res.data.data.description);
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

                    {/* Goods & Services edit form */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Goods & Services</h5>
                    <Row className='mb-5 shift__row'>
                        {/* First Column */}

                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formGoodsName">
                                <Form.Label style={{ fontWeight: 'bold' }}>Goods & Services Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Goods & Services Name"
                                    value={goodservicesname}
                                    onChange={(e) => handleInputChange(setGoodsServices)(e)}
                                />
                            </Form.Group>
                            {formErrors.goodservicesname && <span className="text-danger">{formErrors.goodservicesname}</span>}
                        </Col>

                        {/* Second Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formHSN">
                                <Form.Label style={{ fontWeight: 'bold' }}>HSN / SAC</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter HSN / SAC"
                                    value={hsn}
                                    onChange={(e) => handleInputChange(setHsn)(e)}
                                />
                            </Form.Group>
                            {formErrors.hsn && <span className="text-danger">{formErrors.hsn}</span>}
                        </Col>

                        {/* Third Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formDescription">
                                <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3} // Adjusted row count for better visibility
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => handleInputChange(setDescription)(e)}
                                />
                            </Form.Group>
                            {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                        </Col>

                        {/* Fourth Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formStatus">
                                <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => handleInputChange(setStatus)(e)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                            </Form.Group>
                            {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
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

export default EditGoodsServices