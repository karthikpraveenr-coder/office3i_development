import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditEvent() {

    // ----------------------------------------------------------------------------------------------------------

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisiteventlist = () => {
        navigate(`/admin/eventlist`);
    };

    // ----------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------
    // EDIT EVENT STATE MANAGEMENT

    const [title, setTitle] = useState('');
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventAgenda, setEventAgenda] = useState('');
    const [eventImage, setEventImage] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    // const [imagePreview, setImagePreview] = useState(null);
    // -------------------------------------------------------------------------------------------------

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
    }, []);

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.role_name,
        value: department.id
    }));

    const handleSelectDepartmentChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
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
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------


    //-------------------------------------------------------------------------------
    // HANDLE IMAGE ONCHANGE

    const [newfile, setNewfile] = useState(null);
    const handleImageChange = (e) => {
        const newfile = e.target.files[0];
        if (newfile) {
            setNewfile(newfile);

            const reader = new FileReader();
            reader.onload = function (e) {
                document.querySelector("#img").setAttribute("src", e.target.result);
            };
            reader.readAsDataURL(newfile);
        }
    };

    useEffect(() => {
        if (eventImage) {
            document.querySelector("#img").setAttribute("src", `https://office3i.com/user/api/storage/app/${eventImage}`);
        }
    }, [eventImage]);

    //------------------------------------------------------------------------------------------------
    // HANDLE SAVE EDIT EVENT

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
        if (!eventDate) {
            errors.eventDate = 'Event Date is required.';
        }
        if (!startTime) {
            errors.startTime = 'Start Time is required.';
        }
        if (!eventAgenda) {
            errors.eventAgenda = 'Event Agenda is required.';
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

        const formData = new FormData();
        formData.append('id', id);
        formData.append('e_title', title);
        formData.append('e_teams', selectedDepartment);
        formData.append('e_members', selectedEmployee);
        formData.append('e_date', eventDate);
        formData.append('e_start_time', startTime);
        formData.append('e_end_time', endTime);
        formData.append('e_agenda', eventAgenda);
        // formData.append('e_attachment', eventImage);
        formData.append('updated_by', userData.userempid);

        if (newfile) {
            formData.append('e_image', newfile);

        } else if (eventImage) {
            formData.append('oldimg_path', eventImage);
        }

        // eventImage.forEach(image => formData.append('event_images[]', image));
        try {
            const response = await fetch('https://office3i.com/user/api/public/api/update_event', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {

                setTitle('');
                setSelectedDepartment([]);
                setSelectedEmployee([]);
                setEventDate('');
                setStartTime('');
                setEndTime('');
                setEventAgenda('');
                setEventImage([]);
                // setImagePreview([]);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Event Added Successfully..`,
                });
                // fetchTableData();
                handleVisiteventlist()
            } else {
                throw new Error(`Can't able to add event..`);
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
    // DATA FETCH FFROM API TO INITIAL DATA SET TO THE STATE

    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/view_editevent/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log("editview_employeeshift", res.data.data);

                    setTitle(res.data.data.e_title);
                    setEventDate(res.data.data.e_date);
                    setStartTime(res.data.data.e_start_time);
                    setEndTime(res.data.data.e_end_time);
                    setEventAgenda(res.data.data.e_agenda);
                    setEventImage(res.data.data.e_image);


                    const DepartmentNameArray = res.data.data.e_teams ? res.data.data.e_teams.split(',').map(team => team.trim()) : [];
                    const employeeArray = res.data.data.e_members ? res.data.data.e_members.split(',').map(member => member.trim()) : [];
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
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Event</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>

                <form onSubmit={handleSave}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="eventtitle" className="form-label">Event Title</label>
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
                                <label htmlFor="eventDate" className="form-label">Event Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="eventDate"
                                    value={eventDate}
                                    max="9999-12-31"
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                                {formErrors.eventDate && <span className="text-danger">{formErrors.eventDate}</span>}
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
                                <label htmlFor="startTime" className="form-label">Tentative Start Time</label>
                                <input
                                    type="time"
                                    className="form-control"
                                    id="startTime"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            {formErrors.startTime && <span className="text-danger">{formErrors.startTime}</span>}
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label htmlFor="endTime" className="form-label">Tentative End Time</label>
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

                    <div className="mb-3">
                        <label htmlFor="eventAgenda" className="form-label">Enter Event Agenda</label>
                        <textarea
                            className="form-control"
                            id="eventAgenda"
                            rows="3"
                            value={eventAgenda}
                            onChange={(e) => setEventAgenda(e.target.value)}
                        ></textarea>
                        {formErrors.eventAgenda && <span className="text-danger">{formErrors.eventAgenda}</span>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Event Images</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="form-control"
                        />
                        <img src="" alt="" id="img" style={{ height: '150px' }} />
                    </div>

                    <button type="submit" className="btn btn-primary">Save</button>
                </form>

            </div>
        </div>
    )
}
