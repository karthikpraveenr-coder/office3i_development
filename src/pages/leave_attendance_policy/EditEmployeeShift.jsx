import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';
import Multiselect from 'multiselect-react-dropdown';
import { MultiSelect } from 'react-multi-select-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';

function EditEmployeeShift() {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitaddshiftslot = () => {
        navigate(`/admin/assignemployeeshift`);
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

    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');


    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [shiftSlot, setShiftSlot] = useState('');
    const [shiftSlots, setShiftSlots] = useState([]);
    const [selectedWeekOff, setSelectedWeekOff] = useState([]);
    const [status, setStatus] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});


    // -------------------------------------- Weekoff Dropdown ----------------------------------------------------

    const formattedWeekOffOptions = [
        { value: '1', label: 'Sunday' },
        { value: '2', label: 'Monday' },
        { value: '3', label: 'Tuesday' },
        { value: '4', label: 'Wednesday' },
        { value: '5', label: 'Thursday' },
        { value: '6', label: 'Friday' },
        { value: '7', label: 'Saturday' },
    ];

    const formattedWeekOffDropdown = formattedWeekOffOptions.map(option => ({
        label: option.label,
        value: option.value
    }));


    const handleSelectWeekOffChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => String(option.value));
        setSelectedWeekOff(selectedValues);
    };

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
                console.log("setDepartmentDropdown", data)
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, []);

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.role_name,
        value: department.id
    }));

    const handleSelectDepartmentChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedDepartment(selectedIds);
    };

    const formattedSelectedDepartment = selectedDepartment ? selectedDepartment.join(',') : null;


    // ---------------------------------------------------------------------------------------------------------


    // --------------------------------------- Employee Dropdown ------------------------------------------------

    useEffect(() => {
        const apiUrl = `https://office3i.com/user/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
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
    }, [formattedSelectedDepartment]);


    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));

    const handleSelectEmployeeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------


    // -------------------------------------- shift slot list -----------------------------------------

    useEffect(() => {
        const fetchShiftSlots = async () => {
            try {
                const response = await axios.get('https://office3i.com/user/api/public/api/shiftslotlist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setShiftSlots(data);
                // console.log('setShiftSlots', data)
            } catch (error) {
                console.error('Error fetching shift slots:', error);
            }
        };

        fetchShiftSlots();
    }, []);

    // ------------------------------------------------------------------------------------------------





    const handleSave = (e) => {
        e.preventDefault();

        const errors = {};

        if (!selectedDepartment) {
            errors.selectedDepartment = 'Department is required.';
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
        if (!shiftSlot) {
            errors.shiftSlot = 'Shift-Slot is required.';
        }

        if (!selectedWeekOff.length) {
            errors.selectedWeekOff = 'WeekOff is required.';
        }
        if (!status) {
            errors.status = 'Status is required.';
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
            department_id: selectedDepartment.join(','),
            emp_id: selectedEmployee.join(','),
            start_date: startDate,
            end_date: endDate,
            shift_slotid: shiftSlot,
            week_off: selectedWeekOff.join(','),
            shift_status: status,
            updated_by: userempid
        };


        axios.put(`https://office3i.com/user/api/public/api/update_employeeshift`, requestData, {
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
                        text: 'Employee Shift has been updated successfully!',
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
                    text: 'There was an error updating the Employee Shift. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {

        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setStatus(data.status);

        const DepartmentNameArray = data.department_id ? data.department_id.split(',').map(team => team.trim()) : [];
        const employeeArray = data.emp_id ? data.emp_id.split(',').map(member => member.trim()) : [];
        const weekoffArray = data.week_off ? data.week_off.split(',').map(week => week.trim()) : [];

        setSelectedDepartment(DepartmentNameArray);
        setSelectedEmployee(employeeArray);
        setSelectedWeekOff(weekoffArray);
        setShiftSlot(data.shift_slot);

        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------
    // edit leave policy

    const [data, setData] = useState([]);



    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/editview_employeeshift/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log("editview_employeeshift", res.data.data);
                    setData(res.data.data);
                    setStartDate(res.data.data.start_date);
                    setEndDate(res.data.data.end_date);
                    setStatus(res.data.data.status);


                    const DepartmentNameArray = res.data.data.department_id ? res.data.data.department_id.split(',').map(team => team.trim()) : [];
                    const employeeArray = res.data.data.emp_id ? res.data.data.emp_id.split(',').map(member => member.trim()) : [];
                    const weekoffArray = res.data.data.week_off ? res.data.data.week_off.split(',').map(week => week.trim()) : [];

                    setSelectedDepartment(DepartmentNameArray);
                    console.log("DepartmentNameArray~~~~~~~~~~~~~~~~~~~~", DepartmentNameArray)

                    setSelectedEmployee(employeeArray);
                    console.log("employeeArray~~~~~~~~~~~~~~~~~~~~", employeeArray)
                    setSelectedWeekOff(weekoffArray);
                    console.log("weekoffArray~~~~~~~~~~~~~~~~~~~~", weekoffArray)



                    setShiftSlot(res.data.data.shift_slot);
                    console.log("setShiftSlot------------------------>", res.data.data.shift_slot)


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
                <h3 className='mb-5'>Edit Employee Shift</h3>

                {/* shift slot add form */}

                {/* shift slot add form */}
                <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                    <Form>
                        <Row>
                            <Col>
                                <Form.Group controlId="formDepartment">
                                    <Form.Label>Department Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>

                                    <MultiSelect
                                        options={formattedDepartmentDropdown}
                                        value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(String(option.value)))}
                                        onChange={handleSelectDepartmentChange}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEmployee">
                                    <Form.Label>Employee Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedEmployeesDropdown}
                                        value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(String(option.value)))}
                                        onChange={handleSelectEmployeeChange}
                                        labelledBy="Select"
                                    />
                                    {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formStartDate">
                                    <Form.Label>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" value={startDate} max="9999-12-31" onChange={(e) => setStartDate(e.target.value)} />
                                    {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEndDate">
                                    <Form.Label>End Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control type="date" value={endDate} max="9999-12-31" onChange={(e) => setEndDate(e.target.value)} />
                                    {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                                </Form.Group>
                            </Col>
                        </Row>


                        <Row>
                            <Col>
                                <Form.Group controlId="formShiftSlots">
                                    <Form.Label>Shift Slot <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control as="select" value={shiftSlot} onChange={(e) => setShiftSlot(e.target.value)}>
                                        <option value="">Select Shift Slot</option>
                                        {shiftSlots.map(slot => (
                                            <option key={slot.id} value={slot.id}>{slot.shift_slot}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.shiftSlot && <span className="text-danger">{formErrors.shiftSlot}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formWeekOff">
                                    <Form.Label>Week Off <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <MultiSelect
                                        options={formattedWeekOffDropdown}
                                        value={formattedWeekOffDropdown.filter(option => selectedWeekOff.includes(String(option.value)))}
                                        onChange={handleSelectWeekOffChange}
                                        labelledBy="Select"
                                        disableSearch
                                    />

                                    {formErrors.selectedWeekOff && <span className="text-danger">{formErrors.selectedWeekOff}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label>Status <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                    {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
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
                    </Form>
                </div>

            </Container>
            {/* )} */}
        </>
    )
}

export default EditEmployeeShift