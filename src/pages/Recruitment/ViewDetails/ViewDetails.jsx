import { faEye, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const ViewDetails = () => {

    // --------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToeditresumePage = (id) => {
        navigate(`/admin/editResume/${id}`);
    };
    // --------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------
    const [tab, setTab] = useState('general');
    const [resumeData, setResumeData] = useState(null);
    const { id } = useParams();

    // -------------------------------------------------------------------------------------------------------

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // -------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------

    // Fetch data from the API
    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/resume_edit_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.data.status === "success") {
                    setResumeData(response.data.data[0]);
                    console.log("response.data.data---------->", response.data)
                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [id, usertoken]);

    // -------------------------------------------------------------------------------------------------------

    console.log("resumeData", resumeData)
    if (!resumeData) {
        return <div>Loading...</div>;
    }

    const key__value = {
        display: 'flex',
        flexDirection: 'column',
        lineHeight: 2,
        width:'50%'
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
            <h3 style={{ fontWeight: 'bold', color: '#00275c' }} className='mb-5'>View Details</h3>
            <div className="mb-5" style={{ display: 'flex', gap: '20px' }}>
                <Button variant={tab === 'general' ? 'primary' : 'outline-primary'} onClick={() => setTab('general')} style={{ padding: '7px 25px' }}>General</Button>
                <Button variant={tab === 'career' ? 'primary' : 'outline-primary'} onClick={() => setTab('career')} style={{ padding: '7px 25px' }}>Career</Button>
            </div>

            {tab === 'general' && (
                <Card>

                    <Card.Body>
                        {/* Add Edit Button */}
                        <Button variant="outline-secondary" style={view__btn} onClick={() => GoToeditresumePage(resumeData.id)}><FontAwesomeIcon icon={faPencil} /> Edit</Button>
                        <h6 style={{ fontSize: '22px' }}>General</h6>
                        <Row>
                            <Col style={key__value}><strong>Source</strong> {resumeData.source}</Col>
                            <Col style={key__value}><strong>Candidate Name</strong> {resumeData.candidate_name}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Position Applying For</strong> {resumeData.position_applying}</Col>
                            <Col style={key__value}><strong>Gender</strong> {resumeData.gender}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Email</strong> {resumeData.email}</Col>
                            <Col style={key__value}><strong>Mobile No</strong> {resumeData.mobile_no}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Alternate Mobile No</strong> {resumeData.alter_mobile_no}</Col>
                            <Col style={key__value}><strong>Date Of Birth</strong> {resumeData.dob}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Address/Location</strong> {resumeData.country_name}, {resumeData.state_name}, {resumeData.current_cityname}</Col>
                            <Col style={key__value}><strong>Preferred Location</strong> {resumeData.preferred_locations.join(', ')}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Languages Known</strong> {resumeData.languages}</Col>
                        </Row>
                        <h6 className='mt-5' style={{ fontSize: '22px' }}>Under Graduate</h6>
                        <Row>
                            <Col style={key__value}><strong>Degree</strong> {resumeData.ug_degree}</Col>
                            <Col style={key__value}><strong>Specialization</strong> {resumeData.ug_specialization}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Year of Passing</strong> {resumeData.ug_year_of_passing}</Col>
                            <Col style={key__value}><strong>School/University</strong> {resumeData.ug_university}</Col>
                        </Row>
                        <h6 className='mt-5' style={{ fontSize: '22px' }}>Post Graduate</h6>
                        <Row>
                            <Col style={key__value}><strong>Degree</strong> {resumeData.pg_degree || '-'} </Col>
                            <Col style={key__value}><strong>Specialization</strong> {resumeData.pg_specialization}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Year of Passing</strong> {resumeData.pg_year_of_passing}</Col>
                            <Col style={key__value}><strong>School/University</strong> {resumeData.pg_university}</Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {tab === 'career' && (
                <Card>
                    <Card.Body>
                        {/* Add Edit Button */}
                        <Button variant="outline-secondary" style={view__btn} onClick={() => GoToeditresumePage(resumeData.id)}><FontAwesomeIcon icon={faPencil} /> Edit</Button>

                        <h6 style={{ fontSize: '22px' }}>Career</h6>
                        <Row>
                            <Col style={key__value}><strong>Current Employer</strong> {resumeData.current_employer}</Col>
                            <Col style={key__value}><strong>Current Designation</strong> {resumeData.current_designation}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Functional Area</strong> {resumeData.functional_area}</Col>
                            <Col style={key__value}><strong>Area of Specialization</strong> {resumeData.area_specialization_name}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Industry</strong> {resumeData.industry_name}</Col>
                            <Col style={key__value}><strong>Employment Type</strong> {resumeData.employment_type}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Total Experience</strong> {resumeData.total_exp}</Col>
                            <Col style={key__value}><strong>Current CTC</strong> {resumeData.current_ctc}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Expected CTC</strong> {resumeData.expected_ctc}</Col>
                            <Col style={key__value}><strong>Notice Period</strong> {resumeData.notice_period}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Candidate Status</strong> {resumeData.status}</Col>
                            <Col style={key__value}><strong>Date Of Joining</strong> {resumeData.date_of_join}</Col>
                        </Row>
                        <Row>
                            <Col style={key__value}><strong>Key Skills</strong> {resumeData.key_skills}</Col>
                            <Col style={key__value}><strong>Social Media Link</strong> <a href={`${resumeData.social_link}`} target="_blank">{resumeData.social_link}</a></Col>
                        </Row>
                        <Row>
                            <Col style={key__value} md='6'><strong>Attached Resume</strong>

                                <Button
                                    style={{
                                        background: '#E7E0FC',
                                        border: '1px solid #8056FF',
                                        fontWeight: '600',
                                        color: '#000000',
                                       width:'44px'
                                    }}
                                    onClick={() => {
                                        const url = `https://office3i.com/development/api/storage/app/${resumeData.attached_resume}`;
                                        console.log("Opening URL:", url);
                                        window.open(url, '_blank');
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}


        </Container>
    );
}

export default ViewDetails;
