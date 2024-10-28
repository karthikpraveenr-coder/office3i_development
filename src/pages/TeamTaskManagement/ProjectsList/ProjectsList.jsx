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
import { Form, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faCircleInfo, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import './ProjectsList.css'
import { Dropdown } from 'react-bootstrap';
import axios from 'axios';


function ProjectsList() {

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
        navigate(`/admin/editprojectlist/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [refreshKey, setRefreshKey] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState('');

    useEffect(() => {
        fetchData();
    }, [refreshKey, selectedMenuItem]); // Ensure refreshKey is defined in parent and changes to trigger re-fetch

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            // Define the payload based on user role
            let payload = {};

            if (userrole === '1') {
                payload = {
                    user_roleid: userrole,
                };
            } else {
                payload = {
                    emp_id: userempid,
                    btn_type: selectedMenuItem,
                };
            }

            // Make the fetch request
            const response = await fetch('https://office3i.com/development/api/public/api/view_teamproject_list', {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify(payload) // Convert payload to JSON
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
            setLoading(false); // Ensure loading is false whether the request succeeds or fails
        }
    };


    // ------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Project List. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_project', {
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
                    Swal.fire('Deleted!', 'Project List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Project List');
                }
            }
        } catch (error) {
            console.error('Error deleting Project List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Project List. Please try again later.', 'error');
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
        const csvData = tableData.map(({ p_name, p_type, p_category, p_work_type, client_company, department, membername, from_date, to_date, status }, index) => ({
            '#': index + 1,
            p_name,
            p_type,
            p_category,
            p_work_type,
            client_company,
            department,
            membername,
            from_date,
            to_date,
            status,


        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Project Name', key: 'p_name' },
            { label: 'Project Type', key: 'p_type' },
            { label: 'Category', key: 'p_category' },
            { label: 'Work Type', key: 'p_work_type' },
            { label: 'Client Company', key: 'client_company' },
            { label: 'Department', key: 'department' },
            { label: 'Members', key: 'membername' },
            { label: 'From Date', key: 'from_date' },
            { label: 'To Date', key: 'to_date' },
            { label: 'Status', key: 'status' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'ProjectList.csv',
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

        const data = tableData.map(({ p_name, p_type, p_category, p_work_type, client_company, department, membername, from_date, to_date, status }, index) => [
            index + 1,
            p_name,
            p_type,
            p_category,
            p_work_type,
            client_company,
            department,
            membername,
            from_date,
            to_date,
            status,

        ]);

        doc.autoTable({
            head: [['S.No', 'Project Name', 'Project Type', 'Category', 'Work Type', 'Client Company', 'Department', 'Members', 'From Date', 'To Date', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
            columnStyles: {
                0: { halign: 'center', cellWidth: 40 }, // S.No column
                1: { cellWidth: 80 }, // Project Name column
                2: { cellWidth: 70 }, // Project Type column
                3: { cellWidth: 70 }, // Category column
                4: { cellWidth: 70 }, // Work Type column
                5: { cellWidth: 100 }, // Client Company column
                6: { cellWidth: 70 }, // Department column
                7: { cellWidth: 70 }, // Members column
                8: { cellWidth: 60 }, // From Date column
                9: { cellWidth: 60 }, // To Date column
                10: { cellWidth: 60 }, // Status column
            },
            margin: { top: 40 }, // Adjust top margin
            didDrawPage: (data) => {
                doc.text('Project List', data.settings.margin.left, 30); // Title of the document
            }
        });

        doc.save('ProjectList.pdf');

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

    // -----------------------------------------------------------------------------------------------------

    const [menuItems, setMenuItems] = useState([]);
    // Track selected menu item

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/btn_menu_show/${userempid}`, {
                    headers: {
                        Authorization: `Bearer ${usertoken}`, // Replace with your token
                    },
                });

                if (response.data.status === "success") {
                    const items = response.data.data;
                    setMenuItems(items);

                    // Set "AssignedToMe" as default if it's in the response
                    if (items.includes("AssignedToMe")) {
                        setSelectedMenuItem("AssignedToMe");
                    }
                }
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchMenuItems();
    }, []);

    const handleSelect = (eventKey) => {
        setSelectedMenuItem(eventKey); // Update state with selected menu item
        console.log("Selected Menu Item:", eventKey);
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
                    <span className='mb-5' style={{ fontWeight: 'bold', color: '#00275c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Project List</h3>
                        <span className='project-details'><FontAwesomeIcon icon={faCircleInfo} style={{ fontSize: '20px' }} /> Click on the Project Name to view Tasks List</span>
                    </span>



                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}

                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
                        <div style={{ display: 'flex' }}>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={myStyles1}
                            />

                            {/* ----------------------------- */}
                            {menuItems.length >= 2 && userrole !== '1' ? (
                                <Dropdown onSelect={handleSelect}>
                                    <Dropdown.Toggle className='menu-dropdown-btn' id="dropdown-basic">
                                        {selectedMenuItem || "Dropdown Button"}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {menuItems.length > 0 ? (
                                            menuItems.map((menuItem, index) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={menuItem}
                                                    active={menuItem === selectedMenuItem}
                                                >
                                                    {menuItem}
                                                </Dropdown.Item>
                                            ))
                                        ) : (
                                            <Dropdown.Item disabled>No items available</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : null}



                            {/* ----------------------------- */}

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
                                    <th>Project Name</th>
                                    <th scope="col" style={{ width: '200px' }}>Project Type</th>
                                    <th>Project Category</th>
                                    <th>Project Status</th>
                                    <th>Project Priority</th>
                                    <th scope="col" style={{ width: '300px' }}>Department</th>
                                    <th scope="col" style={{ width: '300px' }}>Teams</th>
                                    <th scope="col" style={{ width: '300px' }}>Members</th>
                                    <th>Duration</th>
                                    <th>Start Date</th>
                                    <th>Finish Date</th>
                                    <th>Notes/Description</th>
                                    <th>Attachment</th>

                                    {(userrole.includes('1') || userrole.includes('2')) && (<th className='no-print'>Action</th>)}


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
                                                <td><Button className='ProjectsList__pnane'>{row.p_name} <FontAwesomeIcon icon={faAnglesRight} /></Button></td>
                                                {/* <td style={Projecttype} onClick={() => handleOpenModal(row.p_type)}>{row.p_type}</td> */}
                                                <td>{row.p_type}</td>
                                                <td>{row.p_category}</td>
                                                <td>{row.project_status_name}</td>
                                                <td>{row.p_priority}</td>
                                                <td>{row.department_name}</td>
                                                <td>{row.teams_name}</td>
                                                <td>{row.membername}</td>
                                                <td>{row.p_duration}</td>
                                                <td>{row.start_date}</td>
                                                <td>{row.finish_date}</td>
                                                <td>{row.p_description}</td>
                                                <td>{row.p_attachment}</td>


                                                {(userrole.includes('1') || userrole.includes('2')) && (
                                                    <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </td>
                                                )}

                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Modal show={showModal} onHide={handleCloseModal}>
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

export default ProjectsList