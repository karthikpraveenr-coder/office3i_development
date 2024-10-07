import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap'; 
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
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';


function AddGoodsServices() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();


    const GoToEditPage = (id) => {
        navigate(`/admin/editgoodsservices/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Goods & Services submit

    const [goodservicesname, setGoodsServices] = useState('');
    const [hsn, setHsn] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const errors = {};
        // Validate input fields

        if (!goodservicesname) {
            errors.goodservicesname = 'Goods & Services Name is required.';
        }

        if (!hsn) {
            errors.hsn = 'HSN / SAC  is required.';
        }

        // if (!description) {
        //     errors.description = 'Description is required.';
        // }

        if (!status) {
            errors.status = 'Status is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {
            good_service_name: goodservicesname,
            hsn_sac: hsn,
            description: description || '-',
            status: status,
            created_by: userempid
        };

        axios.post('https://office3i.com/development/api/public/api/addgood_service', requestData, {
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

                    setGoodsServices('');
                    setHsn('');
                    setDescription('');
                    setStatus('');

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
                    text: 'There was an error creating the Goods & Services. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };

    const handleCancel = () => {
        setGoodsServices('');
        setHsn('');
        setDescription('');
        setStatus('');
        setFormErrors({});
    };
    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
    };
    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/view_goodservice', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                // console.log(responseData.data)
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
                text: 'You are about to delete this Goods & Services . This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_goodservice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        reason: reason,
                        updated_by: userempid
                    }),
                });

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Goods & Services  has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Goods & Services');
                }
            }
        } catch (error) {
            console.error('Error deleting Goods & Services:', error);
            Swal.fire('Error', 'An error occurred while deleting the Goods & Services. Please try again later.', 'error');
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
        const csvData = tableData.map(({ good_service_name, hsn_sac, description, status, created_name, updated_name }, index) => ({
            '#': index + 1,
            good_service_name,
            hsn_sac,
            description,
            status,
            created_name,
            updated_name: updated_name || '-',
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Goods & Services Name', key: 'good_service_name' },
            { label: 'HSN / SAC', key: 'hsn_sac' },
            { label: 'Description', key: 'description' },
            { label: 'Status', key: 'status' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Goods&ServicesList.csv',
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

        const data = tableData.map(({ good_service_name, hsn_sac, description, status, created_name, updated_name }, index) => [
            index + 1,
            good_service_name,
            hsn_sac,
            description,
            status,
            created_name,
            updated_name || '-',
        ]);

        doc.autoTable({
            head: [['S.No', 'Goods & Services Name', 'HSN / SAC', 'Description', 'Status', 'Created By', 'Updated By']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Goods&ServicesList.pdf');

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
                    {/* <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Goods & Services</h3> */}

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Emp Level Category  add form */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Goods & Services</h5>

                    <Row className='mb-5 shift__row'>
                        {/* First Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formGoodsName">
                                <Form.Label style={{ fontWeight: 'bold' }}>Goods & Services Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Goods & Services Name"
                                    value={goodservicesname}
                                    onChange={(e) => handleInputChange(setGoodsServices)(e)}
                                />
                            </Form.Group>
                            {formErrors.goodservicesname && <span className="text-danger">{formErrors.goodservicesname}</span>}
                        </Col>

                        {/* Second Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formHSN">
                                <Form.Label style={{ fontWeight: 'bold' }}>HSN / SAC</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter HSN / SAC"
                                    value={hsn}
                                    onChange={(e) => handleInputChange(setHsn)(e)}
                                />
                            </Form.Group>
                            {formErrors.hsn && <span className="text-danger">{formErrors.hsn}</span>}
                        </Col>

                        {/* Third Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formDescription">
                                <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3} // Adjusted row count for better visibility
                                    placeholder="Enter Description"
                                    value={description}
                                    onChange={(e) => handleInputChange(setDescription)(e)}
                                />
                            </Form.Group>
                            {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                        </Col>

                        {/* Fourth Column */}
                        <Col sm={6} className='mb-3'>
                            <Form.Group controlId="formStatus">
                                <Form.Label style={{ fontWeight: 'bold' }}>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => handleInputChange(setStatus)(e)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                            </Form.Group>
                            {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                        </Col>

                        <div className='mt-3 submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>
                    </Row>


                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}
                    <h5 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Goods & Services List</h5>
                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between' }}>
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

                    <div ref={componentRef}>

                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Goods & Services Name</th>
                                    <th scope="col">HSN / SAC</th>
                                    <th scope="col">Description</th>
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
                                                    <td>{row.good_service_name}</td>
                                                    <td>{row.hsn_sac}</td>
                                                    <td>{row.description}</td>
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

export default AddGoodsServices