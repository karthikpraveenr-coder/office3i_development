import { faCheck, faPencil } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import Select from 'react-select';
import './generatepayslipstyle.css'
import Swal from 'sweetalert2';

const GeneratePayslip = () => {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------

    const [isEditable, setIsEditable] = useState(false);
    const [triggerApiCall, setTriggerApiCall] = useState(false);

    const handleEditClick = () => {
        setIsEditable(true);
    };

    const handleTickClick = () => {
        setIsEditable(false);
        setTriggerApiCall(prev => !prev);
    };

    // ------------------------------------------------------------------------------------------------


    // State variables to store form data
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    console.log("selectedDepartment", selectedDepartment)

    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [month, setMonth] = useState('');
    const [lateCount, setLateCount] = useState(0);
    const [permissionCount, setPermissionCount] = useState(0);
    const [halfDayCount, setHalfDayCount] = useState(0);
    const [leaveCount, setLeaveCount] = useState(0);
    const [absentCount, setAbsentCount] = useState(0);
    const [totalWorkingDays, setTotalWorkingDays] = useState(0);
    const [workedDays, setWorkedDays] = useState(0);
    const [overTimeHours, setOverTimeHours] = useState(0);
    const [grossSalary, setGrossSalary] = useState(0);
    const [perDaySalary, setPerDaySalary] = useState(0);
    const [variable, setVariable] = useState(0);
    const [otherDeductions, setOtherDeductions] = useState(0);
    const [lossOfPay, setLossOfPay] = useState(0);
    const [netPay, setNetPay] = useState(0);



    const [presentcount, setPresentcount] = useState(0);
    const [lopamount, setLopamount] = useState(0);
    const [ottotalamount, setOttotalamount] = useState(0);
    const [overalldeduction, setOveralldeduction] = useState(0);
    const [empsalaryoverall, setEmpsalaryoverall] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    // --------------------------------------------------------------------------------------------------------

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
        }

        if (!selectedEmployee) {
            errors.selectedEmployee = 'Employee name is required.';
        }
        if (!month) {
            errors.month = 'Month is required.';
        }

        // If there are errors, set the formErrors state and return
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('e_id', selectedEmployee);
        formData.append('dep_id', selectedDepartment);
        formData.append('payslipmonthyear', month);
        formData.append('late_count', lateCount);
        formData.append('permission_count', permissionCount);
        formData.append('halfday_count', halfDayCount);
        formData.append('leave_count', leaveCount);
        formData.append('absent_count', absentCount);


        formData.append('present_count', presentcount);

        formData.append('totalmonthlyworkingdays', totalWorkingDays);
        formData.append('totalworkeddays', workedDays);

        formData.append('totallopdays', lossOfPay);
        formData.append('lopamount', lopamount);
        formData.append('ot_totalamount', ottotalamount);

        formData.append('empsalaryperday', perDaySalary);
        formData.append('overalldeduction', overalldeduction);
        formData.append('empsalaryoverall', empsalaryoverall);
        formData.append('totalnetpayamount', netPay);

        formData.append('created_by', userempid);


        axios.post('https://office3i.com/user/api/public/api/add_generate_payslip', formData, {
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
                    text: 'There was an error Generating payslip. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };


    const handleCancel = () => {
        setSelectedDepartment(null);
        setSelectedEmployee(null);
        setMonth('');
        setLateCount('');
        setPermissionCount('');
        setHalfDayCount('');
        setLeaveCount('');
        setAbsentCount('');
        setTotalWorkingDays('');
        setWorkedDays('');
        setOverTimeHours('');
        setGrossSalary('');
        setPerDaySalary('');
        setVariable('');
        setOtherDeductions('');
        setLossOfPay('');
        setNetPay('');
        setPresentcount('');
        setLopamount('');
        setOttotalamount('');
        setOveralldeduction('');
        setEmpsalaryoverall('');
        setFormErrors({});
    };
    // --------------------------------------------------------------------------------------------------------


    // --------------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (month && selectedEmployee) {
            const yearMonth = month; // assuming month is already in the correct format 'YYYY-MM'
            axios.post('https://office3i.com/user/api/public/api/get_emp_yearmonth_details', {
                emp_id: selectedEmployee,
                yearmonth: yearMonth,
            }, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    if (response.data.status === 'success') {
                        const data = response.data.data;
                        setLateCount(data.latecount);
                        setPermissionCount(data.permissioncount);
                        setHalfDayCount(data.halfdaycount);
                        setLeaveCount(data.leavecount);
                        setAbsentCount(data.absentcount);
                        setTotalWorkingDays(data.totalmonthlyworkingdays);
                        setWorkedDays(data.totalworkeddays);
                        setOverTimeHours(data.ot_totalamount);
                        setGrossSalary(data.empgrosssalary);
                        setPerDaySalary(data.empsalaryperday);
                        setVariable(data.variable);
                        setOtherDeductions(data.otherdeduction);
                        setLossOfPay(data.totallopdays);
                        setNetPay(data.totalnetpayamount);

                        setPresentcount(data.presentcount);
                        setLopamount(data.lopamount);
                        setOttotalamount(data.ot_totalamount);
                        setOveralldeduction(data.overalldeduction);
                        setEmpsalaryoverall(data.empsalaryoverall);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });
        }
    }, [month, selectedEmployee, usertoken]);


    // --------------------------------------------------------------------------------------------------------
    // LOSS OF PAY ONCHANGE

    useEffect(() => {
        if (month && selectedEmployee && lossOfPay) {
            const yearMonth = month;
            axios.post('https://office3i.com/user/api/public/api/ot_emp_salary_details', {
                emp_id: selectedEmployee,
                yearmonth: yearMonth,
                lop: lossOfPay,
            }, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    if (response.data.status === 'success') {
                        const data = response.data.data;
                        setLateCount(data.latecount);
                        setPermissionCount(data.permissioncount);
                        setHalfDayCount(data.halfdaycount);
                        setLeaveCount(data.leavecount);
                        setAbsentCount(data.absentcount);
                        setTotalWorkingDays(data.totalmonthlyworkingdays);
                        setWorkedDays(data.totalworkeddays);
                        setOverTimeHours(data.ot_totalamount);
                        setGrossSalary(data.empgrosssalary);
                        setPerDaySalary(data.empsalaryperday);
                        setVariable(data.variable);
                        setOtherDeductions(data.otherdeduction);
                        setLossOfPay(data.totallopdays);
                        setNetPay(data.totalnetpayamount);

                        setPresentcount(data.presentcount);
                        setLopamount(data.lopamount);
                        setOttotalamount(data.ot_totalamount);
                        setOveralldeduction(data.overalldeduction);
                        setEmpsalaryoverall(data.empsalaryoverall);
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });
        }
    }, [triggerApiCall]);

    // --------------------------------------------------------------------------------------------------------



    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://office3i.com/user/api/public/api/userrolelist', {
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
            const apiUrl = `https://office3i.com/user/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
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

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee : null;

    // ------------------------------------------------------------------------------------------------



    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>

            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Generate Payslip</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group controlId="formRole">
                                <Form.Label>Select Department</Form.Label>
                                <Select
                                    options={formattedDepartmentDropdown}
                                    value={formattedDepartmentDropdown.find(option => option.value === selectedDepartment) || null}
                                    onChange={handleSelectDepartmentChange}
                                    isClearable
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formEmployee">
                                <Form.Label>Select Employee Name</Form.Label>
                                <Select
                                    options={formattedEmployeesDropdown}
                                    value={formattedEmployeesDropdown.find(option => option.value === selectedEmployee) || null}
                                    onChange={handleSelectEmployeeChange}
                                    isClearable
                                />
                            </Form.Group>
                            {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                        </Col>

                        <Col>
                            <Form.Group controlId="month">
                                <Form.Label>Select Month</Form.Label>
                                <Form.Control
                                    type="month"
                                    value={month}
                                    max="9999-12-31"
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                            </Form.Group>
                            {formErrors.month && <span className="text-danger">{formErrors.month}</span>}
                        </Col>

                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="lateCount">
                                <Form.Label>No. of Late</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={lateCount}
                                    onChange={(e) => setLateCount(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="permissionCount">
                                <Form.Label>No. of Permission</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={permissionCount}
                                    onChange={(e) => setPermissionCount(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="halfDayCount">
                                <Form.Label>No. of Half Day</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={halfDayCount}
                                    onChange={(e) => setHalfDayCount(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="leaveCount">
                                <Form.Label>No. of Leave</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={leaveCount}
                                    onChange={(e) => setLeaveCount(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="absentCount">
                                <Form.Label>No. of Absent</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={absentCount}
                                    onChange={(e) => setAbsentCount(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="totalWorkingDays">
                                <Form.Label>Total Working Days In Month</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={totalWorkingDays}
                                    onChange={(e) => setTotalWorkingDays(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>


                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="workedDays">
                                <Form.Label>No. of Worked Days</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={workedDays}
                                    onChange={(e) => setWorkedDays(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="overTimeHours">
                                <Form.Label>Over Time</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={overTimeHours}
                                    onChange={(e) => setOverTimeHours(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="grossSalary">
                                <Form.Label>Gross Salary</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={grossSalary}
                                    onChange={(e) => setGrossSalary(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>




                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="perDaySalary">
                                <Form.Label>Per Day Salary</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={perDaySalary}
                                    onChange={(e) => setPerDaySalary(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="variable">
                                <Form.Label>Variable</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={variable}
                                    onChange={(e) => setVariable(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="otherDeductions">
                                <Form.Label>Other Deductions</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={otherDeductions}
                                    onChange={(e) => setOtherDeductions(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>


                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="lossOfPay" className='lossOfPay'>
                                <Form.Label>Loss Of Pay</Form.Label>
                                <div className="position-relative">
                                    <Form.Control
                                        type="number"
                                        value={lossOfPay}
                                        onChange={(e) => setLossOfPay(e.target.value)}
                                        disabled={!isEditable}
                                        className="pr-5" // Add padding to the right to make space for the icon
                                    />
                                    {isEditable ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            onClick={handleTickClick}
                                            className="position-absolute"
                                            style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-50%)', color: '#0A62F1' }}
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faPencil}
                                            onClick={handleEditClick}
                                            className="position-absolute"
                                            style={{ cursor: 'pointer', top: '50%', right: '10px', transform: 'translateY(-50%)' }}
                                        />
                                    )}
                                </div>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="netPay">
                                <Form.Label>Net Pay</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={netPay}
                                    onChange={(e) => setNetPay(e.target.value)}
                                    disabled
                                />
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

export default GeneratePayslip;
