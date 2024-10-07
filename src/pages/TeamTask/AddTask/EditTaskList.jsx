import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';


const EditTaskList = () => {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add shiftslot page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisittasklist = () => {
        navigate(`/admin/tasklist`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------


    const [taskID, setTaskID] = useState('');
    const [taskName, setTaskName] = useState('');
    // const [projectName, setProjectName] = useState('');
    const [projectWorkType, setProjectWorkType] = useState('');
    // const [department, setDepartment] = useState('');
    // const [assignedTo, setAssignedTo] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');


    const [selectedProjectName, setSelectedProjectName] = useState('');
    const [projectNames, setProjectNames] = useState([]);

    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');


    const [attachment, setAttachment] = useState(null);
    const [newfile, setNewfile] = useState(null);
    const [formErrors, setFormErrors] = useState({});


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
        if (attachment) {
            document.querySelector("#img").setAttribute("src", `https://office3i.com/development/api/storage/app/${attachment}`);
        }
    }, [attachment]);

    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT



    const handleSave = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!taskID) {
            errors.taskID = 'Task ID is required.';
        }
        if (!taskName) {
            errors.taskName = 'Task Name is required.';
        }
        if (selectedEmployee.length == 0) {
            console.log('in test')
            errors.selectedEmployee = 'Assigned To is required.';
        }
        if (selectedProjectName.length == 0) {
            console.log('in test')
            errors.selectedProjectName = 'Project Name is required.';
        }
        if (!projectWorkType) {
            errors.projectWorkType = 'Project Work Type is required.';
        }
        if (!startDate) {
            errors.startDate = 'Start Date is required.';
        }
        if (!endDate) {
            errors.endDate = 'End Date is required.';
        }
        if (!status) {
            errors.status = 'Task Status is required.';
        }
        if (!priority) {
            errors.priority = 'Priority is required.';
        }
        if (!description) {
            errors.description = 'Description is required.';
        }

        if (selectedDepartment.length == 0) {
            errors.selectedDepartment = 'Department Name  is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('id', id);
        formData.append('t_id', taskID);
        formData.append('t_name', taskName);
        formData.append('p_name', selectedProjectName);
        formData.append('p_work_type', projectWorkType);

        formData.append('department', selectedDepartment);
        formData.append('assign_to', selectedEmployee);

        formData.append('start_date', startDate);
        formData.append('end_date', endDate);
        formData.append('status', status);
        formData.append('priority', priority);
        formData.append('description', description);

        formData.append('p_reason', '-');

        formData.append('updated_by', userempid);

        if (newfile) {
            formData.append('attachment', newfile);

        } else if (attachment) {
            formData.append('oldimg_path', attachment);
        }




        axios.post('https://office3i.com/development/api/public/api/update_task_list', formData, {
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
                    handleVisittasklist()

                } else {
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
                    text: 'There was an error creating the shift slot. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };
    // ------------------------------------------------------------------------------------------------

    const handleCancel = () => {
        handleVisittasklist()
    };

    // ------------------------------------------------------------------------------------------------
    // edit project list

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/edit_tasklist/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);

                    // Project state
                    setTaskID(res.data.data.t_id)
                    setTaskName(res.data.data.t_name)
                    setSelectedProjectName(res.data.data.p_name)
                    setProjectWorkType(res.data.data.p_work_type)


                    const DepartmentNameArray = res.data.data.department ? res.data.data.department.split(',').map(team => team.trim()) : [];
                    const employeeArray = res.data.data.assign_to ? res.data.data.assign_to.split(',').map(member => member.trim()) : [];


                    setSelectedDepartment(DepartmentNameArray);
                    setSelectedEmployee(employeeArray);


                    setStartDate(res.data.data.start_date);
                    setEndDate(res.data.data.end_date);
                    setStatus(res.data.data.p_status);
                    setPriority(res.data.data.priority);
                    setDescription(res.data.data.description);
                    setAttachment(res.data.data.attachment);



                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    console.log("data", data)

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // TASK ID FETCH FROM API



    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/task_id', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    setTaskID(response.data.data);
                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                console.log(err.message);

            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------


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
        const selectedIds = selectedOptions.map(option => option.value);
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
        const selectedIds = selectedOptions.map(option => String(option.value));
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------


    // -------------------------------- Project Names -------------------------------------------------

    useEffect(() => {
        const fetchProjectNames = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/project_name_list', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                if (response.data.status === 'success') {
                    setProjectNames(response.data.data);
                } else {
                    console.error('Failed to fetch project names');
                }
            } catch (error) {
                console.error('Error fetching project names:', error);
            }
        };

        fetchProjectNames();
    }, []);
    // ------------------------------------------------------------------------------------------------

    return (
        <div className='Addproject__container mt-5' style={{ padding: '0px 70px 30px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Task</h3>
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>
                <Form onSubmit={handleSave}>
                    <Row>
                        <Col>
                            <Form.Group controlId="taskID">
                                <Form.Label>Task ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={taskID}
                                    onChange={(e) => setTaskID(e.target.value)}
                                    disabled
                                />
                                {formErrors.taskID && <span className="text-danger">{formErrors.taskID}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label>Task Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                />
                                {formErrors.taskName && <span className="text-danger">{formErrors.taskName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="selectedProjectName">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedProjectName}
                                    onChange={(e) => setSelectedProjectName(e.target.value)}
                                >
                                    <option value="">Select Project Name</option>
                                    {projectNames.map((project) => (
                                        <option key={project.id} value={project.id}>
                                            {project.project_name}
                                        </option>
                                    ))}
                                </Form.Control>
                                {formErrors.selectedProjectName && <span className="text-danger">{formErrors.selectedProjectName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="projectWorkType">
                                <Form.Label>Project Work Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={projectWorkType}
                                    onChange={(e) => setProjectWorkType(e.target.value)}
                                >
                                    <option value="">Select Project Work Type</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Project">Project</option>
                                    {/* Add more options as needed */}
                                </Form.Control>
                                {formErrors.projectWorkType && <span className="text-danger">{formErrors.projectWorkType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formRole">
                                <Form.Label style={{ fontWeight: 'bold' }}>Department Name</Form.Label>
                                <MultiSelect
                                    options={formattedDepartmentDropdown}
                                    value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(option.value))}
                                    onChange={handleSelectDepartmentChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formEmployee">
                                <Form.Label style={{ fontWeight: 'bold' }}>Assigned To</Form.Label>
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
                                    value={endDate}
                                    max="9999-12-31"
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                {formErrors.endDate && <span className="text-danger">{formErrors.endDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Task Status</Form.Label>
                                <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="">Select Status</option>
                                    <option value="Not Yet Start">Not Yet Start</option>
                                    <option value="In-Progress">In-Progress</option>
                                    <option value="Hold">Hold</option>
                                    <option value="Completed">Completed</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="priority">
                                <Form.Label>Priority</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                >
                                    <option value="">Select Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Form.Control>
                                {formErrors.priority && <span className="text-danger">{formErrors.priority}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="attachment">
                                <Form.Label>Attachment</Form.Label>


                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="form-control" />
                                <img src="" alt="" id="img" style={{ height: '150px' }} />
                            </Form.Group>
                        </Col>

                    </Row>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleCancel} className="ml-2">
                        Cancel
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default EditTaskList;
