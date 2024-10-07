import React, { useState } from 'react'
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
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
import api from '../../api';



function EditAnnouncement() {


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // announcement popup

    const [announcementModel, setAnnouncementModel] = useState(false);
    const handleCloseannouncement = () => setAnnouncementModel(false);
    const handleShowannouncement = () => setAnnouncementModel(true);

    // State variables for announcement form inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [formErrors, setFormErrors] = useState({});

    const handleDateChange = (e) => {
        const inputDate = e.target.value;
        const yearPart = inputDate.split('-')[0];

        if (yearPart.length > 4) {
            return; // Prevent input if year part is longer than 4 characters
        }

        setDate(inputDate);
    };
    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [announcementlist, setAnnouncementlist] = useState([]);
    // To approve or Reject Request
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

  

    const fetchData = async () => {
        try {
            const response = await axios.get('https://office3i.com/development/api/public/api/view_announcement', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            setAnnouncementlist(response.data.data);
            console.log("view_announcement", response.data.data);
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
                text: 'You are about to delete this announcement. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_announcement', {
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

                    setAnnouncementlist(announcementlist.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Announcement has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting announcement');
                }
            }
        } catch (error) {
            console.error('Error deleting announcement:', error);
            Swal.fire('Error', 'An error occurred while deleting the announcement. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // edit shift

    const [data, setData] = useState([]);


    const handleedit = async (id) => {
        handleShowannouncement();
        axios.get(`https://office3i.com/development/api/public/api/editview_announcement/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setData(res.data.data);
                    setTitle(res.data.data.a_title);
                    setDescription(res.data.data.a_description);
                    setDate(res.data.data.a_validdate)
                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------




    const handleSave = (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!title) {
            errors.title = 'Title is required.';
        }

        if (!description) {
            errors.description = 'Description is required.';
        }

        if (!date) {
            errors.date = 'Date is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const requestData = {

            id: data.id,
            validdate: date,
            title: title,
            description: description,
            updated_by: userempid

        };


        axios.put(`https://office3i.com/development/api/public/api/update_announcement`, requestData, {
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
                    handleCloseannouncement()
                    // Increment the refreshKey to trigger re-render
                    setRefreshKey(prevKey => prevKey + 1);
                } else if (status === 'error') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: message,
                    });
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error updating the announcement. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };


    const handleInputChange = (setter) => (e) => {
        let value = e.target.value;
        if (value.startsWith(' ')) {
            value = value.trimStart();
        }
        setter(value);
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
        const csvData = announcementlist.map(({ a_title, a_description, a_validdate, created_name, status, updated_name }, index) => ({
            '#': index + 1,
            a_title,
            a_description,
            a_validdate,
            created_name,
            status,
            updated_name: updated_name || '-',
        }));

        const headers = [
            { label: 'S.NO', key: 'S.NO' },
            { label: 'Title', key: 'a_title' },
            { label: 'Description', key: 'a_description' },
            { label: 'Date', key: 'a_validdate' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Status', key: 'status' },
            { label: 'Updated By', key: 'updated_name' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'announcement.csv',
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

        const data = announcementlist.map(({ a_title, a_description, a_validdate, created_name, status, updated_name }, index) => [
            index + 1,
            a_title,
            a_description,
            a_validdate,
            created_name,
            status,
            updated_name || '-',
        ]);

        const columnWidthPercentages = [5, 20, 25, 10, 10, 10, 10]; // Ensure these add up to 100%
        const pageWidth = doc.internal.pageSize.width;

        const columnWidths = columnWidthPercentages.map(percentage => (pageWidth * percentage) / 100);

        doc.autoTable({
            head: [['S.No', 'Title', 'Description', 'Date', 'Created By', 'Status', 'Updated By']],
            body: data,
            columnStyles: {
                0: { columnWidth: columnWidths[0] },
                1: { columnWidth: columnWidths[1] },
                2: { columnWidth: columnWidths[2] },
                3: { columnWidth: columnWidths[3] },
                4: { columnWidth: columnWidths[4] },
                5: { columnWidth: columnWidths[5] },
                6: { columnWidth: columnWidths[6] }
            },
        });

        doc.save('announcement.pdf');
    };


    // PDF End
    // ========================================

    // ========================================
    // Fillter start

    const filteredData = announcementlist.filter((row) =>
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
                    <h3 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>View Announcement</h3>
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

                    <div ref={componentRef} className="table-responsive">

                        <table className="table">
                            <thead className="thead-dark">
                                <tr style={{whiteSpace:'nowrap'}}>
                                    <th scope="col">S.No</th>
                                    <th scope="col" style={{ width: '20%' }}>Title</th>
                                    <th scope="col" style={{ width: '20%' }}>Description</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Created By</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Updated By</th>
                                    <th scope="col" className="no-print">Action</th>
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
                                                <tr key={row.id} style={{whiteSpace:'nowrap'}}>
                                                    <th scope="row">{serialNumber}</th>
                                                    <td>{row.a_title}</td>
                                                    <td style={{ wordBreak: 'break-word' }} className="description" onClick={() => handleOpenModal(row.a_description)}>{row.a_description}</td>
                                                    <td>{row.a_validdate}</td>
                                                    <td>{row.created_name}</td>
                                                    <td>{row.status || '-'}</td>
                                                    <td>{row.updated_name || '-'}</td>
                                                    <td className="no-print">
                                                        <button className="btn-edit" onClick={() => { handleedit(row.id) }} style={{ marginRight: '10px' }}>
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


                    {/* ========================================================================== */}

                    {/* Modal for adding announcement */}

                    <Modal show={announcementModel} onHide={handleCloseannouncement}>
                        <Modal.Header closeButton>
                            <Modal.Title><h3 className='mb-3' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Announcement</h3></Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <label>Title:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter title"
                                value={title}
                                onChange={(e) => handleInputChange(setTitle)(e)}
                            />
                            {formErrors.title && <p className="text-danger">{formErrors.title}</p>}
                            <label>Description:</label>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => handleInputChange(setDescription)(e)}
                            />
                            {formErrors.description && <p className="text-danger">{formErrors.description}</p>}
                            <label>Date:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={date}
                                min={today}
                                onChange={handleDateChange}
                            />
                            {formErrors.date && <p className="text-danger">{formErrors.date}</p>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseannouncement}>Cancel</Button>
                            <Button variant="primary" onClick={handleSave}>Save Announcement</Button>
                            {/* <Button variant="primary" onClick={handleAddAnnouncement}>Add Announcement</Button> */}
                        </Modal.Footer>
                    </Modal>

                    {/* ========================================================================== */}

                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Description</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{wordBreak:'break-word'}}>
                            {modalContent}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Container>


            )}
        </>



    )
}

export default EditAnnouncement