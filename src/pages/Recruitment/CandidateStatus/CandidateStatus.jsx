import React, { useEffect, useState } from 'react';
import '../css/CandidateStatus.css';
import axios from 'axios';
import { Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CandidateStatus = () => { 

    // --------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToviewdetailsPage = (id) => {
        navigate(`/admin/viewdetails/${id}`);
    };
    // --------------------------------------------------------------------------------------------

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('Joined');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate?.candidate_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://office3i.com/user/api/public/api/resume_status_list/${selectedTab}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                setCandidates(response.data.data || []);
                console.log('responses resume_status_list-------------->', response.data.data);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, [selectedTab, usertoken]);

    // ---------------------------------------------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(6);

    // Pagination logic
    const totalPages = Math.ceil(filteredCandidates.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredCandidates.slice(indexOfFirstEntry, indexOfLastEntry);

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
        <div className="container mt-4" style={{ padding: '0px 50px' }}>
            <div className="header">
                <h3 style={{ fontWeight: 'bold', color: '#00275c' }}>Candidate Status</h3>

                <input
                    type="text"
                    className="search-input"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            <div className='search__btn__group'>
                <div className="btn-group">
                    {['Joined', 'Offered', 'Shortlisted', 'Rejected', 'Not Suitable'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${selectedTab === tab ? 'active' : ''}`}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            {currentEntries.length > 0 ? (
                currentEntries.map((candidate, index) => (

                    <div key={index} className="card">
                        <div className="card-body-container">
                            <div>
                                <span className='card-body-content'><h5 className="card-title-content">Name: </h5><span>{candidate.candidate_name}</span></span>
                                <span className='card-body-content'><h5 className="card-title-content">Designation: </h5><span>{candidate.current_designation}</span></span>
                            </div>
                            <div>
                                <span className='card-body-content'><h5 className="card-title-content">Total Experience: </h5><span>{candidate.total_exp}</span></span>
                                <span className='card-body-content'><h5 className="card-title-content">Current CTC: </h5><span>{candidate.current_ctc}</span></span>
                            </div>
                            <div>
                                <span className='card-body-content'><h5 className="card-title-content">Candidate Status </h5></span>
                                <div className='candidatestatus' style={{textAlign:'center'}}>{candidate.status}</div>
                            </div>
                            <div>
                                <button className="details-button" onClick={()=>GoToviewdetailsPage(candidate.id)}>View Details</button>
                            </div>
                        </div>
                    </div>



                ))
            ) : (
                <div className='Resume__DataNot'>Resume List Data Not Found!.</div>
            )}


            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {paginationBasic()}
            </div>

        </div>




    );
};

export default CandidateStatus;
