import React, { useState } from 'react';
import { Container, Form, Button, Col, Row } from 'react-bootstrap';
import './css/BasicDetailsStyle.css'
import { faAngleLeft, faAngleRight, faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EmployeeDetails = ({ formData, handleChange, prevStep, formErrors, nextStep }) => {





    return (
        <div>
            <Container className="employee__details__container mt-5 mb-5">
                <h3>Employee Details</h3>
                <Form>
                    <Row className="mt-5 mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formGridEmployeeJobType">
                                <Form.Label>Employee Job Type<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="selectedemployeeJobType"
                                    placeholder="Enter Employee Job Type"
                                    value={formData.selectedemployeeJobType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Employee Job Type</option>
                                    {formData.employeeJobType.map(jobtype => (
                                        <option key={jobtype.id} value={jobtype.id}>{jobtype.job_name}</option>
                                    ))} 
                                </Form.Select>
                                {formErrors.selectedemployeeJobType && <span className="text-danger">{formErrors.selectedemployeeJobType}</span>}
                            </Form.Group>
                        </Col>
                   
                    </Row>
                    <Row className="mt-5 mb-3">
                        <Col>
                            <Form.Group controlId="formGridEmployeeCategory">
                                <Form.Label>Employee Category<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="selectedemployeeCategory"
                                    placeholder="Enter Employee Category"
                                    value={formData.selectedemployeeCategory}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Employee Category</option>
                                    {formData.employeeCategory.map(supervisor => (
                                        <option key={supervisor.id} value={supervisor.id}>{supervisor.employee_category}</option>
                                    ))}
                                </Form.Select>
                                {formErrors.selectedemployeeCategory && <span className="text-danger">{formErrors.selectedemployeeCategory}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridDateOfJoining">
                                <Form.Label>Date of Joining<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dateOfJoining"
                                    max="9999-12-31"
                                    value={formData.dateOfJoining}
                                    onChange={handleChange}
                                />
                                {formErrors.dateOfJoining && <span className="text-danger">{formErrors.dateOfJoining}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridProbationPeriod">
                                <Form.Label>Probation Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="probationPeriod"
                                    placeholder="Enter Probation Period"
                                    value={formData.probationPeriod}
                                    onChange={handleChange}
                                />
                                {formErrors.probationPeriod && <span className="text-danger">{formErrors.probationPeriod}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridConfirmationDate">
                                <Form.Label>Confirmation Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="confirmationDate"
                                    max="9999-12-31"
                                    value={formData.confirmationDate}
                                    onChange={handleChange}
                                />
                                {formErrors.confirmationDate && <span className="text-danger">{formErrors.confirmationDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridEmployeeAgreementPeriod">
                                <Form.Label>Employee Agreement Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employeeAgreementPeriod"
                                    placeholder="Enter Employee Agreement Period"
                                    value={formData.employeeAgreementPeriod}
                                    onChange={handleChange}
                                />
                                {formErrors.employeeAgreementPeriod && <span className="text-danger">{formErrors.employeeAgreementPeriod}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridNoticePeriod">
                                <Form.Label>Notice Period<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="noticePeriod"
                                    placeholder="Enter Notice Period"
                                    value={formData.noticePeriod}
                                    onChange={handleChange}
                                />
                                {formErrors.noticePeriod && <span className="text-danger">{formErrors.noticePeriod}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridCTC">
                                <Form.Label>CTC<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    name="ctc"
                                    placeholder="Enter CTC"
                                    value={formData.ctc}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.ctc && <span className="text-danger">{formErrors.ctc}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridGrossSalary">
                                <Form.Label>Gross Salary<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    name="grossSalary"
                                    placeholder="Enter Gross Salary"
                                    value={formData.grossSalary}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.grossSalary && <span className="text-danger">{formErrors.grossSalary}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridNetSalary">
                                <Form.Label>Net Salary<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="number"
                                    name="netSalary"
                                    placeholder="Enter Net Salary"
                                    value={formData.netSalary}
                                    onChange={handleChange}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.netSalary && <span className="text-danger">{formErrors.netSalary}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridLastWorkingDay">
                                <Form.Label>Last Working Day</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="lastWorkingDay"
                                    max="9999-12-31"
                                    value={formData.lastWorkingDay}
                                    onChange={handleChange}
                                />
                                {formErrors.lastWorkingDay && <span className="text-danger">{formErrors.lastWorkingDay}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridProvidentFund">
                                <Form.Label>Provident Fund<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="providentFund"
                                    value={formData.providentFund}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Provident Fund</option>
                                    <option value="Applicable">Applicable</option>
                                    <option value="NA">NA</option>
                                </Form.Select>
                                {formErrors.providentFund && <span className="text-danger">{formErrors.providentFund}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formGridUANNumber">
                                <Form.Label>UAN Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="uanNumber"
                                    placeholder="Enter UAN Number"
                                    value={formData.uanNumber}
                                    onChange={handleChange}
                                    disabled={formData.providentFund !== "Applicable"}
                                />
                                {formErrors.uanNumber && <span className="text-danger">{formErrors.uanNumber}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridEmployeePfContribution">
                                <Form.Label>Employee PF Contribution</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employeePfContribution"
                                    placeholder="Enter Employee PF Contribution"
                                    value={formData.employeePfContribution}
                                    onChange={handleChange}
                                    disabled={formData.providentFund !== "Applicable"}
                                />
                                {formErrors.employeePfContribution && <span className="text-danger">{formErrors.employeePfContribution}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridEmployerPfContribution">
                                <Form.Label>Employer PF Contribution</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employerPfContribution"
                                    placeholder="Enter Employer PF Contribution"
                                    value={formData.employerPfContribution}
                                    onChange={handleChange}
                                    disabled={formData.providentFund !== "Applicable"}
                                />
                                {formErrors.employerPfContribution && <span className="text-danger">{formErrors.employerPfContribution}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridESI">
                                <Form.Label>ESI<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Select
                                    name="esi"
                                    value={formData.esi}
                                    onChange={handleChange}
                                >
                                    <option value="">Select ESI</option>
                                    <option value="Applicable">Applicable</option>
                                    <option value="NA">NA</option>
                                </Form.Select>
                                {formErrors.esi && <span className="text-danger">{formErrors.esi}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridESINumber">
                                <Form.Label>ESI Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="esiNumber"
                                    placeholder="Enter ESI Number"
                                    value={formData.esiNumber}
                                    onChange={handleChange}
                                    disabled={formData.esi !== "Applicable"}
                                />
                                {formErrors.esiNumber && <span className="text-danger">{formErrors.esiNumber}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formGridEmployeeEsiContribution">
                                <Form.Label>Employee ESI Contribution</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employeeEsiContribution"
                                    placeholder="Enter Employee ESI Contribution"
                                    value={formData.employeeEsiContribution}
                                    onChange={handleChange}
                                    disabled={formData.esi !== "Applicable"}
                                />
                                {formErrors.employeeEsiContribution && <span className="text-danger">{formErrors.employeeEsiContribution}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formGridEmployerEsiContribution">
                                <Form.Label>Employer ESI Contribution</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employerEsiContribution"
                                    placeholder="Enter Employer ESI Contribution"
                                    value={formData.employerEsiContribution}
                                    onChange={handleChange}
                                    disabled={formData.esi !== "Applicable"}
                                />
                                {formErrors.employerEsiContribution && <span className="text-danger">{formErrors.employerEsiContribution}</span>}
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

export default EmployeeDetails;
