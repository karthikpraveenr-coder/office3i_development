import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
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
import { faEye, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';


function SalesInvoiceList() {

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
        navigate(`/admin/editsalesinvoice/${id}`);
    };
    const GoToviewPage = (id) => {
        navigate(`/admin/salesinvoiceview/${id}`);
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
            const response = await fetch('https://office3i.com/development/api/public/api/view_saleinvoice', {
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


    useEffect(() => {
        fetch('https://office3i.com/development/api/public/api/view_saleinvoice', {
            headers: {

                'Authorization': `Bearer ${usertoken}`,
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json()
                }
            }).then((data) => {
                console.log("data------------->", data.data)
            })
            .catch((error) => {
                console.log("error", error.message)
            })
    })


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
        const csvData = tableData.map(({ date, sales_invoice_number, company_name, overall_amount, payment_method, payment_status }, index) => ({
            '#': index + 1,
            date,
            sales_invoice_number,
            company_name,
            overall_amount,
            payment_method,
            payment_status

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Date', key: 'date' },
            { label: 'Sales Invoice Number', key: 'sales_invoice_number' },
            { label: 'Company Name', key: 'company_name' },
            { label: 'Overall Amount', key: 'overall_amount' },
            { label: 'Payment Method', key: 'payment_method' },
            { label: 'Payment Status', key: 'payment_status' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'SalesinvoiceList.csv',
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

        const data = tableData.map(({ date, sales_invoice_number, company_name, overall_amount, payment_method, payment_status }, index) => [
            index + 1,
            date,
            sales_invoice_number,
            company_name,
            overall_amount,
            payment_method,
            payment_status
        ]);

        doc.autoTable({
            head: [['S.No', 'Date', 'Sales Invoice Number', 'Company Name', 'Overall Amount', 'Payment Method', 'Payment Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('SalesinvoiceList.pdf');

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


    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Sales invoice List. This action cannot be reversed.',
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
                const response = await fetch('https://office3i.com/development/api/public/api/delete_saleinvoice', {
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
                    Swal.fire('Deleted!', 'Sales invoice List has been deleted.', 'success');
                } else {
                    throw new Error('Error deleting Sales invoice List');
                }
            }
        } catch (error) {
            console.error('Error deleting Sales invoice List:', error);
            Swal.fire('Error', 'An error occurred while deleting the Sales invoice List. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------




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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Sales Invoice List</h3>



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
                                    <th>Date</th>
                                    <th>Sales Invoice Number</th>
                                    <th>Company Name</th>
                                    <th>Overall Amount</th>
                                    <th>Payment Method</th>
                                    <th>Payment Status</th>
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
                                                <td>{row.date}</td>
                                                <td>{row.sales_invoice_number}</td>

                                                <td>{row.company_name}</td>
                                                <td>{row.overall_amount}</td>
                                                <td>{row.payment_method}</td>
                                                <td>{row.payment_status}</td>
                                                <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                        <FontAwesomeIcon icon={faPen} />
                                                    </button>
                                                    <button className="btn-view" onClick={() => { GoToviewPage(row.id) }}>
                                                        <FontAwesomeIcon icon={faEye} />
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


                </Container>


            )}
        </>



    )
}

export default SalesInvoiceList