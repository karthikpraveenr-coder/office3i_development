import React, { useState } from 'react'
import { Button, Container, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function CompanyList() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editcompanylist/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);


    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, [refreshKey]); // Ensure refreshKey is defined in parent and changes to trigger re-fetch

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/view_company_information', {
                method: 'GET', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log("setTableData", responseData.data)

                setLoading(false);
            } else {
                throw new Error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Company List. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_company_information', {
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

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Company List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Company List');
                }
            }
        } catch (error) {
            console.error('Error deleting Company List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Company List. Please try again later.', 'error');
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
        const csvData = tableData.map(({ company_name, mailing_name, gstin_uin, status, created_name, updated_name }, index) => ({
            '#': index + 1,
            company_name,
            mailing_name,
            gstin_uin,
            status,
            created_name,
            updated_name: updated_name || '-'


        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Company Name', key: 'company_name' },
            { label: 'Mailling Name', key: 'mailing_name' },
            { label: 'GSTIN / UIN', key: 'gstin_uin' },
            { label: 'Status', key: 'status' },
            { label: 'Updated By', key: 'updated_name' || '-' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'CompanyList.csv',
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

        const data = tableData.map(({ company_name, mailing_name, gstin_uin, status, created_name, updated_name }, index) => [
            index + 1,
            company_name,
            mailing_name,
            gstin_uin,
            status,
            created_name,
            updated_name || '-'

        ]);

        doc.autoTable({
            head: [['S.No', 'Company Name', 'Mailling Name', 'GSTIN / UIN', 'Status', 'Created By', 'Updated By']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
            // columnStyles: {
            //     0: { halign: 'center', cellWidth: 40 }, // S.No column
            //     1: { cellWidth: 80 }, // Project Name column
            //     2: { cellWidth: 70 }, // Project Type column
            //     3: { cellWidth: 70 }, // Category column
            //     4: { cellWidth: 70 }, // Work Type column
            //     5: { cellWidth: 100 }, // Client Company column
            //     6: { cellWidth: 70 }, // Department column
            //     7: { cellWidth: 70 }, // Members column
            //     8: { cellWidth: 60 }, // From Date column
            //     9: { cellWidth: 60 }, // To Date column
            //     10: { cellWidth: 60 }, // Status column
            // },

        });

        doc.save('CompanyList.pdf');

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

    // const Projecttype = {
    //     maxWidth: '200px',
    //     overflow: 'hidden',
    //     textOverflow: 'ellipsis',
    //     whiteSpace: 'nowrap',
    //     wordBreak: 'break-word',
    //     cursor: 'pointer',
    // };

    // const [showModal, setShowModal] = useState(false);
    // const [modalContent, setModalContent] = useState('');

    // const handleOpenModal = (content) => {
    //     setModalContent(content);
    //     setShowModal(true);
    // };

    // const handleCloseModal = () => {
    //     setShowModal(false);
    //     setModalContent('');
    // };




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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Company List</h3>



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
                                    <th>Company Name</th>
                                    <th>Mailling Name</th>
                                    <th>GSTIN / UIN</th>
                                    <th>Status</th>
                                    <th>Created By</th>
                                    <th>Updated By</th>
                                    <th className='no-print'>Action</th>


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
                                                <td>{row.company_name}</td>
                                                <td>{row.mailing_name}</td>
                                                <td>{row.gstin_uin}</td>
                                                <td>{row.status}</td>
                                                <td>{row.created_name}</td>
                                                <td>{row.updated_name ? row.updated_name : '-'}</td>
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

                    {/* <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Project Type</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ wordBreak: 'break-word' }}>
                            {modalContent}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal> */}



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

export default CompanyList