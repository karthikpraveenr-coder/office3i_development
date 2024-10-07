import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';

function EditTemplate() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisittemplate = () => {
        navigate(`/admin/templates`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // Edit Company PolicySave

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);

    const [newfile, setNewfile] = useState(null);





    const handleImageChange = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            setNewfile(newFile);
            if (newFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector("#img").setAttribute("src", e.target.result);
                    document.querySelector("#img").style.display = 'block'; // Show image
                    document.querySelector("#fileLink").style.display = 'none'; // Hide link
                };
                reader.readAsDataURL(newFile);
            } else if (newFile.type === 'application/pdf') {
                const fileURL = URL.createObjectURL(newFile);
                document.querySelector("#img").style.display = 'none'; // Hide image
                document.querySelector("#fileLink").setAttribute("href", fileURL);
                document.querySelector("#fileLink").style.display = 'block'; // Show link
            }
        }
    };


    // useEffect(() => {
    //     if (file) {
    //         document.querySelector("#img").setAttribute("src", `https://office3i.com/user/api/storage/app/${file}`);
    //     }
    // }, [file]);


    // const handleSave = (e) => {
    //     e.preventDefault();



    //     const formData = new FormData();
    //     formData.append('id', id);
    //     formData.append('title', title);
    //     formData.append('status', status);
    //     formData.append('template_file', file); 
    //     formData.append('old_templatepath', file); 
    //     formData.append('updated_by', userempid); 


    //     axios.post(`https://office3i.com/user/api/public/api/hr_template_update`, formData, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${usertoken}`
    //         }
    //     })
    //         .then(response => {
    //             if (response.status === 200) {
    //                 Swal.fire({
    //                     icon: 'success',
    //                     title: 'Success',
    //                     text: 'Template has been updated successfully!',
    //                 });
    //                 handleVisittemplate()

    //             } else {
    //                 throw new Error('Network response was not ok');
    //             }
    //         })
    //         .catch(error => {
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Error',
    //                 text: 'There was an error updating the Template. Please try again later.',
    //             });

    //             console.error('There was an error with the API:', error);

    //         });
    // };

    const handleSave = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', id);
        formData.append('title', title);
        formData.append('status', status);

        formData.append('updated_by', userempid);

        if (newfile) {
            formData.append('template_file', newfile);

        } else if (file) {
            formData.append('old_templatepath', file);
        }




        axios.post('https://office3i.com/user/api/public/api/hr_template_update', formData, {
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
                    handleVisittemplate()

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
                    text: 'There was an error creating the shift slot. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };

    const handleCancel = () => {
        handleVisittemplate()
    };



    // ------------------------------------------------------------------------------------------------
    // edit shift

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/hr_edit_templatelist/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    console.log("res.data.data", res.data.data)
                    setTitle(res.data.data.title);
                    setStatus(res.data.data.status);
                    setFile(res.data.data.template_file);
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
                    <h3 className='mb-5'>Edit Company Policy</h3>

                    {/* shift slot add form */}

                    <div className='mb-5' style={{
                        background: '#ffffff',
                        padding: '60px 10px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
                        margin: '2px'
                    }}>
                        <Row className='mb-3'>
                            {/* Title Input Field */}
                            <Col>
                                <Form.Group controlId="formTitle">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Title</Form.Label>
                                    <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </Form.Group>
                            </Col>

                            {/* Status Selection Dropdown */}
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="In-Active">In-Active</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {/* File Upload Input */}
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="formFile">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Upload File</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleImageChange}
                                        className="form-control"
                                    />
                                    {/* File Preview */}
                                    {file && file.endsWith('.pdf') ? (
                                        <a id="fileLink" href={`https://office3i.com/user/api/storage/app/${file}`} target="_blank" rel="noopener noreferrer">
                                            View Current PDF
                                        </a>
                                    ) : (
                                        <img id="img" src={file ? `https://office3i.com/user/api/storage/app/${file}` : ''} alt="file" style={{ height: '150px' }} />
                                    )}
                                    <img src="" alt="file" id="img" style={{ height: '150px', display: 'none' }} />
                                    <a id="fileLink" href="" target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}>
                                        View Current PDF
                                    </a>
                                </Form.Group>
                            </Col>


                            {/* Action Buttons */}
                            <div className='mt-3 submit__cancel'>
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                    Cancel
                                </Button>
                            </div>
                        </Row>
                    </div>

                </Container>
            )}
        </>
    )
}

export default EditTemplate