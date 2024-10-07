import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';

export default function SalesInvoice() {


    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();


    const GoToEditPage = () => {
        navigate(`/admin/salesinvoicelist`);
    };

    // ------------------------------------------------------------------------------------------------


    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // SALESINVOICE STATE

    const [fromCompany, setFromCompany] = useState('');
    const [toCompany, setToCompany] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [date, setDate] = useState('');

    const [cgstType, setCgstType] = useState('');
    const [sgstType, setSgstType] = useState('');
    const [igstType, setIgstType] = useState('');


    // const [gstAmount, setGstAmount] = useState('');
    // const [descriptionalGoods, setDescriptionalGoods] = useState('');
    // const [hsnSac, setHsnSac] = useState('');
    // const [quantity, setQuantity] = useState('');
    // const [rate, setRate] = useState('');
    // const [per, setPer] = useState('');
    // const [amount, setAmount] = useState('');

    const [items, setItems] = useState([{
        descriptionalGoods: '',
        hsnSac: '',
        quantity: '',
        rate: '',
        per: '',
        amount: ''
    }]);


    console.log("items", items)

    const [totalValueAmount, setTotalValueAmount] = useState('');
    const [igstAmount, setIgstAmount] = useState('');
    const [cgstAmount, setCgstAmount] = useState('');
    const [sgstAmount, setSgstAmount] = useState('');

    const [roundOff, setRoundOff] = useState('');
    const [totalInvoiceAmount, setTotalInvoiceAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('');

    const [formErrors, setFormErrors] = useState({});

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        // Validate required fields
        if (!fromCompany) errors.fromCompany = 'From Company is required.';
        if (!toCompany) errors.toCompany = 'To Company is required.';
        if (!date) errors.date = 'Date is required.';
        // Check if at least one of CGST, SGST, or IGST is provided
        if (!cgstType && !sgstType && !igstType) {
            errors.taxType = 'At least one of CGST, SGST, or IGST Percentage is required.';
        }

        let descriptionalGoodsProvided = false;

        items.forEach((item, index) => {
            // Check if at least one Descriptional Goods is provided
            if (item.descriptionalGoods) {
                descriptionalGoodsProvided = true;

                if (!item.quantity) errors[`quantity_${index}`] = 'Quantity is required.';
                if (!item.rate) errors[`rate_${index}`] = 'Rate is required.';
                if (!item.per) errors[`per_${index}`] = 'Per is required.';
                if (!item.amount) errors[`amount_${index}`] = 'Amount is required.';
            }
        });

        if (!descriptionalGoodsProvided) {
            errors.descriptionalGoods = 'At least one Descriptional Goods is required.';
        }

        // if (!outputGstAmount) errors.outputGstAmount = 'Output GST Amount is required.';
        // if (!totalValueAmount) errors.totalValueAmount = 'Total Value Amount is required.';
        // if (!totalInvoiceAmount) errors.totalInvoiceAmount = 'Total Invoice Amount is required.';
        if (!paymentMethod) errors.paymentMethod = 'Payment Method is required.';
        if (!paymentStatus) errors.paymentStatus = 'Payment Status is required.';
        if (!reason) errors.reason = 'Reason is required.';
        if (!status) errors.status = 'Status is required.';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        // Create FormData object
        const formDataToSend = new FormData();
        formDataToSend.append('company_from', fromCompany?.value);
        formDataToSend.append('company_to', toCompany?.value);
        formDataToSend.append('date', date);


        formDataToSend.append('igst_percentage', igstType || 0);
        formDataToSend.append('cgst_percentage', cgstType || 0);
        formDataToSend.append('sgst_percentage', sgstType || 0);


        formDataToSend.append('output_igst_amount', igstAmount);
        formDataToSend.append('output_cgst_amount', cgstAmount);
        formDataToSend.append('output_sgst_amount', sgstAmount);
        formDataToSend.append('item_value_amount', totalValueAmount);
        formDataToSend.append('overall_amount', totalInvoiceAmount);
        formDataToSend.append('roundedoff', roundOff);

        formDataToSend.append('payment_method', paymentMethod.value);
        formDataToSend.append('payment_status', paymentStatus.value);
        formDataToSend.append('payment_reason', reason);
        formDataToSend.append('status', status.value);
        formDataToSend.append('created_by', userempid); // Assuming you need the user's ID here

        items.forEach((item, index) => { 
            if (item.descriptionalGoods) {
                formDataToSend.append(`item_id[${index}]`, item.descriptionalGoods?.value); // Assuming `descriptionalGoods` holds item IDs
                formDataToSend.append(`quantity[${index}]`, item.quantity);
                formDataToSend.append(`rate[${index}]`, item.rate);
                formDataToSend.append(`per[${index}]`, item.per);
                formDataToSend.append(`amount[${index}]`, item.amount);
            }
        });

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/addsaleinvoice', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                    // Note: Do not set 'Content-Type' for FormData; it will be set automatically
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.status === 'success') {


                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Invoice Added Successfully.',
                });
                GoToEditPage()

            } else {
                throw new Error("Can't add invoice.");
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };

    // ------------------------------------------------------------------------------------------------



    const handleCancel = () => {
        setFromCompany('');
        setToCompany('');
        // setInvoiceNumber('');
        setDate('');
        setCgstType('');
        setSgstType('');
        setIgstType('');
        // setGstType('');
        // setGstAmount('');
        // setDescriptionalGoods('');
        // setHsnSac('');
        // setQuantity('');
        // setRate('');
        // setPer('');
        // setAmount('');
        // setOutputGstAmount('');
        setItems([{
            descriptionalGoods: '',
            hsnSac: '',
            quantity: '',
            rate: '',
            per: '',
            amount: ''
        }])
        setTotalValueAmount('');

        setIgstAmount('');
        setCgstAmount('');
        setSgstAmount('');
        setRoundOff('');
        setTotalInvoiceAmount('');
        setPaymentMethod('');
        setPaymentStatus('');
        setReason('');
        setStatus('');
        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------


    const [companyOptions, setCompanyOptions] = useState([]);

    useEffect(() => {

        fetch('https://office3i.com/development/api/public/api/sales_company_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Parse the API response to get options for dropdown
                const options = data.data.map(item => ({
                    value: item.id,
                    label: item.company_name
                }));
                setCompanyOptions(options);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Filtered options for "To Company" dropdown
    const filteredToCompanyOptions = companyOptions.filter(option => option.value !== fromCompany?.value);
    // --------------------------------------------------------------------------------------------------------------



    useEffect(() => {

        fetch('https://office3i.com/development/api/public/api/autogeneratesaleinvoiceid', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {

                setInvoiceNumber(data.data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // --------------------------------------------------------------------------------------------------------------


    const [descriptionalGoodsOptions, setDescriptionalGoodsOptions] = useState([]);
    const [hsnSacOptions, setHsnSacOptions] = useState([]);

    // Fetch Descriptional Goods
    useEffect(() => {
        fetch('https://office3i.com/development/api/public/api/sales_item_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const options = data.data.map(item => ({
                        value: item.id,
                        label: item.good_service_name
                    }));
                    setDescriptionalGoodsOptions(options);
                }
            })
            .catch(error => console.error('Error fetching descriptional goods:', error));
    }, [usertoken]);

    // Fetch HSN/SAC based on selected Descriptional Goods
    // useEffect(() => {
    //     if (descriptionalGoods) {
    //         fetch(`https://office3i.com/development/api/public/api/sales_hsn_sac/${descriptionalGoods.value}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${usertoken}`
    //             }
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 if (data.status === 'success') {
    //                     const options = [{
    //                         value: data.data.id,
    //                         label: data.data.hsn_sac
    //                     }];
    //                     setHsnSacOptions(options);
    //                 }
    //             })
    //             .catch(error => console.error('Error fetching HSN/SAC:', error));
    //     } else {
    //         setHsnSacOptions([]);
    //         setHsnSac(null);
    //     }
    // }, [descriptionalGoods, usertoken]);

    // Fetch HSN/SAC based on selected Descriptional Goods
    useEffect(() => {
        items.forEach((item, index) => {
            if (item.descriptionalGoods) {
                fetch(`https://office3i.com/development/api/public/api/sales_hsn_sac/${item.descriptionalGoods.value}`, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            const options = [{
                                value: data.data.id,
                                label: data.data.hsn_sac
                            }];
                            setHsnSacOptions(prevOptions => {
                                const updatedOptions = [...prevOptions];
                                updatedOptions[index] = options;
                                return updatedOptions;
                            });
                        }
                    })
                    .catch(error => console.error('Error fetching HSN/SAC:', error));
            } else {
                setHsnSacOptions(prevOptions => {
                    const updatedOptions = [...prevOptions];
                    updatedOptions[index] = [];
                    return updatedOptions;
                });
            }
        });
    }, [items, usertoken]);
    // --------------------------------------------------------------------------------------------------------------




    const paymentMethodOptions = [
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'PayPal', label: 'PayPal' },
    ];

    const paymentStatusOptions = [
        { value: 'Paid', label: 'Paid' },
        { value: 'Unpaid', label: 'Unpaid' },
        { value: 'Pending', label: 'Pending' },
    ];

    const statusOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
    ];

    // ---------------------------------------------------------------------------------------------------


    // const handleAddFileSet = () => {
    //     setItems([...items, {
    //         descriptionalGoods: '',
    //         hsnSac: '',
    //         quantity: '',
    //         rate: '',
    //         per: '',
    //         amount: ''
    //     }]);
    // };

    const handleAddFileSet = () => {
        // Filter out selected descriptional goods from options
        const selectedDescriptionalGoods = items.map(item => item.descriptionalGoods?.value);
        const filteredOptions = descriptionalGoodsOptions.filter(option => !selectedDescriptionalGoods.includes(option.value));

        setItems([...items, {
            descriptionalGoods: '',
            hsnSac: '',
            quantity: '',
            rate: '',
            per: '',
            amount: ''
        }]);

        // Update the descriptional goods options after adding a new set
        setDescriptionalGoodsOptions(filteredOptions);
    };


    const handleRemoveFileSet = (index) => {
        if (items.length > 1) { // Ensure at least one set remains
            setItems(items.filter((_, i) => i !== index));
            setHsnSacOptions(hsnSacOptions.filter((_, i) => i !== index));
        }
    };


    const handleChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        // Recalculate totals when any amount changes
        if (field === 'amount') {
            const totalValue = updatedItems.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
            setTotalValueAmount(totalValue);

            // Calculate CGST amount
            const igstAmounts = (totalValue * igstType) / 100;
            setIgstAmount(igstAmounts);

            // Calculate SGST amount
            const cgstAmounts = (totalValue * cgstType) / 100;
            setCgstAmount(cgstAmounts);

            // Calculate IGST amount
            const sgstAmounts = (totalValue * sgstType) / 100;
            setSgstAmount(sgstAmounts);

            // Calculate total sales amount
            const totalInvoice = totalValue + igstAmounts + cgstAmounts + sgstAmounts;

            // Round off the totalInvoiceAmount
            const roundedTotalInvoice = Math.round(totalInvoice);
            const roundOffValue = (roundedTotalInvoice - totalInvoice).toFixed(2);

            setTotalInvoiceAmount(roundedTotalInvoice);
            setRoundOff(roundOffValue);
        }

        setItems(updatedItems);
    };

    // ---------------------------------------------------------------------------------------------------

    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Sales Invoice</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }} className='mb-5'>
                <form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">From Company</label>
                                <Select
                                    options={companyOptions}
                                    onChange={setFromCompany}
                                    value={fromCompany}
                                    placeholder="Select a company"
                                />
                                {formErrors.fromCompany && <span className="text-danger">{formErrors.fromCompany}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">To Company</label>
                                <Select
                                    options={filteredToCompanyOptions}
                                    onChange={setToCompany}
                                    value={toCompany}
                                    placeholder="Select a company"
                                />
                                {formErrors.toCompany && <span className="text-danger">{formErrors.toCompany}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Invoice Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    placeholder="Select an invoice number"
                                    list="invoiceNumberOptions"
                                    disabled
                                />
                                {formErrors.invoiceNumber && <span className="text-danger">{formErrors.invoiceNumber}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={date}
                                    max="9999-12-31"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">CGST Percentage</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={cgstType}
                                    onChange={(e) => setCgstType(e.target.value)}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">SGST Percentage</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={sgstType}
                                    onChange={(e) => setSgstType(e.target.value)}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">IGST Percentage</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={igstType}
                                    onChange={(e) => setIgstType(e.target.value)}
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />

                            </div>
                        </Col>
                        {formErrors.taxType && <span className="text-danger">{formErrors.taxType}</span>}
                    </Row>




                    {items.map((item, index) => (
                        <div key={index} className='mb-3'>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">Descriptional Goods</label>
                                        <Select
                                            options={descriptionalGoodsOptions}
                                            onChange={(value) => handleChange(index, 'descriptionalGoods', value)}
                                            value={item.descriptionalGoods}
                                            placeholder="Select descriptional goods"
                                        />
                                        {formErrors.descriptionalGoods && <span className="text-danger">{formErrors.descriptionalGoods}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <label className="form-label">HSN/SAC</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={hsnSacOptions[index]?.[0]?.label || ''}
                                            readOnly
                                            placeholder="HSN/SAC"
                                            disabled
                                        />
                                        {formErrors[`hsnSac_${index}`] && <span className="text-danger">{formErrors[`hsnSac_${index}`]}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}>
                                    <div className="mb-3">
                                        <label className="form-label">Quantity</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.quantity}
                                            onChange={(e) => handleChange(index, 'quantity', e.target.value)}
                                            disabled={!item.descriptionalGoods}
                                        />
                                        {formErrors[`quantity_${index}`] && <span className="text-danger">{formErrors[`quantity_${index}`]}</span>}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="mb-3">
                                        <label className="form-label">Rate</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.rate}
                                            onChange={(e) => handleChange(index, 'rate', e.target.value)}
                                            disabled={!item.descriptionalGoods}
                                        />
                                        {formErrors[`rate_${index}`] && <span className="text-danger">{formErrors[`rate_${index}`]}</span>}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="mb-3">
                                        <label className="form-label">Per</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={item.per}
                                            onChange={(e) => handleChange(index, 'per', e.target.value)}
                                            disabled={!item.descriptionalGoods}
                                        />
                                        {formErrors[`per_${index}`] && <span className="text-danger">{formErrors[`per_${index}`]}</span>}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={item.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                            disabled={!item.descriptionalGoods}
                                        />
                                        {formErrors[`amount_${index}`] && <span className="text-danger">{formErrors[`amount_${index}`]}</span>}
                                    </div>
                                </Col>
                            </Row>

                            {index === items.length - 1 && (
                                <Button variant="primary" onClick={handleAddFileSet}>
                                    ADD
                                </Button>
                            )}
                            {index !== 0 && (
                                <Button variant="danger" onClick={() => handleRemoveFileSet(index)} style={{ marginLeft: '10px' }}>
                                    Remove
                                </Button>
                            )}
                        </div>
                    ))}






                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Total Value Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={totalValueAmount}
                                    onChange={(e) => setTotalValueAmount(e.target.value)}
                                    disabled
                                />
                                {/* {formErrors.totalValueAmount && <span className="text-danger">{formErrors.totalValueAmount}</span>} */}
                            </div>
                        </Col>

                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">IGST Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={igstAmount}
                                    onChange={(e) => setIgstAmount(e.target.value)}
                                    disabled
                                />
                                {/* {formErrors.igstAmount && <span className="text-danger">{formErrors.igstAmount}</span>} */}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">CGST Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={cgstAmount}
                                    onChange={(e) => setCgstAmount(e.target.value)}
                                    disabled
                                />
                                {formErrors.cgstAmount && <span className="text-danger">{formErrors.cgstAmount}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">SGST Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={sgstAmount}
                                    onChange={(e) => setSgstAmount(e.target.value)}
                                    disabled
                                />
                                {formErrors.sgstAmount && <span className="text-danger">{formErrors.sgstAmount}</span>}
                            </div>
                        </Col>


                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Total Invoice Amount</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={totalInvoiceAmount}
                                    onChange={(e) => setTotalInvoiceAmount(e.target.value)}
                                    disabled
                                />
                                {formErrors.totalInvoiceAmount && <span className="text-danger">{formErrors.totalInvoiceAmount}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Round Off</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={roundOff}
                                    onChange={(e) => setRoundOff(Number(e.target.value))}
                                    disabled
                                />
                            </div>
                        </Col>


                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Payment Method</label>
                                <Select
                                    options={paymentMethodOptions}
                                    onChange={setPaymentMethod}
                                    value={paymentMethod}
                                    placeholder="Select a payment method"
                                />
                                {formErrors.paymentMethod && <span className="text-danger">{formErrors.paymentMethod}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Payment Status</label>
                                <Select
                                    options={paymentStatusOptions}
                                    onChange={setPaymentStatus}
                                    value={paymentStatus}
                                    placeholder="Select payment status"
                                />
                                {formErrors.paymentStatus && <span className="text-danger">{formErrors.paymentStatus}</span>}
                            </div>
                        </Col>

                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Reason</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                {formErrors.reason && <span className="text-danger">{formErrors.reason}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <Select
                                    options={statusOptions}
                                    onChange={setStatus}
                                    value={status}
                                    placeholder="Select status"
                                />
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </div>
                        </Col>
                    </Row>

                    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Add Sales Invoice</button>
                    <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
