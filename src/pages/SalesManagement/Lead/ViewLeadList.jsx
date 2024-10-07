import { faEye, faPencil, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Badge, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ViewLeadList = () => {

    // -------------------------------------------------------------------------------------------------------
    const [tab, setTab] = useState('general');
    const [resumeData, setResumeData] = useState(null);
    const [resumestatusData, setResumestatusData] = useState([]);

    const { id } = useParams();
    //  const leadStatus = Array.isArray(resumeData?.data.Leadstatus) ? resumeData.data.Leadstatus : [];


    // -------------------------------------------------------------------------------------------------------

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // -------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------

    // Fetch data from the API
    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/viewedit_leadlist/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.data.status === "success") {
                    setResumeData(response.data.data.Leadlist);
                    console.log("response.data.data---------->", response.data.data.Leadlist)
                    setResumestatusData(response.data.data.Leadstatus);
                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [id, usertoken]);

    // -------------------------------------------------------------------------------------------------------

    //  console.log("resumeData", resumeData)
    if (!resumeData) {
        return <div>Loading...</div>;
    }

    const key__value = {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 2,
        width: '50%'
    }

    const view__btn = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        padding: '7px 25px',
        border: '1px solid #76B700',
        background: '#F0F6E5',
        fontWeight: 'bold',
        color: '#3A3A3A'
    };

    return (
        <Container style={{ padding: '10px 60px', }} >
            <h3 style={{ fontWeight: 'bold', color: '#00275c' }} className='mb-5'>View Lead Details</h3>

            <Card style={{ marginBottom: '15px' }}>

                <Card.Body>
                    {/* Add Edit Button */}
                    <h5 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00275c' }}>Personal Information</h5>
                    <div style={{ padding: '15px' }}>
                        <Row>
                            <Col style={key__value}><strong>Lead ID</strong> {resumeData.lead_id}</Col>
                            <Col style={key__value}><strong>Lead Date</strong> {resumeData.user_leaddate}</Col>
                            <Col style={key__value}><strong>Name</strong> {resumeData.user_name}</Col>
                            <Col style={key__value}><strong>Email</strong> {resumeData.user_email}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Mobile No</strong> {resumeData.user_mobile}</Col>
                            <Col style={key__value}><strong>WhatsApp No</strong> {resumeData.user_whatapp}</Col>
                            <Col style={key__value}><strong>Gender</strong> {resumeData.user_gender}</Col>
                            <Col style={key__value}><strong>Company Name</strong> {resumeData.user_company}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Country</strong> {resumeData.country_name}</Col>
                            <Col style={key__value}><strong>State</strong> {resumeData.state_name}</Col>
                            <Col style={key__value}><strong>City</strong> {resumeData.current_cityname}</Col>
                            <Col style={key__value}><strong>Area</strong> {resumeData.user_area}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Pincode</strong> {resumeData.user_pincode}</Col>
                            <Col style={key__value}><strong>Website</strong> {resumeData.user_website}</Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </div>

                </Card.Body>
            </Card>

            <Card style={{ marginBottom: '15px' }}>

                <Card.Body>
                    {/* Add Edit Button */}
                    <h5 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00275c' }}>Requirement Details</h5>
                    <div style={{ padding: '15px' }}>
                        <Row>
                            <Col style={key__value}><strong>Product Type</strong> {resumeData.product_type}</Col>
                            <Col style={key__value}><strong>Product Name</strong> {resumeData.product_name}</Col>
                            <Col style={key__value}><strong>Budget(Min)</strong> {resumeData.min_budget}</Col>
                            <Col style={key__value}><strong>Budget(Max)</strong> {resumeData.max_budget}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Requirements / Specifications Details </strong> {resumeData.description}</Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            <Card style={{ marginBottom: '15px' }}>

                <Card.Body>
                    {/* Add Edit Button */}
                    <h5 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00275c' }}>Source</h5>
                    <div style={{ padding: '15px' }}>
                        <Row>
                            <Col style={key__value}><strong>Source Name</strong> {resumeData.source_name}</Col>
                            <Col style={key__value}><strong>Source Number</strong> {resumeData.source_number}</Col>
                            <Col style={key__value}><strong>Call On</strong> {resumeData.call_backon || '0000-00-00'}</Col>
                            <Col ></Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Comments</strong> {resumeData.comment}</Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            <Card style={{ marginBottom: '15px' }}>
                <Card.Body>
                    {/* Add Edit Button */}
                    <h5 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00275c' }}>Presales Upload</h5>
                    <div style={{ padding: '15px' }}>
                        <Row>
                            <Col style={key__value}><strong>Upload FileType</strong> <Form.Check
                                type="radio"
                                label="Image"
                                value="image"
                                checked={resumeData.consultfee_filetype === 'image'}
                            />
                                <Form.Check
                                    type="radio"
                                    label="Audio"
                                    value="audio"
                                    checked={resumeData.consultfee_filetype === 'audio'}
                                /></Col>
                            <Col style={key__value}><strong>Attached Link</strong>
                                {resumeData.consultfee_document !== '-' ? (
                                    <button
                                        style={{ width: '75px', height: '35px' }}
                                        className="btn-view"
                                        onClick={() => { window.open(`https://office3i.com/development/api/storage/app/${resumeData.consultfee_document}`, '_blank') }}
                                    >
                                        <FontAwesomeIcon icon={faEye} /> View
                                    </button>
                                ) : (
                                    <FontAwesomeIcon icon={faFolderOpen} />
                                )}</Col>
                            <Col style={key__value}><strong> Sales Department Name</strong> {resumeData.Assign_sales_departmentname}</Col>
                            <Col style={key__value}><strong> Sales Employee Name</strong> {resumeData.Assign_sales_name}</Col>
                            <Col ></Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            <Card style={{ marginBottom: '15px' }}>
                <Card.Body>
                    {/* Add Edit Button */}
                    <h5 style={{ fontSize: '22px', fontWeight: 'bold', color: '#00275c' }}>Status</h5>
                    <div style={{ padding: '15px' }}>
                        <Row>
                            <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                                <thead className="thead-dark">
                                    <tr>
                                        {/* <th>S.No</th> */}
                                        <th>Status Date</th>
                                        <th>Status</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resumestatusData.length === 0 ? (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>No status data found</td>
                                        </tr>
                                    ) : (
                                        resumestatusData.map((row, index) => (
                                            <tr key={index}>
                                                {/* <td>{serialNumber}</td> */}
                                                <td>{row.status_date}</td>
                                                <td>{row.lead_status}</td>
                                                <td>{row.comments}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </Row>
                    </div>
                </Card.Body>
            </Card>

        </Container>
    );
}

export default ViewLeadList;
