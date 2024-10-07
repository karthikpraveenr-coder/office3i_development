import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import emptyfolder from '../../../assets/admin/assets/img/empty-folder.png'

function AssignedList() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editassignedlist/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const requestData = {
            user_roleid: userrole,
            assign_empid: userempid
        };
        try {
            const response = await fetch('https://office3i.com/user/api/public/api/view_raiseassign_list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                body: JSON.stringify(requestData)
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                console.log('----------0-0->', responseData.data)
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Ticket List. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/user/api/public/api/delete_raiseticket', {
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
                    Swal.fire('Deleted!', 'Ticket List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Ticket List');
                }
            }
        } catch (error) {
            console.error('Error deleting Ticket List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Ticket List. Please try again later.', 'error');
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
        const csvData = tableData.map(({ emp_name, ticket_id, ticket_title, role_name, issue_type_name, Assigned_empname, status }, index) => ({
            '#': index + 1,
            emp_name,
            ticket_id,
            ticket_title,
            issue_type_name,
            role_name: role_name || '-',
            Assigned_empname: Assigned_empname || '-',
            status
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Employee Name', key: 'emp_name' },
            { label: 'Ticket ID', key: 'ticket_id' },
            { label: 'Ticket Title', key: 'ticket_title' },
            { label: 'Issue Type', key: 'issue_type_name' },
            { label: 'Assigned Department', key: 'role_name' },
            { label: 'Assigned Employee', key: 'Assigned_empname' },
            { label: 'Status', key: 'status' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'AssignTicketRaiseList.csv',
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

        const data = tableData.map(({ emp_name, ticket_id, ticket_title, role_name, issue_type_name, Assigned_empname, status }, index) => [
            index + 1,
            emp_name,
            ticket_id,
            ticket_title,
            issue_type_name,
            role_name || '-',
            Assigned_empname || '-',
            status
        ]);

        doc.autoTable({
            head: [['S.No', 'Employee Name', 'Ticket ID', 'Ticket Title', 'Issue Type', 'Assigned Department', 'Assigned Employee', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('AssignTicketRaiseList.pdf');

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
            <Container style={{ padding: '10px 40px' }}>
                <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Assigned List</h3>

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

                <div ref={componentRef} style={{ width: '100%', overflowX: 'auto' }}>

                    <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th style={{ width: '80px' }}>S.No</th>
                                <th style={{ width: '150px' }}>Employee Name</th>
                                <th style={{ width: '150px' }}>Ticket ID</th>
                                <th style={{ width: '200px' }}>Ticket Title</th>
                                <th style={{ width: '100px' }}>Issue Type</th>
                                <th style={{ width: '200px' }}>Assigned Department</th>
                                <th style={{ width: '200px' }}>Assigned Employee</th>
                                <th style={{ width: '100px' }} className='no-print'>Attachment</th>
                                <th style={{ width: '100px' }}>Status</th>
                                <th style={{ width: '100px' }} className='no-print'>Action</th>

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
                                                <td>{row.emp_name}</td>
                                                <td>{row.ticket_id}</td>
                                                <td>{row.ticket_title}</td>
                                                <td>{row.issue_type_name}</td>
                                                <td>{row.role_name !== null ? row.role_name : '-'}</td>
                                                <td >{row.Assigned_empname !== null ? row.Assigned_empname : '-'}</td>
                                                <td className='no-print'>
                                                    {row.attachment !== '-' ?
                                                        <button className="btn-view" onClick={() => { window.open(`https://office3i.com/user/api/storage/app/${row.attachment}`, '_blank') }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>

                                                        : <img src={emptyfolder} alt='empty' style={{ width: '40%' }} />}
                                                </td>
                                                <td>{row.status}</td>


                                                <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                    {/* <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                </button> */}
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
        </>
    )
}

export default AssignedList