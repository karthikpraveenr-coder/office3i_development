import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';

const EditEmployeeSalary = () => {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitassignpayslip = () => {
        navigate(`/admin/assignemployeesalarylist`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------


    // State variables for managing form fields

    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');



    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ctc, setCtc] = useState('');
    const [grossPay, setGrossPay] = useState('');
    const [netPay, setNetPay] = useState('');
    const [basicDA, setBasicDA] = useState('');
    const [hra, setHra] = useState('');
    const [convenienceAllowance, setConvenienceAllowance] = useState('');
    const [transportAllowance, setTransportAllowance] = useState('');
    const [medicalAllowance, setMedicalAllowance] = useState('');
    const [otherAllowance, setOtherAllowance] = useState('');
    const [variable, setVariable] = useState('');
    const [pf, setPf] = useState('');
    const [epf, setEpf] = useState('');
    const [esi, setEsi] = useState('');
    const [salaryAdvance, setSalaryAdvance] = useState('');
    const [otherDeductions, setOtherDeductions] = useState('');
    const [status, setStatus] = useState('');


    const [formErrors, setFormErrors] = useState({});

    // Handle form submission
    const handleSave = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }

        if (!selectedEmployee) {
            errors.selectedEmployee = 'Employee name is required.';
        }

        if (!startDate) {
            errors.startDate = 'Start date is required.';
        }

        if (!endDate) {
            errors.endDate = 'End date is required.';
        }

        if (!ctc) {
            errors.ctc = 'CTC is required.';
        } else if (isNaN(ctc)) {
            errors.ctc = 'CTC must be a number.';
        }

        if (!grossPay) {
            errors.grossPay = 'Gross pay is required.';
        } else if (isNaN(grossPay)) {
            errors.grossPay = 'Gross pay must be a number.';
        }

        if (!netPay) {
            errors.netPay = 'Net pay is required.';
        } else if (isNaN(netPay)) {
            errors.netPay = 'Net pay must be a number.';
        }

        if (!basicDA) {
            errors.basicDA = 'Basic + DA is required.';
        } else if (isNaN(basicDA)) {
            errors.basicDA = 'Basic + DA must be a number.';
        }

        if (!hra) {
            errors.hra = 'HRA is required.';
        } else if (isNaN(hra)) {
            errors.hra = 'HRA must be a number.';
        }

        if (!convenienceAllowance) {
            errors.convenienceAllowance = 'Convenience allowance is required.';
        } else if (isNaN(convenienceAllowance)) {
            errors.convenienceAllowance = 'Convenience allowance must be a number.';
        }

        if (!transportAllowance) {
            errors.transportAllowance = 'Transport allowance is required.';
        } else if (isNaN(transportAllowance)) {
            errors.transportAllowance = 'Transport allowance must be a number.';
        }

        if (!medicalAllowance) {
            errors.medicalAllowance = 'Medical allowance is required.';
        } else if (isNaN(medicalAllowance)) {
            errors.medicalAllowance = 'Medical allowance must be a number.';
        }

        if (!otherAllowance) {
            errors.otherAllowance = 'Other allowance is required.';
        } else if (isNaN(otherAllowance)) {
            errors.otherAllowance = 'Other allowance must be a number.';
        }

        if (!variable) {
            errors.variable = 'Variable is required.';
        } else if (isNaN(variable)) {
            errors.variable = 'Variable must be a number.';
        }

        if (!pf) {
            errors.pf = 'PF is required.';
        } else if (isNaN(pf)) {
            errors.pf = 'PF must be a number.';
        }

        if (!epf) {
            errors.epf = 'EPF is required.';
        } else if (isNaN(epf)) {
            errors.epf = 'EPF must be a number.';
        }

        if (!esi) {
            errors.esi = 'ESI is required.';
        } else if (isNaN(esi)) {
            errors.esi = 'ESI must be a number.';
        }

        if (!salaryAdvance) {
            errors.salaryAdvance = 'Salary advance is required.';
        } else if (isNaN(salaryAdvance)) {
            errors.salaryAdvance = 'Salary advance must be a number.';
        }

        if (!otherDeductions) {
            errors.otherDeductions = 'Other deductions is required.';
        } else if (isNaN(otherDeductions)) {
            errors.otherDeductions = 'Other deductions must be a number.';
        }

        if (!status) {
            errors.status = 'Status is required.';
        }

        // If there are errors, set the formErrors state and return
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const formData = new FormData();
        formData.append('id', id);
        formData.append('dep_id', selectedDepartment);
        formData.append('e_id', selectedEmployee);
        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('annual_ctc', ctc);
        formData.append('gross_pay', grossPay);
        formData.append('net_pay', netPay);
        formData.append('basic_da', basicDA);
        formData.append('hra', hra);
        formData.append('conveyance_allowance', convenienceAllowance);
        formData.append('transport_allowance', transportAllowance);
        formData.append('medical_allowance', medicalAllowance);
        formData.append('other_allowance', otherAllowance);
        formData.append('variable', variable);
        formData.append('pf', pf);
        formData.append('epf', epf);
        formData.append('esi', esi);
        formData.append('advance', salaryAdvance);
        formData.append('other_deduction', otherDeductions);
        formData.append('status', status);
        formData.append('updated_by', userempid);


        axios.post('https://office3i.com/development/api/public/api/update_define_emp_salarylist', formData, {
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

                    handleVisitassignpayslip()
                    // setRefreshKey(prevKey => prevKey + 1);
                } else if (status === 'error') {
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
                    text: 'There was an error Creating Employee Salary. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };


    const handleCancel = () => {
        handleVisitassignpayslip()
    };

    // -------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    // edit project list

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/show_define_emp_salary/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);

                    setSelectedDepartment(res.data.data.dep_id);
                    setSelectedEmployee(res.data.data.e_id);
                    console.log("setSelectedEmployee", res.data.data.e_id)


                    setStartDate(res.data.data.start_month);
                    setEndDate(res.data.data.end_month);
                    setCtc(res.data.data.annual_ctc);
                    setGrossPay(res.data.data.gross_pay);
                    setNetPay(res.data.data.net_pay);
                    setBasicDA(res.data.data.basic_da);
                    setHra(res.data.data.hra);
                    setConvenienceAllowance(res.data.data.conveyance_allowance);
                    setTransportAllowance(res.data.data.transport_allowance);
                    setMedicalAllowance(res.data.data.medical_allowance);
                    setOtherAllowance(res.data.data.other_allowance);
                    setVariable(res.data.data.variable);
                    setPf(res.data.data.pf);
                    setEpf(res.data.data.epf);
                    setEsi(res.data.data.esi);
                    setSalaryAdvance(res.data.data.advance);
                    setOtherDeductions(res.data.data.other_deduction);
                    setStatus(res.data.data.status);


                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    console.log("data", data)

    // ------------------------------------------------------------------------------------------------


    // -------------------------------------------------------------------------------------------------------


    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
                // console.log("setDepartmentDropdown", data)
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, [usertoken]);

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.role_name,
        value: department.id
    }));

    const handleSelectDepartmentChange = (selectedOption) => {
        setSelectedDepartment(selectedOption ? selectedOption.value : null);
    };

    const formattedSelectedDepartment = selectedDepartment ? selectedDepartment : null;

    // ---------------------------------------------------------------------------------------------------------

    // --------------------------------------- Employee Dropdown ------------------------------------------------

    useEffect(() => {
        const fetchData = async () => {
            if (!formattedSelectedDepartment) return;
            const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                setEmployeesDropdown(data);
                // console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedDepartment, usertoken]);

    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));

    const handleSelectEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption ? selectedOption.value : null);
    };

    const formattedSelectedEmployee = formattedEmployeesDropdown.find(option => String(option.value) === String(selectedEmployee)) || null;


    // ------------------------------------------------------------------------------------------------


    return (

        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>

            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Employee Salary</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>

                <Form onSubmit={handleSave}>
                    <Row>
                        <Col>
                            <Form.Group controlId="formRole">
                                <Form.Label>Select Department</Form.Label>
                                <Select
                                    options={formattedDepartmentDropdown}
                                    value={formattedDepartmentDropdown.find(option => option.value === selectedDepartment)}
                                    onChange={handleSelectDepartmentChange}
                                    isClearable
                                    isDisabled
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formEmployee">
                                <Form.Label>Select Employee Name</Form.Label>
                                <Select
                                    options={formattedEmployeesDropdown}
                                    value={formattedSelectedEmployee}
                                    onChange={handleSelectEmployeeChange}
                                    isClearable
                                    isDisabled
                                />
                                {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="startDate">
                                <Form.Label>Start Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    max="9999-12-31"
                                    onChange={(e) => setStartDate(e.target.value)}

                                />
                                {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="endDate">
                                <Form.Label>End Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    max="9999-12-31"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="ctc">
                                <Form.Label>CTC</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={ctc}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setCtc(e.target.value)}
                                />
                                {formErrors.ctc && <span className="text-danger">{formErrors.ctc}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="grossPay">
                                <Form.Label>Gross Pay</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={grossPay}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setGrossPay(e.target.value)}
                                />
                                {formErrors.grossPay && <span className="text-danger">{formErrors.grossPay}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="netPay">
                                <Form.Label>Net Pay</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={netPay}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setNetPay(e.target.value)}
                                />
                                {formErrors.netPay && <span className="text-danger">{formErrors.netPay}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="basicDA">
                                <Form.Label>Basic + DA</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={basicDA}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setBasicDA(e.target.value)}
                                />
                                {formErrors.basicDA && <span className="text-danger">{formErrors.basicDA}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>

                        <Col>
                            <Form.Group controlId="hra">
                                <Form.Label>HRA</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={hra}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setHra(e.target.value)}
                                />
                                {formErrors.hra && <span className="text-danger">{formErrors.hra}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="convenienceAllowance">
                                <Form.Label>Convenience Allowance</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={convenienceAllowance}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setConvenienceAllowance(e.target.value)}
                                />
                                {formErrors.convenienceAllowance && <span className="text-danger">{formErrors.convenienceAllowance}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="transportAllowance">
                                <Form.Label>Transport Allowance</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={transportAllowance}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setTransportAllowance(e.target.value)}
                                />
                                {formErrors.transportAllowance && <span className="text-danger">{formErrors.transportAllowance}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="medicalAllowance">
                                <Form.Label>Medical Allowance</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={medicalAllowance}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setMedicalAllowance(e.target.value)}
                                />
                                {formErrors.medicalAllowance && <span className="text-danger">{formErrors.medicalAllowance}</span>}
                            </Form.Group>
                        </Col>
                    </Row>



                    <Row>
                        <Col>
                            <Form.Group controlId="otherAllowance">
                                <Form.Label>Other Allowance</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={otherAllowance}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setOtherAllowance(e.target.value)}
                                />
                                {formErrors.otherAllowance && <span className="text-danger">{formErrors.otherAllowance}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="variable">
                                <Form.Label>Variable</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={variable}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setVariable(e.target.value)}
                                />
                                {formErrors.variable && <span className="text-danger">{formErrors.variable}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="pf">
                                <Form.Label>PF</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={pf}
                                    onChange={(e) => setPf(e.target.value)}
                                />
                                {formErrors.pf && <span className="text-danger">{formErrors.pf}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="epf">
                                <Form.Label>EPF</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={epf}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setEpf(e.target.value)}
                                />
                                {formErrors.epf && <span className="text-danger">{formErrors.epf}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="esi">
                                <Form.Label>ESI</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={esi}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setEsi(e.target.value)}
                                />
                                {formErrors.esi && <span className="text-danger">{formErrors.esi}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="salaryAdvance">
                                <Form.Label>Salary Advance</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={salaryAdvance}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setSalaryAdvance(e.target.value)}
                                />
                                {formErrors.salaryAdvance && <span className="text-danger">{formErrors.salaryAdvance}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="otherDeductions">
                                <Form.Label>Other Deductions</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={otherDeductions}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => setOtherDeductions(e.target.value)}
                                />
                                {formErrors.otherDeductions && <span className="text-danger">{formErrors.otherDeductions}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    {/* Add status options dynamically */}
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                    {/* Add more options as needed */}
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>
                        </Col>
                    </Row>


                    <div className='mt-4'>
                        <Button variant="primary" type="submit" style={{ marginRight: '10PX' }}>
                            Submit
                        </Button>
                        <Button variant="secondary" type="button" onClick={handleCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>

            </div>
        </div>
    );
};

export default EditEmployeeSalary;
