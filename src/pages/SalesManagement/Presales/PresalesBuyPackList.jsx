import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap';
import './css/presalesbuypacklist.css'
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
import { faCommentDollar, faEye, faMoneyCheck, faPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { FaPaypal } from 'react-icons/fa';


function PresalesBuyPackList() {


    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editpresalesbuypackList/${id}`);
    };

    const GoToViewPage = (id) => {
        navigate(`/admin/presalesbuypackview/${id}`);
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
            const response = await fetch('https://office3i.com/development/api/public/api/getbuynow_packlist', {
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
        const csvData = tableData.map(({ cus_name, cus_email, plan_name, add_emp_count, total_plan_amt, plan_period, payment_methodname, payment_statusname, start_date, end_date, created_name, updated_name, assign_member_name }, index) => ({
            '#': index + 1,
            cus_name,
            cus_email,
            plan_name,
            add_emp_count,
            total_plan_amt,
            plan_period,
            payment_methodname,
            payment_statusname,
            start_date,
            end_date,
            created_name,
            updated_name,
            assign_member_name,

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Name', key: 'cus_name' },
            { label: 'Email', key: 'cus_email' },
            { label: 'Addon Employee Count', key: 'add_emp_count' },
            { label: 'Plan Type', key: 'plan_period' },
            { label: 'Payment Method', key: 'payment_methodname' },
            { label: 'Payment Status', key: 'payment_statusname' },
            { label: 'Start Date', key: 'start_date' },
            { label: 'End Date', key: 'end_date' },
            { label: 'Created By', key: 'created_name' },
            { label: 'Updated By', key: 'updated_name' },
            { label: 'Assign Member Name', key: 'assign_member_name' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Buypacklist.csv',
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

        const data = tableData.map(({ cus_name, cus_email, plan_name, add_emp_count, total_plan_amt, plan_period, payment_methodname, payment_statusname, start_date, end_date, created_name, updated_name, assign_member_name }, index) => [
            index + 1,
            cus_name,
            cus_email,
            plan_name,
            add_emp_count,
            total_plan_amt,
            plan_period,
            payment_methodname,
            payment_statusname,
            start_date,
            end_date,
            created_name,
            updated_name,
            assign_member_name,
        ]);

        doc.autoTable({
            head: [['S.No', 'Name', 'Email', 'Plan Name', 'Addon Employee Count', 'Plan Type', 'Payment Method', 'Payment Status', 'Start Date', 'End Date', 'Created By', 'Updated By', 'Assign Member Name']],
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

        doc.save('Buypacklist.pdf');

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




    const handlePayButtonClick = (row) => {
        const payload = {
            cus_id: row.cus_id,
            email: row.cus_email,
            mobile_number: row.cus_mobile,
            product_name: row.plan_name,
            invoice_id: row.invoice_id,
            overall_amt: row.overall_amt,
            name: row.cus_name,
            created_by: userempid
        };

        console.log('payload', payload);

        axios.post('https://office3i.com/development/api/public/api/sent_paylink', payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`,
            }
        })
            .then(response => {
                console.log('API Response:', response.data);

                // Check if the response status is "success" or "error"
                if (response.data.status === 'success') {
                    Swal.fire({
                        title: 'Success!',
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else if (response.data.status === 'error') {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data.message || 'Failed to send payment link. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            })
            .catch(error => {
                console.error('API Error:', error.response?.data || error.message);
                Swal.fire({
                    title: 'Error!',
                    text: 'An unexpected error occurred. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Buy Pack List</h3>



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
                                    <th>Add on Employee</th>
                                    <th>Total Amount</th>
                                    <th>Plan Type</th>
                                    <th>Payment Method</th>
                                    <th>Payment Status</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Created By</th>
                                    <th>Updated By</th>
                                    <th>Assigned Name</th>
                                    <th>Payment Share Link</th>
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
                                                <td>{row.add_emp_count}</td>
                                                <td>{row.overall_amt}</td>
                                                <td>{row.plan_period}</td>
                                                <td>{row.payment_methodname}</td>
                                                <td>{row.payment_statusname}</td>
                                                <td>{row.start_date}</td>
                                                <td>{row.end_date}</td>
                                                <td>{row.created_name}</td>
                                                <td>{row.updated_name == null ? '-' : row.updated_name}</td>
                                                <td>{row.assign_member_name}</td>


                                                <td>
                                                    {row.payment_methodname === 'Online' ?
                                                        <Button className='pay_btn' onClick={() => handlePayButtonClick(row)}
                                                            disabled={row.status === 'Active'}
                                                           
                                                        >
                                                            Pay Link
                                                        </Button>
                                                        : row.payment_methodname}
                                                </td>

                                                <td>{row.status}</td>

                                                <td>
                                                    <button className="btn-view" onClick={() => { GoToViewPage(row.id) }} style={{ padding: '6px 11px', marginRight: '5px' }}>
                                                        <FontAwesomeIcon icon={faEye} />
                                                    </button>

                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }} disabled={row.payment_statusname == 'Paid'}
                                                        style={{ backgroundColor: row.payment_statusname === 'Paid' ? 'grey' : '', borderColor: row.payment_statusname === 'Paid' ? 'grey' : '', cursor: row.payment_statusname === 'Paid' ? 'no-drop' : '' }}
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

export default PresalesBuyPackList