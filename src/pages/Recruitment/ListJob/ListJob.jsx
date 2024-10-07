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
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';


function ListJob() {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editjob/${id}`);
    };

    const GoToViewPage = (id) => {
        navigate(`/admin/viewjob/${id}`);
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

    // useEffect(() => {
    //     fetchData();
    // }, [refreshKey]);

    // const fetchData = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await fetch('https://office3i.com/user/api/public/api/employee_logs', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${usertoken}`,
    //             }
    //         });

    //         if (response.ok) {
    //             const responseData = await response.json();

    //             console.log("setTableData", responseData.data);
    //         } else {
    //             throw new Error('Failed to fetch data');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // ------------------------------------------------------------------------------------------------

    const [activeStatus, setActiveStatus] = useState('All');

    // ------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://office3i.com/user/api/public/api/post_job_list/${activeStatus}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
                );
                // console.log(response)

                setTableData(response.data.data || []);

                console.log('responses listjob-------------->', response.data.data)
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [activeStatus, usertoken]);

    // ------------------------------------------------------------------------------------------------------------







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
        const csvData = tableData.map(({ designation, no_of_vacancies, emp_type, city_names, job_status, created_at }, index) => ({
            '#': index + 1,
            designation,
            no_of_vacancies,
            emp_type,
            city_names,
            job_status,
            created_at

        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Designation', key: 'designation' },
            { label: 'No of vacancies', key: 'no_of_vacancies' },
            { label: 'Employee type', key: 'emp_type' },
            { label: 'Location', key: 'city_names' },
            { label: 'Job status', key: 'job_status' },
            { label: 'Created at', key: 'created_at' },


        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'Listjob.csv',
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

        const data = tableData.map(({ designation, no_of_vacancies, emp_type, city_names, job_status, created_at }, index) => [
            index + 1,
            designation,
            no_of_vacancies,
            emp_type,
            city_names,
            job_status,
            created_at
        ]);

        doc.autoTable({
            head: [['S.No', 'Designation', 'No of vacancies', 'Employee type', 'Location', 'Job status', 'Created at']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('Listjob.pdf');

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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>List Job</h3>

                        <div>
                            <label style={{ fontSize: '21px', fontWeight: '500', paddingRight: '10px' }}>Job Status:</label>
                            <select
                                value={activeStatus}
                                onChange={(e) => setActiveStatus(e.target.value)}
                                style={{ marginBottom: '20px', border: '1px solid #0b6cf2', padding: '5px 7px', boxShadow: '#0b6cf2 0px 0px 6px 0px' }}
                            >
                                <option value="All">All</option>
                                <option value="Active">Active</option>
                                <option value="In-Active">In-Active</option>
                            </select>
                        </div>
                    </div>

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
                                    <th>Designation</th>
                                    <th>No.of Vacancies</th>
                                    <th>Employee Type</th>
                                    <th>Location</th>
                                    <th>Job Status</th>
                                    <th>Created At</th>
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
                                                <td>{row.designation}</td>
                                                <td>{row.no_of_vacancies}</td>
                                                <td>{row.emp_type}</td>

                                                <td>{row.city_names.join(', ')}</td>
                                                <td>{row.job_status}</td>
                                                <td>{row.created_at}</td>
                                                <td className='no-print'>
                                                    <span style={{ display: 'flex', gap: '5px' }}>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} /> Edit
                                                        </button>
                                                        <button className="btn-view" onClick={() => { GoToViewPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faEye} /> View
                                                        </button>
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

export default ListJob