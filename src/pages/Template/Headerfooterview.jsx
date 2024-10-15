import React, { useEffect, useRef, useState } from 'react';
import './css/RelievingLetter.css'; // Import the CSS file for styling


import logo from './images/Relievinghead.png'
import footer from './images/Relievingfoot.png'
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
        axios.get(`https://office3i.com/development/api/public/api/edit_header_footer/${id}`, {
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
                            <img src={`https://office3i.com/development/api/storage/app/${relievingletter.header_layout}`} alt="Offerletter_header" className="logo" />
                        </div>

                        <h4 className="text-center mb-4" style={{marginTop:'-15px'}}>LETTER HEADER</h4>


                        <div className='accept__Terms__Conditions' style={{marginTop:'15%', marginBottom:'15%'}}>
                        {/* <h4 className="text-center mb-4">----------- Content -----------</h4> */}
                        </div>


                        <div className="d-flex justify-content-between align-items-center mb-5 footer">
                            <img src={`https://office3i.com/development/api/storage/app/${relievingletter.footer_layout}`} alt="Offerletter_Footer" className="logo" />
                        </div>
                        <h4 className="text-center mb-4">LETTER FOOTER</h4>

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
