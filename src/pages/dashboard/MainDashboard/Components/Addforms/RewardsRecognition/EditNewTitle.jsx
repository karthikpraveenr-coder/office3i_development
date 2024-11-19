import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditNewTitle() {

    // ------------------------------------------------------------------------------------------------
    const { id } = useParams();
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const handleVisitAddnewtitle = () => {
        navigate(`/admin/addnewtitle`);
    };
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    const [title, setTitle] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [templateAttachment, setTemplateAttachment] = useState(null); // Added state

    const [formErrors, setFormErrors] = useState({})
    const [previewUrl, setPreviewUrl] = useState('');
    const [templatePreviewUrl, setTemplatePreviewUrl] = useState(''); // Added state

    // ------------------------------------------------------------------------------------------------
    // Fetch initial data
    useEffect(() => {
        const fetchSkillData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/edit_reward_recognition_name/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                    },
                });

                const skillData = response.data.data;
                setTitle(skillData.event_name);
                setAttachment(skillData.image)
                setAttachment(skillData.template)

                // Set the preview URL if an attachment already exists
                const attachmentUrl = skillData.image
                    ? `https://office3i.com/development/api/storage/app/${skillData.image}`
                    : null;
                // setAttachment(attachmentUrl);
                setPreviewUrl(attachmentUrl);

                // Set the preview URL if an attachmenttemplateUrl already exists
                const attachmenttemplateUrl = skillData.template
                    ? `https://office3i.com/development/api/storage/app/${skillData.template}`
                    : null;
                // setAttachment(attachmentUrl);
                setTemplatePreviewUrl(attachmenttemplateUrl);
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

    const handleTemplateAttachmentChange = (e) => { // Added handler
        const file = e.target.files[0];
        if (file) {
            setTemplateAttachment(file);
            setTemplatePreviewUrl(URL.createObjectURL(file));
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("event_name", title);
        formData.append("image", attachment);
        formData.append("template_img", templateAttachment);
        formData.append("user_emp_id", userempid);
        formData.append("id", id);

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/update_reward_recognition_name',
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
                handleVisitAddnewtitle()
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

        handleVisitAddnewtitle()
        setFormErrors({});
    };
    // ------------------------------------------------------------------------------------------------

    return (
        <div>
            <Container fluid className='shift__container'>
                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit New Title</h3>

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
                            <Form.Group controlId="formTemplateAttachment" className="mb-3">
                                <Form.Label>Template Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={handleTemplateAttachmentChange}
                                    required
                                />
                                {templatePreviewUrl && (
                                    <div className="mt-3">
                                        <p>Template Preview:</p>
                                        <img src={templatePreviewUrl} alt="Template Attachment Preview" style={{ width: '25%', maxHeight: '200px', objectFit: 'cover' }} />
                                    </div>
                                )}
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

export default EditNewTitle