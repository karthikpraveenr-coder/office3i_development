import React, { useEffect, useRef, useState } from 'react';
import '../css/RelievingLetter.css'; // Import the CSS file for styling

import logo from '../images/Relievinghead.png'
import footer from '../images/Relievingfoot.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const AppointmentLetterView = () => {

    const { id } = useParams();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // --------------------------------------------------------------------------------------------
    const [relievingletter, setRelievingletter] = useState()
    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/edit_offer_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)
                    const data = res.data.data
                    setRelievingletter(data)

                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // --------------------------------------------------------------------------------------------------------
    // PDF DESIGN START

    const pdfContainerRef = useRef(null);



    const handlePrint = useReactToPrint({
        content: () => pdfContainerRef.current,
        documentTitle: `Relieving_letter_${id}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 0;
            }
            body {
                margin: 30px;
                padding: 30px;
            }
            @media print {
                .additional-lines {
                    margin-top: 20px;
                }
                .hidden-print {
                    display: block !important;
                    text-align: center;
                }
            }
        `
    });

    // PDF DESIGN END
    // --------------------------------------------------------------------------------------------------------
    const formattedBenefits = relievingletter?.benefits?.replace(/\n/g, '<br />') || '';
    return (
        <>
            {relievingletter && (
                <div className="a4-container-offer-letter">
                    <div className="content" ref={pdfContainerRef}>

                        <div className="d-flex justify-content-between align-items-center mb-5 header">
                            <img src={`https://office3i.com/user/api/storage/app/${relievingletter.header_attachment}`} alt="Offerletter_header" className="logo" />
                        </div>

                        <h4 className="text-center mb-4">EMPLOYMENT OFFER LETTER</h4>

                        <p className="text-end"><strong>{relievingletter.date}</strong></p>
                        <div className="text-start">
                            <p><strong>{relievingletter.name}</strong></p>
                            <p><strong>{relievingletter.address_line1}</strong></p>
                            <p><strong>{relievingletter.address_line2}</strong></p>
                        </div>

                        <p className='line__height mt-5'>
                            We are pleased to offer you a job as a <strong>{relievingletter.designation}</strong> at <strong>{relievingletter.company_name}</strong>.  We trust that your
                            experience and skills will be a valuable asset to our company.
                        </p>
                        <p className='line__height'>
                            You will be entitled with an annual cost to company of <strong>Rs.{relievingletter.annual_ctc}</strong>.
                            Your working hours will be <strong>{relievingletter.working_hrs_from}AM to {relievingletter.working_hrs_to}PM</strong> on <strong>{relievingletter.working_day}</strong>.
                        </p>
                        <p className='line__height'>
                            You will be on probation for <strong>{relievingletter.probation_period}</strong>.
                        </p>

                        <p className='line__height'>
                            On acceptance of the terms of conditions as per this offer letter, you will be able to terminate
                            your employment with the Company by giving <strong>{relievingletter.noties_period} notice</strong> to the Company and vice versa.
                        </p>
                        <p className='line__height'>
                            <strong> Benefits for the position include:</strong>
                        </p>

                        <p className='line__height'>
                            {/* <strong>{formattedBenefits}</strong> */}
                            <strong dangerouslySetInnerHTML={{ __html: formattedBenefits }} />
                        </p>


                        <p className='line__height'>
                            We would like you to start work on <strong>{relievingletter.date}</strong> and report to  <strong>{relievingletter.supervisor_name}</strong> .
                        </p>

                        <div className='accept__Terms__Conditions'>

                            <p className='line__height'>
                                To accept this offer please sign the enclosed copy of this letter and return it
                                via email by <strong>{relievingletter.last_date_offer}</strong> to indicate your acceptance of this offer.
                            </p>


                            <p className='line__height'>
                                With regards,
                            </p>

                            <p className='line__height'>
                                <strong>{relievingletter.authorised_person_name},</strong>
                            </p>

                            <p className='line__height'>
                                <strong>{relievingletter.authorised_designation}.</strong>
                            </p>
                            <p className='line__height'>
                                I accept the aforesaid terms & conditions and this offer of employment. I shall keep the contents
                                of this document confidential.
                            </p>
                            <div className="text-start signature-section">
                                <p>I will join on: <span class="bracket"> </span></p>
                            </div>
                            <div className="text-start">
                                <p>Name: <span class="bracket"> </span></p>
                                <p>Signature: <span class="bracket"> </span></p>
                                <p>Date: <span class="bracket"> </span></p>
                            </div>
                        </div>


                        <div className="d-flex justify-content-between align-items-center footer">
                            <img src={`https://office3i.com/user/api/storage/app/${relievingletter.footer_attached}`} alt="Offerletter_Footer" className="logo" />
                        </div>

                    </div>


                </div >
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10.5rem', marginTop: '50px', marginBottom: '20PX' }}>
                <button className="btn btn-primary" onClick={handlePrint}>
                    View & Download
                </button>
            </div>

        </>
    );
};

export default AppointmentLetterView;
