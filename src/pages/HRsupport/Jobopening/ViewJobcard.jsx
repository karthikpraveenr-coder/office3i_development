import React, { useEffect, useState } from 'react'
import { Button, Container } from 'react-bootstrap'
import './css/ViewJobcardstyle.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

function ViewJobcard() {

    // ------------------------------------------------------------------------------------------------

    const { id } = useParams();

    const navigate = useNavigate();
    const handleVisitjobopening = () => {
        navigate(`/admin/jobopening`);
    };

    const handleVisitEditJobopening = () => {
        navigate(`/admin/editjobopening/${id}`);
    };

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // job list
    const [jobdetails, setJobdetails] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/user/api/public/api/edit_jobopening_list/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const { data } = response.data;
                console.log('data-->', data)
                setJobdetails(data)


            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, [id]);


    // ------------------------------------------------------------------------------------------------

    // delete the job

    const handleDelete = async () => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this job opening. This action cannot be reversed.',
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
            });

            if (reason) {
                const response = await axios.post('https://office3i.com/user/api/public/api/delete_job_opening', {
                    id: id,
                    updated_by: userempid,
                    reason: reason,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                if (response.status === 200) {
                    setJobdetails(null); // Clear job details after deletion
                    Swal.fire('Deleted!', 'Job opening has been deleted.', 'success');
                    handleVisitjobopening()
                } else {
                    throw new Error('Error deleting job opening');
                }
            }
        } catch (error) {
            console.error('Error deleting job opening:', error);
            Swal.fire('Error', 'An error occurred while deleting the job opening. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------



    return (
        <Container style={{ padding: '10px 50px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Job Openings</h3>

            {jobdetails && (
                <div className='viewjob__container'>

                    <div className='viewjob__header mb-4'>
                        <div className='job__title'>
                            <h4 style={{ fontWeight: 'bold', color: '#00275c' }}>{jobdetails.designation}</h4>

                            <p>No.of Vacancies: {jobdetails.no_of_vacancies}</p>

                        </div>

                        <div className='edit__delete'>
                            <Button onClick={handleVisitEditJobopening}
                                style={{
                                    background: '#f0f6e5',
                                    border: '1px solid #76b700',
                                    color: 'black',
                                    fontWeight: '700'
                                }}
                            ><FontAwesomeIcon icon={faPen} /> Edit</Button>
                            <Button onClick={handleDelete}
                                style={{
                                    background: '#ffe0e0',
                                    border: '1px solid #ff7676',
                                    color: 'black',
                                    fontWeight: '700'
                                }}><FontAwesomeIcon icon={faTrashCan}
                                /> Delete</Button>
                        </div>

                    </div>

                    <div className='viewjob__body'>
                        <h5>Description</h5>
                        <p className="Description__content" dangerouslySetInnerHTML={{ __html: jobdetails.description }}></p>

                    </div>

                </div>
            )}
        </Container>
    )
}

export default ViewJobcard