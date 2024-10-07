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


function OverTimeRequest() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';


    // ------------------------------------------------------------------------------------------------

    const handleStatusButtonClick = (row, status) => {
        // Update the row status locally (optional)
        row.status = status;


        // Create FormData object
        const formData = new FormData();
        formData.append('id', row.id);
        formData.append('e_id', row.e_id);
        formData.append('hr_id', userempid);



        formData.append('request_date', row.request_date);
        formData.append('request_fromtime', row.request_fromtime);
        formData.append('request_totime', row.request_totime);

        formData.append('hrstatus', status);
        formData.append('slot_id', row.sid);
        formData.append('totalhours', row.total_hrs);


        // Make API call

        console.log("formData", formData)

        fetch('https://office3i.com/user/api/public/api/approval_ot_request', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })


            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })



            .then(data => {

                // Check if the status is success
                if (data.status === 'success') {
                    // Update hrstatus and request_status locally without waiting for reload
                    row.hrstatus = status;
                    row.request_status = status; // Directly use 'status'

                    if (status === 'Approved') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'OverTime Request Successfully Approved',
                        });
                    } else if (status === 'Rejected') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Rejected',
                            text: 'OverTime Request Rejected',
                        });
                    }

                    // Increment refreshKey to force rerender
                    setRefreshKey(prevKey => prevKey + 1);

                } else {
                    // Handle other status scenarios if needed
                    console.error('OverTime Request Approval failed:', data.message);

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'OverTime Request Approval failed',
                    });
                }
            })


            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
                // Handle error

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was a problem with the fetch operation',
                });
            });
    };

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
            const response = await fetch('https://office3i.com/user/api/public/api/hr_ot_approvallist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    emp_id: userempid,
                    user_roleid: userrole,
                })
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
        const csvData = tableData.map(({ e_name, departmentName, request_type_name, request_location, shift_slot, request_date, request_fromtime, request_totime, total_hrs, request_reason, tl_reqeust_status, request_status }, index) => ({
            '#': index + 1,
            e_name,
            departmentName,
            request_type_name,
            request_location,
            shift_slot,
            request_date,
            request_fromtime,
            request_totime,
            total_hrs,
            request_reason,
            tl_reqeust_status,
            request_status
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Name', key: 'e_name' },
            { label: 'Department', key: 'departmentName' },
            { label: 'Type', key: 'request_type_name' },
            { label: 'Location', key: 'request_location' },
            { label: 'Shift Slot', key: 'shift_slot' },
            { label: 'Date', key: 'request_date' },
            { label: 'From Time', key: 'request_fromtime' },
            { label: 'To Time', key: 'request_totime' },
            { label: 'Total Hours', key: 'total_hrs' },
            { label: 'Reason', key: 'request_reason' },
            { label: 'TL Status', key: 'tl_reqeust_status' },
            { label: 'HR Status', key: 'request_status' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'OTrequest.csv',
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

        const data = tableData.map(({ e_name, departmentName, request_type_name, request_location, shift_slot, request_date, request_fromtime, request_totime, total_hrs, request_reason, tl_reqeust_status, request_status, }, index) => [
            index + 1,
            e_name,
            departmentName,
            request_type_name,
            request_location,
            shift_slot,
            request_date,
            request_fromtime,
            request_totime,
            total_hrs,
            request_reason,
            tl_reqeust_status,
            request_status
        ]);

        doc.autoTable({
            head: [['S.No', 'Name', 'Department', 'Type', 'Location', 'Shift Slot', 'Date', 'From Time', 'To Time', 'Total Hours', 'Reason', 'TL Status', 'HR Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('OTrequest.pdf');

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

    // REASON ELLIPSE METHOD MODEL

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>OverTime Request List</h3>



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
                                    <th>Department</th>
                                    <th>Type</th>
                                    <th>Location</th>
                                    <th>Shift Slot</th>
                                    <th>Date</th>
                                    <th>From Time</th>
                                    <th>To Time</th>
                                    <th>Total Hours</th>
                                    <th style={{ width: '200px' }}>Reason</th>
                                    <th>TL Status</th>
                                    <th>HR Status</th>

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
                                                <td>{row.e_name}</td>
                                                <td>{row.departmentName}</td>

                                                <td>{row.request_type_name}</td>
                                                <td>{row.request_location}</td>
                                                <td>{row.shift_slot}</td>
                                                <td>{row.request_date}</td>
                                                <td>{row.request_fromtime}</td>
                                                <td>{row.request_totime}</td>
                                                <td>{row.total_hrs}</td>

                                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'break-word', cursor: 'pointer', }}
                                                    onClick={() => handleOpenModal(row.request_reason)}
                                                >
                                                    {row.request_reason}
                                                </td>

                                                <td>{row.tl_reqeust_status || 'Pending'}</td>

                                                <td>
                                                    {row.request_status === 'Pending' ?
                                                        (userrole.includes('1') || userrole.includes('2') ?
                                                            <div style={{ display: 'flex' }}>
                                                                <button
                                                                    style={row.status === 'Approved' ? myStyles : myStyles1}
                                                                    onClick={() => handleStatusButtonClick(row, 'Approved')}
                                                                >
                                                                    <FaCheck color="green" size={24} />
                                                                </button>
                                                                <button
                                                                    style={row.status === 'Rejected' ? myStyles : myStyles1}
                                                                    onClick={() => handleStatusButtonClick(row, 'Rejected')}
                                                                >
                                                                    <FaTimes color="red" size={24} />
                                                                </button>
                                                            </div>
                                                            :
                                                            <p>{row.request_status}</p>
                                                        )
                                                        :
                                                        <p>{row.request_status}</p>
                                                    }
                                                </td>

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ---------------------------------------------------------------------------------------- */}
                    {/* ELLIPSE REASON MODEL */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Reason</Modal.Title>
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
                    {/* ---------------------------------------------------------------------------------------- */}


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

export default OverTimeRequest