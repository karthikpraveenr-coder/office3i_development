import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
// import './css/addshiftslotstyle.css'
import { useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';




function Payslip() {

    const { id } = useParams();

    // ------------------------------------------------------------------------------------------------
    // Navigat to editevent
    const navigate = useNavigate();

    const handleVisitPayslip = (empId) => {
        navigate(`/admin/payslippdfview/${empId}`);
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
    }, [refreshKey]); // Ensure refreshKey is defined in parent and changes to trigger re-fetch

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch(`https://office3i.com/user/api/public/api/get_emp_payslip_list/${id}`, {
                method: 'GET', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },

            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data || []);
                console.log("setTableData-monthly", responseData.data)

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
    //    HANDLE DETELE THE TABLE LIST

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this payslip. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/user/api/public/api/delete_payslip_list', {
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
                    Swal.fire('Deleted!', 'payslip has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting shift slot');
                }
            }
        } catch (error) {
            console.error('Error deleting payslip:', error);
            Swal.fire('Error', 'An error occurred while deleting the payslip. Please try again later.', 'error');
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
        const csvData = tableData.map(({ payslipmonthyear,gross_pay,overall_deduction,totalnetpay_amount  }, index) => ({
            '#': index + 1,
            payslipmonthyear,
            gross_pay,
            overall_deduction,
            totalnetpay_amount

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Month', key: 'payslipmonthyear' },
            { label: 'Gross Pay', key: 'gross_pay' },
            { label: 'Total Deduction', key: 'overall_deduction' },
            { label: 'Net Pay', key: 'totalnetpay_amount' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Payslip.csv',
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

        const data = tableData.map(({ payslipmonthyear,gross_pay,overall_deduction,totalnetpay_amount }, index) => [
            index + 1,
            payslipmonthyear,
            gross_pay,
            overall_deduction,
            totalnetpay_amount
        ]);

        doc.autoTable({
            head: [['S.No', 'Month', 'Gross Pay', 'Total Deduction', 'Net Pay']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Payslip.pdf');

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Payslip - {tableData?.[0]?.emp_name || ''}</h3>



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
                            <thead className="thead-dark" style={{verticalAlign:'top'}}>
                                <tr>
                                    <th>S.No</th>
                                    <th>Month</th>
                                    <th>Basic + DA</th>
                                    <th>HRA</th>
                                    <th>Convenience <br />Allowance</th>
                                    <th>Transport <br />Allowance</th>
                                    <th>Medical <br />Allowance</th>
                                    <th>Other <br />Allowance</th>
                                    <th>Overtime</th>
                                    <th>Variable</th>
                                    <th>Gross Pay</th>
                                    <th>PF</th>
                                    <th>ESI</th>
                                    <th>Salary <br />Advance</th>
                                    <th>Other <br />Deductions</th>
                                    <th>Loss Of Pay</th>
                                    <th>Total <br />Deduction</th>
                                    <th>Net Pay</th>
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
                                            <tr key={row.id} title="Click to know more" style={{ cursor: 'pointer' }}>
                                                <td>{serialNumber}</td>
                                                <td>{row.payslipmonthyear}</td>
                                                <td>{row.basic_da}</td>
                                                <td>{row.hra}</td>
                                                <td>{row.conveyance_allowance}</td>
                                                <td>{row.transport_allowance}</td>
                                                <td>{row.medical_allowance}</td>
                                                <td>{row.other_allowance}</td>
                                                <td>{row.emp_ot}</td>
                                                <td>{row.variable}</td>
                                                <td>{row.gross_pay}</td>
                                                <td>{row.pf}</td>
                                                <td>{row.esi}</td>
                                                <td>{row.advance}</td>
                                                <td>{row.other_deduction}</td>
                                                <td>{row.emp_lop}</td>
                                                <td>{row.overall_deduction}</td>
                                                <td>{row.totalnetpay_amount}</td>
                                                <td className='no-print' style={{ display: 'flex', gap: '10px' }}>

                                                    <button style={{ padding: '6px' }} className="btn-view" onClick={() => handleVisitPayslip(row.id)}>
                                                        <FontAwesomeIcon icon={faEye} /> View
                                                    </button>
                                                    <button className="btn-delete"
                                                        onClick={() => handleDelete(row.id)}><FontAwesomeIcon icon={faTrashCan} /> Delete </button>
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

export default Payslip