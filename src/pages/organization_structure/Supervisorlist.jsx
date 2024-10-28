import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import '../leave_attendance_policy/css/addshiftslotstyle.css';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';


function Supervisorlist() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editsupervisorlist/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit

    const [department, setDepartment] = useState([]);
    const [maindepartment, setMainDepartment] = useState([]);
    console.log("department", department)
    const [supervisorOptions, setSupervisorOptions] = useState([]);

    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedMainDepartment, setSelectedMainDepartment] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('');
    const [initialData, setInitialData] = useState({ department: [], supervisorOptions: [] });
    const [status, setStatus] = useState('');




    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/supervisor_userrole', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { data } = response.data;
                console.log("department and supervisor options", response.data);

                if (Array.isArray(data)) {
                    setDepartment(data);
                    setSupervisorOptions(data);
                    setInitialData({ department: data, supervisorOptions: data });
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(error => {
                console.error('Error fetching department and supervisor options:', error);
            });
    }, [usertoken]);

    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/department_list', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { data } = response.data;
                console.log("department and supervisor options", response.data);

                if (Array.isArray(data)) {
                    setMainDepartment(data);
                } else {
                    console.error("Unexpected data format:", data);
                }
            })
            .catch(error => {
                console.error('Error fetching department and supervisor options:', error);
            });
    }, [usertoken]);


    const [formErrors, setFormErrors] = useState({})

    const handleSubmit = (e) => {
        e.preventDefault();


        const errors = {};


        // Validate shift slot
        if (!selectedDepartment) {
            errors.selectedDepartment = 'Role Name is required';
        }
        if (!selectedMainDepartment) {
            errors.selectedMainDepartment = 'Department is required';
        }

        if (!selectedSupervisor) {
            errors.selectedSupervisor = 'Supervisor is required';
        }
        if (!status) {
            errors.status = 'Status is required';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear form errors if there are no errors
        setFormErrors({});

        const requestData = {
            departmentrole_id: selectedDepartment,
            supervisor_id: selectedSupervisor,
            depart_id: selectedMainDepartment,
            created_by: userempid,
            status: status
        };



        axios.post('https://office3i.com/development/api/public/api/addsupervisor', requestData, {
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

                    setSelectedDepartment('');
                    setSelectedSupervisor('');
                    setSelectedMainDepartment('');
                    setStatus('');
                    setDepartment(initialData.department);
                    setSupervisorOptions(initialData.supervisorOptions);
                    // Increment the refreshKey to trigger re-render
                    setRefreshKey(prevKey => prevKey + 1);

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
                    text: 'There was an error creating the Supervisor List. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };

    const handleCancel = () => {
        setSelectedDepartment('');
        setSelectedSupervisor('');
        setSelectedMainDepartment('');
        setStatus('');
        setDepartment(initialData.department);
        setSupervisorOptions(initialData.supervisorOptions);
        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/view_supervisor', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log(responseData.data)
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this supervisor list. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_supervisor', {
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
            console.error('Error deleting shift slot:', error);
            Swal.fire('Error', 'An error occurred while deleting the supervisor list. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ========================================
    // pagination, search, print state

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();

    // loading state
    const [loading, setLoading] = useState(true);

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
        const csvData = tableData.map(({ departlist_name, department_name, supervisor_name, status, created_name, updated_name }, index) => ({
            '#': index + 1,
            departlist_name,
            department_name,
            supervisor_name,
            status,
            created_name,
            updated_name: updated_name || '-',
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Department name', key: 'departlist_name' },
            { label: 'Role name', key: 'department_name' },
            { label: 'Supervisor Role name', key: 'supervisor_name' },
            { label: 'Status', key: 'status' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'SupervisorList.csv',
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

        const data = tableData.map(({ departlist_name, department_name, supervisor_name, status, created_name, updated_name }, index) => [
            index + 1,
            departlist_name,
            department_name,
            supervisor_name,
            status,
            created_name,
            updated_name || '-',
        ]);

        doc.autoTable({
            head: [['S.No', 'Department name', 'Role Name', 'Supervisor name', 'Status', 'Created By', 'Updated By']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('SupervisorList.pdf');

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

    const handleDepartmentChange = (e) => {
        const selectedDepartmentId = e.target.value;
        console.log("selectedDepartmentId", selectedDepartmentId)
        setSelectedDepartment(selectedDepartmentId);

        // Filter supervisor options based on selected department
        const filteredSupervisors = department.filter(option => option.id !== parseInt(selectedDepartmentId));
        setSupervisorOptions(filteredSupervisors);
        setSelectedSupervisor('');
    };

    const handleMainDepartmentChange = (e) => {
        const selectedMainDepartmentId = e.target.value;
        setSelectedMainDepartment(selectedMainDepartmentId);


    };

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Supervisor List</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Supervisor list slot add form */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Supervisor</h5>
                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                        <Row className='mb-2 '>
                            <Col>
                                <Form.Group controlId="formDepartmentName">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Department Name</Form.Label>
                                    <Form.Select
                                        name="selectedMainDepartment"
                                        value={selectedMainDepartment}
                                        onChange={handleMainDepartmentChange}
                                    >
                                        <option value="">Select Department</option>
                                        {Array.isArray(maindepartment) && maindepartment.map(option => (
                                            <option key={option.id} value={option.id}>{option.depart_name}</option>
                                        ))}
                                    </Form.Select>
                                    {formErrors.selectedMainDepartment && <span className="text-danger">{formErrors.selectedMainDepartment}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formDepartmentName">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Role Name</Form.Label>
                                    <Form.Select
                                        name="selectedRole"
                                        value={selectedDepartment}
                                        onChange={handleDepartmentChange}
                                    >
                                        <option value="">Select Role</option>
                                        {Array.isArray(department) && department.map(option => (
                                            <option key={option.id} value={option.id}>{option.role_name}</option>
                                        ))}
                                    </Form.Select>
                                    {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row className='mb-2 '>
                            <Col>
                                <Form.Group controlId="formSupervisorName">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Supervisor Role Name</Form.Label>
                                    <Form.Control as="select" value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)} disabled={!selectedDepartment}>
                                        <option value="">Select Supervisor</option>
                                        {Array.isArray(supervisorOptions) && supervisorOptions.map(option => (
                                            <option key={option.id} value={option.id}>{option.role_name}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.selectedSupervisor && <span className="text-danger">{formErrors.selectedSupervisor}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formStatus">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                                    <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="">Select Status</option>
                                        <option value="Active">Active</option>
                                        <option value="In-Active">In-Active</option>
                                    </Form.Control>
                                    {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <div className='submit__cancel'>
                                <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                    Cancel
                                </Button>
                            </div>
                        </Row>
                    </div>
                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Supervisor List</h5>
                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
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
                                    <th scope="col">Department Name</th>
                                    <th scope="col">Role Name</th>
                                    <th scope="col">Supervisor Role Name</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created By</th>
                                    <th scope="col">Updated By</th>
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
                                                    <td>{row.departlist_name}</td>
                                                    <td>{row.department_name}</td>
                                                    <td>{row.supervisor_name}</td>
                                                    <td>{row.status}</td>
                                                    <td>{row.created_name}</td>
                                                    <td>{row.updated_name || '-'}</td>
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

export default Supervisorlist