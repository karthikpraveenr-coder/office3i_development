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
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDate } from '../../../Features/salarycalculationcurrentdate_state';


function SalaryCalculationList() {

    // ------------------------------------------------------------------------------------------------
    const navigate = useNavigate();
    const handlevisitindividual = (id) => {

        navigate(`/admin/individualmonthlylist/${id}?date=${currentDate}`);
    };


    const dispatch = useDispatch();
    const currentDate = useSelector((state) => state.date.currentDate);
    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ------------------------------------------------------------------------------------------------
    // Month and Year Filter
    // const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const formattedDate = `${year}-${month}`;
        dispatch(setCurrentDate(formattedDate));
    }, [dispatch]);

    console.log("currentDate", currentDate)
    // ------------------------------------------------------------------------------------------------

    // Table list view api
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://office3i.com/development/api/public/api/salary_calculation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`,
                    },
                    body: JSON.stringify({
                        yearmonth: currentDate,
                    })
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setTableData(responseData.data);
                    console.log("setTableData--->", responseData);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (currentDate) {
            fetchData();
        }
    }, [currentDate, usertoken]);

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
        // Prepare the headers dynamically
        const headers = [
            { label: 'S.No', key: 'serialNumber' },
            { label: 'Employee ID', key: 'hrms_emp_id' },
            { label: 'Name', key: 'emp_name' },
            { label: 'LA', key: 'latecount' },
            { label: 'PR', key: 'permissioncount' },
            { label: 'HL', key: 'halfdaycount' },
            { label: 'L', key: 'leavecount' },
            { label: 'A', key: 'absentcount' },
            { label: 'OT Amount', key: 'ot_totalamount' },
            { label: 'Overall LOP', key: 'totallopdays' },
            { label: 'Gross Salary', key: 'empgrosssalary' },
            { label: 'W.Days - A.Days', key: 'workingDays_absentDays' },
            { label: 'Net Salary', key: 'totalnetpayamount' }
        ];

        // Prepare the data for each row
        const csvData = filteredleaveData.map((row, index) => {
            const serialNumber = currentPage * itemsPerPage + index + 1;
            const rowData = {
                serialNumber,
                hrms_emp_id: row.hrms_emp_id,
                emp_name: row.emp_name,
                latecount: row.latecount,
                permissioncount: row.permissioncount,
                halfdaycount: row.halfdaycount,
                leavecount: row.leavecount,
                absentcount: row.absentcount,
                ot_totalamount: row.ot_totalamount,
                totallopdays: row.totallopdays,
                empgrosssalary: row.empgrosssalary,
                workingDays_absentDays: `${row.totalmonthlyworkingdays} - ${row.totallopdays}`,
                totalnetpayamount: row.totalnetpayamount
            };
            return rowData;
        });

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Salarycalculation.csv'
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // Can be changed to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);
    
        // Add the title to the PDF
        const title = `Monthly List - ${currentDate}`;
        const titleX = 40; // X coordinate for the title
        const titleY = 40; // Y coordinate for the title
        doc.setFontSize(20); // Set font size for the title
        doc.text(title, titleX, titleY);
    
        // Prepare the table headers
        const head = [['S.No', 'Employee ID', 'Name', 'LA', 'PR', 'HL', 'L', 'A', 'OT Amount', 'Overall LOP', 'Gross Salary', 'W.Days - A.Days', 'Net Salary']];
    
        // Prepare the table data
        const body = filteredleaveData.map((row, rowIndex) => {
            const serialNumber = currentPage * itemsPerPage + rowIndex + 1;
            return [
                serialNumber,
                row.hrms_emp_id,
                row.emp_name,
                row.latecount,
                row.permissioncount,
                row.halfdaycount,
                row.leavecount,
                row.absentcount,
                row.ot_totalamount,
                row.totallopdays,
                row.empgrosssalary,
                `${row.totalmonthlyworkingdays} - ${row.totallopdays}`,
                row.totalnetpayamount
            ];
        });
    
        doc.autoTable({
            startY: titleY + 30,
            head,
            body,
        });
    
        doc.save('Salarycalculation.pdf');
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

    const shift__container = {
        padding: '50px 0px'
    }

    // ===============================================

    // ---------------------------------------------------------------------------------------------------
    // Header and body dates iterate
    const allKeys = filteredleaveData.reduce((keys, record) => {
        Object.keys(record).forEach(key => {
            if (!keys.includes(key) && key !== "Name" && key !== "id" && key !== "emp_status") {
                keys.push(key);
            }
        });
        return keys;
    }, []).sort((a, b) => a - b);

    // ---------------------------------------------------------------------------------------------------


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

                <Container fluid style={shift__container}>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Salary Calculation List</h3>



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
                            <input
                                type="month"
                                style={myStyles1}
                                value={currentDate}
                                onChange={(e) => {
                                    const newDate = e.target.value;
                                    console.log('New date selected:', newDate); // Debugging log
                                    dispatch(setCurrentDate(newDate));
                                }}
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
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>LA</th>
                                    <th>PR</th>
                                    <th>HL</th>
                                    <th>L</th>
                                    <th>A</th>
                                    <th>OT Amount</th>
                                    <th>Overall LOP</th>
                                    <th>Gross Salary</th>
                                    <th>W.Days - A.Days</th>
                                    <th>Net Salary</th>


                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredleaveData.length === 0 ? (
                                        <tr>
                                            <td colSpan="14" style={{ textAlign: 'center' }}>No search data found</td>
                                        </tr>
                                    ) : (


                                        filteredleaveData.map((row, index) => {

                                            const serialNumber = currentPage * itemsPerPage + index + 1;

                                            return (
                                                <tr key={row.id}>
                                                    <th scope="row">{serialNumber}</th>
                                                    <td>{row.hrms_emp_id}</td>
                                                    <td>{row.emp_name}</td>
                                                    <td>{row.latecount}</td>
                                                    <td>{row.permissioncount}</td>
                                                    <td>{row.halfdaycount}</td>
                                                    <td>{row.leavecount}</td>
                                                    <td>{row.absentcount}</td>
                                                    <td>{row.ot_totalamount}</td>
                                                    <td>{row.totallopdays}</td>
                                                    <td>{row.empgrosssalary}</td>
                                                    <td>{row.totalmonthlyworkingdays} - {row.totallopdays}</td>
                                                    <td>{row.totalnetpayamount}</td>
                                                    {/* <td>{row.other_allowance}</td> */}



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

export default SalaryCalculationList