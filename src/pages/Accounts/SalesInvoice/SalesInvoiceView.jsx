import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import './Invoice.css'
import { toWords } from 'number-to-words';
import axios from 'axios';

const SalesInvoiceView = () => {
    const { id } = useParams();
    // ------------------------------------------------------------------------------------------------


    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [companyDetails, setCompanyDetails] = useState({});
    const [buyerDetails, setBuyerDetails] = useState({});

    const [cgstType, setCgstType] = useState('');
    const [sgstType, setSgstType] = useState('');
    const [igstType, setIgstType] = useState('');

    const [igstAmount, setIgstAmount] = useState('');
    const [cgstAmount, setCgstAmount] = useState('');
    const [sgstAmount, setSgstAmount] = useState('');

    const [items, setItems] = useState([{
        descriptionalGoods: '',
        hsnSac: '',
        quantity: '',
        rate: '',
        per: '',
        amount: ''
    }]);
    const [totalAmount, setTotalAmount] = useState('');
    // const [amountInWords, setAmountInWords] = useState('');
    const [bankDetails, setBankDetails] = useState({});

    const pdfContainerRef = useRef(null);

    const amount = Number(totalAmount);
    let amountInWords = Number.isFinite(amount) ? toWords(amount).replace(/and/g, '').replace(/,/g, '') : '';

    if (amountInWords.includes("thous")) {
        amountInWords = amountInWords.replace(/thous/g, 'thousand');
    }
    amountInWords = amountInWords.charAt(0).toUpperCase() + amountInWords.slice(1);

    const handlePrint = useReactToPrint({
        content: () => pdfContainerRef.current,
        documentTitle: `salesinvoice_${id}`,
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
        axios.get(`https://office3i.com/development/api/public/api/pdfview_saleinvoice/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const data = response.data.data.involicedata;
                console.log('data-------------------->', response.data);

                setInvoiceNumber(data.sales_invoice_number);

                setCgstType(data.cgst_percentage)
                setSgstType(data.sgst_percentage)
                setIgstType(data.igst_percentage)


                setCgstAmount(data.output_cgst_amount)
                setSgstAmount(data.output_sgst_amount)
                setIgstAmount(data.output_igst_amount)

                setInvoiceDate(data.date);
                setCompanyDetails({
                    name: data.from_companyname,
                    address: data.from_companyaddress,
                    gstin: data.from_companygstin_uin,
                    state: data.from_statename,
                    code: data.from_statename_code, // Update with actual field if necessary
                });
                setBuyerDetails({
                    name: data.to_companyname,
                    address: data.to_companyaddress,
                    gstin: data.to_companygstin_uin,
                    state: data.to_statename,
                    code: data.to_statename_code, // Update with actual field if necessary
                });

                const itemsWithHsnSac = response.data.data.invoiceitem.map(item => ({
                    good_service_name: item.good_service_name,
                    description: item.description,
                    hsnSac: item.hsn_sac,
                    quantity: item.quantity,
                    rate: item.rate,
                    per: item.per,
                    amount: item.amount,
                    igst: data.output_igst_amount, // Or compute based on other fields
                }));
                setItems(itemsWithHsnSac);

                setTotalAmount(data.overall_amount);
                // setAmountInWords('INR Fifty Three Thousand One Hundred Only'); 
                setBankDetails({
                    accountHolder: data.from_accountholdername,
                    bankName: data.from_bank_name,
                    accountNumber: data.from_account_number,
                    branchIfsc: data.from_ifsccode,
                });



            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
                // setLoading(false);
            });
    }, []);


    return (
        <div className="container mt-4" style={{ width: '210mm', height: '297mm' }}>
            <div ref={pdfContainerRef}>
                <table style={{ boxShadow: 'none', borderColor: '#000000', width: '100%', height: '100%', border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                    <thead>
                        <tr>
                            <th colSpan="7" className="text-center print-font-large">
                                <h2>INVOICE</h2>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>{companyDetails.name}</strong><br />
                                {companyDetails.address}<br />
                                GSTIN/UIN: {companyDetails.gstin}<br />
                                State Name: {companyDetails.state}
                            </td>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Invoice No.</strong><br /> {invoiceNumber}<br />
                            </td>
                            <td colSpan="3" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Dated</strong><br /> {invoiceDate}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" className="print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Buyer (Bill to)</strong><br />
                                <strong>{buyerDetails.name}</strong><br />
                                {buyerDetails.address}<br />
                                GSTIN/UIN: {buyerDetails.gstin}<br />
                                State Name: {buyerDetails.state}
                            </td>
                            <td colSpan="5" className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                        </tr>
                        <tr>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>S.No</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Description of Goods</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>HSN/SAC</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Quantity</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Rate</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Per</td>
                            <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Amount</td>
                        </tr>
                        {items.map((item, index) => (
                            <tr key={index}>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{index + 1}</td>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}><strong>{item.good_service_name}</strong><br />
                                    {(item.description || '').split('\n').map((line, i) => <div key={i}>{line}</div>)}

                                </td>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{item.hsnSac}</td>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{item.quantity}</td>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{item.rate}</td>
                                <td className="print-font-small" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{item.per}</td>
                                <td className="print-font-small text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderBottom: 'none', borderTop: 'none' }}>{item.amount}</td>
                            </tr>
                        ))}
                        {igstType !== "0" && (
                            <tr>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>Output IGST {igstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>{igstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderBottom: 'none' }}>{igstAmount}</td>
                            </tr>
                        )}

                        {sgstType !== "0" && (
                            <tr>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>Output SGST {sgstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>{sgstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none', borderTop: 'none', borderBottom: 'none' }}>{sgstAmount}</td>
                            </tr>
                        )}

                        {cgstType !== "0" && (
                            <tr>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>Output CGST {cgstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>{cgstType}%</td>
                                <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }} />
                                <td colSpan="1" className="text-right print-font-medium" style={{ border: '1px solid black', padding: '0.5rem 0.5rem', borderTop: 'none' }}>{cgstAmount}</td>
                            </tr>
                        )}

                        <tr className="print-font-medium">
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className="text-right" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>Total</td>
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }} />
                            <td className='text-right' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>{totalAmount}</td>
                        </tr>
                        <tr className="print-font-medium">
                            <td colSpan="2" className='table-border' style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <strong>Amount Chargeable (in words)</strong><br />
                                {amountInWords} Only
                            </td>
                            <td colSpan="5" className="table-border" style={{ border: '1px solid black', padding: '0.5rem 0.5rem' }}>
                                <p className="text-right">E & O E</p>
                                <strong>Company's Bank Details</strong><br />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>A/c Holder's Name</strong>
                                        <span>: {bankDetails.accountHolder}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>Bank Name</strong>
                                        <span>: {bankDetails.bankName}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>A/c No</strong>
                                        <span>: {bankDetails.accountNumber}</span>
                                    </div>
                                    <div style={{ display: 'flex' }}>
                                        <strong style={{ minWidth: '150px' }}>Branch & IFSC Code</strong>
                                        <span>: {bankDetails.branchIfsc}</span>
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
                                    <span>for {companyDetails.name}</span><br />
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '20px' }}>
                <button className="btn btn-primary" onClick={handlePrint}>Print Invoice</button>
            </div>
        </div>
    );
};

export default SalesInvoiceView;
