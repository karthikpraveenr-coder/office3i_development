import React, { useEffect, useRef, useState } from 'react';
import '../css/RelievingLetter.css'; // Import the CSS file for styling

import logo from '../images/Relievinghead.png'
import footer from '../images/Relievingfoot.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const RelievingLetter = () => {

    const { id } = useParams();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // --------------------------------------------------------------------------------------------
    const [relievingletter, setRelievingletter] = useState()
    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/edit_relieving_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    // console.log("setData----------->", res.data.data)
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
             
                .hidden-print {
                    display: block !important;
                    text-align: center;
                }
            }
        `
    });

    // PDF DESIGN END
    // --------------------------------------------------------------------------------------------------------

    return (
        <>
            {relievingletter && (
                <div className="a4-container">
                    <div ref={pdfContainerRef} className="content">
                        <div className="d-flex justify-content-between align-items-center mb-5 header">
                            <img src={`https://office3i.com/development/api/storage/app/${relievingletter.header_attachment}`} alt="Stark Industries Logo" className="logo" />
                        </div>

                        <div className='relieving__letter__boday'>
                            <h4 className="text-center mb-4 relieving__letter">RELIEVING LETTER</h4>

                            <p className="text-end">{relievingletter.date}</p>

                            <p className='line__height mt-5'>
                                This is to certify that <strong>{relievingletter.employee_name}</strong> was employed with <strong>{relievingletter.company_name}</strong> from <strong>{relievingletter.joining_date} to {relievingletter.last_working_day}</strong>.
                            </p>
                            <p className='line__height'>
                                Throughout this tenure, <strong>{relievingletter.employee_name}</strong> has diligently fulfilled their responsibilities as a <strong>{relievingletter.designation}</strong>.
                                Your dedication and contribution to the team has been valuable.
                            </p>

                            <p className='line__height'>
                                We acknowledge that you have returned any and all properties of the Company and have completed all formalities with respect to your cessation of employment with the Company.

                            </p>

                            <p>
                                We wish you all the best for your future endeavors.
                            </p>

                            <div className="text-start signature-section">
                                <p>For <strong>{relievingletter.company_name}</strong></p>
                                <div className="signature">
                                    {/* <img src="signature.png" alt="Signature" /> */}
                                </div>
                                <p><strong>{relievingletter.authorised_person_name}</strong></p>
                                <p>{relievingletter.authorised_person_designation}</p>
                            </div>
                        </div>
                        
                        <div className="footer text-center">

                            <img src={`https://office3i.com/development/api/storage/app/${relievingletter.footer_attached}`} alt="Offerletter_Footer" className="logo" />
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

export default RelievingLetter;
