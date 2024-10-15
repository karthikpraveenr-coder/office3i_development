import React, { useEffect, useState } from 'react';
import { Accordion, Row, Col, Form, Button } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa'; // Import icons
import './ManageProjects.css'; // Import your custom CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import plus from '../images/plus.svg'
import minus from '../images/minus.svg'
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';

function ManageProjects() {
    // ---------------------------------------------------------------------------------------------------------------
    // Accordion handling

    const [activeKey, setActiveKey] = useState(null);

    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key); // Toggle active key
    };
    // ---------------------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------------
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    // ---------------------------------------------------------------------------------------------------------------


    // Individual states for project details
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [projectCategory, setProjectCategory] = useState('');

    // const [department, setDepartment] = useState('');
    // const [teams, setTeams] = useState('');
    // const [members, setMembers] = useState('');

    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [duration, setDuration] = useState({ years: 0, months: 0, days: 0 });
    const [projectStatus, setProjectStatus] = useState('');
    const [projectPriority, setProjectPriority] = useState('');
    const [notes, setNotes] = useState('');
    const [attachment, setAttachment] = useState(null);

    // Individual states for client details
    const [clientName, setClientName] = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');

    // States for task details (Project 2)
    const [taskName, setTaskName] = useState('');
    const [taskprojectName, setTaskProjectName] = useState('');
    const [taskDepartment, setTaskDepartment] = useState('');
    const [taskTeam, setTaskTeam] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [taskstartDate, setTaskStartDate] = useState('');
    const [taskfinishDate, setTaskFinishDate] = useState('');
    const [taskStatus, setTaskStatus] = useState('');
    const [taskPriority, setTaskPriority] = useState('');
    const [taskNotes, setTaskNotes] = useState('');
    const [taskAttachment, setTaskAttachment] = useState(null);


    // ---------------------------------------------------------------------------------------------------------------

    const handleFileChange = (e) => {
        setAttachment(e.target.files[0]);
    };

    // ---------------------------------------------------------------------------------------------------------------
    // start date and finish date and days counting

    const calculateDuration = (start, finish) => {
        const startDate = new Date(start);
        const finishDate = new Date(finish);

        // Calculate the difference in years, months, and days
        let years = finishDate.getFullYear() - startDate.getFullYear();
        let months = finishDate.getMonth() - startDate.getMonth();
        let days = finishDate.getDate() - startDate.getDate();

        // Adjust if the days or months are negative
        if (days < 0) {
            months -= 1;
            const previousMonth = new Date(finishDate.getFullYear(), finishDate.getMonth(), 0);
            days += previousMonth.getDate();
        }

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        return { years, months, days };
    };

    const handleFinishDateChange = (e) => {
        const finishDateValue = e.target.value;
        setFinishDate(finishDateValue);

        if (startDate && finishDateValue) {
            const durationResult = calculateDuration(startDate, finishDateValue);
            setDuration(durationResult);
        }
    };

    //     const formattedDuration = `
    //   ${duration.years !== 0 ? `${duration.years} years` : ''}
    //   ${duration.months !== 0 ? `${duration.months} months` : ''}
    //   ${duration.days !== 0 ? `${duration.days} days` : ''}
    // `.replace(/\s+/g, ' ').trim();


    const formatDuration = () => {
        const { years, months, days } = duration;
        const parts = [];
        if (years > 0) parts.push(`${years} year${years > 1 ? 's' : ''}`);
        if (months > 0) parts.push(`${months} month${months > 1 ? 's' : ''}`);
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);

        return parts.join(', ') || '0 days'; // Return '0 days' if all are zero
    };


    // ---------------------------------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------------------------------
    const [subtaskProjectName, setSubtaskProjectName] = useState('');
    const [subtaskTaskName, setSubtaskTaskName] = useState('');

    const [subtasks, setSubtasks] = useState([
        {
            subtaskName: '',
            subtaskDepartment: '',
            subtaskTeam: '',
            assignedTo: '',
            startDate: '',
            finishDate: '',
            duration: '',
            durationcount: '',
            subtaskStatus: '',
            subtaskPriority: '',
        },
    ]);


    const handleSubtaskChange = (index, field, value) => {
        const updatedSubtasks = [...subtasks];
        updatedSubtasks[index][field] = value;
        setSubtasks(updatedSubtasks);
    };


    const addSubtask = () => {
        setSubtasks([
            ...subtasks,
            {
                subtaskName: '',
                subtaskDepartment: '',
                subtaskTeam: '',
                assignedTo: '',
                startDate: '',
                finishDate: '',
                duration: '',
                durationcount: '',
                subtaskStatus: '',
                subtaskPriority: '',
            },
        ]);
    };

    const removeSubtask = (index) => {

        if (subtasks.length > 1) {
            setSubtasks(subtasks.filter((_, i) => i !== index));
        }
    };

    // Project Handling
    // ---------------------------------------------------------------------------------------------------------------
    const [formErrors, setFormErrors] = useState({});


    const projecthandlesubmit = async (e) => {
        e.preventDefault();


        const errors = {};

        if (!projectName) {
            errors.projectName = 'Project Name is required';
        }

        if (!projectType) {
            errors.projectType = 'Project Type is required';
        }
        if (!projectCategory) {
            errors.projectCategory = 'Project Category is required';
        }
        if (!selectedDeptIds) {
            errors.selectedDeptIds = 'Department is required';
        }
        if (!selectedTeamIds) {
            errors.selectedTeamIds = 'Teams is required';
        }
        if (!selectedMemberds) {
            errors.selectedMemberds = 'Members is required';
        }
        if (!startDate) {
            errors.startDate = 'Start Date is required';
        }
        if (!finishDate) {
            errors.finishDate = 'Finish Date is required';
        }
        if (!duration) {
            errors.duration = 'Duration is required';
        }
        if (!projectStatus) {
            errors.projectStatus = 'Project Status is required';
        }
        if (!projectPriority) {
            errors.projectPriority = 'Project Priority is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();

        // Adding form data
        // project details
        formData.append('p_name', projectName);
        formData.append('p_type', projectType);
        formData.append('p_category', projectCategory);
        formData.append('p_department', selectedDeptIds);
        formData.append('p_teams', selectedTeamIds);
        formData.append('p_members', selectedMemberds);
        formData.append('start_date', startDate);
        formData.append('finish_date', finishDate);
        formData.append('p_duration', JSON.stringify(duration));
        formData.append('status', projectStatus);
        formData.append('p_priority', projectPriority);
        formData.append('p_description', notes);
        formData.append('p_attachment', attachment);

        // client details
        formData.append('c_name', clientName);
        formData.append('c_company', clientCompany);
        formData.append('c_mobile_number', mobileNumber);
        formData.append('c_email', email);
        formData.append('c_state', state);
        formData.append('c_city', city);


        formData.append('created_by', userempid);

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/add_team_project',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            // Handle success
            if (response.data.status === 'success') {
                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                handleToggle('0')
                projecthandlecancel()
            } else if (response.data.status === 'error') {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
            Swal.fire({
                title: 'Error!',
                text: 'An unexpected error occurred. Please try again later.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const fileInputRef = useRef(null);

    const projecthandlecancel = () => {
        // project details
        setProjectName('')
        setProjectType('')
        setProjectCategory('')
        // setDepartment('')
        // setTeams('')
        // setMembers('')
        setSelectedDepartments([])
        setSelectedTeams([])
        setSelectedMembers([])
        setStartDate('')
        setFinishDate('')
        setDuration('')
        setProjectStatus('')
        setProjectPriority('')
        setNotes('')
        setAttachment(null)
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // client details
        setClientName('')
        setClientCompany('')
        setMobileNumber('')
        setEmail('')
        setState('')
        setCity('')

        setFormErrors({});
        handleToggle('0')
    }

    // ---------------------------------------------------------------------------------------------------------------

    // Task Handling
    // ---------------------------------------------------------------------------------------------------------------

    const Taskhandlesubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!taskName) {
            errors.taskName = 'Task Name is required';
        }
        if (!taskprojectName) {
            errors.taskprojectName = 'Project Name is required';
        }
        if (!taskDepartment) {
            errors.taskDepartment = 'Task Department is required';
        }
        if (!taskTeam) {
            errors.taskTeam = 'Task Team is required';
        }
        if (!assignedTo) {
            errors.assignedTo = 'Assigned Name is required';
        }
        if (!taskstartDate) {
            errors.taskstartDate = 'Start Date is required';
        }
        if (!taskfinishDate) {
            errors.taskfinishDate = 'Finish Date is required';
        }
        if (!taskStatus) {
            errors.taskStatus = 'Task Status is required';
        }
        if (!taskPriority) {
            errors.taskPriority = 'Task Priority is required';
        }

        // If there are errors, set them in state and return
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear errors if validation passed
        setFormErrors({});

        try {
            // Prepare the form data
            const formData = new FormData();
            formData.append('t_id', taskId);
            formData.append('t_name', taskName);
            formData.append('p_name', taskprojectName);
            formData.append('assign_dep', taskDepartment);
            formData.append('assign_teams', taskTeam);
            formData.append('assign_to', assignedTo);
            formData.append('start_date', taskstartDate);
            formData.append('finish_date', taskfinishDate);
            formData.append('t_status', taskStatus);
            formData.append('t_priority', taskPriority);
            formData.append('t_description', taskNotes);
            formData.append('t_attachement', taskAttachment);
            formData.append('created_by', userempid);

            // Make the API call
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/add_team_task',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                        'Content-Type': 'multipart/form-data', // For file uploads
                    },
                }
            );

            // Handle the API response
            if (response.data.status === 'success') {

                Swal.fire({
                    title: 'Success!',
                    text: response.data.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                handleToggle('1')
                setRefreshKey(prevKey => prevKey + 1);
                Taskhandlecancel()


            } else if (response.data.status === 'error') {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                setFormErrors({ taskName: response.data.message });
            }
        } catch (error) {
            console.error('Error submitting task:', error);
            Swal.fire({
                title: 'Error!',
                text: error,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    const fileInputReftask = useRef(null);

    const Taskhandlecancel = () => {
        setTaskName('')
        setTaskProjectName('')
        setTaskDepartment('')
        setTaskTeam('')
        setAssignedTo('')
        setTaskStartDate('')
        setTaskFinishDate('')
        setTaskStatus('')
        setTaskPriority('')
        setTaskNotes('')
        setTaskAttachment(null)
        // Reset file input
        if (fileInputReftask.current) {
            fileInputReftask.current.value = '';
        }

        setFormErrors({});
        handleToggle('1')
    }
    // ---------------------------------------------------------------------------------------------------------------

    // Subtask Handling
    // ---------------------------------------------------------------------------------------------------------------

    const Subtaskhandlesubmit = (e) => {
        e.preventDefault();

        const errors = {};

        if (!subtaskProjectName) {
            errors.subtaskProjectName = 'Project Name is required';
        }
        if (!subtaskTaskName) {
            errors.subtaskTaskName = 'Task Name is required';
        }


        // Validate each subtask fields
        subtasks.forEach((subtask, index) => {
            // Create a key for each subtask field to store error messages
            if (!subtask.subtaskName) {
                errors[`subtasks[${index}].subtaskName`] = `Subtask ${index + 1} name is required`;
            }
            if (!subtask.subtaskDepartment) {
                errors[`subtasks[${index}].subtaskDepartment`] = `Subtask ${index + 1} department is required`;
            }
            if (!subtask.subtaskTeam) {
                errors[`subtasks[${index}].subtaskTeam`] = `Subtask ${index + 1} team is required`;
            }
            if (!subtask.assignedTo) {
                errors[`subtasks[${index}].assignedTo`] = `Subtask ${index + 1} assigned to is required`;
            }
            if (!subtask.startDate) {
                errors[`subtasks[${index}].startDate`] = `Subtask ${index + 1} start date is required`;
            }
            if (!subtask.finishDate) {
                errors[`subtasks[${index}].finishDate`] = `Subtask ${index + 1} finish date is required`;
            }
            if (!subtask.duration) {
                errors[`subtasks[${index}].duration`] = `Subtask ${index + 1} duration is required`;
            }
            if (!subtask.durationcount) {
                errors[`subtasks[${index}].durationcount`] = `Subtask ${index + 1} durationcount is required`;
            }
            if (!subtask.subtaskStatus) {
                errors[`subtasks[${index}].subtaskStatus`] = `Subtask ${index + 1} status is required`;
            }
            if (!subtask.subtaskPriority) {
                errors[`subtasks[${index}].subtaskPriority`] = `Subtask ${index + 1} priority is required`;
            }
        });


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

    }


    const Subtaskhandlecancel = () => {
        setSubtaskProjectName('')
        setSubtaskTaskName('')
        setSubtasks([{
            subtaskName: '',
            subtaskDepartment: '',
            subtaskTeam: '',
            assignedTo: '',
            startDate: '',
            finishDate: '',
            duration: '',
            durationcount: '',
            subtaskStatus: '',
            subtaskPriority: '',
        }])
        setFormErrors({});
    }

    // ---------------------------------------------------------------------------------------------------------------
    // State for departments, teams, and members data
    const [departmentsData, setDepartmentsData] = useState([]);
    const [teamsData, setTeamsData] = useState([]);
    const [membersData, setMembersData] = useState([]);

    // State for selected values
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    // Generate options for Select components
    const departmentOptions = departmentsData.map(dept => ({
        value: dept.id,
        label: dept.depart_name
    }));

    const teamOptions = teamsData.map(team => ({
        value: team.id,
        label: team.role_name
    }));

    const memberOptions = membersData.map(member => ({
        value: member.emp_id,
        label: member.emp_name
    }));

    // Fetch departments on component mount
    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/department_drop_down', {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
            .then(response => {
                setDepartmentsData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, [usertoken]);

    // Fetch teams when departments are selected
    useEffect(() => {
        if (selectedDepartments.length > 0) {
            const selectedDeptIds = selectedDepartments.map(dept => dept.value).join(',');
            axios.get(`https://office3i.com/development/api/public/api/teams_drop_down/${selectedDeptIds}`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setTeamsData(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                });
        } else {
            setTeamsData([]);
        }
    }, [selectedDepartments, usertoken]);

    // Fetch members when teams are selected
    useEffect(() => {
        if (selectedTeams.length > 0) {
            const selectedTeamIds = selectedTeams.map(team => team.value).join(',');
            axios.get(`https://office3i.com/development/api/public/api/member_drop_down/${selectedTeamIds}`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setMembersData(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching members:', error);
                });
        } else {
            setMembersData([]);
        }
    }, [selectedTeams, usertoken]);

    const selectedDeptIds = selectedDepartments.map(dept => dept.value).join(',');
    const selectedTeamIds = selectedTeams.map(team => team.value).join(',');
    const selectedMemberds = selectedMembers.map(member => member.value).join(',');

    console.log("selectedDeptIds", selectedDeptIds)
    // ---------------------------------------------------------------------------------------------------------------


    // Task Area

    // ---------------------------------------------------------------------------------------------------------------
    const [taskdepartmentsData, setTaskDepartmentsData] = useState([]);
    const [taskteamsData, setTaskTeamsData] = useState([]);
    const [taskmembersData, setTaskMembersData] = useState([]);

    // Fetch departments
    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/department_drop_down', {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
            .then(response => {
                setTaskDepartmentsData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    // Fetch teams when a department is selected
    useEffect(() => {
        if (taskDepartment) {
            axios.get(`https://office3i.com/development/api/public/api/teams_drop_down/${taskDepartment}`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setTaskTeamsData(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching teams:', error);
                });
        }
    }, [taskDepartment]);

    // Fetch members when a team is selected
    useEffect(() => {
        if (taskTeam) {
            axios.get(`https://office3i.com/development/api/public/api/member_drop_down/${taskTeam}`, {
                headers: {
                    Authorization: `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setTaskMembersData(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching members:', error);
                });
        }
    }, [taskTeam]);
    // ---------------------------------------------------------------------------------------------------------------

    // Sub Task Area

    // ---------------------------------------------------------------------------------------------------------------
    const [subtaskdepartmentsData, setSubTaskDepartmentsData] = useState([]);
    const [subtaskteamsData, setSubTaskTeamsData] = useState({});
    const [subtaskmembersData, setSubTaskMembersData] = useState({});

    // Fetch departments on component mount
    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/department_drop_down', {
            headers: {
                Authorization: `Bearer ${usertoken}`
            }
        })
            .then(response => {
                setSubTaskDepartmentsData(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching departments:', error);
            });
    }, []);

    // Fetch teams based on subtaskDepartment
    useEffect(() => {
        subtasks.forEach((subtask, index) => {
            if (subtask.subtaskDepartment) {
                axios.get(`https://office3i.com/development/api/public/api/teams_drop_down/${subtask.subtaskDepartment}`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                })
                    .then(response => {
                        setSubTaskTeamsData(prev => ({
                            ...prev,
                            [index]: response.data.data,
                        }));
                    })
                    .catch(error => {
                        console.error('Error fetching teams:', error);
                    });
            }
        });
    }, [subtasks]);

    // Fetch members based on subtaskTeam
    useEffect(() => {
        subtasks.forEach((subtask, index) => {
            if (subtask.subtaskTeam) {
                axios.get(`https://office3i.com/development/api/public/api/member_drop_down/${subtask.subtaskTeam}`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                })
                    .then(response => {
                        setSubTaskMembersData(prev => ({
                            ...prev,
                            [index]: response.data.data,
                        }));
                    })
                    .catch(error => {
                        console.error('Error fetching members:', error);
                    });
            }
        });
    }, [subtasks]);

    // ---------------------------------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------------------------------
    const [taskId, setTaskId] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    // Task ID

    useEffect(() => {
        // Fetch Task ID from API
        const fetchTaskId = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/auto_task_id', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                if (response.data.status === "success") {
                    setTaskId(response.data.data); // Set the fetched task ID
                }
            } catch (error) {
                console.error("Error fetching Task ID:", error);
            }
        };

        fetchTaskId(); // Call the function to fetch task ID
    }, [refreshKey]);

    // ---------------------------------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------------------------------

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        // Fetch project dropdown options from the API
        const fetchProjects = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/project_drop_down', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                if (response.data.status === "success") {
                    setProjects(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects(); // Call the function to fetch project data
    }, []);
    console.log("projects---------------->", projects)
    console.log("subtaskProjectName---------------->", subtaskProjectName)
    // ---------------------------------------------------------------------------------------------------------------


    // ---------------------------------------------------------------------------------------------------------------
    const [task, setTask] = useState([]);

    useEffect(() => {
        // Fetch project dropdown options from the API
        const fetchtask = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/teamtask_drop_down/${subtaskProjectName}`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                if (response.data.status === "success") {
                    setTask(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchtask(); // Call the function to fetch project data
    }, [subtaskProjectName]);
    // ---------------------------------------------------------------------------------------------------------------



    return (
        <div style={{ padding: '10px 50px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Manage Projects</h3>

            <Accordion activeKey={activeKey} className="mb-3">

                <Accordion.Item eventKey="0">
                    <div
                        onClick={() => handleToggle('0')}
                        className={`accordion-header ${activeKey === '0' ? 'active' : ''}`}
                    >
                        <h4 className='Teamtask__project'>Create Project</h4> <span>{activeKey === '0' ? <FaMinus /> : <FaPlus />}</span>
                    </div>

                    <Accordion.Body>
                        <h5 className='Teamtask__project__subtitle mt-4 mb-4'>Project Details</h5>
                        <Form>
                            <Form.Group className="mb-3" controlId="projectName">
                                <Form.Label>Project Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                <Form.Control
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                                {formErrors.projectName && <span className="text-danger">{formErrors.projectName}</span>}
                            </Form.Group>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="projectType">
                                        <Form.Label>Project Type <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={projectType}
                                            onChange={(e) => setProjectType(e.target.value)}
                                        />
                                        {formErrors.projectType && <span className="text-danger">{formErrors.projectType}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="projectCategory">
                                        <Form.Label>Project Category <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={projectCategory}
                                            onChange={(e) => setProjectCategory(e.target.value)}
                                        />
                                        {formErrors.projectCategory && <span className="text-danger">{formErrors.projectCategory}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>

                                    <Form.Label>
                                        Select Department <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                    </Form.Label>
                                    <Select
                                        isMulti
                                        options={departmentOptions}
                                        value={selectedDepartments}
                                        onChange={setSelectedDepartments}
                                        placeholder="Select departments..."
                                    />
                                    {formErrors.selectedDeptIds && <span className="text-danger">{formErrors.selectedDeptIds}</span>}

                                </Col>
                                <Col>
                                    <Form.Label>
                                        Select Team <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                    </Form.Label>
                                    <Select
                                        isMulti
                                        options={teamOptions}
                                        value={selectedTeams}
                                        onChange={setSelectedTeams}
                                        placeholder="Select teams..."
                                    />
                                    {formErrors.selectedTeamIds && <span className="text-danger">{formErrors.selectedTeamIds}</span>}
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Label>
                                        Select Members <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                    </Form.Label>
                                    <Select
                                        isMulti
                                        options={memberOptions}
                                        value={selectedMembers}
                                        onChange={setSelectedMembers}
                                        placeholder="Select members..."
                                    />
                                    {formErrors.selectedMemberds && <span className="text-danger">{formErrors.selectedMemberds}</span>}
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="startDate">
                                        <Form.Label>
                                            Start Date
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => {
                                                setStartDate(e.target.value);
                                                setFinishDate(""); // Clear the finish date if start date changes
                                                setDuration({ years: 0, months: 0, days: 0 }); // Reset duration
                                            }}
                                        />
                                        {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="finishDate">
                                        <Form.Label>
                                            Finish Date
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={finishDate}
                                            min={startDate} // Set the minimum finish date to the selected start date
                                            onChange={handleFinishDateChange}
                                        />
                                        {formErrors.finishDate && <span className="text-danger">{formErrors.finishDate}</span>}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="duration">
                                        <Form.Label>
                                            Duration (Years, Months, Days)
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            // value={`${duration.years} years, ${duration.months} months, ${duration.days} days`}
                                            value={formatDuration()}

                                            readOnly // Make this read-only as it's automatically calculated
                                        />
                                        {formErrors.duration && <span className="text-danger">{formErrors.duration}</span>}
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="projectStatus">
                                        <Form.Label>
                                            Project Status
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Select
                                            aria-label="Select Project Status"
                                            value={projectStatus}
                                            onChange={(e) => setProjectStatus(e.target.value)}
                                        >
                                            <option>Select Project Status...</option>
                                            <option value="1">Yet To Start</option>
                                            <option value="2">In Progress</option>
                                            <option value="3">Hold</option>
                                            <option value="4">Completed</option>
                                        </Form.Select>
                                        {formErrors.projectStatus && <span className="text-danger">{formErrors.projectStatus}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="projectPriority">
                                        <Form.Label>
                                            Project Priority
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Select
                                            aria-label="Select Project Priority"
                                            value={projectPriority}
                                            onChange={(e) => setProjectPriority(e.target.value)}
                                        >
                                            <option>Select Project Priority...</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </Form.Select>
                                        {formErrors.projectPriority && <span className="text-danger">{formErrors.projectPriority}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Form.Group className="mb-3" controlId="notes">
                                    <Form.Label>Notes/Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />
                                </Form.Group>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="attachment">
                                        <Form.Label>Attachment</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <h5 className='Teamtask__project__subtitle mt-4 mb-4'>Client Details</h5>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="clientName">
                                        <Form.Label>Client Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="clientCompany">
                                        <Form.Label>Client Company</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={clientCompany}
                                            onChange={(e) => setClientCompany(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="mobileNumber">
                                        <Form.Label>Mobile Number</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="state">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className='create__project__btn'>
                                <button class="btn btn-primary mt-3 mb-3" onClick={projecthandlesubmit}>Submit</button>
                                <button type="button" class="btn btn-outline-primary" onClick={projecthandlecancel}>Cancel</button>
                            </div>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <div
                        onClick={() => handleToggle('1')}
                        className={`accordion-header ${activeKey === '1' ? 'active' : ''}`}
                    >
                        <h4 className='Teamtask__project'>Create Task</h4> <span>{activeKey === '1' ? <FaMinus /> : <FaPlus />}</span>
                    </div>

                    <Accordion.Body>
                        <h5 className='Teamtask__project__subtitle mt-4 mb-4'>Task Details</h5>
                        <Form>
                            <Row>
                                <Col className='Task__detail__taskid'>
                                    <Form.Label>Task ID:</Form.Label>
                                    <Button className='Task__id'>{taskId}</Button>
                                </Col>

                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskName">
                                        <Form.Label>
                                            Task Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={taskName}
                                            onChange={(e) => setTaskName(e.target.value)}
                                            required
                                        />
                                        {formErrors.taskName && <span className="text-danger">{formErrors.taskName}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskProjectName">
                                        <Form.Label>
                                            Project Name <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        </Form.Label>
                                        <Form.Select
                                            value={taskprojectName}
                                            onChange={(e) => setTaskProjectName(e.target.value)}
                                        >
                                            <option>Select Project Name...</option>
                                            {/* Add your project name options here */}
                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.project_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {formErrors.taskProjectName && <span className="text-danger">{formErrors.taskProjectName}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskDepartment">
                                        <Form.Label>
                                            Select Department <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        </Form.Label>
                                        <Form.Select
                                            value={taskDepartment}
                                            onChange={(e) => setTaskDepartment(e.target.value)}
                                        >
                                            <option>Select Department...</option>
                                            {/* Add your department options here */}
                                            {taskdepartmentsData.map((dept) => (
                                                <option key={dept.id} value={dept.id}>
                                                    {dept.depart_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {formErrors.taskDepartment && <span className="text-danger">{formErrors.taskDepartment}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskTeam">
                                        <Form.Label>
                                            Select Team <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        </Form.Label>
                                        <Form.Select
                                            value={taskTeam}
                                            onChange={(e) => setTaskTeam(e.target.value)}
                                        >
                                            <option>Select Team...</option>
                                            {/* Add your team options here */}
                                            {taskteamsData.map((team) => (
                                                <option key={team.id} value={team.id}>
                                                    {team.role_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {formErrors.taskTeam && <span className="text-danger">{formErrors.taskTeam}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="assignedTo">
                                        <Form.Label>
                                            Assign To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        </Form.Label>
                                        <Form.Select
                                            value={assignedTo}
                                            onChange={(e) => setAssignedTo(e.target.value)}
                                        >
                                            <option>Select person...</option>
                                            {/* Add your assignable persons here */}
                                            {taskmembersData.map((member) => (
                                                <option key={member.emp_id} value={member.emp_id}>
                                                    {member.emp_name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {formErrors.assignedTo && <span className="text-danger">{formErrors.assignedTo}</span>}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="taskstartDate">
                                        <Form.Label>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={taskstartDate}
                                            onChange={(e) => setTaskStartDate(e.target.value)}
                                        />
                                        {formErrors.taskstartDate && <span className="text-danger">{formErrors.taskstartDate}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col>
                                    <Form.Group className="mb-3" controlId="taskfinishDate">
                                        <Form.Label>Finish Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={taskfinishDate}
                                            onChange={(e) => setTaskFinishDate(e.target.value)}
                                        />
                                        {formErrors.taskfinishDate && <span className="text-danger">{formErrors.taskfinishDate}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskStatus">
                                        <Form.Label>Task Status <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>

                                        <Form.Select
                                            aria-label="Select Task Status"
                                            value={taskStatus}
                                            onChange={(e) => setTaskStatus(e.target.value)}
                                        >
                                            <option>Select Project Status...</option>
                                            <option value="1">Yet To Start</option>
                                            <option value="2">In Progress</option>
                                            <option value="3">Hold</option>
                                            <option value="4">Completed</option>
                                        </Form.Select>
                                        {formErrors.taskStatus && <span className="text-danger">{formErrors.taskStatus}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>

                                <Col>
                                    <Form.Group className="mb-3" controlId="taskPriority">
                                        <Form.Label>Task Priority <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>

                                        <Form.Select
                                            aria-label="Select Task Priority"
                                            value={taskPriority}
                                            onChange={(e) => setTaskPriority(e.target.value)}
                                        >
                                            <option>Select Project Priority...</option>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </Form.Select>
                                        {formErrors.taskPriority && <span className="text-danger">{formErrors.taskPriority}</span>}
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="mb-3" controlId="taskAttachment">
                                        <Form.Label>Attachment</Form.Label>
                                        <Form.Control
                                            type="file"
                                            onChange={(e) => setTaskAttachment(e.target.files[0])}
                                            ref={fileInputReftask}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Form.Group className="mb-3" controlId="taskNotes">
                                    <Form.Label>Notes/Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        value={taskNotes}
                                        onChange={(e) => setTaskNotes(e.target.value)}
                                        rows={3}
                                    />
                                </Form.Group>
                            </Row>

                            <div className='create__project__btn'>
                                <Button variant="primary" onClick={Taskhandlesubmit} className="mt-3 mb-3">
                                    Submit
                                </Button>
                                <Button variant="outline-primary" type="button" onClick={Taskhandlecancel}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <div
                        onClick={() => handleToggle('2')}
                        className={`accordion-header ${activeKey === '2' ? 'active' : ''}`}
                    >
                        <h4 className='Teamtask__project'>Create Subtask</h4> <span>{activeKey === '2' ? <FaMinus /> : <FaPlus />}</span>
                    </div>

                    <Accordion.Body>
                        <h5 className='Teamtask__project__subtitle mt-4 mb-4'>Subtask Details</h5>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="subtaskProjectName">
                                        <Form.Label>
                                            Project Name
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        <Form.Select
                                            value={subtaskProjectName} // Add state for subtaskProjectName
                                            onChange={(e) => setSubtaskProjectName(e.target.value)} // Update state on change
                                            required
                                            
                                        >
                                            <option>Select Project...</option>
                                            {/* Add your project options here */}

                                            {projects.map((project) => (
                                                <option key={project.id} value={project.id}>
                                                    {project.project_name}
                                                </option>
                                            ))}
                                            
                                        </Form.Select>
                                        {formErrors.subtaskProjectName && <span className="text-danger">{formErrors.subtaskProjectName}</span>}
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group className="mb-3" controlId="subtaskTaskName">
                                        <Form.Label>
                                            Task Name
                                            <sup>
                                                <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                            </sup>
                                        </Form.Label>
                                        {task.length > 0 ? (
                                        <Form.Select
                                            value={subtaskTaskName} // Add state for subtaskTaskName
                                            onChange={(e) => setSubtaskTaskName(e.target.value)} // Update state on change
                                            required
                                        >
                                            <option>Select Task...</option>
                                            {/* Add your task options here */}
                                            {task.map((tasks) => (
                                                <option key={tasks.id} value={tasks.id}>
                                                    {tasks.task_name}
                                                </option>
                                            ))}
                                          
                                        </Form.Select>
                                         ) : (
                                            <Form.Select disabled>
                                                <option>No tasks available</option>
                                            </Form.Select>
                                        )}
                                        {formErrors.subtaskTaskName && <span className="text-danger">{formErrors.subtaskTaskName}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>


                            {subtasks.map((subtask, index) => (
                                <div key={index} className="subtask-container">
                                    <h6 className="subtask__counts">Subtask {index + 1}</h6>

                                    <Form.Group className="mb-3" controlId={`subtaskName-${index}`}>
                                        <Form.Label>Subtask<sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={subtask.subtaskName}
                                            onChange={(e) => handleSubtaskChange(index, 'subtaskName', e.target.value)}
                                            placeholder='Enter the Description'
                                            required
                                        />
                                        {formErrors[`subtasks[${index}].subtaskName`] && (
                                            <span className="text-danger">{formErrors[`subtasks[${index}].subtaskName`]}</span>
                                        )}
                                    </Form.Group>

                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId={`subtaskDepartment-${index}`}>
                                                <Form.Label>
                                                    Select Department
                                                    <sup>
                                                        <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                                    </sup>
                                                </Form.Label>
                                                <Form.Select
                                                    value={subtask.subtaskDepartment}
                                                    onChange={(e) => handleSubtaskChange(index, 'subtaskDepartment', e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    {subtaskdepartmentsData.map((dept) => (
                                                        <option key={dept.id} value={dept.id}>
                                                            {dept.depart_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].subtaskDepartment`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].subtaskDepartment`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col>
                                            <Form.Group className="mb-3" controlId={`subtaskTeam-${index}`}>
                                                <Form.Label>
                                                    Select Team
                                                    <sup>
                                                        <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                                    </sup>
                                                </Form.Label>
                                                <Form.Select
                                                    value={subtask.subtaskTeam}
                                                    onChange={(e) => handleSubtaskChange(index, 'subtaskTeam', e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    {subtaskteamsData[index] && subtaskteamsData[index].map((team) => (
                                                        <option key={team.id} value={team.id}>
                                                            {team.role_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].subtaskTeam`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].subtaskTeam`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>




                                    <Row>
                                        <Col>
                                            <Form.Group className="mb-3" controlId={`assignedTo-${index}`}>
                                                <Form.Label>
                                                    Assign To
                                                    <sup>
                                                        <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                                    </sup>
                                                </Form.Label>
                                                <Form.Select
                                                    value={subtask.assignedTo}
                                                    onChange={(e) => handleSubtaskChange(index, 'assignedTo', e.target.value)}
                                                    required
                                                >
                                                    <option>Select a person...</option>
                                                    {subtaskmembersData[index] && subtaskmembersData[index].map((member) => (
                                                        <option key={member.emp_id} value={member.emp_id}>
                                                            {member.emp_name}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].assignedTo`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].assignedTo`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>
                                            <Form.Group className="mb-3" controlId={`startDate-${index}`}>
                                                <Form.Label>Start Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={subtask.startDate}
                                                    onChange={(e) => handleSubtaskChange(index, 'startDate', e.target.value)}
                                                    required
                                                />
                                                {formErrors[`subtasks[${index}].startDate`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].startDate`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>


                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId={`finishDate-${index}`}>
                                                <Form.Label>Finish Date <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    value={subtask.finishDate}
                                                    onChange={(e) => handleSubtaskChange(index, 'finishDate', e.target.value)}
                                                    required
                                                />
                                                {formErrors[`subtasks[${index}].finishDate`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].finishDate`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId={`durationDays-${index}`}>
                                                <Form.Label>
                                                    Duration
                                                    <sup>
                                                        <FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} />
                                                    </sup>
                                                </Form.Label>
                                                <Form.Select
                                                    value={subtask.duration}
                                                    onChange={(e) => handleSubtaskChange(index, 'duration', e.target.value)}
                                                >
                                                    <option value="">Select Duration...</option>
                                                    {/* Example options for days */}
                                                    <option value="0">Days</option>
                                                    <option value="1">Hours</option>

                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].duration`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].duration`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>

                                        <Col md={2}>
                                            <Form.Group className="mb-3" controlId={`durationcount-${index}`}>
                                                <Form.Label>
                                                    Duration Count
                                                </Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    value={subtask.durationcount}
                                                    onChange={(e) => handleSubtaskChange(index, 'durationcount', e.target.value)}
                                                />
                                                {formErrors[`subtasks[${index}].durationcount`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].durationcount`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>

                                            <Form.Group className="mb-3" controlId={`subtaskStatus-${index}`}>
                                                <Form.Label>Subtask Status <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>

                                                <Form.Select
                                                    aria-label="Select Subtask Status"
                                                    value={subtask.subtaskStatus}
                                                    onChange={(e) => handleSubtaskChange(index, 'subtaskStatus', e.target.value)}
                                                >
                                                    <option>Select Subtask Status...</option>
                                                    <option value="1">Yet To Start</option>
                                                    <option value="2">In Progress</option>
                                                    <option value="3">Hold</option>
                                                    <option value="4">Completed</option>
                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].subtaskStatus`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].subtaskStatus`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col>

                                            <Form.Group className="mb-3" controlId={`subtaskPriority-${index}`}>
                                                <Form.Label>Subtask Priority <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>

                                                <Form.Select
                                                    aria-label="Select Subtask Priority"
                                                    value={subtask.subtaskPriority}
                                                    onChange={(e) => handleSubtaskChange(index, 'subtaskPriority', e.target.value)}
                                                >
                                                    <option>Select Subtask Priority...</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </Form.Select>
                                                {formErrors[`subtasks[${index}].subtaskPriority`] && (
                                                    <span className="text-danger">{formErrors[`subtasks[${index}].subtaskPriority`]}</span>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>


                                    {/* Display remove button only if there's more than 1 subtask */}
                                    {subtasks.length > 1 && (
                                        <Button

                                            className="mb-4 minus"
                                            onClick={() => removeSubtask(index)}
                                        >
                                            <img src={minus} alt='minus' />
                                        </Button>
                                    )}

                                </div>
                            ))}

                            <Button className="mb-3 plus" onClick={addSubtask}>
                                <img src={plus} alt='plus' />
                            </Button>

                            <div className="create__project__btn">
                                <Button variant="primary" onClick={Subtaskhandlesubmit} className="mt-3 mb-3">
                                    Submit
                                </Button>
                                <Button variant="outline-primary" onClick={Subtaskhandlecancel} type="button">
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>

            </Accordion>

        </div>
    );
}

export default ManageProjects;
