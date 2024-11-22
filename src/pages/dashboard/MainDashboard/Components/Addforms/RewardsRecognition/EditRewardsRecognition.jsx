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


    const handleUpdate = async (e) => {
        e.preventDefault();


        // Convert selected IDs to integer arrays
        const selectedDepartmentIds = selectedDepartment.map(Number);
        const selectedTeamIds = selectedTeam.map(Number);
        const selectedMemberIds = selectedMember.map(Number);

        // Prepare payload in JSON format
        const payload = {
            id: id,
            month: monthYear,  // Assuming `monthYear` is the month in the format "YYYY-MM"
            title_id: title,   // Assuming `title` is the title ID
            departments: selectedDepartmentIds,  // Array of selected department IDs
            teams: selectedTeamIds,  // Array of selected team IDs
            members: selectedMemberIds,  // Array of selected member IDs
            user_emp_id: userempid  // Assuming `userempid` is the user employee ID
        };

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/update_reward_recognition_list',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`,
                    },
                }
            );

            if (response.data.status === "success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.message,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else if (response.data.status === "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Try Again'
                });
            }
        } catch (error) {
            console.error("Error submitting form", error);
            Swal.fire({
                icon: 'error',
                title: 'Unexpected Error',
                text: 'An unexpected error occurred. Please try again.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };



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
                setTitle(RewardsData.title);

                // Parse departments, teams, and members as arrays
                const departmentIds = RewardsData.departments.split(',');
                const teamIds = RewardsData.teams.split(',');
                const memberIds = RewardsData.members.split(',');


                // Set selected values correctly
                setSelectedDepartment(departmentIds);
                setSelectedTeam(teamIds);
                setSelectedMember(memberIds);
                // ------------------------------------


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
    // Dropdown state variables
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [teamOptions, setTeamOptions] = useState([]);
    const [memberOptions, setMemberOptions] = useState([]);

    // Selected dropdown values
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState([]);
    const [selectedMember, setSelectedMember] = useState([]);

    // Fetch departments
    useEffect(() => {
        axios
            .get("https://office3i.com/development/api/public/api/department_drop_down", {
                headers: { Authorization: `Bearer ${usertoken}` },
            })
            .then((response) => {
                const data = response.data.data || [];
                const formattedDepartments = data.map((department) => ({
                    label: department.depart_name,
                    value: String(department.id),
                }));
                setDepartmentOptions(formattedDepartments);
            })
            .catch((error) => console.error("Error fetching departments:", error));
    }, [usertoken]);

    // Fetch teams based on selected departments
    useEffect(() => {
        if (selectedDepartment.length) {
            const selectedIds = selectedDepartment.join(",");
            axios
                .get(`https://office3i.com/development/api/public/api/teams_drop_down/${selectedIds}`, {
                    headers: { Authorization: `Bearer ${usertoken}` },
                })
                .then((response) => {
                    const data = response.data.data || [];
                    const formattedTeams = data.map((team) => ({
                        label: team.role_name,
                        value: String(team.id),
                    }));
                    setTeamOptions(formattedTeams);
                })
                .catch((error) => console.error("Error fetching teams:", error));
        } else {
            setTeamOptions([]);
        }
    }, [selectedDepartment, usertoken]);

    // Fetch members based on selected teams
    useEffect(() => {
        if (selectedTeam.length) {
            const selectedIds = selectedTeam.join(",");
            axios
                .get(`https://office3i.com/development/api/public/api/member_drop_down/${selectedIds}`, {
                    headers: { Authorization: `Bearer ${usertoken}` },
                })
                .then((response) => {
                    const data = response.data.data || [];
                    const formattedMembers = data.map((member) => ({
                        label: member.emp_name,
                        value: String(member.emp_id),
                    }));
                    setMemberOptions(formattedMembers);
                })
                .catch((error) => console.error("Error fetching members:", error));
        } else {
            setMemberOptions([]);
        }
    }, [selectedTeam, usertoken]);

    // ---------------------------------------------------------------------------------------------------------------
    const formattedDepartmentDropdown = departmentOptions.map(employee => ({
        label: employee.label,
        value: employee.value
    }));

    const handleSelectDepartmentChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedDepartment(selectedIds);
    };

    const formattedTeamDropdown = teamOptions.map(employee => ({
        label: employee.label,
        value: employee.value
    }));

    const handleSelectTeamChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedTeam(selectedIds);
    };

    const formattedMemberDropdown = memberOptions.map(employee => ({
        label: employee.label,
        value: employee.value
    }));

    const handleSelectMemberChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedMember(selectedIds);
    };


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
                                        options={formattedDepartmentDropdown}
                                        value={formattedDepartmentDropdown.filter(option => selectedDepartment.includes(String(option.value)))}
                                        onChange={handleSelectDepartmentChange}
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
                                        options={formattedTeamDropdown}
                                        value={formattedTeamDropdown.filter(option => selectedTeam.includes(String(option.value)))}
                                        onChange={handleSelectTeamChange}
                                        labelledBy="Select Teams"
                                        isDisabled={!selectedDepartment.length}
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
                                        options={formattedMemberDropdown}
                                        value={formattedMemberDropdown.filter(option => selectedMember.includes(String(option.value)))}
                                        onChange={handleSelectMemberChange}
                                        labelledBy="Select Members"
                                        isDisabled={!selectedTeam.length}
                                    />
                                    {formErrors.assignedTo && (
                                        <span className="text-danger">{formErrors.assignedTo}</span>
                                    )}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="justify-content-left mt-4">
                            <Col xs="auto">
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleUpdate}>
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