import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap';
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


function SalesTrialPackList() {


    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        // navigate(`/admin/editcustomerenquirylist/${id}`);
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
            const response = await fetch('https://office3i.com/development/api/public/api/getsales_trialpacklist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    e_id: userempid,
                    role_id: userrole
                })
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
        const csvData = tableData.map(({ cus_name, cus_email, plan_name, start_date, end_date, created_name, updated_name, assign_member_name, reference_name, ref_emp_code, status  }, index) => ({
            '#': index + 1,
            cus_name,
            cus_email,
            plan_name,
            start_date,
            end_date,
            created_name,
            updated_name,
            assign_member_name,
            reference_name,
            ref_emp_code,
            status

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Name', key: 'cus_name' },
            { label: 'Email', key: 'cus_email' },
            { label: 'Plan Name', key: 'plan_name' },
            { label: 'Start Date', key: 'start_date' },
            { label: 'End Date', key: 'end_date' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },
            { label: 'Assign Member Name', key: 'assign_member_name' },
            { label: 'Reference Name', key: 'reference_name' },
            { label: 'Employee Code', key: 'ref_emp_code' },
            { label: 'Status', key: 'status' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Trialpacklist.csv',
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

        const data = tableData.map(({ cus_name, cus_email, plan_name, start_date, end_date, created_name, updated_name, assign_member_name, reference_name, ref_emp_code, status }, index) => [
            index + 1,
            cus_name,
            cus_email,
            plan_name,
            start_date,
            end_date,
            created_name,
            updated_name,
            assign_member_name,
            reference_name,
            ref_emp_code,
            status
        ]);

        doc.autoTable({
            head: [['S.No', 'Name', 'Email', 'Plan Name', 'Start Date', 'End Date', 'Created By', 'Updated By', 'Assign Member Name', 'Reference Name', 'Employee Code', 'Status']],
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

        doc.save('Trialpacklist.pdf');

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Trial Pack List</h3>



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
                                    <th>Plan Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Created By</th>
                                    <th>Updated By</th>
                                    <th>Assigned Name</th>
                                    <th>Reference Name</th>
                                    <th>Employee Code</th>
                                    <th>Status</th>
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
                                                <td>{row.cus_name}</td>
                                                <td>{row.cus_email}</td>

                                                <td>{row.plan_name}</td>
                                                <td>{row.start_date}</td>
                                                <td>{row.end_date}</td>
                                                <td>{row.created_name}</td>
                                                <td>{row.updated_name == null ? '-' : row.updated_name}</td>
                                                <td>{row.assign_member_name}</td>
                                                <td>{row.reference_name}</td>
                                                <td>{row.ref_emp_code}</td>
                                                <td>{row.status}</td>
                                                <td>
                                                    <span style={{ display: 'flex', gap: '10px' }}>

                                                        <Button className="active-button" disabled={row.status === 'Active'}>Active</Button>
                                                    </span>
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

export default SalesTrialPackList