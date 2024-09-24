import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const EditJobopening = () => {

    // ------------------------------------------------------------------------------------------------
    const { id } = useParams();

    const navigate = useNavigate();
    const handleVisitjobopening = () => {
        navigate(`/admin/jobopening`);
    };

    const handleCancel = () => {
        navigate(`/admin/viewjobcard/${id}`);
    };

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // update

    const [designation, setDesignation] = useState('');
    const [vacancies, setVacancies] = useState('');
    const [description, setDescription] = useState('');


    const handleUpdate = (e) => {
        e.preventDefault();


        const requestData = {
            id: id,
            designation: designation,
            no_of_vacancies: vacancies,
            description: description,
            updated_by: userempid
        };

        console.log("requestData", requestData)



        axios.put('https://office3i.com/user/api/public/api/update_job_opening', requestData, {
            headers: {
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
                    handleVisitjobopening()
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
                    text: 'There was an error updating the job opening. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // const [jobdetails, setJobdetails] = useState(null);
    // fetch the data 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/user/api/public/api/edit_jobopening_list/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const { data } = response.data;
                // console.log('data-->', data)
                // setJobdetails(data)
                setDesignation(data.designation)
                setVacancies(data.no_of_vacancies)
                setDescription(data.description)



            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, [id]);

    // ------------------------------------------------------------------------------------------------


    return (
        <Container style={{ padding: '10px 50px' }}>

            <div style={{ paddingBottom: '80px' }}>
                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Job Openings</h3>
                <h5 className='mb-2'>Edit Job</h5>
                <Form onSubmit={handleUpdate}
                    style={{
                        background: '#ffffff',
                        padding: '60px 40px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
                        margin: '2px'
                    }}>
                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    placeholder="Enter Designation"
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formVacancies">
                                <Form.Label>No. of Vacancies</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={vacancies}
                                    onChange={(e) => setVacancies(e.target.value)}
                                    placeholder="Enter number of vacancies"
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="formDescription">
                        <Form.Label>Description</Form.Label>
                        <JoditEditor
                            value={description}
                            config={{
                                placeholder: '',
                                // other configurations you might have
                            }}
                            onChange={(newContent) => setDescription(newContent)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Button type="submit" variant="primary">Save</Button>
                        <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
                    </Form.Group>
                </Form>

            </div>

        </Container>
    );
};

export default EditJobopening;
