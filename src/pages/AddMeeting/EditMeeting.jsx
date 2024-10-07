import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditMeeting() {

    // ----------------------------------------------------------------------------------------------------------

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitmeetinglist = () => {
        navigate(`/admin/meetinglist`);
    };

    // ----------------------------------------------------------------------------------------------------------


    // ----------------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------------
    // ADD EVENT STATE MANAGEMENT

    const [title, setTitle] = useState('');
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [meetingAgenda, setMeetingAgenda] = useState('');
    const [meetingRemarks, setMeetingRemarks] = useState('');
    const [formErrors, setFormErrors] = useState({});


    // -----------------------------------------------------------------------------------------------------------

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
        const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
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
                // console.log("setEmployeesDropdown", data)
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
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------



    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT

    const handleSave = async (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!title) {
            errors.title = 'Title is required.';
        }
        if (selectedEmployee.length == 0) {
            console.log('in test')
            errors.selectedEmployee = 'Employee Name is required.';
        }
        if (!meetingDate) {
            errors.meetingDate = 'Meeting Date is required.';
        }
        if (!startTime) {
            errors.startTime = 'Start Time is required.';
        }
        if (!meetingAgenda) {
            errors.meetingAgenda = 'Meeting Agenda is required.';
        }
        if (!meetingRemarks) {
            errors.meetingRemarks = 'Meeting Agenda is required.';
        }
        if (!endTime) {
            errors.endTime = 'End Time is required.';
        }
        if (selectedDepartment.length == 0) {
            errors.selectedDepartment = 'Department Name is required.';
        }



        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const meetingData = {
            id: id,
            m_title: title,
            m_teams: selectedDepartment.join(','), // Convert array to comma-separated string
            m_members: selectedEmployee.join(','), // Convert array to comma-separated string
            m_date: meetingDate,
            m_start_time: startTime,
            m_end_time: endTime,
            m_agenda: meetingAgenda,
            m_remarks: meetingRemarks,
            updated_by: '1'
        };

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/update_meeting', {
                method: 'PUT',
                body: JSON.stringify(meetingData),
                headers: {
                    'Authorization': `Bearer ${usertoken}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                setTitle('');
                setSelectedDepartment([]);
                setSelectedEmployee([]);
                setMeetingDate('');
                setStartTime('');
                setEndTime('');
                setMeetingAgenda('');
                setMeetingRemarks('');

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Meeting Successfully Added',
                });
                handleVisitmeetinglist();
            } else {
                throw new Error(`Can't able to add event.`);
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------
    // DATA FETCH FFROM API TO INITIAL DATA SET TO THE STATE

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/view_editmeeting/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log("editview_employeeshift", res.data.data);

                    setTitle(res.data.data.m_title);
                    setMeetingDate(res.data.data.m_date);
                    setStartTime(res.data.data.m_start_time);
                    setEndTime(res.data.data.m_end_time);
                    setMeetingAgenda(res.data.data.m_agenda);
                    setMeetingRemarks(res.data.data.m_remarks);


                    const DepartmentNameArray = res.data.data.m_teams ? res.data.data.m_teams.split(',').map(team => team.trim()) : [];
                    const employeeArray = res.data.data.m_members ? res.data.data.m_members.split(',').map(member => member.trim()) : [];
                    setSelectedDepartment(DepartmentNameArray);
                    setSelectedEmployee(employeeArray);

                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // ------------------------------------------------------------------------------------------------

    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Meeting</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>

                <form onSubmit={handleSave}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="eventtitle" className="form-label">Meeting Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="eventtitle"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                {formErrors.title && <span className="text-danger">{formErrors.title}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="selectedDepartment" className="form-label">Select Teams</label>
                                <MultiSelect
                                    options={formattedDepartmentDropdown}
                                    value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(option.value))}
                                    onChange={handleSelectDepartmentChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="meetingDate" className="form-label">Meeting Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="meetingDate"
                                    max="9999-12-31"
                                    value={meetingDate}
                                    onChange={(e) => setMeetingDate(e.target.value)}
                                />
                                {formErrors.meetingDate && <span className="text-danger">{formErrors.meetingDate}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="selectedEmployee" className="form-label">Select Members</label>
                                <MultiSelect
                                    options={formattedEmployeesDropdown}
                                    value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(String(option.value)))}
                                    onChange={handleSelectEmployeeChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="startTime" className="form-label">Start Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="startTime"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                                {formErrors.startTime && <span className="text-danger">{formErrors.startTime}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="endTime" className="form-label">End Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="endTime"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                                {formErrors.endTime && <span className="text-danger">{formErrors.endTime}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="meetingAgenda" className="form-label">Enter Event Agenda</label>
                                <textarea
                                    className="form-control"
                                    id="meetingAgenda"
                                    rows="3"
                                    value={meetingAgenda}
                                    onChange={(e) => setMeetingAgenda(e.target.value)}
                                ></textarea>
                                {formErrors.meetingAgenda && <span className="text-danger">{formErrors.meetingAgenda}</span>}
                            </div>

                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="meetingRemarks" className="form-label">Remarks</label>
                                <textarea
                                    className="form-control"
                                    id="meetingRemarks"
                                    rows="3"
                                    value={meetingRemarks}
                                    onChange={(e) => setMeetingRemarks(e.target.value)}
                                ></textarea>
                                {formErrors.meetingRemarks && <span className="text-danger">{formErrors.meetingRemarks}</span>}
                            </div>

                        </Col>


                    </Row>





                    <button type="submit" className="btn btn-primary">Save</button>
                </form>

            </div>
        </div>
    )
}
