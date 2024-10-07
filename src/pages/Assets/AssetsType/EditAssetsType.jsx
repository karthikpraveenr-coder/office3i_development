import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';


function EditAssetsType() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add Assetslist page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitAssetslist = () => {
        navigate(`/admin/assetstype`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Edit assets state

    const [assetsID, setAssetsID] = useState('');
    const [assetsType, setAssetsType] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // ------------------------------------------------------------------------------------------------
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/edit_asset_typelist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    setAssetsID(response.data.data.asset_id);
                    setAssetsType(response.data.data.asset_type_name);
                    setLoading(false)


                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: error,
                });
            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------


    const handleSave = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!assetsID) {
            errors.assetsID = 'Asset ID is required.';
        }

        if (!assetsType) {
            errors.assetsType = 'Asset Type is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            id: id,
            asset_type_name: assetsType,
            updated_by: userempid
        };


        axios.put('https://office3i.com/development/api/public/api/update_asset_type', requestData, {
            headers: {
                'Content-Type': 'application/json',
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

                    handleVisitAssetslist()


                } else if (status === 'error') {

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
                    text: 'There was an error creating the leave policy type. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    // ------------------------------------------------------------------------------------------------

    const handleCancel = () => {
        handleVisitAssetslist()
        setFormErrors({});
    }

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
                    <h3 className='mb-5'>Assets Type</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* shift slot add form */}

                    <Row className='mb-5 shift__row'>
                        <Col>
                            <Form>
                                <Form.Group controlId="formShift">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Assets ID</Form.Label>
                                    <Form.Control type="text" placeholder="Enter Assets ID" value={assetsID} onChange={(e) => setAssetsID(e.target.value)} disabled />
                                    {formErrors.assetsID && <span className="text-danger">{formErrors.assetsID}</span>}
                                </Form.Group>

                            </Form>
                        </Col>
                        <Col>
                            <Form.Group controlId="formShift">
                                <Form.Label style={{ fontWeight: 'bold' }}>Assets Type</Form.Label>
                                <Form.Control type="text" placeholder="Enter Assets Type" value={assetsType} onChange={(e) => setAssetsType(e.target.value)} />
                                {formErrors.assetsType && <span className="text-danger">{formErrors.assetsType}</span>}
                            </Form.Group>

                        </Col>
                        <div className='mt-5 submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>
                    </Row>
                    {/* ------------------------------------------------------------------------------------------------ */}

                </Container>


            )}
        </>



    )
}

export default EditAssetsType