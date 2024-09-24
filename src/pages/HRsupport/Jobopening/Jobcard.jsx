import React from 'react'
import { Button } from 'react-bootstrap'
import './css/Jobcardstyle.css'
import { useNavigate } from 'react-router-dom';

function Jobcard({ designation, no_of_vacancies, description, id }) {


    const navigate = useNavigate();
    const handleVisitProfile = () => {
        navigate(`/admin/viewjobcard/${id}`);
    };


    return (
        <div>

            <div className='job__card__container'>

                <div className='Job__headers'>
                    <h4 style={{ fontWeight: 'bold', color: '#00275c' }}>{designation}</h4>

                    <p className='vacancies'>No.of Vacancies: {no_of_vacancies}</p>

                </div>

                <div className='job__body'>
                    <h6 className='Description'>Description</h6>
                    <p className="Description__content ellipse two-lines" dangerouslySetInnerHTML={{ __html: description }}></p>
                </div>

                <div className='job__footer'>
                    <Button style={{ width: '60%' }} onClick={handleVisitProfile}>View Job</Button>
                </div>

            </div>
        </div>
    )
}

export default Jobcard