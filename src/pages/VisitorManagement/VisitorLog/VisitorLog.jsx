import React, { useEffect, useState } from 'react'
import VisitorLogcard from './VisitorLogcard'
import axios from 'axios';
import { Pagination } from 'react-bootstrap';

function VisitorLog() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';


    // ------------------------------------------------------------------------------------------------

    const [visitors, setVisitors] = useState([]);
    const [error, setError] = useState(null);

    const fetchVisitors = async () => {
        try {
            const response = await axios.get('https://office3i.com/development/api/public/api/visitor_list', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`,
                }
            });
            if (response.data.status === 'success') {
                setVisitors(response.data.data);
            } else {
                setError('Failed to fetch visitor data');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchVisitors();
    }, []);

    // ----------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------------
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEmployees = visitors.filter(employee =>
        employee.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ------------------------------------------------------------------------------------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(6);

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
        <div>
            <div className='mb-3' style={{
                padding: '21px 112px 0px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItem: 'center'
            }}>
                <h3 style={{ fontWeight: 'bold', color: '#00275c' }}>Visitor Log</h3>
                <input
                    type="text"
                    placeholder="Search employee..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ marginBottom: '20px', border: '1px solid #0b6cf2', padding: '5px 7px', boxShadow: '#0b6cf2 0px 0px 6px 0px' }}
                />
            </div>


            {filteredEmployees.length > 0 ? (
                currentEntries.map((visitor, index) => (
                    <VisitorLogcard
                        key={index}
                        id={visitor.id}
                        visitor_name={visitor.visitor_name}
                        profile_img={visitor.profile_img}
                        mobile_number={visitor.mobile_number}
                        id_proof_name={visitor.id_proof_name}
                        id_number={visitor.id_number}
                        department={visitor.department}
                        email_id={visitor.email_id}
                        whom_to_visit={visitor.whom_to_visit}
                        location={visitor.location}
                        date={visitor.date}
                        in_time={visitor.in_time}
                        out_time={visitor.out_time}
                        onCheckout={fetchVisitors}
                    />
                ))
            ) : (
                <p style={{display:'flex', justifyContent:'center', paddingTop:'40px', paddingBottom:'40px', fontWeight:'700', fontSize:'24px'}}>No visitors found.</p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {paginationBasic()}
            </div>

        </div>
    )
}

export default VisitorLog