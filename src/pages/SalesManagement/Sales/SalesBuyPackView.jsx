import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toWords } from 'number-to-words';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';

const SalesBuyPackView = () => {
    const { id } = useParams();
    // ------------------------------------------------------------------------------------------------


    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    const [invoicedata, setInvoicedata] = useState("");

    // ------------------------------------------------------------------------------------------------



    const pdfContainerRef = useRef(null);

    const amount = Number(invoicedata.overall_amt);
    let amountInWords = Number.isFinite(amount) ? toWords(amount).replace(/and/g, '').replace(/,/g, '') : '';

    if (amountInWords.includes("thous")) {
        amountInWords = amountInWords.replace(/thous/g, 'thousand');
    }
    amountInWords = amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1);

    const handlePrint = useReactToPrint({
        content: () => pdfContainerRef.current,
        documentTitle: `PROFORMAINVOICE_${id}`,
        pageStyle: `
            @page {
                size: A4;
                margin: 0;
            }
            body {
                margin: 1cm;
                padding: 1cm;
                -webkit-print-color-adjust: exact;
            }
            @media print {
                .table-bordered {
                    border-collapse: collapse;
                }
                .table-bordered th,
                .table-bordered td {
                    border: 1px solid #000 !important;
                    padding: 8px !important;
                }
                .hidden-print {
                    display: none !important;
                }
                .print-font-small {
                    font-size: 10px;
                }
                .print-font-medium {
                    font-size: 12px;
                }
                .print-font-large {
                    font-size: 24px;
                }
            }
        `
    });


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/getbuybowpacksalesviewlist/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                if (response.data.status === "success") {
                    const { Leadlist, Leadstatus } = response.data.data;

                    const data = Leadlist;
                    // Handle the data here
                    console.log("welcome-------------->", data)
                    // setInvoicenumber(data.transaction_id)
                    setInvoicedata(data)
                    // setFirstName(data.cus_name)
                    // setEmail(data.cus_email)
                    // setMobile(data.cus_mobile)
                    // setCompanyName(data.cus_companyname)
                    // setPassword(data.cus_password)
                    // setSelectedPlan(data.plan_id)
                    // setSelectedModule(data.module_id)
                    // setMode(data.demo_mode)
                    // setMode(data.demo_mode)

                    // setSelectedDepartment(data.assign_department)

                    // setSelectedEmployee(data.assign_member)
                    // setGstin(data.cus_gstin)
                    // setBillingAddress(data.cus_billing_address)

                    // setPincode(data.cus_pincode)
                    // setSelectedPaymentMethod(data.payment_method)
                    // setReason(data.pay_reason)
                    // setSelectedPaymentStatus(data.payment_status)
                    // // setOfflineProof(data.payment_status)

                    // setSelectedCountry(data.cus_country)
                    // setSelectedState(data.cus_state)
                    // setSelectedCity(data.cus_city)

                    // setPlanDuration(data.plan_period)
                    // setEmployeeCount(data.add_emp_count)
                    // setGst(data.tax_amt)
                    // setOverallAmount(data.overall_amt)
                    // setDiscountamount(data.discount_amount)

                    // setAddedEmployeeAmount(parseInt(data.add_emp_amt))
                }
            } catch (error) {
                console.error('There was an error fetching the data!', error);
            }
        };

        fetchData();
    }, [id, usertoken]);

    const SGST = invoicedata.tax_amt / 2;
    const CGST = invoicedata.tax_amt / 2;


    return (
        <div className="container mt-4" style={{ width: '210mm', height: '297mm' }}>
            <div ref={pdfContainerRef}>
                <table style={{ boxShadow: 'none', borderColor: '#000000', width: '100%', height: '100%', border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                    <thead>
                        <tr>
                            <th colSpan="7" className="text-center print-font-large">
                                <h3>{invoicedata.payment_statusname === 'Paid' ? 'INVOICE' : 'PROFORMA INVOICE'}</h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', verticalAlign: 'top' }}>
                                <strong>Office3i</strong><br />
                                No:624, Anna Salai, 4th Floor, Khivraj Buildings, Chennai-600006<br />
                                GSTIN/UIN: 33AOJPK8656H2ZL<br />
                                State Name: Tamil Nadu, Code : 33<br />
                                Phone : 9876543210 Mail : abcd123@gmail.com
                            </td>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', verticalAlign: 'top' }}>
                                <strong>Invoice No.</strong><br /> {invoicedata.transaction_id}<br />
                            </td>
                            <td colSpan="3" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', verticalAlign: 'top' }}>
                                <strong>Dated</strong><br /> {invoicedata.start_date}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Buyer (Bill to)</strong><br />
                                <strong>{invoicedata.cus_companyname}</strong><br />
                                {invoicedata.cus_billing_address}<br />
                                GSTIN/UIN: {invoicedata.cus_gstin}<br />
                                State Name: {invoicedata.state_name}
                            </td>
                            <td colSpan="5" className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                        </tr>
                        <tr>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>S.No</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Description of Products</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>HSN/SAC</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Quantity</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Rate</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Per</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Amount</td>
                        </tr>



                        <tr>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>1.</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}><strong>{invoicedata.plan_name}</strong><br />
                                {/* {(invoicedata.state_name || '').split('\n').map((line, i) => <div key={i}>{line}</div>)} */}

                            </td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{998313}</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                        </tr>
                        <tr>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>Plan Amount ( {invoicedata.plan_period} )</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>1</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{invoicedata.plan_amt}</td>
                        </tr>
                        <tr style={{ height: '18vh', verticalAlign: 'top' }}>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>Added Employee Amount</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{invoicedata.add_emp_count}</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}></td>
                            <td className="print-font-small text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{invoicedata.add_emp_amt}</td>
                        </tr>

                        {invoicedata.statecodegstname !== "Tamilnadu" && (

                            <tr>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>Output IGST 18%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>18%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>{invoicedata.tax_amt}</td>
                            </tr>
                        )}

                        {invoicedata.statecodegstname == "Tamilnadu" && (
                            <>
                                <tr>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>Output SGST 9%</td>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>9%</td>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>{SGST}</td>
                                </tr>

                                <tr>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>Output CGST 9%</td>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>9%</td>
                                    <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                    <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>{CGST}</td>
                                </tr>
                            </>
                        )}

                        <tr className="print-font-medium">
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className="text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Total</td>
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='text-right' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}><FontAwesomeIcon icon={faIndianRupeeSign} /> <strong>{invoicedata.overall_amt}</strong></td>
                        </tr>
                        <tr className="print-font-medium">
                            <td colSpan="2" className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', verticalAlign: 'top' }}>
                                <strong>Amount Chargeable (in words)</strong><br />
                                {amountInWords} Only
                            </td>
                            <td colSpan="5" className="table-border" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <p className="text-right">E & O E</p>
                                <strong>Company's Bank Details</strong><br />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>A/c Holder's Name</strong>
                                        <span>: Office3i</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>Bank Name</strong>
                                        <span>: Indian Bank</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>A/c No</strong>
                                        <span>: 1234567890</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>Branch & IFSC Code</strong>
                                        <span>: Thousand Light, Chennai & IDIB000T020</span>
                                    </div>
                                </div>
                            </td>


                        </tr>
                        <tr className="print-font-medium">
                            <td colSpan="2" className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Declaration</strong><br />
                                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                            </td>
                            <td colSpan="5" className="text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <span style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <span>for Office3i</span><br />
                                    <span style={{ paddingTop: '23px' }}>Authorised Signatory</span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="7" className="text-center print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <p>This is a Computer Generated Invoice</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 20px' }}>
                <button className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
            </div>
        </div>
    );
};

export default SalesBuyPackView;
