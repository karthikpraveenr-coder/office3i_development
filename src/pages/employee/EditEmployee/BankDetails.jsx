import React, { useState } from 'react';
import { Container, Form, Button, Col, Row, InputGroup } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

const BankDetails = ({ formData, handleChange, prevStep, formErrors, nextStep }) => {



    return (
        <div>
           

            <Container className="bank__details__container mt-5">
            <h3>Bank Details</h3>
                <Form>

                    <Row className="mt-5 mb-3">
                        <Col>
                            <Form.Group controlId="formGridBankAccountNumber">
                                <Form.Label>Bank Account Number<sup><FontAwesomeIcon icon={faStarOfLife} style={{color:'#fb1816', fontSize:'8px'}}/></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bankAccountNumber"
                                    placeholder="Enter Bank Account Number"
                                    value={formData.bankAccountNumber}
                                    onChange={handleChange}
                                />
                                {formErrors.bankAccountNumber && <span className="text-danger">{formErrors.bankAccountNumber}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridBankName">
                                <Form.Label>Bank Name<sup><FontAwesomeIcon icon={faStarOfLife} style={{color:'#fb1816', fontSize:'8px'}}/></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bankName"
                                    placeholder="Enter Bank Name"
                                    value={formData.bankName}
                                    onChange={handleChange}
                                />
                                {formErrors.bankName && <span className="text-danger">{formErrors.bankName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridBankBranch">
                                <Form.Label>Bank Branch<sup><FontAwesomeIcon icon={faStarOfLife} style={{color:'#fb1816', fontSize:'8px'}}/></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bankBranch"
                                    placeholder="Enter Bank Branch"
                                    value={formData.bankBranch}
                                    onChange={handleChange}
                                />
                                {formErrors.bankBranch && <span className="text-danger">{formErrors.bankBranch}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridIFSCCode">
                                <Form.Label>IFSC Code<sup><FontAwesomeIcon icon={faStarOfLife} style={{color:'#fb1816', fontSize:'8px'}}/></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifscCode"
                                    placeholder="Enter IFSC Code"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                />
                                {formErrors.ifscCode && <span className="text-danger">{formErrors.ifscCode}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col lg={6}>
                            <Form.Group controlId="formGridAccountType">
                                <Form.Label>Select Account Type<sup><FontAwesomeIcon icon={faStarOfLife} style={{color:'#fb1816', fontSize:'8px'}}/></sup></Form.Label>
                                <Form.Select
                                    name="accountType"
                                    value={formData.accountType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Account Type</option>
                                    <option value="Savings">Savings</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Current">Current</option>
                                </Form.Select>
                                {formErrors.accountType && <span className="text-danger">{formErrors.accountType}</span>}
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

export default BankDetails;

