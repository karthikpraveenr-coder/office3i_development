import React, { useState } from 'react'
import { Button, Container, Modal } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2'; 
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


function PresalesLeadEnquiryList() {
 

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editcustomerenquirylist/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';




    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/contact_EnquiryList', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("setTableData", responseData.data);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------------------------------





    // ========================================
    // pagination, search, print state

    const itemsPerPage = 20;
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
        const csvData = tableData.map(({ first_name, email, company_name, mobile_number,description,product_plan,enq_type,status_name,created_name,updated_name }, index) => ({
            '#': index + 1,
            first_name,
            email,
            company_name,
            mobile_number,
            description,
            product_plan,
            enq_type,
            status_name,
            created_name,
            updated_name,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'First Name', key: 'first_name' },
            { label: 'Email', key: 'email' },
            { label: 'Company Name', key: 'company_name' },
            { label: 'Mobile Number', key: 'mobile_number' },
            { label: 'Description', key: 'description' },
            { label: 'Product plan', key: 'product_plan' },
            { label: 'Enq type', key: 'enq_type' },
            { label: 'Status', key: 'status_name' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'EnquiryList.csv',
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

        const data = tableData.map(({ first_name, email, company_name, mobile_number,description,product_plan,enq_type,status_name,created_name,updated_name }, index) => [
            index + 1,
            first_name,
            email,
            company_name,
            mobile_number,
            description,
            product_plan,
            enq_type,
            status_name,
            created_name,
            updated_name,
        ]);

        doc.autoTable({
            head: [['S.No', 'First Name', 'Email', 'Company Name', 'Mobile Number', 'Description','Product plan','Enq type', 'Status', 'Created By', 'Updated By']],
            body: data,
            // styles: { fontSize: 10 }, // Optionally set font size
            // columnStyles: {
            //     0: { cellWidth: 50 }, // S.No
            //     1: { cellWidth: 100 }, // Activity Done By
            //     2: { cellWidth: 350 }, // Message
            //     3: { cellWidth: 175 }, // Created At
            //     4: { cellWidth: 200 }, // Updated At
            // },
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('EnquiryList.pdf');

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
    const Projecttype = {
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordBreak: 'break-word',
        cursor: 'pointer',
    };

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleOpenModal = (content) => {
        setModalContent(content);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent('');
    };




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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Enquiry List</h3>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

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

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Company Name</th>
                                    <th>Mobile Number</th>
                                    <th style={{ width: '300px' }}>Description</th>
                                    <th>Product Plan</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Created By</th>
                                    <th>Updated By</th>
                                    <th>Action</th>


                                </tr>
                            </thead>

                            <tbody>
                                {filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (
                                    filteredleaveData.map((row, index) => {
                                        const serialNumber = currentPage * itemsPerPage + index + 1;
                                        return (
                                            <tr key={row.id}>
                                                <td>{serialNumber}</td>
                                                <td>{row.first_name}</td>
                                                <td>{row.email}</td>

                                                <td>{row.company_name}</td>
                                                <td>{row.mobile_number}</td>
                                                {/* <td>{row.description}</td> */}
                                                <td style={Projecttype} onClick={() => handleOpenModal(row.description)}>{row.description}</td>
                                                <td>{row.product_plan}</td>
                                                <td>{row.enq_type}</td>
                                                <td>{row.status_name}</td>
                                                <td>{row.created_name}</td>
                                                <td>{row.updated_name}</td>
                                                <td>

                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }} disabled={row.status_name == 'Completed'}
                                                    style={{background: row.status_name == 'Completed' ?'grey':'',borderColor: row.status_name == 'Completed' ?'grey':'',cursor: row.status_name == 'Completed' ?'no-drop':'' }}
                                                    >
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

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Description</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ wordBreak: 'break-word' }}>
                            {modalContent}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>



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

export default PresalesLeadEnquiryList