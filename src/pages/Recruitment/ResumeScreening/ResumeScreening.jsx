import React, { useState } from 'react'
import { Button, Container, Dropdown, Modal } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faEnvelopeOpen, faEye, faFolderOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import axios from 'axios';


function ResumeScreening() {

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
    const [readcount, setReadcount] = useState('');
    const [unreadcount, setUnreadcount] = useState('');

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/career_inboxdetails', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data.career_list);
                setReadcount(responseData.data.read_count);
                setUnreadcount(responseData.data.unread_count);
                console.log("setTableData", responseData.data.career_list);
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
        const csvData = tableData.map(({ created_name, message, created_at, updated_at }, index) => ({
            '#': index + 1,
            created_name,
            message,
            created_at,
            updated_at,

        }));

        const headers = [
            { label: '#', key: '#' },
            { label: 'Activity Done By', key: 'created_name' },
            { label: 'Message', key: 'message' },
            { label: 'created At', key: 'created_at' },
            { label: 'Updated At', key: 'updated_at' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Employeelog.csv',
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

        const data = tableData.map(({ created_name, message, created_at, updated_at }, index) => [
            index + 1,
            created_name,
            message,
            created_at,
            updated_at,
        ]);

        doc.autoTable({
            head: [['#', 'Activity Done By', 'Message', 'Created At', 'Updated At']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Employeelog.pdf');

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
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px',
        width: '55%'
    };

    // ===============================================

    // ---------------------------------------- Delete the table list -------------------------------------------
    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Resume. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/single_delete', {
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
                    Swal.fire('Deleted!', 'Resume has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Resume');
                }
            }
        } catch (error) {
            console.error('Error deleting Resume:', error);
            Swal.fire('Error', 'An error occurred while deleting the Resume. Please try again later.', 'error');
        }
    };

    // -------------------------------------------------------------------------------------------------------------

    // ---------------------------------------- Delete the table list -------------------------------------------
    // delete the table list

    const BulkhandleDelete = async () => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete these Resumes. This action cannot be reversed.',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter reason for deletion',
                inputAttributes: { maxLength: 100 },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete them!',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Reason is required for deletion.');
                    }
                    return value;
                }
            });

            if (reason) {
                const idsString = selectedIds.join(',');
                const response = await fetch('https://office3i.com/development/api/public/api/bulk_delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    },
                    body: JSON.stringify({ id: idsString, updated_by: userempid, reason }),
                });

                const responseData = await response.json();
                console.log(responseData);

                if (response.ok || response.type === 'opaqueredirect') {
                    setTableData(tableData.filter(row => !selectedIds.includes(row.id)));
                    setSelectedIds([]);
                    Swal.fire('Deleted!', 'Selected resumes have been deleted.', 'success');
                } else {
                    throw new Error('Error deleting resumes');
                }
            }
        } catch (error) {
            console.error('Error deleting resumes:', error);
            Swal.fire('Error', 'An error occurred while deleting the resumes. Please try again later.', 'error');
        }
    };

    // -------------------------------------------------------------------------------------------------------------


    const Markasread = async (id) => {
        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/read_countupdate',
                {
                    id: id,
                    updated_by: userempid
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
            );
            Swal.fire('Read', 'Selected resumes have been Readed.', 'success');
            console.log('Update successful:', response.data);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating read count:', error);
        }
    };

    const Markasunread = async (id) => {
        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/un_read_countupdate',
                {
                    id: id,
                    updated_by: userempid
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
            );
            Swal.fire('Read', 'Selected resumes have been UnReaded.', 'success');
            console.log('Update successful:', response.data);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating read count:', error);
        }
    };

    const BulkMarkasread = async () => {
        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/bulk_read_countupdate',
                {
                    id: selectedIds.join(','),
                    updated_by: userempid
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
            );
            Swal.fire('Read', 'Selected resumes have been Readed.', 'success');
            console.log('Update successful:', response.data);
            setSelectedIds([]);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating read count:', error);
        }
    };

    const BulkMarkasunread = async () => {
        try {
            const response = await axios.post(
                'https://office3i.com/development/api/public/api/bulk_unread_countupdate',
                {
                    id: selectedIds.join(','),
                    updated_by: userempid
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
            );
            Swal.fire('Read', 'Selected resumes have been UnReaded.', 'success');
            console.log('Update successful:', response.data);
            setSelectedIds([]);
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Error updating read count:', error);
        }
    };

    // const [readstatus, setReadstatus]=useState('')
    // tableData.forEach(item => {
    //     console.log("Read Status:", item.read_status);
    //     setReadstatus(item.read_status)
    // });

    // console.log(readstatus)

    // -------------------------------------------------------------------------------------------------------------

    const readcountStyle = {
        marginLeft: '10px',
        background: '#0A62F1',
        color: 'white',
        padding: '4px 8px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '8px'
    };


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

    // -------------------------------------------------------------------------------------------------------------

    const [selectedIds, setSelectedIds] = useState([]);


    const handleCheckboxChange = (id) => {
        setSelectedIds((prevSelectedIds) => {
            if (prevSelectedIds.includes(id)) {
                return prevSelectedIds.filter((selectedId) => selectedId !== id);
            } else {
                return [...prevSelectedIds, id];
            }
        });
    };

    const hasUnread = filteredleaveData.some(row => selectedIds.includes(row.id) && row.read_status === '0');
    const hasRead = filteredleaveData.some(row => selectedIds.includes(row.id) && row.read_status === '1');

    // ---------------------------------------------------------------------------------------------------------
    const [headerCheckboxState, setHeaderCheckboxState] = useState('None');

    const handleHeaderCheckboxChange = (state) => {
        setHeaderCheckboxState(state);

        switch (state) {
            case 'all':
                setSelectedIds(filteredleaveData.map((row) => row.id));
                break;
            case 'read':
                setSelectedIds(filteredleaveData.filter((row) => row.read_status !== '0').map((row) => row.id));
                break;
            case 'unread':
                setSelectedIds(filteredleaveData.filter((row) => row.read_status === '0').map((row) => row.id));
                break;
            case 'none':
                setSelectedIds([]);
                break;
            default:
                setSelectedIds([]);
        }
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

                <Container fluid style={{ padding: '10px 35px' }}>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Inbox Webmail</h3>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between' }} className='mb-3'>
                        <div style={{ display: 'flex', width: '65%' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={myStyles1}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Button style={{ background: '#D0E2FF', border: '1px solid #D0E2FF', fontWeight: '600', color: '#0A62F1' }}>Read<span style={readcountStyle}>{readcount}</span></Button>
                                <Button style={{ background: '#D0E2FF', border: '1px solid #D0E2FF', fontWeight: '600', color: '#0A62F1' }}>Unread<span style={readcountStyle}>{unreadcount}</span></Button>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* <button style={myStyles}>{handleExportCSV()}</button>
                            <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                            <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button> */}


                            <>
                                {hasUnread && (
                                    <Button
                                        style={{ background: '#C6D6FF', border: '1px solid #0A62F1', color: 'black' }}
                                        onClick={BulkMarkasread}
                                        disabled={selectedIds.length === 0}
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </Button>
                                )}

                                {hasRead && (
                                    <Button
                                        style={{ background: '#C6D6FF', border: '1px solid #0A62F1', color: 'black' }}
                                        onClick={BulkMarkasunread}
                                        disabled={selectedIds.length === 0}
                                    >
                                        <FontAwesomeIcon icon={faEnvelopeOpen} />
                                    </Button>
                                )}
                            </>

                            <Button style={{ background: '#BD0000', border: '1px solid #BD0000' }} onClick={BulkhandleDelete} disabled={selectedIds.length === 0}><FontAwesomeIcon icon={faTrash} /></Button>



                        </div>
                    </div>

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    <th>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className='headercheckbox' style={{ border: '3px solid white', color: 'white', background: '#0d6efd' }}>
                                                {headerCheckboxState.charAt(0).toUpperCase() + headerCheckboxState.slice(1)}
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleHeaderCheckboxChange('all')}>All</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleHeaderCheckboxChange('read')}>Read</Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleHeaderCheckboxChange('unread')}>Unread</Dropdown.Item>
                                                 <Dropdown.Item onClick={() => handleHeaderCheckboxChange('none')}>None</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>
                                    <th>Designation</th>
                                    <th>Name</th>
                                    <th>Mobile No</th>
                                    <th>Email</th>
                                    <th style={{ width: '250px' }}>Key Skill</th>
                                    <th>Resume</th>
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

                                        return (
                                            <tr key={row.id} style={
                                                row.read_status === '0'
                                                    ? { color: 'black', fontWeight: 'bold', background: 'rgb(226 242 247)' }
                                                    : selectedIds.includes(row.id)
                                                        ? { background: '#E1ECFF' }
                                                        : {}
                                            }>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.includes(row.id)}
                                                        onChange={() => handleCheckboxChange(row.id)}
                                                        style={{ width: '50px', height: '20px', cursor: 'pointer' }}
                                                    />
                                                </td>
                                                <td>{row.designation}</td>
                                                <td>{row.candidate_name}</td>

                                                <td>{row.mobile_no}</td>
                                                <td>{row.email}</td>
                                                <td style={Projecttype} onClick={() => handleOpenModal(row.key_skills)}>{row.key_skills}</td>

                                                <td>{row.attachment !== null ?
                                                    <Button
                                                        style={{
                                                            background: '#E7E0FC',
                                                            border: '1px solid #8056FF',
                                                            fontWeight: '600',
                                                            color: '#000000'
                                                        }}
                                                        onClick={() => {
                                                            const url = `https://office3i.com/development/api/storage/app/${row.attachment}`;
                                                            console.log("Opening URL:", url);
                                                            window.open(url, '_blank');
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </Button>

                                                    : <FontAwesomeIcon icon={faFolderOpen} />}
                                                </td>
                                                <td>
                                                    <span style={{ display: 'flex', gap: '10px' }}>
                                                        <>
                                                            {row.read_status == '0' ?
                                                                <Button style={{ background: '#C6D6FF', border: '1px solid #0A62F1', fontWeight: '600', color: '#000000' }} onClick={() => Markasread(row.id)} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Mark as Read"><FontAwesomeIcon icon={faEnvelope} /></Button>
                                                                : <Button style={{ background: '#F1F5FF', border: '1px solid #0A62F1', fontWeight: '600', color: '#000000' }} onClick={() => Markasunread(row.id)} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Mark as UnRead"><FontAwesomeIcon icon={faEnvelopeOpen} /></Button>

                                                            }
                                                        </>
                                                        <Button style={{ background: '#FFE0E0', border: '1px solid #FF7676', fontWeight: '600', color: '#000000' }} onClick={() => handleDelete(row.id)}><FontAwesomeIcon icon={faTrash} /></Button>
                                                    </span>
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
                            <Modal.Title>Key Skills</Modal.Title>
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


                </Container >


            )
            }
        </>



    )
}

export default ResumeScreening