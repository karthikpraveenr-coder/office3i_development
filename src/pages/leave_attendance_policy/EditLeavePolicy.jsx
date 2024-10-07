import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import { MultiSelect } from 'react-multi-select-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';



function LeavePolicy() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitaddshiftslot = () => {
        navigate(`/admin/leavepolicy`);
    };
    // loading state
    const [loading, setLoading] = useState(true);


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';



    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [leaveType, setLeaveType] = useState('');
    const [leaveTypes, setLeaveTypes] = useState([]);

    const [rolesDropdown, setRolesDropdown] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [totalLeaveCount, setTotalLeaveCount] = useState(0);
    const [monthlyLeaveCount, setMonthlyLeaveCount] = useState(0);
    const [formErrors, setFormErrors] = useState({});




    // ------------------------------------- Leave type dropdown ----------------------------------------------  

    useEffect(() => {
        // Fetch Leave Types from API
        axios.get('https://office3i.com/development/api/public/api/leave_type_list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                // Extract the Leave Types array from the response
                console.log('Leave Types data:', response.data);
                const leaveTypesData = response.data.data;
                setLeaveTypes(leaveTypesData);
            })
            .catch(error => {
                console.error('Error fetching Leave Types:', error);
            });
    }, []);


    // ---------------------------------------------------------------------------------------------------------

    // -------------------------------------- Role Dropdown ----------------------------------------------------

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                // const data = response.data.data || [];
                // setRolesDropdown(data);
                // console.log("setRolesDropdown", data)

                if (response.data && response.data.data) {
                    const data = response.data.data;
                    setRolesDropdown(data);
                } else {
                    console.error("No team data received");
                }

            } catch (error) {
                console.error('Error fetching role options:', error);
            }
        };

        fetchRoles();
    }, []);

    const formattedRolesDropdown = rolesDropdown.map(role => ({
        label: role.role_name,
        value: role.id
    }));

    const handleSelectRoleChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedRole(selectedIds);
    };

    const formattedSelectedRole = selectedRole ? selectedRole.join(',') : null;

    // ---------------------------------------------------------------------------------------------------------


    // --------------------------------------- Employee Dropdown ------------------------------------------------

    useEffect(() => {
        const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${formattedSelectedRole}`;
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl,

                    {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                const data = response.data.data;
                setEmployeesDropdown(data);
                console.log("setEmployeesDropdown", data)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedRole]);


    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));


    const handleSelectEmployeeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployee = selectedEmployee ? selectedEmployee.join(',') : null;


    // -------------------------------------- handleSubmit -------------------------------------------------------

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSave = (e) => {
        e.preventDefault();

        const errors = {};
        if (!selectedRole) {
            errors.selectedRole = 'Role is required.';
        }

        if (!selectedEmployee) {
            errors.selectedEmployee = 'Employee is required.';
        }
        if (!startDate) {
            errors.startDate = 'Start Date is required.';
        }

        if (!endDate) {
            errors.endDate = 'End Date is required.';
        }
        if (!leaveType) {
            errors.leaveType = 'Leave Type is required.';
        }
        if (!totalLeaveCount) {
            errors.totalLeaveCount = 'Total Leave Count is required.';
        }
        if (!monthlyLeaveCount) {
            errors.monthlyLeaveCount = 'Monthly Leave Count is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            // id: id,
            // category_name: leavepolicycategory,
            // category_status: status,
            // updated_by: userempid

            id: id,
            start_date: startDate,
            end_date: endDate,
            role_type: selectedRole.join(','),
            emp_id: selectedEmployee.join(','),
            leave_type: leaveType,
            leave_count: totalLeaveCount,
            monthly_count: monthlyLeaveCount,
            updated_by: userempid
        };


        axios.put(`https://office3i.com/development/api/public/api/update_leavepolicy`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.status === 200) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Leave Policy has been updated successfully!',
                    });
                    handleVisitaddshiftslot()
                    setRefreshKey(prevKey => prevKey + 1);
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the Leave Policy. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };



    const handleCancel = () => {
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setLeaveType(data.leave_type);

        const roleNameArray = data.role_type ? data.role_type.split(',').map(team => team.trim()) : [];
        const employeeArray = data.emp_id ? data.emp_id.split(',').map(member => member.trim()) : [];

        setSelectedRole(roleNameArray);
        setSelectedEmployee(employeeArray);

        setTotalLeaveCount(data.leave_count);
        setMonthlyLeaveCount(data.monthly_count);
        setFormErrors({});

    };

    // -----------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // edit 
    const [data, setData] = useState([]);


    useEffect(() => {
        console.log("This is is-->", id)
        axios.get(`https://office3i.com/development/api/public/api/editview_leavepolicy/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    console.log("setData", res.data.data)

                    setStartDate(res.data.data.start_date);
                    setEndDate(res.data.data.end_date);
                    setLeaveType(res.data.data.leave_type);




                    const roleNameArray = res.data.data.role_type ? res.data.data.role_type.split(',').map(team => team.trim()) : [];
                    const employeeArray = res.data.data.emp_id ? res.data.data.emp_id.split(',').map(member => member.trim()) : [];

                    setSelectedRole(roleNameArray);
                    console.log("setSelectedRole", roleNameArray)
                    setSelectedEmployee(employeeArray);
                    console.log("setSelectedEmployee", employeeArray)

                    setTotalLeaveCount(res.data.data.leave_count);
                    setMonthlyLeaveCount(res.data.data.monthly_count);

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

            {/* {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : ( */}

            <Container fluid className='shift__container'>
                <h3 className='mb-5'>Edit Leave Policy</h3>

                {/* ------------------------------------------------------------------------------------------------ */}
                {/* shift slot add form */}
                <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>

                    <Row>
                        <Col>
                            <Form.Group controlId="formStartDate">
                                <Form.Label style={{ fontWeight: 'bold' }}>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control type="date" value={startDate} max="9999-12-31" onChange={(e) => setStartDate(e.target.value)} />
                                {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formEndDate">
                                <Form.Label style={{ fontWeight: 'bold' }}>End Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control type="date" value={endDate} max="9999-12-31" onChange={(e) => setEndDate(e.target.value)} />
                                {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formLeaveType">
                                <Form.Label style={{ fontWeight: 'bold' }}>Leave Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control as="select" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                    <option value="">Select Leave Type</option>
                                    {leaveTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.leave_type_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.leaveType && <span className="text-danger">{formErrors.leaveType}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formRole">
                                <Form.Label style={{ fontWeight: 'bold' }}>Role <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>


                                <MultiSelect
                                    options={formattedRolesDropdown}
                                    value={formattedRolesDropdown.filter(option => selectedRole.includes(String(option.value)))}
                                    onChange={handleSelectRoleChange}
                                    labelledBy="Select"
                                    disabled
                                />

                                {formErrors.selectedRole && <span className="text-danger">{formErrors.selectedRole}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formEmployee">
                                <Form.Label style={{ fontWeight: 'bold' }}>Select Employee <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>


                                <MultiSelect
                                    options={formattedEmployeesDropdown}
                                    value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(String(option.value)))}

                                    onChange={handleSelectEmployeeChange}
                                    labelledBy="Select"
                                    disabled
                                />
                                {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTotalLeaveCount">
                                <Form.Label style={{ fontWeight: 'bold' }}>Total Leave Count <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control type="number" value={totalLeaveCount} onKeyDown={(e) => {
                                    // Prevent entering 'e', 'E', '+', '-', and '.'
                                    if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                        e.preventDefault();
                                    }
                                }} onChange={(e) => setTotalLeaveCount(e.target.value)} />
                                {formErrors.totalLeaveCount && <span className="text-danger">{formErrors.totalLeaveCount}</span>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formMonthlyLeaveCount">
                                <Form.Label style={{ fontWeight: 'bold' }}>Monthly Leave Count <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control type="number" value={monthlyLeaveCount}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }} onChange={(e) => setMonthlyLeaveCount(e.target.value)} />
                                {formErrors.monthlyLeaveCount && <span className="text-danger">{formErrors.monthlyLeaveCount}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <div className='submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSave}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>
                    </Row>
                </div>
                {/* ------------------------------------------------------------------------------------------------ */}




            </Container>

            {/* 
            )} */}
        </>



    )
}

export default LeavePolicy