import React from 'react';
import paylogo from '../../../assets/admin/assets/img/EPK_group_Logo.png';
import jsPDF from 'jspdf';
// import numberToWords from 'number-to-words';
import 'jspdf-autotable';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

export default function Payslippdfview() {

    // ----------------------------------------------------------------------------------------------------------
    // FETCH THE ID USING USEPARAMS

    const { id } = useParams();

    console.log("pid", id)
    const [loading, setLoading] = useState(true);
    const [PayslipData, setPayslipData] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------------
    // PAYSLIP DATA FETCH FROM API

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/get_pdf_payslip_list/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                const { data } = response.data;
                setPayslipData(data);
                console.log('data-------------->', data);
                // console.log("API Response", data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching employee data:', error);
            }
        };

        fetchData();
    }, []);

    // ----------------------------------------------------------------------------------------------------------
    // FETCH THE CURRENT MONTH AND YEAR

    const currentDate = new Date();
    //const monthval=12;
    const months = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    // Assuming PayslipData is defined elsewhere in your code
    const payslipmonthyearvalue = PayslipData[0]?.payslipmonthyear;
    let monthval = '';
    let currentMonth = '';
    let currentYear = '';

    if (payslipmonthyearvalue) {
        const [year, month] = payslipmonthyearvalue.split('-');
        monthval = month;
        currentYear = year;
        currentMonth = months[parseInt(monthval) - 1];

    } else {
        console.error("payslipmonthyear is not defined or is empty");
    }

    // --------------------------------------------------------------------------------------------------------
    // EMPLOYEE PAYSLIP TOP DATA

    const [employeeData, setEmployeeData] = useState({
        // uanNumber: '123456789123',
        // employeeId: 'EPK0005',
        // pfNumber: 'MHBAN00000640000000125',
        // dateOfJoining: '26-12-2022',
        // department: 'IT',
        // dateOfConfirmation: '26-12-2022',
    });

    useEffect(() => {
        if (PayslipData.length > 0) {
            setEmployeeData(prevState => ({
                ...prevState,
                pan: PayslipData[0]?.pan_number,
                uanNumber: PayslipData[0]?.uan_number,
                currentDesignation: PayslipData[0]?.emp_designation,
                employeeName: PayslipData[0]?.emp_name,
                lop: PayslipData[0]?.emp_lop,
                workingdays: PayslipData[0]?.total_days_in_month,
            }));
        }
    }, [PayslipData]);

    // --------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------
    // EMPLOYEE PAYSLIP BODY DATA

    const tableData = [
        { description: 'Basic + DA', amount: Math.round(PayslipData[0]?.basic_da), deductionDescription: 'PF', deductionAmount: PayslipData[0]?.pf },
        { description: 'HRA', amount: Math.round(PayslipData[0]?.hra), deductionDescription: 'ESI', deductionAmount: PayslipData[0]?.esi },
        { description: 'Conveyance Allowance', amount: PayslipData[0]?.conveyance_allowance, deductionDescription: 'Salary Advance', deductionAmount: PayslipData[0]?.advance },
        { description: 'Transport Allowance', amount: PayslipData[0]?.transport_allowance, deductionDescription: 'Other Deduction', deductionAmount: PayslipData[0]?.other_deduction },
        { description: 'Medical Allowance', amount: Math.round(PayslipData[0]?.medical_allowance), deductionDescription: 'Loss Of Pay', deductionAmount: PayslipData[0]?.lop_amount },
        { description: 'Other Allowance', amount: Math.round(PayslipData[0]?.other_allowance), deductionDescription: '', deductionAmount: '' },
        { description: 'OverTime', amount: Math.round(PayslipData[0]?.emp_ot), deductionDescription: '', deductionAmount: '' },
        { description: 'Variable', amount: Math.round(PayslipData[0]?.variable), deductionDescription: '', deductionAmount: '' },
        { description: 'Gross Pay', amount: PayslipData[0]?.gross_pay, deductionDescription: 'Total Deductions', deductionAmount: PayslipData[0]?.overall_deduction },
        { description: '', amount: '', deductionDescription: 'Net Pay', deductionAmount: PayslipData[0]?.totalnetpay_amount },
    ];

    // --------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------
    // FUNCTION TO CONVERT NUMBER TO WORDS

    function numberToWords(number) {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

        if (number === 0) return 'Zero';

        let words = '';

        if (number >= 1000) {
            words += numberToWords(Math.floor(number / 1000)) + ' Thousand ';
            number %= 1000;
        }

        if (number >= 100) {
            words += ones[Math.floor(number / 100)] + ' Hundred ';
            number %= 100;
        }

        if (number >= 20) {
            words += tens[Math.floor(number / 10)] + ' ';
            number %= 10;
        } else if (number >= 11) {
            words += teens[number - 11] + ' ';
            number = 0;
        }

        if (number > 0) {
            words += ones[number] + ' ';
        }

        return words.trim();
    }

    const salary = PayslipData[0]?.totalnetpay_amount;
    const salaryInWords = numberToWords(salary);

    // --------------------------------------------------------------------------------------------------------



    // --------------------------------------------------------------------------------------------------------
    // PDF DESIGN START

    const pdfContainerRef = useRef(null);

   

    const handlePrint = useReactToPrint({
        content: () => pdfContainerRef.current,
        documentTitle: `payslip_${id}`,
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

    // --------------------------------------------------------------------------------------------------------
    // TABLE STYLES

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
        boxShadow: 'none'
    };

    const cellStyle = {
        border: '1px solid #8e8e8e',
    };
    const print = {
        display: 'none'
    };

    // --------------------------------------------------------------------------------------------------------




    return (
        <>


            <div className="container" style={{ width: '70%', marginTop: '20px', marginBottom: '2px', border: '1px solid #A4CED8', paddingBottom: '10px' }}>
                <div ref={pdfContainerRef} className='printcontainer'>
                    <div className="row" style={{ padding: '22px' }}>
                        <div className="col-5">
                            <img src={paylogo} alt='' style={{ width: '86%', height: '108px' }} />
                        </div>
                        <div className="col-7" style={{ borderLeft: '2px solid #000' }}>
                            <span style={{ display: 'flex', flexDirection: 'column' }}>
                                <h4>EPK Group</h4>
                                <p style={{ display: 'flex', justifyContent: 'center', fontSize: '19px', fontWeight: '400' }}>
                                    No:624,Anna Salai 4th floor,Khivraj Building, Near, Gemini Flyover, Tamil Nadu 600006
                                </p>
                                <h5>Salary Slip for the Month of {currentMonth} - {currentYear}</h5>
                            </span>
                        </div>
                    </div>
                    {/* ------------------------------------------------------------------------------------------------------------------ */}

                    <div className="row">
                        <div className="col-6" style={{ width: '42%' }}>
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>Employee Name:</span> {PayslipData[0]?.emp_name}</h6>
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>Designation:</span> {PayslipData[0]?.emp_designation}</h6>
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>No of Working Days:</span> {PayslipData[0]?.total_days_in_month}</h6>

                        </div>
                        <div className="col-6">
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>UAN number:</span> {PayslipData[0]?.uan_number}</h6>
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>PAN Number:</span> {PayslipData[0]?.pan_number}</h6>
                            <h6><span style={{ color: 'bold', fontWeight: 'bold' }}>LOP days  :</span> {PayslipData[0]?.emp_lop}</h6>
                        </div>
                    </div>
                    {/* ------------------------------------------------------------------------------------------------------------------ */}

                    {/* ------------------------------------------------------------------------------------------------------------------ */}


                    <table className="table" style={tableStyle}>
                        <thead>
                            <tr>
                                <th colSpan="2" scope="col" style={{ textAlign: 'center', border: '1px solid #8e8e8e' }}>
                                    Earnings
                                </th>
                                <th colSpan="2" scope="col" style={{ textAlign: 'center', border: '1px solid #8e8e8e' }}>
                                    Deduction
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th style={{ ...cellStyle, width: '25%' }}>Description</th>
                                <th style={{ ...cellStyle, textAlign: 'right', width: '12%' }}>Amount</th>
                                <th style={{ ...cellStyle, width: '25%' }}>Description</th>
                                <th style={{ ...cellStyle, textAlign: 'right', width: '25%' }}>Amount</th>
                            </tr>
                            {tableData.map((row, index) => (
                                <tr key={index}>
                                    <td style={cellStyle}>{row.description}</td>
                                    <td style={{ ...cellStyle, textAlign: 'right' }}>{row.amount}</td>
                                    <td style={cellStyle}>{row.deductionDescription}</td>
                                    <td style={{ ...cellStyle, textAlign: 'right' }}>{row.deductionAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* ------------------------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------------------------ */}
                    <p style={{ fontSize: '14px', padding: '20px 0px', fontWeight: '500', backgroundColor: '#e9f7e7', }}>
                        <span style={{ color: '#0A62F1', fontWeight: 'bold' }}>|</span>
                        Total Net Payable - <span style={{ color: '#0A62F1', fontWeight: 'bold' }}>{salary}</span> {salaryInWords}
                        {/* {getTotalNetPayableInWords(totalNetPayable)} */}
                    </p>

                    <p className="hidden-print" style={print}>This is a system generated payslip, hence the signature is not required</p>

                    {/* ------------------------------------------------------------------------------------------------------------------ */}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginLeft: '10.5rem', marginTop: '50px', marginBottom: '20PX' }}>
                <button className="btn btn-primary" onClick={handlePrint}>
                    View & Download
                </button>
            </div>

        </>
    );
}
