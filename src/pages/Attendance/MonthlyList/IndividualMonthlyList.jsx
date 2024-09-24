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
import { useParams, useSearchParams } from 'react-router-dom';


function IndividualMonthlyList() {

    // ------------------------------------------------------------------------------------------------
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const dateFromUrl = searchParams.get('date');

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    function newFormattedDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    }

    const [currentDate, setCurrentDate] = useState(dateFromUrl || newFormattedDate());

    useEffect(() => {

        if (dateFromUrl) {
            setCurrentDate(dateFromUrl);
        }
    }, [dateFromUrl]);

    // useEffect(() => {
    //     // This effect runs only once on mount to set a default date if none is provided in the URL
    //     if (!dateFromUrl) {
    //         const today = new Date();
    //         const year = today.getFullYear();
    //         const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure month is two digits
    //         const formattedDate = `${year}-${month}`;
    //         setCurrentDate(formattedDate);
    //     }
    // }, []);


    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);
    const [individualempname, setIndividualempname] = useState()


    useEffect(() => {
        fetchData();
    }, [currentDate]);

    const fetchData = async () => {
        setLoading(true); // Ensure loading is set before fetching
        try {
            const response = await fetch('https://office3i.com/user/api/public/api/get_IndividualMonthlyList', {
                method: 'POST', // Set the method to POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                },
                body: JSON.stringify({
                    empid: id,
                    yearmonth: currentDate,
                })
            });

            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data.Individualdata);
                setIndividualempname(responseData.data.empname);
                console.log("setTableData", responseData.data)

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
        const csvData = tableData.map(({ Date, checkin_time, checkout_time, emp_present, emp_late, emp_permission, emp_onduty, checkout_total_hours }, index) => ({
            '#': index + 1,
            Date,
            checkin_time,
            checkout_time,
            emp_present,
            emp_late,
            emp_permission,
            emp_onduty,
            checkout_total_hours,


        }));

        const headers = [
            { label: '#', key: '#' },
            { label: 'Date', key: 'Date' },
            { label: 'In Time', key: 'checkin_time' },
            { label: 'Out Time', key: 'checkout_time' },
            { label: 'P/A/L/HL', key: 'emp_present' },
            { label: 'LA', key: 'emp_late' },
            { label: 'PR', key: 'emp_permission' },
            { label: 'OT/W/H', key: 'emp_onduty' },
            { label: 'Total Hours', key: 'checkout_total_hours' },

        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'IndividualmonthlyList.csv',
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

        // Add the title to the PDF
        const title = `${individualempname} Monthly Attendance`;
        const titleX = 40; // X coordinate for the title
        const titleY = 40; // Y coordinate for the title
        doc.setFontSize(20); // Set font size for the title
        doc.text(title, titleX, titleY);

        const data = tableData.map(({ Date, checkin_time, checkout_time, emp_present, emp_late, emp_permission, emp_onduty, checkout_total_hours }, index) => [
            index + 1,
            Date,
            checkin_time,
            checkout_time,
            emp_present,
            emp_late,
            emp_permission,
            emp_onduty,
            checkout_total_hours,

        ]);

        doc.autoTable({
            startY: titleY + 30,
            head: [['#', 'Date', 'In Time', 'Out Time', 'P/A/L/HL', 'LA', 'PR', 'OT/W/H', 'Total Hours']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('IndividualmonthlyList.pdf');

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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>{individualempname} Monthly Attendance</h3>



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
                            <input
                                type="month"
                                style={myStyles1}
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
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
                                    <th>In time</th>
                                    <th>Out Time</th>
                                    <th>P/L/A/HL</th>
                                    <th>Late</th>
                                    <th>Permission</th>
                                    <th>OT/W/H</th>
                                    <th>Total Hours</th>


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
                                                <td>{row.Date}</td>
                                                <td>{row.checkin_time}</td>
                                                <td>{row.checkout_time}</td>
                                                <td>{row.emp_present}</td>
                                                <td>{row.emp_late}</td>
                                                <td>{row.emp_permission}</td>
                                                <td>{row.others}</td>
                                                <td>{row.checkout_total_hours}</td>

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

export default IndividualMonthlyList