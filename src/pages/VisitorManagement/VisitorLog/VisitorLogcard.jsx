import React from 'react'
import { Button, Container } from 'react-bootstrap'
import './css/VisitorLogcard.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'
import Swal from 'sweetalert2'


function VisitorLogcard({ id, visitor_name, profile_img, mobile_number, id_proof_name, id_number, department, email_id, whom_to_visit, location, date, in_time, out_time, onCheckout  }) {


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';


    // ------------------------------------------------------------------------------------------------

    const handlecheckout = (e) => {
        e.preventDefault();

        // Get the current time and format it as HH:MM:SS
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const currentTime = `${hours}:${minutes}:${seconds}`;

        const requestData = {
            id: id,
            out_time: currentTime,
            updated_by: userempid,
        };

        axios.put('https://office3i.com/user/api/public/api/visitor_checkout', requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;

                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });
                    onCheckout(); 
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the check out. Please try again later.',
                });

                console.error('There was an error with the API:', error);
            });
    };


    return (
        <Container style={{ padding: '20px 30px 0px 30px', display: 'flex', justifyContent: 'center' }} className='mb-5'>


            <div className='visitorlog__container'>

                <div className='visitorlog__header'>

                    <img src={`https://office3i.com/user/api/storage/app/${profile_img}`} alt='Visitor_profile' className='Visitor_profile' />

                    <h4 className='Visitor_name'>{visitor_name}</h4>
                </div>

                <div className='visitorlog__body'>
                    <div className='visitorlog__left'>
                        <p><span className='visitorlog__label'>Mobile Number: </span><span className='visitorlog__value'>{mobile_number}</span></p>
                        <p><span className='visitorlog__label'>Email ID: </span><span className='visitorlog__value'>{email_id}</span></p>
                        <p><span className='visitorlog__label'>Department: </span><span className='visitorlog__value'>{department}</span></p>
                        <p><span className='visitorlog__label'>In Time: </span><span className='visitorlog__value'>{in_time}</span></p>
                        <p><span className='visitorlog__label'>Date: </span><span className='visitorlog__value'>{date}</span></p>


                    </div>
                    <div className='visitorlog__right'>
                        <p><span className='visitorlog__label'>ID Proof: </span><span className='visitorlog__value'>{id_proof_name}</span></p>
                        <p><span className='visitorlog__label'>ID Proof Number: </span><span className='visitorlog__value'>{id_number}</span></p>
                        <p><span className='visitorlog__label'>Whom To Visit: </span><span className='visitorlog__value'>{whom_to_visit}</span></p>
                        <p><span className='visitorlog__label'>Out Time: </span><span className='visitorlog__value'>{out_time}</span></p>
                        <p><span className='visitorlog__label'>Location: </span><span className='visitorlog__value'>{location}</span></p>
                    </div>

                </div>

                <div className='visitorlog__footer'>
                    {out_time === null ? (
                        <Button className='visitorlog__checkout' onClick={handlecheckout}>Check Out</Button>
                    ) : (
                        <Button className='visitorlog__checkout__success'><FontAwesomeIcon icon={faCircleCheck} style={{ color: '#92E100' }} /> Check Out</Button>
                    )}
                </div>


            </div>


        </Container>
    )
}

export default VisitorLogcard