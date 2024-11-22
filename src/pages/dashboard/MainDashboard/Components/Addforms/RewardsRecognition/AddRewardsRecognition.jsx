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
import { useNavigate } from 'react-router-dom';
import { FaStarOfLife } from 'react-icons/fa';
import Select from 'react-select';
import { MultiSelect } from 'react-multi-select-component';

function AddRewardsRecognition() {
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editrewardsrecognition/${id}`);
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the selections are empty or not in array format
        if (!Array.isArray(selectedDepartment) || selectedDepartment.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select the department as an array.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!Array.isArray(selectedTeam) || selectedTeam.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select the teams as an array.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (!Array.isArray(selectedMember) || selectedMember.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select the members as an array.',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Extract selected IDs and keep them in array format
        const selectedDepartmentIds = selectedDepartment.map((dept) => dept.value);
        const selectedTeamIds = selectedTeam.map((team) => team.value);
        const selectedMemberIds = selectedMember.map((member) => member.value);

        // Prepare payload in JSON format
        const payload = {
            month: monthYear,  // Assuming `monthYear` is the month in the format "YYYY-MM"
            title_id: title,   // Assuming `title` is the title ID
            departments: selectedDepartmentIds,  // Array of selected department IDs
            teams: selectedTeamIds,  // Array of selected team IDs
            members: selectedMemberIds,  // Array of selected member IDs
            user_emp_id: userempid  // Assuming `userempid` is the user employee ID
        };

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/insert_reward_recognition_list',
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
                setRefreshKey();
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
                }
            })
            .catch((error) => {
                console.error('Error fetching reward recognition data:', error);
            });
    }, []);

    // ---------------------------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------
    // State variables for dropdown options (globally)
    const [departmentOptions, setDepartmentOptions] = useState([]); // For departments dropdown
    const [teamOptions, setTeamOptions] = useState([]); // For teams dropdown
    const [memberOptions, setMemberOptions] = useState([]); // For members dropdown


    // State variables for selected dropdown values
    const [selectedDepartment, setSelectedDepartment] = useState([]); // For selected departments
    const [selectedTeam, setSelectedTeam] = useState([]); // For selected teams
    const [selectedMember, setSelectedMember] = useState([]); // For selected members



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
                setDepartmentOptions(formattedDepartments);
            })
            .catch((error) => console.error("Error fetching departments:", error));
    }, [usertoken]);

    // Fetch teams based on selected departments
    useEffect(() => {
        if (selectedDepartment.length) {
            const selectedIds = selectedDepartment.map((dept) => dept.value).join(",");
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
                    setTeamOptions(formattedTeams);
                })
                .catch((error) => console.error("Error fetching teams:", error));
        } else {
            setTeamOptions([]); // Reset teams if no department is selected
        }
    }, [selectedDepartment, usertoken]);

    // Fetch members based on selected teams
    useEffect(() => {
        if (selectedTeam.length) {
            const selectedIds = selectedTeam.map((team) => team.value).join(",");
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
                    setMemberOptions(formattedMembers);
                })
                .catch((error) => console.error("Error fetching members:", error));
        } else {
            setMemberOptions([]); // Reset members if no team is selected
        }
    }, [selectedTeam, usertoken]);

    // ---------------------------------------------------------------------------------------------------------------



    // -----------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/get_reward_recognition_list', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data); // Access skill_dev_list from responseData
                console.log("responseData.skill_dev_list", responseData.data);
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // -----------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Rewards and Recognition list. This action cannot be reversed.',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter reason for deletion',
                inputAttributes: {
                    maxLength: 100, // Limit input to 100 characters
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Reason is required for deletion.');
                    }
                    return value;
                }
            });

            if (reason) {
                const response = await fetch('https://office3i.com/development/api/public/api/delete_reward_recognition_list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        updated_by: userempid,
                        reason: reason,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.status === "success") {
                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', data.message, 'success');
                } else {
                    Swal.fire('Error', data.message, 'error');
                }
            }
        } catch (error) {
            console.error('Error deleting  department:', error);
            Swal.fire('Error', 'An error occurred while deleting the Rewards and Recognition list. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------

    // -----------------------------------------------------------------------------------------------------

    // ========================================
    // pagination, search, print state

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();



    // ========================================
    // print start

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================


    // ========================================
    // CSV start


    const handleExportCSV = () => {
        const csvData = tableData.map(({ title_name }, index) => ({
            '#': index + 1,
            title_name,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Title Name', key: 'title_name' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'RewardsRecognition.csv',
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // You can change to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);

        const data = tableData.map(({ title_name }, index) => [
            index + 1,
            title_name
        ]);

        doc.autoTable({
            head: [['S.No', 'Title Name']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('RewardsRecognition.pdf');

    };

    // PDF End
    // ========================================

    // ========================================
    // Fillter start

    const filteredData = tableData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fillter End
    // ========================================

    const filteredleaveData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // ============================================

    const myStyles = {
        color: 'white',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',
        borderRadius: '21px',
        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    const myStyles1 = {
        color: '#0d6efd',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',

        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    // ===============================================

    return (
        <>
            <style>
                {`
@media print {
.no-print {
display: none !important;
}
}
`}
            </style>

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Rewards & Recognition</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Supervisor list slot add form */}

                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                        <Row className='mb-3'>
                            <Col>
                                <Button onClick={GoToaddnewtitlePage}><FontAwesomeIcon icon={faPlus} /> Add New Title</Button>
                            </Col>
                        </Row>
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
                                        options={departmentOptions}
                                        value={selectedDepartment}
                                        onChange={setSelectedDepartment}
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
                                        options={teamOptions}
                                        value={selectedTeam}
                                        onChange={setSelectedTeam}
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
                                        options={memberOptions}
                                        value={selectedMember}
                                        onChange={setSelectedMember}
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


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap: 'wrap', gap: '17px' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={myStyles1}
                            />
                        </div>
                        <div>
                            <button style={myStyles}>{handleExportCSV()}</button>
                            <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                            <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                        </div>
                    </div>

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>

                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Title</th>
                                    <th scope="col" className='no-print'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredleaveData.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center' }}>No search data found</td>
                                        </tr>
                                    ) : (


                                        filteredleaveData.map((row, index) => {

                                            const serialNumber = currentPage * itemsPerPage + index + 1;

                                            return (
                                                <tr key={row.id}>
                                                    <th scope="row">{serialNumber}</th>
                                                    <td>{row.title_name}</td>


                                                    <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )}
                            </tbody>
                        </table>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <ReactPaginate
                            previousLabel={<span aria-hidden="true">&laquo;</span>}
                            nextLabel={<span aria-hidden="true">&raquo;</span>}
                            breakLabel={<span>...</span>}
                            breakClassName={'page-item disabled'}
                            breakLinkClassName={'page-link'}
                            pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            disabledClassName={'disabled'}
                            activeLinkClassName={'bg-dark text-white'}
                        />
                    </div>

                    {/* ------------------------------------------------------------------------------------------------ */}


                </Container>


            )}
        </>
    )
}

export default AddRewardsRecognition