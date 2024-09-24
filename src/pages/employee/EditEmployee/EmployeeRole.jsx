import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

const EmployeeRole = ({ formData, handleChange, prevStep, formErrors, nextStep }) => {

    // const userRoleOptions = formData.userRole.data || [];
    const userRoleOptions = (formData.userRole && formData.userRole.data) || [];

    console.log("userRoleOptions:---------------------------------------------------------------->", userRoleOptions);
    console.log("formData.userRole:", formData.userRole);


    return (
        <div>


            <Container className="employee__role__container mt-5">
                <h3>Employee Role</h3>
                <Form >

                    <Row className="mt-5 mb-3">
                        <Col>
                            <Form.Group controlId="formGridUserRole">
                                <Form.Label>Select User Role<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="selectedRoleId" // Assuming you've added this field to your state
                                    value={formData.selectedRoleId || ''} // Ensures a controlled component
                                    onChange={handleChange} // Make sure handleChange updates selectedRoleId correctly
                                >
                                    <option value="">Select User Role</option>
                                    {userRoleOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.role_name}</option>
                                    ))}
                                </Form.Select>
                                {formErrors.selectedRoleId && <span className="text-danger">{formErrors.selectedRoleId}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formGridDesignation" className='mb-2'>
                                <Form.Label>Designation<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="designation"
                                    placeholder="Enter Designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                />
                                {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                            </Form.Group>
                            <Form.Group controlId="formGridCheckbox">
                                <Form.Check
                                    type="checkbox"
                                    name="isCheckBoxChecked"
                                    label="Update Designation"
                                    checked={formData.isCheckBoxChecked}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>



                    </Row>

                    <Row className="mt-3">
                        <Col>
                            <Form.Group controlId="formGridDesignationDate">
                                <Form.Label>Designation Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="designationDate"
                                    value={formData.designationDate}
                                    onChange={handleChange}
                                    disabled={!formData.isCheckBoxChecked}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridNewDesignation">
                                <Form.Label>New Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="newDesignation"
                                    placeholder="Enter New Designation"
                                    value={formData.newDesignation}
                                    onChange={handleChange}
                                    disabled={!formData.isCheckBoxChecked}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridSupervisor">
                                <Form.Label>Select Supervisor<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="selectedsupervisorId"
                                    value={formData.selectedsupervisorId} // Assuming formData.supervisor is an object containing id and supervisor_name
                                    onChange={handleChange}
                                >
                                    <option value="">Select Supervisor</option>
                                    {formData.supervisor.map(supervisor => (
                                        <option key={supervisor.id} value={supervisor.id}>{supervisor.supervisor_name}</option>
                                    ))}
                                </Form.Select>
                                {formErrors.selectedsupervisorId && <span className="text-danger">{formErrors.selectedsupervisorId}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formGridOfficialEmail">
                                <Form.Label>Official Email Id<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="email"
                                    name="officialEmail"
                                    placeholder="Enter Official Email Id"
                                    value={formData.officialEmail}
                                    onChange={handleChange}
                                />
                                {formErrors.officialEmail && <span className="text-danger">{formErrors.officialEmail}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">

                        <Col>
                            <Form.Group controlId="formGridPassword">
                                <Form.Label>Password<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {formErrors.password && <span className="text-danger">{formErrors.password}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formGridCheckinCheckout">
                                <Form.Label>Checkin/Checkout<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="checkinCheckout"
                                    value={formData.checkinCheckout}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose...</option>
                                    <option value="1">Checkin</option>
                                    <option value="2">Checkin/Checkout</option>
                                    <option value="3">None</option>
                                </Form.Select>
                                {formErrors.checkinCheckout && <span className="text-danger">{formErrors.checkinCheckout}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">


                        <Col>
                            <Form.Group controlId="formGridOvertime">
                                <Form.Label>Overtime</Form.Label>
                                <Form.Select
                                    name="overtime"
                                    value={formData.overtime}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Overtime</option>
                                    <option value="Applicable">Applicable</option>
                                    <option value="NA">NA</option>
                                </Form.Select>
                                {formErrors.overtime && <span className="text-danger">{formErrors.overtime}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formGridLateAllowed">
                                <Form.Label>Late Allowed</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lateAllowed"
                                    placeholder="Enter Late Allowed"
                                    value={formData.lateAllowed}
                                    onChange={handleChange}
                                />
                                {formErrors.lateAllowed && <span className="text-danger">{formErrors.lateAllowed}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">

                        <Col lg={6}>
                            <Form.Group controlId="formGridPermissionAllowed">
                                <Form.Label>Permission Allowed</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="permissionAllowed"
                                    placeholder="Enter Permission Allowed"
                                    value={formData.permissionAllowed}
                                    onChange={handleChange}
                                />
                                {formErrors.permissionAllowed && <span className="text-danger">{formErrors.permissionAllowed}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3" style={{ display: 'flex' }}>
                        <Col xs={6} md={2} lg={2} xl={2}>
                            <button className="btn btn-secondary previous" onClick={prevStep}><FontAwesomeIcon icon={faAngleLeft} /> Previous</button>
                        </Col>
                        <Col xs={6} md={2} lg={2} xl={2}>
                            <button onClick={nextStep} className="btn btn-primary next">Next <FontAwesomeIcon icon={faAngleRight} /></button>
                        </Col>
                    </Row>



                </Form>
            </Container>
            {/* <button onClick={nextStep} className="btn btn-primary mt-3">Next</button> */}
        </div>
    );
};

export default EmployeeRole;

