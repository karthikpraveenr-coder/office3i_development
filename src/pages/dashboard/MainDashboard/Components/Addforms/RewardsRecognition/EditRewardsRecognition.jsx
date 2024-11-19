import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ScaleLoader } from 'react-spinners';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFolderOpen, faPen, faPlus, faStarOfLife, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaStarOfLife } from 'react-icons/fa';
import Select from 'react-select';
import { MultiSelect } from 'react-multi-select-component';

function EditRewardsRecognition() {

    const { id } = useParams();

    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editskillsdevelopmenttraining/${id}`);
    };

    const GoToaddnewtitlePage = () => {
        navigate(`/admin/addnewtitle`);
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    const [monthYear, setMonthYear] = useState('');       // For "Select Month & Year"

    const [formErrors, setFormErrors] = useState({})


    const handleSubmit = () => {

    }



    const handleCancel = () => {


        setFormErrors({});
    };

    // -----------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------------
    // Fetch initial data
    useEffect(() => {
        const fetchSkillData = async () => {
            try {
                const response = await axios.get(
                    `https://office3i.com/development/api/public/api/edit_reward_recognition_list/${id}`,
                    { headers: { Authorization: `Bearer ${usertoken}` } }
                );

                const RewardsData = response.data.data;

                console.log("RewardsData:", RewardsData);

                // Set Month & Year
                setMonthYear(RewardsData.month);

                // Set Title
                setTitle(RewardsData.title);

                console.log("Initial RewardsData.departments:", RewardsData.departments);
                console.log("Initial RewardsData.teams:", RewardsData.teams);
                console.log("Initial RewardsData.members:", RewardsData.members);
            
                // Parse RewardsData
                const departmentIds = RewardsData.departments.split(',').map(id => parseInt(id));
                const teamIds = RewardsData.teams.split(',').map(id => parseInt(id));
                const memberIds = RewardsData.members.split(',').map(id => parseInt(id));
            
                console.log("Parsed Department IDs:", departmentIds);
                console.log("Parsed Team IDs:", teamIds);
                console.log("Parsed Member IDs:", memberIds);
            
                // Ensure the departments, teams, and members arrays are available
                console.log("Available Departments:", departments);
                console.log("Available Teams:", teams);
                console.log("Available Members:", members);
            
                // Format Departments
                if (RewardsData.departments) {
                    const formattedDepartments = departmentIds.map(id => {
                        const department = departments.find(dept => dept.id === id);
                        console.log("Finding Department ID:", id, "Found:", department);
                        return department ? { value: department.id, label: department.dept_name } : null;
                    }).filter(Boolean);
                    console.log("Formatted Departments:", formattedDepartments);
                    setTaskDepartment(formattedDepartments);
                }
            
                // Format Teams
                if (RewardsData.teams) {
                    const formattedTeams = teamIds.map(id => {
                        const team = teams.find(team => team.id === id);
                        console.log("Finding Team ID:", id, "Found:", team);
                        return team ? { value: team.id, label: team.role_name } : null;
                    }).filter(Boolean);
                    console.log("Formatted Teams:", formattedTeams);
                    setTaskTeam(formattedTeams);
                }
            
                // Format Members
                if (RewardsData.members) {
                    const formattedMembers = memberIds.map(id => {
                        const member = members.find(member => member.emp_id === id);
                        console.log("Finding Member ID:", id, "Found:", member);
                        return member ? { value: member.emp_id, label: member.emp_name } : null;
                    }).filter(Boolean);
                    console.log("Formatted Members:", formattedMembers);
                    setAssignedTo(formattedMembers);
                }



            } catch (error) {
                console.error("Error fetching skill data:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load data. Please try again later.',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK',
                });
            }
        };




        fetchSkillData();
    }, [usertoken, id]);



    // ---------------------------------------------------------------------------------------------------------
    const [title, setTitle] = useState('');
    const [rewardRecognitionData, setRewardRecognitionData] = useState([]);

    useEffect(() => {
        // Fetch reward recognition data
        axios.get('https://office3i.com/development/api/public/api/reward_recognition_name_list', {
            headers: {
                Authorization: `Bearer ${usertoken}`,
            },
        })
            .then((response) => {
                if (response.data.status === 'success') {
                    setRewardRecognitionData(response.data.data);
                    setLoading(false)
                }
            })
            .catch((error) => {
                console.error('Error fetching reward recognition data:', error);
            });
    }, []);

    // ---------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    // State variables for dropdown selections
    const [taskDepartment, setTaskDepartment] = useState([]); // For selected departments
    const [taskTeam, setTaskTeam] = useState([]); // For selected teams
    const [assignedTo, setAssignedTo] = useState([]); // For selected members

    // State variables for dropdown options
    const [departments, setDepartments] = useState([]); // Dropdown options for departments
    const [teams, setTeams] = useState([]); // Dropdown options for teams
    const [members, setMembers] = useState([]); // Dropdown options for members

    console.log("taskDepartment:", taskDepartment)
    console.log("setTaskTeam:", taskTeam)
    console.log("setAssignedTo:", assignedTo)
    // Fetch departments on component mount
    useEffect(() => {
        axios
            .get("https://office3i.com/development/api/public/api/department_drop_down", {
                headers: { Authorization: `Bearer ${usertoken}` },
            })
            .then((response) => {
                const data = response.data.data || [];
                const formattedDepartments = data.map((department) => ({
                    label: department.depart_name, // Assuming 'depart_name' is the department name
                    value: department.id, // Assuming 'id' is the department ID
                }));
                setDepartments(formattedDepartments);
            })
            .catch((error) => console.error("Error fetching departments:", error));
    }, [usertoken]);

    // Fetch teams based on selected departments
    useEffect(() => {
        if (taskDepartment.length) {
            const selectedIds = taskDepartment.map((dept) => dept.value).join(",");
            axios
                .get(`https://office3i.com/development/api/public/api/teams_drop_down/${selectedIds}`, {
                    headers: { Authorization: `Bearer ${usertoken}` },
                })
                .then((response) => {
                    const data = response.data.data || [];
                    const formattedTeams = data.map((team) => ({
                        label: team.role_name, // Assuming 'role_name' is the team role name
                        value: team.id, // Assuming 'id' is the team ID
                    }));
                    setTeams(formattedTeams);
                })
                .catch((error) => console.error("Error fetching teams:", error));
        } else {
            setTeams([]); // Reset teams if no department is selected
        }
    }, [taskDepartment, usertoken]);

    // Fetch members based on selected teams
    useEffect(() => {
        if (taskTeam.length) {
            const selectedIds = taskTeam.map((team) => team.value).join(",");
            axios
                .get(`https://office3i.com/development/api/public/api/member_drop_down/${selectedIds}`, {
                    headers: { Authorization: `Bearer ${usertoken}` },
                })
                .then((response) => {
                    const data = response.data.data || [];
                    const formattedMembers = data.map((member) => ({
                        label: member.emp_name, // Assuming 'emp_name' is the member name
                        value: member.emp_id, // Assuming 'emp_id' is the member ID
                    }));
                    setMembers(formattedMembers);
                })
                .catch((error) => console.error("Error fetching members:", error));
        } else {
            setMembers([]); // Reset members if no team is selected
        }
    }, [taskTeam, usertoken]);
    // ---------------------------------------------------------------------------------------------------------------



    // ------------------------------------------------------------------------------------------------


    return (
        <>


            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (

                <Container fluid className='shift__container'>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Rewards & Recognition</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Supervisor list slot add form */}

                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>

                        <Row className='mb-3'>
                            {/* Select Month & Year */}
                            <Col sm={12} md={6}>
                                <Form.Group controlId="formMonthYear" className="mb-3">
                                    <Form.Label>Select Month & Year</Form.Label>
                                    <Form.Control
                                        type="month"
                                        value={monthYear}
                                        onChange={(e) => setMonthYear(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* Title */}
                            <Col sm={12} md={6}>
                                <Form.Group controlId="formTitle" className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    >
                                        <option>Select Title</option>
                                        {rewardRecognitionData.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.event_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.title && <span className="text-danger">{formErrors.title}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={6}>
                                <Form.Group controlId="taskDepartment">
                                    <Form.Label>Select Department</Form.Label>
                                    <MultiSelect
                                        options={departments}
                                        value={taskDepartment}
                                        onChange={setTaskDepartment}
                                        labelledBy="Select Departments"
                                    />
                                    {formErrors.taskDepartment && (
                                        <span className="text-danger">{formErrors.taskDepartment}</span>
                                    )}
                                </Form.Group>
                            </Col>

                            <Col sm={12} md={6}>
                                <Form.Group controlId="taskTeam">
                                    <Form.Label>Select Team</Form.Label>
                                    <MultiSelect
                                        options={teams}
                                        value={taskTeam}
                                        onChange={setTaskTeam}
                                        labelledBy="Select Teams"
                                        isDisabled={!taskDepartment.length}
                                    />
                                    {formErrors.taskTeam && (
                                        <span className="text-danger">{formErrors.taskTeam}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm={12} md={6}>
                                <Form.Group controlId="assignedTo">
                                    <Form.Label>Select Member</Form.Label>
                                    <MultiSelect
                                        options={members}
                                        value={assignedTo}
                                        onChange={setAssignedTo}
                                        labelledBy="Select Members"
                                        isDisabled={!taskTeam.length}
                                    />
                                    {formErrors.assignedTo && (
                                        <span className="text-danger">{formErrors.assignedTo}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="justify-content-left mt-4">
                            <Col xs="auto">
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn ms-2'>
                                    Cancel
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* ------------------------------------------------------------------------------------------------ */}



                </Container>


            )}
        </>
    )
}

export default EditRewardsRecognition