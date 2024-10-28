import React, { useRef, useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './css/Templatestyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';


function Templates() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/edittemplate/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------
    // Add Shift Slot submit

    const [title, setTitle] = useState('');
    const [status, setStatus] = useState('');
    const [file, setFile] = useState(null);

    const [refreshKey, setRefreshKey] = useState(0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        if (!title) {
            errors.title = 'Title is required.';
        }
        if (!status) {
            errors.status = 'Status is required.';
        }
        if (!file) {
            errors.file = 'File is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});


        const formData = new FormData();
        formData.append('created_by', userempid);
        formData.append('status', status);
        formData.append('title', title);
        if (file) {
            formData.append('template_file', file);
        }

        axios.post('https://office3i.com/development/api/public/api/hr_addtemplates', formData, {
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
                    text: 'There was an error creating the shift slot. Please try again later.',
                });
                console.error('There was an error with the API:', error);
            });
    };

    const fileInputRef = useRef(null);

    const handleCancel = () => {
        setTitle('')
        setStatus('')
        setFile(null)
        setFormErrors({});

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);


    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        const formdata = {
            user_roleid: userrole,
            emp_id: userempid
        };

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/hr_templatelist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(formdata)
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log(responseData.data);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Company Policy. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/hr_template_delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`, // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        updated_by: userempid, // Assuming userempid is defined somewhere
                        reason: reason,
                    }),
                });
    
                if (response.ok || response.redirected) {
                    setTableData(prevData => prevData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Company Policy has been deleted.', 'success');
                } else {
                    throw new Error('Failed to delete Company Policy');
                }
            }
        } catch (error) {
            console.error('Error deleting Company Policy:', error);
            Swal.fire('Error', 'An error occurred while deleting the Company Policy. Please try again later.', 'error');
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
        const csvData = tableData.map(({ title, status }, index) => ({
            '#': index + 1,
            title,
            status,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Title', key: 'title' },
            { label: 'Status', key: 'status' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Company Policy.csv',
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

        const data = tableData.map(({ title, status }, index) => [
            index + 1,
            title,
            status,

        ]);

        doc.autoTable({
            head: [['S.No', 'Title', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Company Policy.pdf');

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

    const handleDownload = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Company Policy</h3>


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {(userrole.includes('1') || userrole.includes('2')) && (
                        <>
                            <h5 className='mb-2'>Add Company Policy</h5>
                            {/* shift slot add form */}
                            <div className='mb-5' style={{
                                background: '#ffffff',
                                padding: '60px 40px',
                                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
                                margin: '2px'
                            }}>
                                <Row className='mb-3'>
                                    {/* Title Input Field */}
                                    <Col>
                                        <Form.Group controlId="formTitle">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Title</Form.Label>
                                            <Form.Control type="text" placeholder="Enter title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                            {formErrors.title && <span className="text-danger">{formErrors.title}</span>}
                                        </Form.Group>
                                    </Col>

                                    {/* Status Selection Dropdown */}
                                    <Col>
                                        <Form.Group controlId="formStatus">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                                            <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="" disabled>Select Status</option>
                                                <option value="Active">Active</option>
                                                <option value="In-Active">In-Active</option>
                                            </Form.Control>
                                            {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    {/* File Upload Input */}
                                    <Col sm={6} md={6} lg={6} xl={6}>
                                        <Form.Group controlId="formFile">
                                            <Form.Label style={{ fontWeight: 'bold' }}>Upload File</Form.Label>
                                            <Form.Control type="file" onChange={handleFileChange} ref={fileInputRef} />
                                            {formErrors.file && <span className="text-danger">{formErrors.file}</span>}
                                        </Form.Group>
                                    </Col>


                                    {/* Action Buttons */}
                                    <div className='mt-3 submit__cancel'>
                                        <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                            Submit
                                        </Button>
                                        <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                            Cancel
                                        </Button>
                                    </div>
                                </Row>
                            </div>
                        </>
                    )}

                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

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
                                    <th scope="col">Title</th>

                                    <th scope="col">Status</th>
                                    {/* <th scope="col"  style={{ width: '20%' }}>File</th> */}
                                    <th scope="col" style={{ width: '50%' }} className="no-print">Action</th>
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
                                                    <td>{row.title}</td>
                                                    <td>{row.status}</td>
                                                    {/* <td><img src={`https://office3i.com/development/api/storage/app/${row.template_file}`} alt='template-image' style={{ width: '30%' }} /></td> */}

                                                    <td style={{ display: 'flex', gap: '10px' }} className="no-print">

                                                        <button className="btn-view" onClick={() => { window.open(`https://office3i.com/development/api/storage/app/${row.template_file}`, '_blank') }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>


                                                        <button
                                                            className="btn-download"
                                                            onClick={() => handleDownload(`https://office3i.com/development/api/storage/app/${row.template_file}`, row.template_file.split('/').pop())}
                                                        >
                                                            <FontAwesomeIcon icon={faDownload} /> Download
                                                        </button>

                                                        {(userrole.includes('1') || userrole.includes('2')) && (
                                                            <>
                                                                <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                                    <FontAwesomeIcon icon={faPen} /> Edit
                                                                </button>

                                                                <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                                    <FontAwesomeIcon icon={faTrashCan} /> Delete
                                                                </button>
                                                            </>

                                                        )}
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

export default Templates