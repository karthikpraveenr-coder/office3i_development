import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {


    // ----------------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEventList = () => {
        navigate(`/admin/projectlist`);
    };


    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ----------------------------------------------------------------------------------------------------------


    // Project state
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [projectCategory, setProjectCategory] = useState('');
    const [projectWorkType, setProjectWorkType] = useState('');
    // const [department, setDepartment] = useState('');
    // const [members, setMembers] = useState('');
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [duration, setDuration] = useState('');
    const [status, setStatus] = useState('');
    const [description, setDescription] = useState('');

    // Client state
    const [clientName, setClientName] = useState('');
    const [clientCompany, setClientCompany] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!projectName) {
            errors.projectName = 'Project is required.';
        }
        if (selectedEmployee.length == 0) {
            console.log('in test')
            errors.selectedEmployee = 'Select Members is required.';
        }
        if (!projectType) {
            errors.projectType = 'Project Type is required.';
        }
        if (!projectCategory) {
            errors.projectCategory = 'Project Category is required.';
        }
        if (!projectWorkType) {
            errors.projectWorkType = 'Project Work Type is required.';
        }
        if (!fromDate) {
            errors.fromDate = 'From Date is required.';
        }
        if (!toDate) {
            errors.toDate = 'To Date is required.';
        }
        if (!duration) {
            errors.duration = 'Duration is required.';
        }
        if (!status) {
            errors.status = 'Status is required.';
        }
        if (!description) {
            errors.description = 'Description is required.';
        }
        if (!clientName) {
            errors.clientName = 'Client Name is required.';
        }
        if (!clientCompany) {
            errors.clientCompany = 'Client Company is required.';
        }

        if (!email) { 
            errors.email = 'Email is required';
        } else if (/^\d/.test(email)) {
            errors.email = 'Email must not start with a number';
        } else if (!/^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.email = 'Invalid email address';
        }

        if (!contactNo) {
            errors.contactNo = 'Phone number is required';
        } else if (!/^\d{10}$/.test(contactNo)) {
            errors.contactNo = 'Phone number must be 10 digits';
        }
        if (!city) {
            errors.city = 'City is required.';
        }
        if (!state) {
            errors.state = 'State is required.';
        }
        if (selectedDepartment.length == 0) {
            errors.selectedDepartment = 'Select Teams  is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        // Project state
        formData.append('p_name', projectName);
        formData.append('p_type', projectType);
        formData.append('p_work_type', projectWorkType);
        formData.append('p_category', projectCategory);
        formData.append('p_description', description);
        formData.append('p_department', selectedDepartment);
        formData.append('p_members', selectedEmployee);
        formData.append('from_date', fromDate);
        formData.append('to_date', toDate);
        formData.append('status', status);
        formData.append('p_durations', duration);

        // Client state
        formData.append('c_name', clientName);
        formData.append('c_company', clientCompany);
        formData.append('c_email', email);
        formData.append('c_mobile', contactNo);
        formData.append('c_city', city);
        formData.append('c_state', state);
        formData.append('created_by', userempid);

        // eventImage.forEach(image => formData.append('event_images[]', image));
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/add_project', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = await response.json();

            const { status, message } = data;

            if (status === 'success') {

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: message,
                });
                GoToEventList()
                // fetchTableData();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: message,

                });
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


    // Handle form cancellation
    const handleCancel = () => {
        setProjectName('');
        setProjectType('');
        setProjectCategory('');
        setProjectWorkType('');
        setSelectedDepartment('');
        setSelectedEmployee('');
        setFromDate('');
        setToDate('');
        setDuration('');
        setStatus('');
        setDescription('');

        setClientName('');
        setClientCompany('');
        setContactNo('');
        setEmail('');
        setCity('');
        setState('');
        setFormErrors({});
    };





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
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedEmployee(selectedIds);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee.join(',') : null;


    // ------------------------------------------------------------------------------------------------

    return (
        <div className='Addproject__container mt-5' style={{ padding: '0px 70px 30px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Project</h3>
            <Form onSubmit={handleSubmit}>
                <h5 className='mb-5' style={{ color: '#00275c' }}>Project Details</h5>
                <div className='Project__Detail' style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>
                    <Row>
                        <Col>
                            <Form.Group controlId="projectName">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                                {formErrors.projectName && <span className="text-danger">{formErrors.projectName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="projectType">
                                <Form.Label>Project Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={projectType}
                                    onChange={(e) => setProjectType(e.target.value)}
                                />
                                {formErrors.projectType && <span className="text-danger">{formErrors.projectType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="projectCategory">
                                <Form.Label>Project Category</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={projectCategory}
                                    onChange={(e) => setProjectCategory(e.target.value)}
                                />
                                {formErrors.projectCategory && <span className="text-danger">{formErrors.projectCategory}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="projectWorkType">
                                <Form.Label>Project Work Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={projectWorkType}
                                    onChange={(e) => setProjectWorkType(e.target.value)}
                                />
                                {formErrors.projectWorkType && <span className="text-danger">{formErrors.projectWorkType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
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
                        <Col>
                            <div className="mb-3">
                                <label htmlFor="selectedEmployee" className="form-label">Select Members</label>
                                <MultiSelect
                                    options={formattedEmployeesDropdown}
                                    value={formattedEmployeesDropdown.filter(option => selectedEmployee.includes(option.value))}
                                    onChange={handleSelectEmployeeChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="fromDate">
                                <Form.Label>From Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={fromDate}
                                    max="9999-12-31"
                                    onChange={(e) => setFromDate(e.target.value)}
                                />
                                {formErrors.fromDate && <span className="text-danger">{formErrors.fromDate}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="toDate">
                                <Form.Label>To Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={toDate}
                                    max="9999-12-31"
                                    onChange={(e) => setToDate(e.target.value)}
                                />
                                {formErrors.toDate && <span className="text-danger">{formErrors.toDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="duration">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                />
                                {formErrors.duration && <span className="text-danger">{formErrors.duration}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
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
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="description">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                <h5 className='mb-5 mt-5' style={{ color: '#00275c' }}>Client Details</h5>
                <div className='Client__Details mb-5' style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>
                    <Row>
                        <Col>
                            <Form.Group controlId="clientName">
                                <Form.Label>Client Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                />
                                {formErrors.clientName && <span className="text-danger">{formErrors.clientName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="clientCompany">
                                <Form.Label>Client Company</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={clientCompany}
                                    onChange={(e) => setClientCompany(e.target.value)}
                                />
                                {formErrors.clientCompany && <span className="text-danger">{formErrors.clientCompany}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="contactNo">
                                <Form.Label>Contact No</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                />
                                {formErrors.contactNo && <span className="text-danger">{formErrors.contactNo}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="city">
                                <Form.Label>City</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                                {formErrors.city && <span className="text-danger">{formErrors.city}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="state">
                                <Form.Label>State</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                                {formErrors.state && <span className="text-danger">{formErrors.state}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                </div>

                <Button variant="primary" type="submit">Submit</Button>{' '}
                <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            </Form>
        </div>
    );
};

export default AddProject;
