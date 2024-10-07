import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import './css/popupstyle.css';

const OrganizationChartPopUp = ({ handleCloseannouncement, announcementModel, orgHistory }) => {
    if (!orgHistory || !orgHistory.employee_details || !orgHistory.position_history) {
        return null; // Or render a fallback UI
    }

    const { employee_details, position_history } = orgHistory;

    return (
        <Modal show={announcementModel} onHide={handleCloseannouncement}>
            <Modal.Header closeButton>
                <div className='image__name'>
                    <img src={`https://office3i.com/user/api/storage/app/${employee_details.profile_img}`} alt={employee_details.first_name} className='header__image' />
                    <div className='header__names'>
                        <h3 className='org__username'>{employee_details.first_name} {employee_details.last_name}</h3>
                        <p className='org__Designation'>
                            Current Designation: {employee_details.department_name || 'N/A'}
                        </p>
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body>
                <div className='position__container'>

                    {position_history.map((position, index) => (

                        <div key={index} className='position__item'>
                            <div className='current__Designation'>
                               <h5>{position.department_name || 'N/A'}</h5> 
                               {index !== position_history.length - 1 && <div className='vertical-line'></div>}
                            </div>
                            <div className='position__history'>


                                {/* <h6>{new Date(position.position_start_date).toLocaleDateString()} - {position.position_end_date ? new Date(position.position_end_date).toLocaleDateString() : 'Present'}</h6> */}
                               
                               
                               
                                {position.department_salaries.map((salary, salaryIndex) => (

                                    <p key={salaryIndex}>
                                        <h6>{salary.ctc_start_month} - {salary.ctc_end_month}</h6>
                                        CTC: {salary.annual_ctc / 100000} LPA
                                        
                                        </p>
                                ))}

                            </div>
                        </div>
                    ))}


                </div>
            </Modal.Body>
        </Modal>
    );
};

export default OrganizationChartPopUp;
