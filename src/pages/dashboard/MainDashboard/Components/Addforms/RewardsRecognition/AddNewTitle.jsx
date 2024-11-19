import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ScaleLoader } from 'react-spinners';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faFolderOpen, faPen, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddNewTitle() {
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editnewtitle/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    const [title, setTitle] = useState('');
    const [attachment, setAttachment] = useState(null);
    const [templateAttachment, setTemplateAttachment] = useState(null);
    const [formErrors, setFormErrors] = useState({})


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("event_name", title);
        formData.append("image", attachment);  // File object
        formData.append("template_img", templateAttachment); 
        formData.append("user_emp_id", userempid);

        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/insert_reward_recognition_name',
                formData,
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
                setRefreshKey()
                handleCancel()
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

    const fileInputRef = React.useRef();
    const templateFileInputRef = React.useRef();


    const handleCancel = () => {
        setTitle('');
        setAttachment(null);
        setTemplateAttachment(null); 
        setFormErrors({});

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Reset the input field
        }
        if (templateFileInputRef.current) {
            templateFileInputRef.current.value = ''; // Reset the Template Attachment input field
        }
    };
    // -----------------------------------------------------------------------------------------------------
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
            const response = await fetch('https://office3i.com/development/api/public/api/get_reward_recognition_name', {
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
                text: 'You are about to delete this Department list. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_reward_recognition_name/1/2', {
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
            Swal.fire('Error', 'An error occurred while deleting the department list. Please try again later.', 'error');
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
        const csvData = tableData.map(({ depart_name, departmentsup_name, status, created_name, updated_name }, index) => ({
            '#': index + 1,
            depart_name,
            departmentsup_name,
            status,
            created_name,
            updated_name: updated_name || '-',
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Department name', key: 'depart_name' },
            { label: 'Supervisor name', key: 'departmentsup_name' },
            { label: 'Status', key: 'status' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'DepartmentList.csv',
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

        const data = tableData.map(({ depart_name, departmentsup_name, status, created_name, updated_name }, index) => [
            index + 1,
            depart_name,
            departmentsup_name,
            status,
            created_name,
            updated_name || '-',
        ]);

        doc.autoTable({
            head: [['S.No', 'Department name', 'Supervisor name', 'Status', 'Created By', 'Updated By']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('DepartmentList.pdf');

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add New Title</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Supervisor list slot add form */}

                    <div className='mb-5' style={{ background: '#ffffff', padding: '60px 10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)', margin: '2px' }}>
                        <Row className='mb-3'>
                            <Col sm={12} md={6}>
                                <Form.Group controlId="formTitle" className="mb-3">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={12} md={6}>
                                <Form.Group controlId="formAttachment" className="mb-3">
                                    <Form.Label>Attachment</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setAttachment(e.target.files[0])}
                                        required
                                        ref={fileInputRef}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col sm={12} md={6}>
                                <Form.Group controlId="formTemplateAttachment" className="mb-3">
                                    <Form.Label>Template Attachment</Form.Label>
                                    <Form.Control
                                        type="file"
                                        onChange={(e) => setTemplateAttachment(e.target.files[0])} // New state handler
                                        required
                                        ref={templateFileInputRef}
                                    />
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
                                    <th scope="col">Title Name</th>
                                    <th scope="col">Attachment</th>
                                    <th scope="col">Template</th>
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
                                                    <td>{row.event_name}</td>
                                                    <td>{row.image !== null ?
                                                        <button className="btn-view" onClick={() => { window.open(`https://office3i.com/development/api/storage/app/${row.image}`, '_blank') }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>

                                                        : <FontAwesomeIcon icon={faFolderOpen} />}
                                                    </td>
                                                    <td>{row.image !== null ?
                                                        <button className="btn-view" onClick={() => { window.open(`https://office3i.com/development/api/storage/app/${row.template}`, '_blank') }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>

                                                        : <FontAwesomeIcon icon={faFolderOpen} />}
                                                    </td>
                                                    <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
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

export default AddNewTitle