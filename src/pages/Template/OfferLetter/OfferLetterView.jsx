import React, { useEffect, useRef, useState } from 'react';
import '../css/RelievingLetter.css'; // Import the CSS file for styling

import logo from '../images/Relievinghead.png'
import footer from '../images/Relievingfoot.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';


const AppointmentLetterView = () => {

    const { id, layout_id } = useParams();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // --------------------------------------------------------------------------------------------
    const [relievingletter, setRelievingletter] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const offerResponse = axios.get(`https://office3i.com/development/api/public/api/edit_offer_list/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                const headerFooterResponse = axios.get(`https://office3i.com/development/api/public/api/edit_header_footer/${layout_id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                // Wait for both requests to resolve
                const [offerRes, headerFooterRes] = await Promise.all([offerResponse, headerFooterResponse]);

                if (offerRes.status === 200 && headerFooterRes.status === 200) {
                    console.log("Offer Data:", offerRes.data.data);
                    console.log("Header/Footer Data:", headerFooterRes.data.data);

                    // Assuming you want to combine both responses into relievingLetter
                    const combinedData = {
                        offerData: offerRes.data.data,
                        headerFooterData: headerFooterRes.data.data
                    };

                    setRelievingletter(combinedData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id, layout_id, usertoken]);

    // --------------------------------------------------------------------------------------------------------
    // PDF DESIGN START

    const pdfContainerRef = useRef(null);
    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });

    function formatApiDate(apiResponseDate) {
        // Create a new Date object from the API response
        const date = new Date(apiResponseDate);
    
        // Format the date to DD-MM-YYYY
        return format(date, 'dd-MM-yyyy');
    }

    const styles = StyleSheet.create({
        body: {
            paddingTop: 120,
            paddingBottom: 120,
            paddingHorizontal: 35,
            fontFamily: 'Times-Roman'
        },
        bold: {
            fontWeight: 'bold', // Make text bold
        },
        title: {
            marginTop: 10,
            fontSize: 24,
            textAlign: 'center',
        },
        head_date: {
            textAlign: 'right',
            fontSize: '15px',
            marginTop: '15px',
            marginBottom: '20px',
            fontWeight: 'bold',
        },
        to_content: {
            fontSize: '15px',
            marginTop: '15px',
            fontWeight: 'bold',
        },
        candidate_name: {
            fontSize: '15px',
            marginTop: '15px',
            fontWeight: 'bold',
        },
        candidate_address: {
            fontSize: '15px',
            marginTop: '5px',
        },
        start_date: {
            marginTop: '20px',
            fontSize: '15px',
            fontWeight: 'normal',
        },
        line__height: {
            marginTop: '15px',
            fontSize: '15px',
            fontWeight: 'normal',
        },
        for_company: {
            marginTop: '35px',
            fontSize: '15px',
            fontWeight: 'bold',
        },
        for_hr_depart: {
            marginTop: '25px',
            marginBottom: '25px',
            fontSize: '15px',
            fontWeight: 'bold',
        },

        on_the_day_joining: {
            marginTop: '15px',
            fontSize: '15px',
            fontWeight: 'normal',
        },
        authorised_sign: {
            marginTop: '35px',
            marginBottom: '15px',
            fontSize: '15px',
            fontWeight: 'normal',
        },
        footer_sign_date: {
            marginTop: '12px',
            fontSize: '15px',
            fontWeight: 'normal',
        },
        author: {
            fontSize: 12,
            textAlign: 'center',
            marginBottom: 40,
        },
        subtitle: {
            fontSize: 18,
            margin: 12,
            fontFamily: 'Oswald'
        },
        text: {
            margin: 12,
            fontSize: 14,
            textAlign: 'justify',
            fontFamily: 'Times-Roman'
        },
        image: {
            // marginVertical: 15,
            // marginHorizontal: 100,
            // maxWidth:'100px'
            top: 15,
            left: 0,
            right: 0,
            position: 'absolute',
            width: '100%',
            height: '100px',
            objectFit: 'contain',
        },
        image_footer: {
            width: '100%',
            height: '100px',
            objectFit: 'contain',
            position: 'absolute',
            bottom: 15,
            left: 0,
            right: 0,
            // position: 'absolute'
        },
        header: {
            // fontSize: 12,
            marginBottom: 20,
            textAlign: 'center',
            color: 'grey',
        },
        pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },
        bracket: {
            borderBottom: '1px solid #000', // Adds a line for visual representation
            width: 100, // Adjust as necessary for length
            marginLeft: 5, // Space between label and line
        },
    });



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
    console.log('this is reliving letter image', relievingletter);

    // PDF DESIGN END
    // --------------------------------------------------------------------------------------------------------
    // const formattedBenefits = relievingletter ? relievingletter.offerData?.benefits?.replace(/\n/g, '<br />') || '' : '';
    const formattedBenefits = relievingletter?.offerData?.benefits
        ? relievingletter.offerData.benefits.replace(/\n/g, '<br />')
        : '';

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
        const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    };
    return (
        <>
            {relievingletter && (
                <div className="a4-container-offer-letter">
                    <div className="content" ref={pdfContainerRef}>

                        <PDFViewer style={{
                            width: '100%', // Set width to 100% of the parent container
                            height: '700px', // Set a fixed height
                            border: '1px solid #000', // Optional: Add border for visibility
                        }}>

                            <Document>
                                <Page style={styles.body}>
                                    <Image
                                        style={styles.image} fixed
                                        src={`https://office3i.com/development/api/storage/app/${relievingletter.headerFooterData.header_layout ? relievingletter.headerFooterData.header_layout : ''}`}
                                        // src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg'}

                                    />

                                    <Text style={styles.title}>EMPLOYEE OFFER LETTER</Text>
                                    <Text style={styles.head_date}> {formatDate(relievingletter.offerData?.date)}</Text>

                                    {'\n'}<Text style={styles.on_the_day_joining}>{relievingletter.offerData?.name}</Text>
                                    {'\n'}<Text style={styles.on_the_day_joining}>{relievingletter.offerData?.address_line1}</Text>
                                    {'\n'}<Text style={styles.on_the_day_joining}>{relievingletter.offerData?.address_line2}</Text>

                                    <Text style={styles.line__height}>We are pleased to offer you the position of <Text style={styles.bold}>{relievingletter.offerData?.designation}</Text> at <Text style={styles.bold}>{relievingletter.offerData?.company_name}</Text>.  We trust that your experience and skills will be valuable assets to our company.
                                    </Text>

                                    {/* <Text style={styles.line__height}>
                                        You will be entitled to an annual cost to company (CTC) of <Text style={styles.bold}>{relievingletter.offerData?.annual_ctc}</Text>. Your working hours will be from <Text style={styles.bold}>11:07AM to 11:08PM on 30</Text>.
                                    </Text> */}
                                    <Text style={styles.line__height}>
                                        You will be entitled to an annual cost to company (CTC) of <Text style={styles.bold}>Rs. {relievingletter.offerData?.annual_ctc}</Text>.
                                        Your working hours will be from <Text style={styles.bold}>{relievingletter.offerData?.working_hrs_from ? relievingletter.offerData.working_hrs_from : ''} to {relievingletter.offerData?.working_hrs_to ? relievingletter.offerData.working_hrs_to : ''}</Text> for <Text style={styles.bold}>{relievingletter.offerData?.working_day ? relievingletter.offerData.working_day : ''} {relievingletter.offerData?.working_day > 1 ? 'days' : 'day'}</Text>.
                                    </Text>

                                    <Text style={styles.line__height}>
                                        You will be on probation for a period of <Text style={styles.bold}>{relievingletter.offerData?.probation_period ? relievingletter.offerData.probation_period : ''}</Text>.
                                    </Text>

                                    <Text style={styles.line__height}>
                                        Upon acceptance of the terms and conditions as outlined in this offer letter, either you or the Company may terminate your employment by providing <Text style={styles.bold}>{relievingletter.offerData?.noties_period ? relievingletter.offerData.noties_period : ''} notice</Text>.
                                    </Text>

                                    <Text style={styles.line__height}>
                                        <Text style={styles.bold}>Benefits for this position include:</Text>
                                    </Text>

                                    {formattedBenefits.split('\n').map((line, index) => (
                                        <Text key={index} style={styles.line__height}>
                                            {line}
                                        </Text>
                                    ))}

                                    <Text style={styles.line__height}>
                                        We would like you to begin work on <Text style={styles.bold}>{relievingletter.offerData.date ?formatApiDate(relievingletter.offerData.date) : ''}</Text> and report to <Text style={styles.bold}>{relievingletter.offerData.supervisor_name ? relievingletter.offerData.supervisor_name : ''}</Text>.
                                    </Text>

                                    <Text style={styles.line__height}>
                                        To accept this offer please sign the enclosed copy of this letter and return it
                                        via email by <Text style={styles.bold}>{relievingletter.offerData.last_date_offer ? formatApiDate(relievingletter.offerData.last_date_offer) : ''}</Text> to confirm your acceptance.
                                    </Text>

                                    <Text style={styles.line__height}>
                                        With regards,
                                        <Text style={styles.line__height}>
                                            {'\n'}<Text style={styles.bold}>{relievingletter.offerData.authorised_person_name ? relievingletter.offerData.authorised_person_name : ''},</Text>
                                            {'\n'}<Text style={styles.line__height}>
                                                <Text style={styles.bold}>{relievingletter.offerData.authorised_designation ? relievingletter.offerData.authorised_designation : ''}.</Text>
                                            </Text>
                                        </Text>
                                    </Text>

                                    <Text style={styles.line__height}>
                                        <Text style={styles.bold}>Employee Acceptance:</Text>
                                        <Text style={styles.line__height}>
                                            {'\n'}I accept the terms and conditions outlined in this offer of employment. I will maintain the confidentiality of the contents of this document.
                                        </Text></Text>

                                    <Text style={styles.line__height}>
                                        Name: <Text style={styles.bracket}></Text>
                                    </Text>
                                    <Text style={styles.line__height}>
                                        Signature: <Text style={styles.bracket}></Text>
                                    </Text>
                                    <Text style={styles.line__height}>
                                        Date: <Text style={styles.bracket}></Text>
                                    </Text>


                                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                                        `${pageNumber} / ${totalPages}`
                                    )} fixed />

                                    <Image
                                        style={styles.image_footer} fixed
                                        src={`https://office3i.com/development/api/storage/app/${relievingletter.headerFooterData?.footer_layout}`}
                                        // src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg'}
                                    />
                                </Page>

                            </Document>

                        </PDFViewer>

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
