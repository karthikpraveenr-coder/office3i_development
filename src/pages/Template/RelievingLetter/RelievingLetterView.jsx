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

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

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
        marginTop:10,
        fontSize: 24,
        textAlign: 'center',
    },
    head_date: {
        textAlign: 'right',
        fontSize: '15px',
        marginTop: '15px',
        marginBottom:'20px',
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
    for_company:{
        marginTop: '35px',
        fontSize: '15px',
        fontWeight: 'bold', 
    },
    for_hr_depart:{
        marginTop: '35px',
        marginBottom: '25px',
        fontSize: '15px',
        fontWeight: 'bold', 
    },
    
    on_the_day_joining: {
        marginTop: '15px',
        fontSize: '15px',
        fontWeight: 'normal',
        marginLeft: '25px',
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
});


const RelievingLetter = () => {

    const { id, layout_id } = useParams();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // --------------------------------------------------------------------------------------------
    const [relievingletter, setRelievingletter] = useState()


    useEffect(() => {
        const fetchData = async () => {
            try {
                const ReliveResponse = axios.get(`https://office3i.com/development/api/public/api/edit_relieving_list/${id}`, {
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
                const [reliveRes, headerFooterRes] = await Promise.all([ReliveResponse, headerFooterResponse]);

                if (reliveRes.status === 200 && headerFooterRes.status === 200) {
                    console.log("Offer Data:", reliveRes.data.data);
                    console.log("Header/Footer Data:", headerFooterRes.data.data);

                    // Assuming you want to combine both responses into relievingLetter
                    const combinedData = {
                        reliveData: reliveRes.data.data,
                        headerFooterData: headerFooterRes.data.data
                    };

                    setRelievingletter(combinedData)
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
        const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    };


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

                    <PDFViewer style={{
                        width: '100%', // Set width to 100% of the parent container
                        height: '700px', // Set a fixed height
                        border: '1px solid #000', // Optional: Add border for visibility
                    }}>

                        <Document>
                            <Page style={styles.body}>
                                <Image
                                    style={styles.image} fixed
                                    src={`https://office3i.com/development/api/storage/app/${relievingletter.headerFooterData?.header_layout}`}
                                    // src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg'}
                               />

                                <Text style={styles.head_date}>Date : {formatDate(relievingletter.reliveData?.date)}</Text>
                                <Text style={styles.title}>RELIEVING CUM EXPERIENCE LETTER</Text>

                                <Text style={styles.start_date}>
                                 This to certify that <Text style={styles.bold}>{relievingletter.reliveData?.salutation} {relievingletter.reliveData?.employee_name}</Text> was associated with our organization from <Text style={styles.bold}>{formatDate(relievingletter.reliveData?.joining_date)}</Text> to <Text style={styles.bold}>{formatDate(relievingletter.reliveData?.last_working_day)}</Text> with an annual package of Rs.<Text style={styles.bold}>{relievingletter.reliveData?.converted_annual_salary_number} (Rupees {relievingletter.reliveData?.converted_annual_salary_text})</Text> and the last designation held by her/him during the time of relieving was that of <Text style={styles.bold}>{relievingletter.reliveData?.designation}</Text>.</Text>
                                 <Text style={styles.line__height}>During his/her tenure with us for the above period, we found him/her efficient, his/her
                                 character and conduct were good.</Text>
                                 <Text style={styles.line__height}>We wish him/her the best in his/her future endeavor.</Text>
                              
                                 <Text style={styles.for_company}>For {relievingletter.reliveData?.company_name},</Text>

                                 <Text style={styles.for_hr_depart}>HR DEPARTMENT</Text>
                                 
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
