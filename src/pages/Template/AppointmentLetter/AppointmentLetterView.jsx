import React, { useEffect, useRef, useState } from 'react';
import '../css/RelievingLetter.css'; // Import the CSS file for styling
// import { PDFDownloadLink, Document, Page, Text, Image, Font, ReactPDF, Quixote } from '@react-pdf/renderer';

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import { PDFViewer } from '@react-pdf/renderer';

import logo from '../images/Relievinghead.png'
import footer from '../images/Relievingfoot.png'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';



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
        fontSize: 24,
        textAlign: 'center',
    },
    head_date: {
        textAlign: 'right',
        fontSize: '15px',
        marginTop: '15px',
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


const AppointmentLetterView = (dummy_images) => {

    const { id, layout_id } = useParams();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // --------------------------------------------------------------------------------------------
    const [relievingletter, setRelievingletter] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const appointmentResponse = axios.get(`https://office3i.com/development/api/public/api/edit_appointment_list/${id}`, {
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
                const [appointmentRes, headerFooterRes] = await Promise.all([appointmentResponse, headerFooterResponse]);

                if (appointmentRes.status === 200 && headerFooterRes.status === 200) {
                    console.log("Appoin Data:", appointmentRes.data.data);
                    console.log("Header/Footer Data:", headerFooterRes.data.data);

                    // Assuming you want to combine both responses into relievingLetter
                    const combinedData = {
                        appoinData: appointmentRes.data.data,
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

    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); // Get day with leading zero
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
        const year = String(date.getFullYear()).slice(2); // Get last two digits of the year
        return `${day}-${month}-${year}`;
    };


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
                .header, .footer {
                    position: fixed;
                    left: 0;
                    right: 0;
                    width: 100%;
                    z-index: 1000;
                }
                    

                .additional-lines {
                margin-top: 20px;
                }
               .hidden-print {
                display: block !important;
                text-align: center;
                }

                .header {
                top: 0;
               }
                .footer {
                bottom: 0;
               }
                .content {
                margin-top: 100px; 
                margin-bottom: 100px;
               }`
    });

    // const handlePrint_1 = () => {
    //     html2canvas(pdfContainerRef.current, { scale: 2 }).then(canvas => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const pdf = new jsPDF('p', 'pt', 'a4');
    //         const imgWidth = 190; // Set the image width according to your PDF page
    //         const pageHeight = pdf.internal.pageSize.height;
    //         const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //         let heightLeft = imgHeight;

    //         let position = 0;

    //         pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    //         heightLeft -= pageHeight;

    //         while (heightLeft >= 0) {
    //             position = heightLeft - imgHeight;
    //             pdf.addPage();
    //             pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    //             heightLeft -= pageHeight;
    //         }

    //         pdf.save('appointment_letter.pdf');
    //     });
    // };


    // PDF DESIGN END
    // --------------------------------------------------------------------------------------------------------


    const formattedTermsandcondition = relievingletter?.appoinData?.employment_tc?.replace(/\n/g, '<br />') || '';

    return (
        <>
            {relievingletter && (
                <div className="a4-container-appointment">

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
                                />

                                <Text style={styles.title}>EMPLOYEE APPOINTMENT LETTER</Text>
                                <Text style={styles.head_date}>Date : {formatDate(relievingletter.appoinData?.start_date)}</Text>

                                <Text style={styles.to_content}>To,</Text>
                                <Text style={styles.candidate_name}>{relievingletter.appoinData.candidate_name ? relievingletter.appoinData.candidate_name : ''}</Text>
                                <Text style={styles.candidate_address}>{relievingletter.appoinData.address_line1 ? relievingletter.appoinData.address_line1 : ''}</Text>
                                <Text style={styles.candidate_address}>{relievingletter.appoinData.address_line2 ? relievingletter.appoinData.address_line2 : ''}</Text>
                                <Text style={styles.start_date}>
                                    With reference to your application to our organization and the subsequent interview you had with
                                    us, we are pleased to confirm your Appointment as <Text style={styles.bold}>{relievingletter.appoinData?.designation}</Text> at our organization from <Text style={styles.bold}>{formatDate(relievingletter.appoinData?.start_date)}</Text>
                                </Text>
                                <Text style={styles.line__height}>
                                    You will be entitled to <Text style={styles.bold}>Annual CTC</Text> of Rupees <Text style={styles.bold}>{relievingletter.appoinData?.converted_annual_salary_text}</Text> only
                                </Text>
                                <Text style={styles.on_the_day_joining}>
                                    On the day of joining, you have submitted the photocopy of the following:
                                </Text>

                                <Text style={styles.on_the_day_joining}>1. Educational Certificates</Text>
                                {'\n'}  <Text style={styles.on_the_day_joining}>2. Address Proof along with an ID Proof</Text>
                                {'\n'}  <Text style={styles.on_the_day_joining}>3. One Passport-Sized Photograph</Text>
                                {'\n'}  <Text style={styles.on_the_day_joining}>4. Relieving Letter from Previous Employer (if applicable)</Text>

                                <Text style={styles.line__height}>
                                    You will be under probation for a period of <Text style={styles.bold}>{relievingletter.appoinData?.probation_period}</Text>, during which your performance will be
                                    assessed. Your confirmation of service will depend on the performance during the probation period.
                                </Text>

                                <Text style={styles.line__height}>
                                    The management has the right to terminate the employment at any point of time by giving a {relievingletter.appoinData?.noties_period_text} notice or a {relievingletter.appoinData?.noties_period_text} salary in lieu of the notice. Similarly, if any employee wishes to resign
                                    should serve a {relievingletter.appoinData?.noties_period_text} notice or a {relievingletter.appoinData?.noties_period_text} salary in lieu of the notice. In the case of termination due
                                    to any mal practice or violation of agreement terms, the company reserves the right to terminate
                                    the employment without notice and claim compensation.
                                </Text>

                                <Text style={styles.line__height}>You shall bind yourself to follow the rules, regulations and directions of the company, issued from
                                    time to time and presently in force. You are liable to be shifted from one job or department
                                    depending on the company’s requirement.</Text>

                                <Text style={styles.line__height}> You are appointed on the basis of the representation made or facts disclosed in your application for
                                    appointment. In case of any fact or representation is found to be wrong or considered to be
                                    connected to be concealed, it shall invalidate the appointment and shall deem to be automatically
                                    cancelled.</Text>

                                <Text style={styles.line__height}> The company expects you to work high standards of initiative, efficiency and economy. During the
                                    course of your employment, you shall not engage yourself in any other regular/part-time services or
                                    work without permission in writing from the organization.</Text>

                                <Text style={styles.line__height}>
                                    You will be expected to comply with a proprietary Information Non-Disclosure Agreement as a part
                                    of this contract. Please return the duplicate copy of this offer after affixing your signature as mark of
                                    your acceptance of this offer.
                                </Text>

                                <Text style={styles.line__height}>
                                    We welcome you to organization and trust that you will enjoy working here and in contributing to
                                    the growth and prosperity of the company.
                                </Text>

                                <Text style={styles.line__height}>
                                    <Text style={styles.bold}>All the best!</Text>
                                </Text>

                                <Text style={styles.authorised_sign}>
                                    <Text style={styles.bold}>Authorized Signatory,</Text>
                                </Text>

                                {'\n'}<Text style={styles.line__height}>I agree to the contract of working minimum six months in this organization from my date of joining.</Text>
                                {'\n'}<Text style={styles.line__height}>I hereby confirm my acceptance to all terms set forth above:</Text>

                                {'\n'}<Text style={styles.footer_sign_date}><Text style={styles.bold}>Signature:</Text></Text>
                                {'\n'}<Text style={styles.footer_sign_date}><Text style={styles.bold}>Date:</Text></Text>
                                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                                    `${pageNumber} / ${totalPages}`
                                )} fixed />
                                <Image
                                    style={styles.image_footer} fixed
                                    src={`https://office3i.com/development/api/storage/app/${relievingletter.headerFooterData.footer_layout ? relievingletter.headerFooterData.footer_layout : ''}`}
                                    // src={'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_640.jpg'}
                                />
                            </Page>

                        </Document>

                    </PDFViewer>

                </div>
            )}

            <div>
                {/* <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading document...' : 'Download now!'
                    }
                </PDFDownloadLink> */}
            </div>
            
            {/* <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10.5rem', marginTop: '50px', marginBottom: '20PX' }}>
                <button className="btn btn-primary" onClick={handlePrint}>
                    View & Download
                </button>
            </div> */}

        </>
    );
};

export default AppointmentLetterView;
