import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';
import EmployeeListCard from './EmployeeListCard';
import { Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function EmployeeList() {

    // ------------------------------------------------------------------------------------------------------------

    const [employeeData, setEmployeeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [activeStatus, setActiveStatus] = useState('Active');


    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(6);

    // ------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData && userData.token ? userData.token : '';

    // ------------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://office3i.com/development/api/public/api/employee_litshow/${activeStatus}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                }
                );
                // console.log(response)

                setEmployeeData(response.data.data || []);

                console.log('responses', response.data.data)
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [activeStatus, usertoken]);

    // ------------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------------------


    const filteredEmployees = employeeData.filter(employee =>
        employee.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ------------------------------------------------------------------------------------------------------------

    // Pagination logic
    const totalPages = Math.ceil(filteredEmployees.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredEmployees.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (page) => setCurrentPage(page);

    const paginationBasic = () => {
        let active = currentPage;
        let items = [];
        let visiblePages = 5; // You can adjust how many pages you want to show here
        let startPage = active - 2 > 1 ? active - 2 : 1;
        let endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;

        if (active - 2 <= 1) {
            endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;
        }

        if (totalPages > visiblePages && active + 2 > totalPages) {
            startPage = totalPages - (visiblePages - 1);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {startPage > 1 && <Pagination.Ellipsis disabled />}
                {items}
                {endPage < totalPages && <Pagination.Ellipsis disabled />}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        );
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
                    <ScaleLoader color="rgb(11 108 242)" />
                </div>
            ) : (
                <div>

                    <div style={{ padding: '25px 75px 0px 75px' }}>


                        <h3 style={{ paddingBottom: '20px', fontWeight: 'bold', color: '#00275c' }}>Employee List</h3>
                        <span style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <div>

                                <input
                                    type="text"
                                    placeholder="Search employee..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    style={{ marginBottom: '20px', border: '1px solid #0b6cf2', padding: '5px 7px', boxShadow: '#0b6cf2 0px 0px 6px 0px' }}
                                />
                            </div>

                            <div>
                                <label style={{ fontSize: '21px', fontWeight: '500', paddingRight: '10px' }}>Status:</label>
                                <select
                                    value={activeStatus}
                                    onChange={(e) => setActiveStatus(e.target.value)}
                                    style={{ marginBottom: '20px', border: '1px solid #0b6cf2', padding: '5px 7px', boxShadow: '#0b6cf2 0px 0px 6px 0px' }}
                                >
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </select>
                            </div>



                        </span>


                    </div>




                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', paddingTop: '40px' }}>
                        {filteredEmployees.length > 0 ? (

                            currentEntries.map((employee) => (
                                <EmployeeListCard
                                    key={employee.id}
                                    name={employee.first_name}
                                    role={employee.role_name}
                                    department_name={employee.department_name}

                                    hrms_emp_id={employee.hrms_emp_id}
                                    mobile={employee.mobile_no}
                                    email={employee.official_email}
                                    picture={employee.profile_img}

                                    id={employee.id}
                                // empid={employee.epkemployee_id}
                                />


                            ))
                        ) : (
                            <p style={{ display: 'flex', justifyContent: 'center', paddingTop: '40px', paddingBottom: '40px', fontWeight: '700', fontSize: '24px' }}>No Employee found.</p>
                        )}


                    </div>


                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {paginationBasic()}
                    </div>


                </div>


            )}


        </>
    )
}