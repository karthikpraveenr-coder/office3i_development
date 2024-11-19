import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditSkillsdevelopmenttraining() {

    // ------------------------------------------------------------------------------------------------
    const { id } = useParams();
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const handleVisitSkillDevelopmentTraining = () => {
        navigate(`/admin/AddSkillsDevelopmentTraining`);
    };
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    const [title, setTitle] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [formErrors, setFormErrors] = useState({})
    const [previewUrl, setPreviewUrl] = useState('');

    // ------------------------------------------------------------------------------------------------
    // Fetch initial data
    useEffect(() => {
        const fetchSkillData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/edit_skill_dev/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                    },
                });

                const skillData = response.data.skill_dev_details;
                setTitle(skillData.event_name);
                setAttachment()
                setStartDate(skillData.from_date);
                setFinishDate(skillData.to_date);

                // Set the preview URL if an attachment already exists
                const attachmentUrl = skillData.attachment
                    ? `https://office3i.com/development/api/storage/app/${skillData.attachment}`
                    : null;
                setAttachment(attachmentUrl);
                setPreviewUrl(attachmentUrl);
            } catch (error) {
                console.error("Error fetching skill data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load data. Please try again later.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchSkillData();
    }, [usertoken]);

    const handleAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachment(file);
            setPreviewUrl(URL.createObjectURL(file)); // Set preview for the selected file
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("event_name", title);
        formData.append("attachment", attachment);  // File object
        formData.append("from_date", startDate);
        formData.append("to_date", finishDate);
        formData.append("user_emp_id", userempid);
        formData.append("id", id);

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/update_skill_dev',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                    },
                }
            );

            if (response.data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
                handleVisitSkillDevelopmentTraining()
            } else if (response.data.status === "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Try Again'
                });
            }
        } catch (error) {
            console.error("Error submitting form", error);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    const handleCancel = () => {

        handleVisitSkillDevelopmentTraining()
        setFormErrors({});
    };
    // ------------------------------------------------------------------------------------------------

    return (
        <div>
            <Container fluid className='shift__container'>
                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Skill Development & Training</h3>

                {/* ------------------------------------------------------------------------------------------------ */}
                {/* Supervisor list slot add form */}

                <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                    <Row className='mb-3'>
                        <Col sm={12} md={6}>
                            <Form.Group controlId="formTitle" className="mb-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        <Col sm={12} md={6}>
                            <Form.Group controlId="formAttachment" className="mb-3">
                                <Form.Label>Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleAttachmentChange}
                                    required
                                />
                                {previewUrl && (
                                    <div className="mt-3">
                                        <p>Preview:</p>
                                        <img src={previewUrl} alt="Attachment Preview" style={{ width: '25%', maxHeight: '200px', objectFit: 'cover' }} />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-3'>
                        <Col sm={12} md={6}>
                            <Form.Group controlId="formStartDate" className="mb-3">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={12} md={6}>
                            <Form.Group controlId="formFinishDate" className="mb-3">
                                <Form.Label>Finish Date</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    value={finishDate}
                                    onChange={(e) => setFinishDate(e.target.value)}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="justify-content-left mt-4">
                        <Col xs="auto">
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn ms-2'>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </div>

                {/* ------------------------------------------------------------------------------------------------ */}



            </Container>

        </div>
    )
}

export default EditSkillsdevelopmenttraining