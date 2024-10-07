import React, { useState, useRef, useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Select from 'react-select';
import axios from 'axios';

export default function EditPurchaseInvoice() {

    const { id } = useParams();
    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();


    const GoToinvoicelistPage = () => {
        navigate(`/admin/purchaseinvoicelist`);
    };

    // ------------------------------------------------------------------------------------------------


    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // SALESINVOICE STATE

    const [vendorname, setVendorName] = useState('');
    const [shipto, setShipTo] = useState('');
    const [billto, setBillTo] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [date, setDate] = useState('');

    const [deliveryNote, setDeliveryNote] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [modeOfPayment, setModeOfPayment] = useState('');
    const [referenceNoAndDates, setReferenceNoAndDates] = useState('');
    const [otherReference, setOtherReference] = useState('');
    const [buyersOrderNo, setBuyersOrderNo] = useState('');
    const [buyersOrderDate, setBuyersOrderDate] = useState('');
    const [dispatchDocNo, setDispatchDocNo] = useState('');
    const [dispatchThrough, setDispatchThrough] = useState('');
    const [designation, setDesignation] = useState('');
    const [termsOfDelivery, setTermsOfDelivery] = useState('');
    const [otherDetails, setOtherDetails] = useState('');

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
        amount: '',
        saleid: ''
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

    // ----------------------------------------------------------------------------------------------------------
    const [invoiceData, setInvoiceData] = useState(null);
    const [itemsWithHsnSac, setItemsWithHsnSac] = useState();
    const [isCompanyOptionsLoaded, setIsCompanyOptionsLoaded] = useState(false);

    useEffect(() => {

        if (!isCompanyOptionsLoaded) return;

        console.log("Fetching invoice data...");

        axios.get(`https://office3i.com/development/api/public/api/editview_purchaseinvoice/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const data = response.data.data;
                setInvoiceData(data);
                console.log('data------------------------------------>', data)
                // setVendorName(data.involicedata.vendor_id);
                // setShipTo(data.involicedata.ship_to);
                // setBillTo(data.involicedata.bill_to);

                const vendorNameid = parseInt(data.involicedata.vendor_id, 10);
                const shipid = parseInt(data.involicedata.ship_to, 10);
                const shiptoid = parseInt(data.involicedata.bill_to, 10);

                // Find the corresponding company objects from companyOptions and set them
                const vendorNameOption = companyOptions.find(option => option.value === vendorNameid);
                const shipOption = companyOptions.find(option => option.value === shipid);
                const shiptoOption = companyOptions.find(option => option.value === shiptoid);

                console.log('vendorNameOption:', vendorNameOption);
                console.log('shipOption:', shipOption);
                console.log('shiptoOption:', shiptoOption);

                setVendorName(vendorNameOption || null);
                setShipTo(shipOption || null);
                setBillTo(shiptoOption || null);

                setInvoiceNumber(data.involicedata.bill_number);
                setDate(data.involicedata.bill_date);

                setDeliveryNote(data.involicedata.delivery_note);
                setDeliveryDate(data.involicedata.delivery_date);
                setModeOfPayment(data.involicedata.mode_termsof_payment);
                setReferenceNoAndDates(data.involicedata.reference_no_date);
                setOtherReference(data.involicedata.other_reference);
                setBuyersOrderNo(data.involicedata.buyers_order_no);

                setBuyersOrderDate(data.involicedata.order_date);
                setDispatchDocNo(data.involicedata.dispatch_doc_no);
                setDispatchThrough(data.involicedata.dispatched_through);
                setDesignation(data.involicedata.destination);
                setTermsOfDelivery(data.involicedata.termsof_delivery);
                setOtherDetails(data.involicedata.others_details);



                setCgstType(data.involicedata.cgst_percentage);
                setSgstType(data.involicedata.sgst_percentage);
                setIgstType(data.involicedata.igst_percentage);

                setTotalValueAmount(data.involicedata.item_value_amount);
                setIgstAmount(data.involicedata.output_igst_amount);
                setCgstAmount(data.involicedata.output_cgst_amount);
                setSgstAmount(data.involicedata.output_sgst_amount);
                setTotalInvoiceAmount(data.involicedata.overall_amount);
                setRoundOff(data.involicedata.roundedoff);

                // setGstType(data.involicedata.gst_type);
                // setGstAmount(data.involicedata.gst_percentage);

                // setOutputGstAmount(data.involicedata.output_gst_amount);
                setTotalValueAmount(data.involicedata.item_value_amount);
                setTotalInvoiceAmount(data.involicedata.overall_amount);

                setPaymentMethod(data.involicedata.payment_method);
                setPaymentStatus(data.involicedata.payment_status);
                setReason(data.involicedata.payment_reason);
                setStatus(data.involicedata.status);



                // Initialize items
                const itemsWithHsnSac = data.invoiceitem.map(item => ({
                    descriptionalGoods: parseInt(item.item_id),
                    hsnSac: item.hsn_sac,
                    quantity: item.quantity,
                    rate: item.rate,
                    per: item.per,
                    amount: item.amount,
                    saleid: item.id
                }));
                setItems(itemsWithHsnSac);



            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
                // setLoading(false);
            });
    }, [isCompanyOptionsLoaded]);

    // ----------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    const handleSave = async (e) => {
        e.preventDefault();

        const errors = {};

        // Validate required fields
        if (!vendorname) errors.vendorname = 'Vendor Name is required.';
        if (!shipto) errors.shipto = 'Ship To is required.';
        if (!billto) errors.billto = 'Bill To is required.';
        if (!invoiceNumber) errors.invoiceNumber = 'InvoiceNumber is required.';
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
        formDataToSend.append('id', id);
        formDataToSend.append('vendor_id', vendorname?.value || vendorname);
        formDataToSend.append('ship_to', shipto?.value || shipto);
        formDataToSend.append('bill_to', billto?.value || billto);

        formDataToSend.append('bill_number', invoiceNumber);
        formDataToSend.append('bill_date', date);

        formDataToSend.append('delivery_note', deliveryNote);
        formDataToSend.append('delivery_date', deliveryDate === null ? '' : deliveryDate);
        formDataToSend.append('reference_no_date', referenceNoAndDates);
        formDataToSend.append('other_reference', otherReference);
        formDataToSend.append('buyers_order_no', buyersOrderNo);
        formDataToSend.append('order_date', buyersOrderDate === null ? '' : buyersOrderDate);
        formDataToSend.append('dispatch_doc_no', dispatchDocNo);

        formDataToSend.append('mode_termsof_payment', modeOfPayment);

        formDataToSend.append('dispatched_through', dispatchThrough);
        formDataToSend.append('destination', designation);
        formDataToSend.append('termsof_delivery', termsOfDelivery);
        formDataToSend.append('others_details', otherDetails);


        formDataToSend.append('igst_percentage', igstType || 0);
        formDataToSend.append('cgst_percentage', cgstType || 0);
        formDataToSend.append('sgst_percentage', sgstType || 0);


        formDataToSend.append('output_igst_amount', igstAmount);
        formDataToSend.append('output_cgst_amount', cgstAmount);
        formDataToSend.append('output_sgst_amount', sgstAmount);
        formDataToSend.append('item_value_amount', totalValueAmount);
        formDataToSend.append('overall_amount', totalInvoiceAmount);
        formDataToSend.append('roundedoff', roundOff);

        formDataToSend.append('payment_method', paymentMethod.value || paymentMethod);
        formDataToSend.append('payment_status', paymentStatus.value || paymentStatus);
        formDataToSend.append('payment_reason', reason);
        formDataToSend.append('status', status.value || status);
        formDataToSend.append('updated_by', userempid); // Assuming you need the user's ID here

        items.forEach((item, index) => {
            if (item.descriptionalGoods) {
                formDataToSend.append(`sale_id[${index}]`, item.saleid);
                formDataToSend.append(`item_id[${index}]`, item.descriptionalGoods?.value || item.descriptionalGoods); // Assuming `descriptionalGoods` holds item IDs
                formDataToSend.append(`quantity[${index}]`, item.quantity);
                formDataToSend.append(`rate[${index}]`, item.rate);
                formDataToSend.append(`per[${index}]`, item.per);
                formDataToSend.append(`amount[${index}]`, item.amount);
            }

        });

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/updatepurchaseinvoice', {
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
                    text: 'Invoice Updated Successfully.',
                });
                GoToinvoicelistPage()

            } else {
                throw new Error("Can't Updated invoice.");
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
        GoToinvoicelistPage()
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
                setIsCompanyOptionsLoaded(true);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Filtered options for "Ship To" dropdown
    const filteredshiptoOptions = companyOptions.filter(option => option.value !== vendorname?.value);
    // --------------------------------------------------------------------------------------------------------------



    // useEffect(() => {

    //     fetch('https://office3i.com/development/api/public/api/autogeneratesaleinvoiceid', {
    //         headers: {
    //             'Authorization': `Bearer ${usertoken}`
    //         }
    //     })
    //         .then(response => response.json())
    //         .then(data => {

    //             setInvoiceNumber(data.data);
    //         })
    //         .catch(error => console.error('Error fetching data:', error));
    // }, []);

    // --------------------------------------------------------------------------------------------------------------


    const [descriptionalGoodsOptions, setDescriptionalGoodsOptions] = useState([]);
    const [hsnSacOptions, setHsnSacOptions] = useState([]);

    // Fetch descriptional goods options
    useEffect(() => {
        fetch('https://office3i.com/development/api/public/api/sales_item_list', {
            headers: { 'Authorization': `Bearer ${usertoken}` }
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

    // Fetch HSN/SAC options based on selected descriptional goods
    useEffect(() => {
        const fetchHsnSacOptions = async () => {
            const updatedOptions = [];
            for (const [index, item] of items.entries()) {
                if (item.descriptionalGoods) {
                    try {
                        const response = await fetch(`https://office3i.com/development/api/public/api/sales_hsn_sac/${item.descriptionalGoods}`, {
                            headers: { 'Authorization': `Bearer ${usertoken}` }
                        });
                        const data = await response.json();
                        if (data.status === 'success') {
                            updatedOptions[index] = { value: data.data.id, label: data.data.hsn_sac };
                        } else {
                            updatedOptions[index] = null;
                        }
                    } catch (error) {
                        console.error('Error fetching HSN/SAC:', error);
                        updatedOptions[index] = null;
                    }
                } else {
                    updatedOptions[index] = null;
                }
            }
            setHsnSacOptions(updatedOptions);
        };
        fetchHsnSacOptions();
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

    // Handle adding a new item set
    const handleAddFileSet = () => {
        const selectedDescriptionalGoods = items.map(item => item.descriptionalGoods?.value);
        const filteredOptions = descriptionalGoodsOptions.filter(option => !selectedDescriptionalGoods.includes(option.value));

        setItems([...items, {
            descriptionalGoods: '',
            hsnSac: '',
            quantity: '',
            rate: '',
            per: '',
            amount: '',
            saleid: ''
        }]);

        setDescriptionalGoodsOptions(filteredOptions);
    };

    // Handle removing an item set
    // const handleRemoveFileSet = (index) => {
    //     if (items.length > 1) { // Ensure at least one set remains
    //         setItems(items.filter((_, i) => i !== index));
    //         setHsnSacOptions(hsnSacOptions.filter((_, i) => i !== index));


    //     }
    // };

    // Handle removing an item set
    const handleRemoveFileSet = (index) => {
        if (items.length > 1) { // Ensure at least one set remains
            const updatedItems = items.filter((_, i) => i !== index);
            setItems(updatedItems);

            // Recalculate totals when an item is removed
            const totalValue = updatedItems.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
            setTotalValueAmount(totalValue);

            const igstAmounts = (totalValue * igstType) / 100;
            setIgstAmount(igstAmounts);

            const cgstAmounts = (totalValue * cgstType) / 100;
            setCgstAmount(cgstAmounts);

            const sgstAmounts = (totalValue * sgstType) / 100;
            setSgstAmount(sgstAmounts);

            const totalInvoice = totalValue + igstAmounts + cgstAmounts + sgstAmounts;
            const roundedTotalInvoice = Math.round(totalInvoice);
            const roundOffValue = (roundedTotalInvoice - totalInvoice).toFixed(2);

            setTotalInvoiceAmount(roundedTotalInvoice);
            setRoundOff(roundOffValue);
        }
    };


    // Handle field change
    const handleChange = async (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;

        // If descriptionalGoods changes, fetch and update hsnSac
        if (field === 'descriptionalGoods') {
            const selectedOption = descriptionalGoodsOptions.find(option => option.value === value);
            if (selectedOption) {
                try {
                    const response = await fetch(`https://office3i.com/development/api/public/api/sales_hsn_sac/${value}`, {
                        headers: { 'Authorization': `Bearer ${usertoken}` }
                    });
                    const data = await response.json();
                    if (data.status === 'success') {
                        updatedItems[index].hsnSac = data.data.hsn_sac || '';
                    } else {
                        updatedItems[index].hsnSac = '';
                    }
                } catch (error) {
                    console.error('Error fetching HSN/SAC:', error);
                    updatedItems[index].hsnSac = '';
                }
            } else {
                updatedItems[index].hsnSac = '';
            }
        }

        setItems(updatedItems);

        // Recalculate totals when any amount changes
        if (field === 'amount') {
            const totalValue = updatedItems.reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
            setTotalValueAmount(totalValue);

            const igstAmounts = (totalValue * igstType) / 100;
            setIgstAmount(igstAmounts);

            const cgstAmounts = (totalValue * cgstType) / 100;
            setCgstAmount(cgstAmounts);

            const sgstAmounts = (totalValue * sgstType) / 100;
            setSgstAmount(sgstAmounts);

            const totalInvoice = totalValue + igstAmounts + cgstAmounts + sgstAmounts;
            const roundedTotalInvoice = Math.round(totalInvoice);
            const roundOffValue = (roundedTotalInvoice - totalInvoice).toFixed(2);

            setTotalInvoiceAmount(roundedTotalInvoice);
            setRoundOff(roundOffValue);
        }
    };


    // ---------------------------------------------------------------------------------------------------



    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Purchase Invoice</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>
                <form onSubmit={handleSave}>
                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Vendor Name</label>
                                <Select
                                    options={companyOptions}
                                    value={vendorname}
                                    onChange={(selectedOption) => {
                                        setVendorName(selectedOption);
                                        console.log('Selected To Company:', selectedOption);
                                    }}
                                    placeholder="Select Vendor"
                                />
                                {formErrors.vendorname && <span className="text-danger">{formErrors.vendorname}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Ship To</label>
                                <Select
                                    options={filteredshiptoOptions}
                                    value={shipto}
                                    onChange={(selectedOption) => {
                                        setShipTo(selectedOption);

                                    }}
                                    placeholder="Select Ship To"
                                />
                                {formErrors.shipto && <span className="text-danger">{formErrors.shipto}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Bill To</label>
                                <Select
                                    options={filteredshiptoOptions}
                                    value={billto}
                                    onChange={(selectedOption) => {
                                        setBillTo(selectedOption);
                                    }}
                                    placeholder="Select Bill To"
                                />
                                {formErrors.billto && <span className="text-danger">{formErrors.billto}</span>}
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
                                <label className="form-label">Delivery Note</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={deliveryNote}
                                    onChange={(e) => setDeliveryNote(e.target.value)}
                                />
                                {formErrors.deliveryNote && <span className="text-danger">{formErrors.deliveryNote}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Delivery Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={deliveryDate}
                                    max="9999-12-31"
                                    onChange={(e) => setDeliveryDate(e.target.value)}
                                />
                                {formErrors.deliveryDate && <span className="text-danger">{formErrors.deliveryDate}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Mode of Payment</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={modeOfPayment}
                                    onChange={(e) => setModeOfPayment(e.target.value)}
                                />
                                {formErrors.modeOfPayment && <span className="text-danger">{formErrors.modeOfPayment}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Reference No & Dates</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={referenceNoAndDates}
                                    onChange={(e) => setReferenceNoAndDates(e.target.value)}
                                />
                                {formErrors.referenceNoAndDates && <span className="text-danger">{formErrors.referenceNoAndDates}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Other Reference</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otherReference}
                                    onChange={(e) => setOtherReference(e.target.value)}
                                />
                                {formErrors.otherReference && <span className="text-danger">{formErrors.otherReference}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Buyer's Order No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={buyersOrderNo}
                                    onChange={(e) => setBuyersOrderNo(e.target.value)}
                                />
                                {formErrors.buyersOrderNo && <span className="text-danger">{formErrors.buyersOrderNo}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Buyer's Order Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={buyersOrderDate}
                                    max="9999-12-31"
                                    onChange={(e) => setBuyersOrderDate(e.target.value)}
                                />
                                {formErrors.buyersOrderDate && <span className="text-danger">{formErrors.buyersOrderDate}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Dispatch Doc No</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={dispatchDocNo}
                                    onChange={(e) => setDispatchDocNo(e.target.value)}
                                />
                                {formErrors.dispatchDocNo && <span className="text-danger">{formErrors.dispatchDocNo}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Dispatch Through</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={dispatchThrough}
                                    onChange={(e) => setDispatchThrough(e.target.value)}
                                />
                                {formErrors.dispatchThrough && <span className="text-danger">{formErrors.dispatchThrough}</span>}
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                                {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Terms of Delivery</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={termsOfDelivery}
                                    onChange={(e) => setTermsOfDelivery(e.target.value)}
                                />
                                {formErrors.termsOfDelivery && <span className="text-danger">{formErrors.termsOfDelivery}</span>}
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <label className="form-label">Other Details</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={otherDetails}
                                    onChange={(e) => setOtherDetails(e.target.value)}
                                />
                                {formErrors.otherDetails && <span className="text-danger">{formErrors.otherDetails}</span>}
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
                                            onChange={(value) => handleChange(index, 'descriptionalGoods', value.value)}
                                            value={descriptionalGoodsOptions.find(option => option.value === item.descriptionalGoods)}
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
                                            value={hsnSacOptions[index]?.label || ''}
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
                                    value={paymentMethodOptions.find(option => option.value === paymentMethod)}
                                    onChange={setPaymentMethod}
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
                                    value={paymentStatusOptions.find(option => option.value === paymentStatus)}
                                    onChange={setPaymentStatus}
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
                                    value={statusOptions.find(option => option.value === status)}
                                    onChange={setStatus}
                                    placeholder="Select status"
                                />
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                            </div>
                        </Col>
                    </Row>

                    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Update Sales Invoice</button>
                    <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
