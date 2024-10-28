import React, { useState } from 'react'
import { Button, Container } from 'react-bootstrap';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

function AssignEmployeeSalaryList() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editemployeesalary/${id}`);
    };

    const GoToAddPage = () => {
        navigate(`/admin/assignemployeesalary`);
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

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/get_define_emp_salarylist', {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },

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
        const csvData = tableData.map(({ dep_name, emp_name, start_month, end_month, annual_ctc, gross_pay, net_pay, basic_da, hra, conveyance_allowance, transport_allowance,
            medical_allowance, other_allowance, variable, pf, epf, esi, advance, other_deduction, status }, index) => ({
                '#': index + 1,
                dep_name,
                emp_name,
                start_month,
                end_month,
                annual_ctc,
                gross_pay,
                net_pay,
                basic_da,
                hra,
                conveyance_allowance,
                transport_allowance,
                medical_allowance,
                other_allowance,
                variable,
                pf,
                epf,
                esi,
                advance,
                other_deduction,
                status
            }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Department', key: 'dep_name' },
            { label: 'Employee Name', key: 'emp_name' },
            { label: 'Start Date', key: 'start_month' },
            { label: 'End Date', key: 'end_month' },
            { label: 'CTC', key: 'annual_ctc' },
            { label: 'Gross Pay', key: 'gross_pay' },
            { label: 'Net Pay', key: 'net_pay' },
            { label: 'Basic + DA', key: 'basic_da' },
            { label: 'HRA', key: 'hra' },
            { label: 'Convenience Allowance', key: 'conveyance_allowance' },
            { label: 'Transport Allowance', key: 'transport_allowance' },
            { label: 'Medical Allowance', key: 'medical_allowance' },
            { label: 'Other Allowance', key: 'other_allowance' },
            { label: 'Variable', key: 'variable' },
            { label: 'PF', key: 'pf' },
            { label: 'EPF', key: 'epf' },
            { label: 'ESI', key: 'esi' },
            { label: 'Salary Advance', key: 'advance' },
            { label: 'Other Deduction', key: 'other_deduction' },
            { label: 'Status', key: 'status' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Assign-employee-salaryList.csv',
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

        const data = tableData.map(({ dep_name, emp_name, start_month, end_month, annual_ctc, gross_pay, net_pay, basic_da, hra, conveyance_allowance, transport_allowance,
            medical_allowance, other_allowance, variable, pf, epf, esi, advance, other_deduction, status }, index) => [

                index + 1,
                dep_name,
                emp_name,
                start_month,
                end_month,
                annual_ctc,
                gross_pay,
                net_pay,
                basic_da,
                hra,
                conveyance_allowance,
                transport_allowance,
                medical_allowance,
                other_allowance,
                variable,
                pf,
                epf,
                esi,
                advance,
                other_deduction,
                status
            ]);

        doc.autoTable({
            head: [['S.No', 'Department', 'Employee Name', 'Start Date', 'End Date', 'CTC', 'Gross Pay', 'Net Pay', 'Basic + DA', 'HRA', 'Convenience Allowance',
                'Transport Allowance', 'Medical Allowance', 'Other Allowance', 'Variable', 'PF', 'EPF', 'ESI', 'Salary Advance', 'Other Deduction', 'Status']],
            body: data,
            startY: 20, // Adjust as needed to leave space for other content or headers
            styles: { fontSize: 8 }, // Adjust font size as per your requirement
            // headStyles: { fillColor: [176, 196, 222], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
            margin: { top: 40 }, // Adjust margins if needed
        });

        doc.save('Assign-employee-salaryList.pdf');

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Assign Employee Salary</h3>
                    <Button onClick={GoToAddPage}>+ Add</Button>
                </div>

                {/* ------------------------------------------------------------------------------------------------ */}
                {/* List table */}

                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
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

                <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }} style={{ width: '100%', overflowX: 'auto' }}>

                    <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                        <thead className="thead-dark">
                            <tr>
                                <th>S.No</th>
                                <th>Department</th>
                                <th>Employee Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th >CTC</th>
                                <th>Gross Pay</th>
                                <th>Net Pay</th>
                                <th>Basic + DA</th>
                                <th>HRA</th>
                                <th>Convenience Allowance</th>
                                <th>Transport Allowance</th>
                                <th>Medical Allowance</th>
                                <th>OtherAllowance</th>
                                <th>Variable</th>
                                <th>PF</th>
                                <th>EPF</th>
                                <th>ESI</th>
                                <th>Salary Advance</th>
                                <th>Other Deduction</th>
                                <th>Status</th>
                                <th className='no-print'>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredleaveData.length === 0 ? (
                                    <tr>
                                        <td colSpan="22" style={{ textAlign: 'center' }}>No search data found</td>
                                    </tr>
                                ) : (


                                    filteredleaveData.map((row, index) => {

                                        const serialNumber = currentPage * itemsPerPage + index + 1;

                                        return (
                                            <tr key={row.id}>
                                                <th scope="row">{serialNumber}</th>
                                                <td>{row.dep_name}</td>
                                                <td>{row.emp_name}</td>
                                                <td>{row.start_month}</td>
                                                <td>{row.end_month}</td>
                                                <td>{row.annual_ctc}</td>
                                                <td>{row.gross_pay}</td>
                                                <td>{row.net_pay}</td>
                                                <td>{row.basic_da}</td>
                                                <td>{row.hra}</td>
                                                <td>{row.conveyance_allowance}</td>
                                                <td>{row.transport_allowance}</td>
                                                <td>{row.medical_allowance}</td>
                                                <td>{row.other_allowance}</td>
                                                <td>{row.variable}</td>
                                                <td>{row.pf}</td>
                                                <td>{row.epf}</td>
                                                <td>{row.esi}</td>
                                                <td>{row.advance}</td>
                                                <td>{row.other_deduction}</td>
                                                <td>{row.status}</td>

                                                <td style={{ display: 'flex', gap: '10px' }} className='no-print'>
                                                    <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
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
        </>
    )
}

export default AssignEmployeeSalaryList