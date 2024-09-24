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
        axios.get(`https://office3i.com/user/api/public/api/edit_appointment_list/${id}`, {
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
        documentTitle: `Appointment_letter_${id}`,
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


    const formattedTermsandcondition = relievingletter?.employment_tc?.replace(/\n/g, '<br />') || '';

    return (
        <>
            {relievingletter && (
                <div className="a4-container-appointment">
                    <div className="content" ref={pdfContainerRef}>
                        <div className="d-flex justify-content-between align-items-center mb-5 header">
                            <img src={`https://office3i.com/user/api/storage/app/${relievingletter.header_attachment}`} alt="Appointment_letter" className="logo" />
                        </div>
                        <div className='appointment__letter__boday'>
                            <h4 className="text-center mb-4 appointment__letter">EMPLOYEE APPOINTMENT LETTER</h4>

                            <p className="text-end">07/07/2024</p>
                            <div className="text-start">
                                <p><strong>{relievingletter.candidate_name}</strong></p>
                                <p><strong>{relievingletter.address_line1}</strong></p>
                                <p><strong>{relievingletter.address_line2}</strong></p>
                            </div>

                            <p className='line__height mt-5'>
                                This letter serves as your official appointment to the position of <strong>{relievingletter.designation}</strong> with effect
                                from <strong>{relievingletter.date}</strong> after careful consideration of your application and the subsequent interviews
                                you had with us. We are confident that your contributions will greatly enhance our team and
                                contribute to the success of <strong>{relievingletter.company_name}</strong>.
                            </p>
                            <p className='line__height'>
                                You are appointed on the basis of the representation made or facts disclosed in your application
                                for appointment. In case of any fact or representation is found to be wrong or considered to be
                                connected to be concealed, it shall invalidate the appointment and shall deem to be
                                automatically cancelled.
                            </p>
                            <p className='line__height'>
                                You will be entitled to gross salary of <strong>{relievingletter.gross_salary}</strong> per month. Further details of your remuneration
                                and benefits are affixed.
                            </p>

                            <p className='line__height'>
                                You will be under probation for a period of <strong>{relievingletter.noties_period_text}</strong> during which your performance
                                will be assessed. On satisfactory completion of the probation period, you will be confirmed in
                                service. If not confirmed after six months, this order will continue to be in operation, and the
                                probation period will stand extended automatically till further notice.
                            </p>
                            <p className='line__height'>
                                On confirmation of employment, this appointment may be terminated by either side by giving
                                <strong> {relievingletter.noties_period_text}</strong> notice or <strong>{relievingletter.noties_period_text}’ </strong> salary in lieu of notice period.
                            </p>





                            <div className='Employment__Terms__Conditions'>
                                <p className='line__height'>
                                    You will be liable to be transferred to any other department or establishment or branch or
                                    subsidiary of the Company. In such a case, you will be governed by the terms and conditions
                                    of service as applicable to the new assignment.
                                </p>

                                <p className='line__height footer_top_adjustment'>
                                    We welcome you to the <strong>{relievingletter.company_name}</strong> family and trust we will have a long and mutually
                                    rewarding association.
                                </p>

                                <p className='line__height'>
                                    <strong>Employment Terms & Conditions</strong>
                                </p>


                                <p className='line__height' dangerouslySetInnerHTML={{ __html: formattedTermsandcondition }} />

                            </div>

                            <div className="text-start signature-section">
                                <p>For <strong>{relievingletter.company_name}</strong></p>
                                <div className="signature">
                                    {/* <img src="signature.png" alt="Signature" /> */}
                                </div>
                                <p><strong>{relievingletter.authorised_person_name}</strong></p>
                                <p>{relievingletter.authorised_person_designation}</p>
                            </div>
                        </div>

                        <div className="d-flex justify-content-between align-items-center footer">
                            <img src={`https://office3i.com/user/api/storage/app/${relievingletter.footer_attached}`} alt="Offerletter_Footer" className="logo" />
                        </div>

                    </div>


                </div>
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
