import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const EditRaiseTicket = () => {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add Assetslist page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitTicketlist = () => {
        navigate(`/admin/ticketslist`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';
    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // const [department, setDepartment] = useState('');
    // const [employeeName, setEmployeeName] = useState('');
    const [department, setDepartment] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [ticketID, setTicketID] = useState('');
    const [ticketTitle, setTicketTitle] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [assignDepartment, setAssignDepartment] = useState('');
    const [assignEmployee, setAssignEmployee] = useState('');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});


    // ------------------------------------------------------------------------------------------------
    const [newfile, setNewfile] = useState(null);

    const handleAttachmentChange = (e) => {
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
    // FETCH DATA FROM API TO STORE THE INITIAL STATE FOR EDIT FEILDS


    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/editview_raiselist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    console.log("edit----->", response.data.data)

                    setDepartment(response.data.data.department);
                    setEmployeeName(response.data.data.emp_id);

                    setTicketID(response.data.data.ticket_id);
                    setTicketTitle(response.data.data.ticket_title);
                    setIssueType(response.data.data.issue_type);
                    setDescription(response.data.data.description);
                    setAttachment(response.data.data.attachment);
                    setAssignDepartment(response.data.data.assign_dep);
                    setAssignEmployee(response.data.data.assign_empid);
                    setStatus(response.data.data.status);
                    console.log("----------->", response.data.data.status)



                    setLoading(false)


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

    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT 

    const handleSave = (e) => {
        e.preventDefault();
        const errors = {};

        if (assignDepartment == '-') {
            errors.assignDepartment = 'Assign Department is required.';
        }

        if (assignEmployee == '-') {
            errors.assignEmployee = 'Assign Employee is required.';
        }

        if (status == 'Pending') {
            errors.status = 'Status is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const formData = {
            id: id,
            emp_id: employeeName,
            assign_dep: assignDepartment,
            assign_empid: assignEmployee,
            status: status,
            updated_by: userempid
        }

        axios.put('https://office3i.com/development/api/public/api/update_raiseticket', formData, {
            headers: {
                'Content-Type': 'application/json',
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
                    handleVisitTicketlist()
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
                    text: 'There was an error creating the leave policy type. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };



    const handleCancel = () => {
        handleVisitTicketlist()
        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------



    // -------------------------------------- Department ---------------------------------------------------
    const [departmentDropdown, setDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------

    // ------------------------------------  Employee  ---------------------------------------------------

    const [employeesDropdown, setEmployeesDropdown] = useState([]);

    // Fetch employee dropdown options based on selected department
    useEffect(() => {
        if (department) {
            const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${department}`;
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data || [];
                    setEmployeesDropdown(data);
                } catch (error) {
                    console.error('Error fetching employee options:', error);
                }
            };
            fetchEmployees();
        }
    }, [department, usertoken]);
    // ---------------------------------------------------------------------------------------------------


    // -------------------------------------- Assign Department ---------------------------------------------------
    const [assignDepartmentDropdown, setAssignDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setAssignDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------

    // ------------------------------------ Assign Employee  ---------------------------------------------------

    const [assignEmployeesDropdown, setAssignEmployeesDropdown] = useState([]);

    // Fetch employee dropdown options based on selected department
    useEffect(() => {
        if (assignDepartment) {
            const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${assignDepartment}`;
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data || [];
                    setAssignEmployeesDropdown(data);
                } catch (error) {
                    console.error('Error fetching employee options:', error);
                }
            };
            fetchEmployees();
        }
    }, [assignDepartment, usertoken]);
    // ---------------------------------------------------------------------------------------------------

    // -------------------------------------- Issue Type ---------------------------------------------------
    const [issueTypeDropdown, setIssueTypeDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/issue_type_list', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setIssueTypeDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------





    return (

        <div className='RaiseTicket__container' style={{ padding: '10px 40px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Ticket</h3>
            <div className='form__area' style={{ background: '#ffffff', padding: '60px 40px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                <Form onSubmit={handleSave}>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)} disabled>
                                    <option value="">Select Department</option>
                                    {departmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.role_name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formEmployeeName">
                                <Form.Label>Employee Name</Form.Label>
                                <Form.Control as="select" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} disabled>
                                    <option value="">Select Employee</option>
                                    {employeesDropdown.map(emp => (
                                        <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formTicketID">
                                <Form.Label>Ticket ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ticketID}
                                    onChange={(e) => setTicketID(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formTicketTitle">
                                <Form.Label>Ticket Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ticketTitle}
                                    onChange={(e) => setTicketTitle(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formIssueType">
                                <Form.Label>Issue Type</Form.Label>
                                <Form.Control as="select" value={issueType} onChange={(e) => setIssueType(e.target.value)} disabled>
                                    <option value="">Select Issue Type</option>
                                    {issueTypeDropdown.map(issue => (
                                        <option key={issue.id} value={issue.id}>{issue.ot_type_name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Assigned Department</Form.Label>
                                <Form.Control as="select" value={assignDepartment} onChange={(e) => setAssignDepartment(e.target.value)}>
                                    <option value="">Select Department</option>
                                    {assignDepartmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.role_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.assignDepartment && <span className="text-danger">{formErrors.assignDepartment}</span>}
                            </Form.Group>
                        </Col>

                    </Row>

                    <Row className='mb-3'>
                        <Col md={6}>
                            <Form.Group controlId="formEmployeeName">
                                <Form.Label>Assigned Employee Name</Form.Label>
                                <Form.Control as="select" value={assignEmployee} onChange={(e) => setAssignEmployee(e.target.value)} disabled={!assignDepartment}>
                                    <option value="">Select Employee</option>
                                    {assignEmployeesDropdown.map(emp => (
                                        <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.assignEmployee && <span className="text-danger">{formErrors.assignEmployee}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formStatus">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    {/* <option value="Pending">Pending</option> */}
                                    <option value="Assigned">Assigned</option>
                                    <option value="Solved">Solved</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mb-3'>
                        <Col>
                            <Form.Group controlId="formAttachment">
                                <Form.Label>Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    name="attachment"
                                    onChange={handleAttachmentChange}
                                    disabled
                                />
                                <img src="" alt="" id="img" style={{ height: '150px' }} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className='mb-5'>
                        <Col>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={1}>
                            <Button variant="primary" type="submit">
                                Save
                            </Button>
                        </Col>
                        <Col md={1}>
                            <Button variant="secondary" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>

                </Form>
            </div>
        </div>
    );
};

export default EditRaiseTicket;
