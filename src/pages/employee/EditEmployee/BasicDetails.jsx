import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

const BasicDetails = ({ formData, handleChange, handlePictureChange, formErrors, copyAddress, handleCheckboxChange, imagePreviewUrl, nextStep, oldProfileImg }) => {




    return (
        <div className='basic__details__container mt-5 mb-5'>
            <h3>Basic Details</h3>

            <Container className="mt-5">
                <Form >
                    <Row className="mb-4">
                        {/* Employee ID */}
                        <Form.Group as={Col} md="6" controlId="formGridEmployeeId">
                            <Form.Label>Employee ID<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="employeeId"
                                placeholder="Enter Employee ID"
                                value={formData.employeeId}
                                onChange={handleChange}
                                disabled
                            />
                            {formErrors.employeeId && <span className="text-danger">{formErrors.employeeId}</span>}
                        </Form.Group>


                        {/* Employee Picture */}
                        <Form.Group as={Col} md="6" controlId="formGridEmployeePicture">
                            <Form.Label>Employee Picture<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                name="employeePicture"
                                onChange={handlePictureChange}
                            />
                            {formErrors.employeePicture && <span className="text-danger">{formErrors.employeePicture}</span>}
                            {imagePreviewUrl && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={imagePreviewUrl} alt="Employee Preview" style={{ width: '25%', height: 'auto' }} />
                                </div>
                            )}
                            {!imagePreviewUrl && oldProfileImg && (
                                <div style={{ marginTop: '10px' }}>
                                    <img src={`https://office3i.com/user/api/storage/app/${oldProfileImg}`} alt="Employee Preview" style={{ width: '25%', height: 'auto' }} />
                                </div>
                            )}
                        </Form.Group>




                    </Row>

                    <Row className="mb-4">
                        {/* First Name */}
                        <Form.Group as={Col} md="6" controlId="formGridFirstName">
                            <Form.Label>First Name<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                placeholder="Enter First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {formErrors.firstName && <span className="text-danger">{formErrors.firstName}</span>}
                        </Form.Group>

                        {/* Last Name */}
                        <Form.Group as={Col} md="6" controlId="formGridLastName">
                            <Form.Label>Last Name<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                placeholder="Enter Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {formErrors.lastName && <span className="text-danger">{formErrors.lastName}</span>}
                        </Form.Group>


                    </Row>

                    <Row className="mb-4">
                        {/* Gender */}
                        <Form.Group as={Col} md="6" controlId="formGridGender">
                            <Form.Label>Gender<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </Form.Select>
                            {formErrors.gender && <span className="text-danger">{formErrors.gender}</span>}
                        </Form.Group>


                        {/* Status */}
                        <Form.Group as={Col} md="6" controlId="formGridStatus">
                            <Form.Label>Status<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="Active">Active</option>
                                <option value="In-Active">In-Active</option>
                            </Form.Select>
                            {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        {/* Phone Number */}
                        <Form.Group as={Col} md="6" controlId="formGridPhoneNumber">
                            <Form.Label>Phone Number<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="tel"
                                name="phoneNumber"
                                placeholder="Enter Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                            {formErrors.phoneNumber && <span className="text-danger">{formErrors.phoneNumber}</span>}
                        </Form.Group>

                        {/* WhatsApp Number */}
                        <Form.Group as={Col} md="6" controlId="formGridWhatsappNumber">
                            <Form.Label>WhatsApp Number<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="tel"
                                name="whatsappNumber"
                                placeholder="Enter WhatsApp Number"
                                value={formData.whatsappNumber}
                                onChange={handleChange}
                            />
                            {formErrors.whatsappNumber && <span className="text-danger">{formErrors.whatsappNumber}</span>}
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        {/* Email */}
                        <Form.Group as={Col} md="6" controlId="formGridEmail">
                            <Form.Label>Email<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                        </Form.Group>

                        {/* Date of Birth */}
                        <Form.Group as={Col} md="6" controlId="formGridDateOfBirth">
                            <Form.Label>Date of Birth<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                            />
                            {formErrors.dob && <span className="text-danger">{formErrors.dob}</span>}
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        {/* Current Address */}
                        <Form.Group as={Col} md="6" controlId="formGridCurrentAddress">
                            <Form.Label>Current Address<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="currentAddress"
                                placeholder="Enter Current Address"
                                value={formData.currentAddress}
                                onChange={handleChange}
                            />
                            {formErrors.currentAddress && <span className="text-danger">{formErrors.currentAddress}</span>}
                        </Form.Group>

                        {/* Permanent Address */}
                        <Form.Group as={Col} md="6" controlId="formGridPermanentAddress">
                            <Form.Label>Permanent Address<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="permanentAddress"
                                placeholder="Enter Permanent Address"
                                value={formData.permanentAddress}
                                onChange={handleChange}
                            />
                            {formErrors.permanentAddress && <span className="text-danger">{formErrors.permanentAddress}</span>}
                            <Form.Check
                                type="checkbox"
                                label="Same as current address"
                                checked={copyAddress}
                                onChange={handleCheckboxChange}
                            />
                        </Form.Group>


                    </Row>

                    <Row className="mb-4">
                        {/* Parent/Guardian Name */}
                        <Form.Group as={Col} md="6" controlId="formGridParentName">
                            <Form.Label>Parent/Guardian Name<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="parentName"
                                placeholder="Enter Parent/Guardian Name"
                                value={formData.parentName}
                                onChange={handleChange}
                            />
                            {formErrors.parentName && <span className="text-danger">{formErrors.parentName}</span>}
                        </Form.Group>


                        {/* Marital Status */}
                        <Form.Group as={Col} md="6" controlId="formGridMaritalStatus">
                            <Form.Label>Marital Status<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Select
                                name="maritalStatus"
                                value={formData.maritalStatus}
                                onChange={handleChange}
                            >
                                <option value="">Choose...</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                            </Form.Select>
                            {formErrors.maritalStatus && <span className="text-danger">{formErrors.maritalStatus}</span>}
                        </Form.Group>


                    </Row>

                    <Row className="mb-4">
                        {/* Spouse Name */}
                        <Form.Group as={Col} md="6" controlId="formGridSpouseName">
                            <Form.Label>Spouse Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="spouseName"
                                placeholder="Enter Spouse Name"
                                value={formData.spouseName}
                                onChange={handleChange}
                                disabled={formData.maritalStatus !== "Married"}
                            />
                            {formErrors.spouseName && <span className="text-danger">{formErrors.spouseName}</span>}
                        </Form.Group>

                        {/* Aadhar Number */}
                        <Form.Group as={Col} md="6" controlId="formGridAadharNumber">
                            <Form.Label>Aadhar Number<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="aadharNumber"
                                placeholder="Enter Aadhar Number"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                            />
                            {formErrors.aadharNumber && <span className="text-danger">{formErrors.aadharNumber}</span>}
                        </Form.Group>


                    </Row>

                    <Row>
                        {/* PAN Number */}
                        <Form.Group as={Col} md="6" controlId="formGridPanNumber">
                            <Form.Label>PAN Number<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                            <Form.Control
                                type="text"
                                name="panNumber"
                                placeholder="Enter PAN Number"
                                value={formData.panNumber}
                                onChange={handleChange}
                            />
                            {formErrors.panNumber && <span className="text-danger">{formErrors.panNumber}</span>}
                        </Form.Group>
                    </Row>



                    <button onClick={nextStep} className="btn btn-primary mt-3 next">Next <FontAwesomeIcon icon={faChevronRight} /></button>

                </Form>
            </Container>
            {/* <button onClick={nextStep} className="btn btn-primary mt-3">Next</button> */}
        </div>
    );
};

export default BasicDetails;
