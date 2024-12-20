import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ScaleLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';



export default function EditOfferLetter() {

    const { id } = useParams();
    const navigate = useNavigate();

    const GoToEventList = () => {
        navigate(`/admin/offerletterList`);
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';

    // State management
    // const [headerAttachment, setHeaderAttachment] = useState(null);
    // const [footerAttachment, setFooterAttachment] = useState(null);
    const [header_footer_layout_id, setheader_footer_layout_id] = useState('');
    const [date, setDate] = useState('');
    const [salutation, setSalutation] = useState('');
    const [name, setName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [designation, setDesignation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [annualCTC, setAnnualCTC] = useState('');
    const [workingHoursFrom, setWorkingHoursFrom] = useState('');
    const [workingHoursTo, setWorkingHoursTo] = useState('');
    const [workingDays, setWorkingDays] = useState('');
    const [probationPeriod, setProbationPeriod] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');
    const [benefits, setBenefits] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [supervisorName, setSupervisorName] = useState('');
    const [lastDateForAcceptance, setLastDateForAcceptance] = useState('');
    const [authorisedPersonName, setAuthorisedPersonName] = useState('');
    const [authorisedPersonDesignation, setAuthorisedPersonDesignation] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const today = new Date().toISOString().split('T')[0];

    const [refreshKey, setRefreshKey] = useState(0);
    const [headerFooterData, setHeaderFooterData] = useState([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true);

    const [offerStatus, setOfferStatus] = useState('0');
    const [reasonReject, setReasonReject] = useState('0');
    const [otherReason, setOtherReason] = useState('');





    const handleCancel = () => {
        GoToEventList()
        // setHeaderAttachment(null);
        // setFooterAttachment(null);
        setheader_footer_layout_id('');
        setDate('');
        setSalutation('');
        setName('');
        setAddressLine1('');
        setAddressLine2('');
        setDesignation('');
        setCompanyName('');
        setAnnualCTC('');
        setWorkingHoursFrom('');
        setWorkingHoursTo('');
        setWorkingDays('');
        setProbationPeriod('');
        setNoticePeriod('');
        setBenefits('');
        setStartingDate('');
        setSupervisorName('');
        setLastDateForAcceptance('');
        setAuthorisedPersonName('');
        setAuthorisedPersonDesignation('');
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        // if (!header_footer_layout_id) errors.header_footer_layout_attachment = 'Layout Ccompany name is required.';


        // if (!headerAttachment) {
        //     errors.headerAttachment = 'Header Attachment is required.';
        // }
        // if (!footerAttachment) {
        //     errors.footerAttachment = 'Footer Attachment is required.';
        // }

        if (!header_footer_layout_id) errors.header_footer_layout_attachment = 'Layout company name is required.';

        if (!date) {
            errors.date = 'Date is required.';
        }
        if (!salutation) errors.salutation = 'Salutation is required.';
        if (!name) errors.name = 'Name is required.';
        if (!addressLine1) errors.addressLine1 = 'Address Line 1 is required.';
        if (!designation) errors.designation = 'Designation is required.';
        if (!companyName) errors.companyName = 'Company Name is required.';
        if (!annualCTC) errors.annualCTC = 'Annual CTC is required.';
        if (!workingHoursFrom) errors.workingHoursFrom = 'Working hours from is required.';
        if (!workingHoursTo) errors.workingHoursTo = 'Working hours to is required.';
        if (!workingDays) errors.workingDays = 'Working days are required.';
        if (!probationPeriod) errors.probationPeriod = 'Probation period is required.';
        if (!noticePeriod) errors.noticePeriod = 'Notice period is required.';
        if (!benefits) errors.benefits = 'Benefits are required.';
        if (!startingDate) errors.startingDate = 'Starting date is required.';
        if (!supervisorName) errors.supervisorName = 'Supervisor Name is required.';
        if (!lastDateForAcceptance) errors.lastDateForAcceptance = 'Last date for offer acceptance is required.';
        if (!authorisedPersonName) errors.authorisedPersonName = 'Authorised person name is required.';
        if (!authorisedPersonDesignation) errors.authorisedPersonDesignation = 'Authorised person designation is required.';

        if (offerStatus == '2' && reasonReject == '0') {
            errors.reasonReject = 'You must select a reason for rejection when the offer is declined.';
        }

        if (reasonReject == '4') {
            if (reasonReject == '4' && otherReason.length >= '5') {

            } else {
                errors.other_reason = 'Should enter reason atleast 5 digits.';
            }
        }



        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = new FormData();
        formData.append('id', id);

        // if (headerAttachment instanceof File) {
        //     formData.append('header_attachment', headerAttachment);
        // } else {
        //     formData.append('header_oldpath', headerAttachment);
        // }

        // if (footerAttachment instanceof File) {
        //     formData.append('footer_attached', footerAttachment);
        // } else {
        //     formData.append('footer_oldpath', footerAttachment);
        // }

        formData.append('header_footer_layout_id', header_footer_layout_id);

        formData.append('date', date);
        formData.append('select_salutation', salutation);
        formData.append('name', name);
        formData.append('address_line1', addressLine1);
        formData.append('address_line2', addressLine2);
        formData.append('designation', designation);
        formData.append('company_name', companyName);
        formData.append('annual_ctc', annualCTC);
        formData.append('working_hrs_from', workingHoursFrom);
        formData.append('working_hrs_to', workingHoursTo);
        formData.append('working_day', workingDays);
        formData.append('probation_period', probationPeriod);
        formData.append('noties_period', noticePeriod);
        formData.append('benefits', benefits);
        formData.append('start_date', startingDate);
        formData.append('supervisor_name', supervisorName);
        formData.append('last_date_offer', lastDateForAcceptance);
        formData.append('authorised_person_name', authorisedPersonName);
        formData.append('authorised_designation', authorisedPersonDesignation);

        formData.append('offerStatus', offerStatus);
        formData.append('reasonReject', reasonReject);
        formData.append('otherReason', otherReason);

        formData.append('updated_by', userData.userempid);

        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }


        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/update_offer_letter', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = response.data;

            if (data.status === 'success') {
                handleCancel();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Offer Letter Updated Successfully',
                });
                GoToEventList()
            } else {
                throw new Error('Failed to Edit Offer Letter.');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };

    // --------------------------------------------------------------------------------------------

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/edit_offer_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)
                    const data = res.data.data;
                    setheader_footer_layout_id(data.layout_id);
                    // setHeaderAttachment(data.header_attachment)
                    // setFooterAttachment(data.footer_attached)
                    setDate(data.date)
                    setName(data.name)
                    setSalutation(data.select_salutation)
                    setAddressLine1(data.address_line1)
                    setAddressLine2(data.address_line2)
                    setDesignation(data.designation)
                    setCompanyName(data.company_name)
                    setStartingDate(data.start_date)
                    setAnnualCTC(data.annual_ctc)
                    setWorkingHoursFrom(data.working_hrs_from)
                    setWorkingHoursTo(data.working_hrs_to)
                    setWorkingDays(data.working_day)
                    setProbationPeriod(data.probation_period)
                    setNoticePeriod(data.noties_period)
                    setBenefits(data.benefits)
                    setSupervisorName(data.supervisor_name)
                    setLastDateForAcceptance(data.last_date_offer)
                    setAuthorisedPersonName(data.authorised_person_name)
                    setAuthorisedPersonDesignation(data.authorised_designation)
                    setOfferStatus(data.offer_status);
                    setReasonReject(data.offer_reason);
                    setOtherReason(data.other_reason);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // --------------------------------------------------------------------------------------------



    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [footerImagePreviewUrl, setFooterImagePreviewUrl] = useState('');



    // useEffect(() => {
    //     if (headerAttachment && headerAttachment instanceof File) {
    //         setImagePreviewUrl(URL.createObjectURL(headerAttachment));
    //     } else if (headerAttachment) {
    //         setImagePreviewUrl(`https://office3i.com/development/api/storage/app/${headerAttachment}`);
    //     }
    //     // Cleanup URL when component unmounts or file changes
    //     return () => {
    //         if (imagePreviewUrl) {
    //             URL.revokeObjectURL(imagePreviewUrl);
    //         }
    //     };
    // }, [headerAttachment, headerAttachment]);



    // useEffect(() => {
    //     if (footerAttachment && footerAttachment instanceof File) {
    //         setFooterImagePreviewUrl(URL.createObjectURL(footerAttachment));
    //     } else if (footerAttachment) {
    //         setFooterImagePreviewUrl(`https://office3i.com/development/api/storage/app/${footerAttachment}`);
    //     }
    //     // Cleanup URL when component unmounts or file changes
    //     return () => {
    //         if (footerImagePreviewUrl) {
    //             URL.revokeObjectURL(footerImagePreviewUrl);
    //         }
    //     };
    // }, [footerAttachment, footerAttachment]);


    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        const formdata = {
            user_roleid: userrole,
            emp_id: userempid
        };

        try {

            const response = await fetch('https://office3i.com/development/api/public/api/headerFooter_templatelist', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                },
                // body: JSON.stringify(formdata)
            });

            if (response.ok) {
                const responseData = await response.json();
                setHeaderFooterData(responseData.data);
                // setTableData(responseData.data);
                // console.log('responce data for offter_letter', responseData.data);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // const handleHeaderAttachmentChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setImagePreviewUrl(reader.result);
    //             setHeaderAttachment(file);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setImagePreviewUrl('');
    //         setHeaderAttachment(null);
    //     }
    // };

    // const handleFooterAttachmentChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setFooterImagePreviewUrl(reader.result);
    //             setFooterAttachment(file);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setFooterImagePreviewUrl('');
    //         setFooterAttachment(null);
    //     }
    // };

    return (
        <>
            {loading ? (<div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#f6f6f6'
            }}>
                <ScaleLoader color="rgb(20 166 249)" />
            </div>) : (
                <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Offer Letter</h3>
                    <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>
                        <form onSubmit={handleSubmit}>
                            <Row className="mb-3">
                                {/* Insert Header – Attachment */}
                                {/* <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Insert Header</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleHeaderAttachmentChange}
                                    className="form-control"
                                />
                                {formErrors.headerAttachment && <span className="text-danger">{formErrors.headerAttachment}</span>}
                                {imagePreviewUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={imagePreviewUrl} alt="Header Preview" style={{ width: '30%', height: '100px', objectFit: 'contain' }} />
                                    </div>
                                )}
                            </div>
                        </Col> */}

                                {/* Insert Footer – Attachment */}

                                {/* <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Insert Footer</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFooterAttachmentChange}
                                    className="form-control"
                                />
                                {formErrors.footerAttachment && <span className="text-danger">{formErrors.footerAttachment}</span>}
                                {footerImagePreviewUrl && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img src={footerImagePreviewUrl} alt="Footer Preview" style={{ width: '30%', height: '100px', objectFit: 'contain' }} />
                                    </div>
                                )}
                            </div>
                        </Col> */}

                                <div className="mb-3">
                                    <label htmlFor="salutation" className="form-label">Select Layout</label>
                                    <select
                                        id="salutation"
                                        className="form-control"
                                        value={header_footer_layout_id}
                                        onChange={(e) => setheader_footer_layout_id(e.target.value)}
                                    >
                                        <option value="" disabled>Select Company</option>
                                        {headerFooterData.map(option => (
                                            <option key={option.id} value={option.id}>
                                                {option.company_title}
                                            </option>
                                        ))}

                                        {/* Add more options as needed */}
                                    </select>
                                    {formErrors.header_footer_layout_attachment && <span className="text-danger">{formErrors.header_footer_layout_attachment}</span>}
                                </div>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    {/* Date */}
                                    <div className="mb-3">
                                        <label htmlFor="date" className="form-label">Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="date"
                                            value={date}
                                            // min={today}
                                            max="9999-12-31"
                                            // onChange={(e) => setDate(e.target.value)}
                                            onChange={(e) => {
                                                setDate(e.target.value); // Update the date state

                                                if (startingDate) {
                                                    setStartingDate(''); // Correctly update startingDate using setStartingDate
                                                    setLastDateForAcceptance('');
                                                }
                                            }}
                                        />
                                        {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    {/* Select Salutation */}
                                    <div className="mb-3">
                                        <label htmlFor="salutation" className="form-label">Select Salutation</label>
                                        <select
                                            id="salutation"
                                            className="form-control"
                                            value={salutation}
                                            onChange={(e) => setSalutation(e.target.value)}
                                        >
                                            <option value="" disabled>Select Salutation</option>
                                            <option value="Mr.">Mr.</option>
                                            <option value="Ms.">Ms.</option>
                                            <option value="Mrs.">Mrs.</option>
                                            {/* Add more options as needed */}
                                        </select>
                                        {formErrors.salutation && <span className="text-danger">{formErrors.salutation}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    {/* Name */}
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                        {formErrors.name && <span className="text-danger">{formErrors.name}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Address Line 1 */}
                                    <div className="mb-3">
                                        <label htmlFor="addressLine1" className="form-label">Address Line 1</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="addressLine1"
                                            value={addressLine1}
                                            onChange={(e) => setAddressLine1(e.target.value)}
                                        />
                                        {formErrors.addressLine1 && <span className="text-danger">{formErrors.addressLine1}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Address Line 2 */}
                                    <div className="mb-3">
                                        <label htmlFor="addressLine2" className="form-label">Address Line 2</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="addressLine2"
                                            value={addressLine2}
                                            onChange={(e) => setAddressLine2(e.target.value)}
                                        />
                                        {formErrors.addressLine2 && <span className="text-danger">{formErrors.addressLine2}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Designation */}
                                    <div className="mb-3">
                                        <label htmlFor="designation" className="form-label">Designation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="designation"
                                            value={designation}
                                            onChange={(e) => setDesignation(e.target.value)}
                                        />
                                        {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Company Name */}
                                    <div className="mb-3">
                                        <label htmlFor="companyName" className="form-label">Company Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="companyName"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                        />
                                        {formErrors.companyName && <span className="text-danger">{formErrors.companyName}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Annual CTC */}
                                    <div className="mb-3">
                                        <label htmlFor="annualCTC" className="form-label">Annual CTC</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="annualCTC"
                                            value={annualCTC}
                                            onChange={(e) => setAnnualCTC(e.target.value)}
                                        />
                                        {formErrors.annualCTC && <span className="text-danger">{formErrors.annualCTC}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={3}>
                                    {/* Working hours from */}
                                    <div className="mb-3">
                                        <label htmlFor="workingHoursFrom" className="form-label">Working hours from</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="workingHoursFrom"
                                            value={workingHoursFrom}
                                            onChange={(e) => setWorkingHoursFrom(e.target.value)}
                                        />
                                        {formErrors.workingHoursFrom && <span className="text-danger">{formErrors.workingHoursFrom}</span>}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    {/* Working hours from */}
                                    <div className="mb-3">
                                        <label htmlFor="workingHoursTo" className="form-label">Working hours To</label>
                                        <input
                                            type="time"
                                            className="form-control"
                                            id="workingHoursTo"
                                            value={workingHoursTo}
                                            onChange={(e) => setWorkingHoursTo(e.target.value)}
                                        />
                                        {formErrors.workingHoursTo && <span className="text-danger">{formErrors.workingHoursTo}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Working days */}
                                    <div className="mb-3">
                                        <label htmlFor="workingDays" className="form-label">Working days</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="workingDays"
                                            min={1}
                                            max={7}
                                            onKeyDown={(e) => {
                                                // Prevent entering 'e', 'E', '+', '-'
                                                if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            value={workingDays}
                                            onChange={(e) => setWorkingDays(e.target.value)}
                                        />
                                        {formErrors.workingDays && <span className="text-danger">{formErrors.workingDays}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Probation period */}
                                    <div className="mb-3">
                                        <label htmlFor="probationPeriod" className="form-label">
                                            Probation period
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="info-tooltip">
                                                        Please enter the probation period in words (e.g., "two months"). Do not type numbers.
                                                    </Tooltip>
                                                }
                                            >
                                                <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </span>
                                            </OverlayTrigger>
                                        </label>                                        <input
                                            type="text"
                                            className="form-control"
                                            id="probationPeriod"
                                            value={probationPeriod}
                                            onKeyDown={(e) => {
                                                // Prevent entering 'e', 'E', '+', '-'
                                                if (e.key === '+' || e.key === '-') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => setProbationPeriod(e.target.value)}
                                        />
                                        {formErrors.probationPeriod && <span className="text-danger">{formErrors.probationPeriod}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Notice Period */}
                                    <div className="mb-3">
                                        <label htmlFor="noticePeriod" className="form-label">Notice Period
                                        <OverlayTrigger
                                                placement="top"
                                                overlay={
                                                    <Tooltip id="info-tooltip">
                                                        Please enter the notice  period in words (e.g., "two months"). Do not type numbers.
                                                    </Tooltip>
                                                }
                                            >
                                                <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                    <FontAwesomeIcon icon={faInfoCircle} />
                                                </span>
                                            </OverlayTrigger>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="noticePeriod"
                                            value={noticePeriod}
                                            onKeyDown={(e) => {
                                                // Prevent entering 'e', 'E', '+', '-'
                                                if (e.key === '+' || e.key === '-') {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => setNoticePeriod(e.target.value)}
                                        />
                                        {formErrors.noticePeriod && <span className="text-danger">{formErrors.noticePeriod}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Benefits */}
                                    <div className="mb-3">
                                        <label htmlFor="benefits" className="form-label">Benefits</label>
                                        <textarea
                                            className="form-control"
                                            id="benefits"
                                            rows="3"
                                            value={benefits}
                                            onChange={(e) => setBenefits(e.target.value)}
                                        ></textarea>
                                        {formErrors.benefits && <span className="text-danger">{formErrors.benefits}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Starting Date */}
                                    <div className="mb-3">
                                        <label htmlFor="startingDate" className="form-label">Starting Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="startingDate"
                                            value={startingDate}
                                            // min={today}
                                            min={date || "0001-01-01"}
                                            max={lastDateForAcceptance || "9999-12-31"}
                                            onChange={(e) => setStartingDate(e.target.value)}
                                        />
                                        {formErrors.startingDate && <span className="text-danger">{formErrors.startingDate}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Supervisor Name */}
                                    <div className="mb-3">
                                        <label htmlFor="supervisorName" className="form-label">Supervisor Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="supervisorName"
                                            value={supervisorName}
                                            onChange={(e) => setSupervisorName(e.target.value)}
                                        />
                                        {formErrors.supervisorName && <span className="text-danger">{formErrors.supervisorName}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    {/* Last Date for Offer Acceptance */}
                                    <div className="mb-3">
                                        <label htmlFor="lastDateForAcceptance" className="form-label">Last Date for Offer Acceptance</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="lastDateForAcceptance"
                                            value={lastDateForAcceptance}
                                            // min={today}
                                            min={startingDate || date || "0001-01-01"}
                                            max="9999-12-31"
                                            onChange={(e) => setLastDateForAcceptance(e.target.value)}
                                        />
                                        {formErrors.lastDateForAcceptance && <span className="text-danger">{formErrors.lastDateForAcceptance}</span>}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>

                                    {/* Authorised Person Name */}
                                    <div className="mb-3">
                                        <label htmlFor="authorisedPersonName" className="form-label">Authorised Person Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="authorisedPersonName"
                                            value={authorisedPersonName}
                                            onChange={(e) => setAuthorisedPersonName(e.target.value)}
                                        />
                                        {formErrors.authorisedPersonName && <span className="text-danger">{formErrors.authorisedPersonName}</span>}
                                    </div>
                                </Col>
                                <Col md={6}>

                                    {/* Authorised Person Designation */}
                                    <div className="mb-3">
                                        <label htmlFor="authorisedPersonDesignation" className="form-label">Authorised Person Designation</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="authorisedPersonDesignation"
                                            value={authorisedPersonDesignation}
                                            onChange={(e) => setAuthorisedPersonDesignation(e.target.value)}
                                        />
                                        {formErrors.authorisedPersonDesignation && <span className="text-danger">{formErrors.authorisedPersonDesignation}</span>}
                                    </div>
                                </Col>
                            </Row>


                            <Row className="mb-3">
                                <>
                                    <Col md={4}>
                                        {/* Current Status */}
                                        <div className="mb-3">
                                            <label htmlFor="offer_status" className="form-label">Current Status</label>
                                            <select
                                                id="offer_status"
                                                className="form-control"
                                                value={offerStatus}
                                                onChange={(e) => setOfferStatus(e.target.value)}
                                            >
                                                <option value="0">Pending</option>
                                                <option value="1">Accepted</option>
                                                <option value="2">Decline</option>
                                                {/* Add more options as needed */}
                                            </select>
                                            {formErrors.offer_status && <span className="text-danger">{formErrors.offer_status}</span>}
                                        </div>
                                    </Col>

                                    {offerStatus == '2' && ( // Only show when "Decline" is  disabled
                                        <Col md={4}>
                                            {/* Reason for Rejection */}
                                            <div className="mb-3">
                                                <label htmlFor="reason_reject" className="form-label">Reason for Rejection</label>
                                                <select
                                                    id="reason_reject"
                                                    className="form-control"
                                                    value={reasonReject}
                                                    onChange={(e) => setReasonReject(e.target.value)}
                                                >
                                                    <option value="0" selected disabled>Select Reason</option>
                                                    <option value="1">Salary</option>
                                                    <option value="2">Distance</option>
                                                    <option value="3">Benefits</option>
                                                    <option value="4">Others</option>
                                                    {/* Add more options as needed */}
                                                </select>
                                                {formErrors.reasonReject && <span className="text-danger">{formErrors.reasonReject}</span>}
                                            </div>
                                        </Col>
                                    )}
                                </>

                                {(reasonReject == '4' && offerStatus == '2') && (<Col md={4}>
                                    {/* Last Date for Offer Acceptance */}
                                    <div className="mb-3">
                                        <label htmlFor="reason_for_others" className="form-label">Other Type of Reason</label>
                                        <textarea
                                            className="form-control"
                                            id="reason_for_others"
                                            value={otherReason}
                                            onChange={(e) => setOtherReason(e.target.value)}
                                            rows="1"
                                        />
                                        {formErrors.other_reason && <span className="text-danger">{formErrors.other_reason}</span>}
                                    </div>
                                </Col>)}
                            </Row>
                            <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Edit Offer Letter</button>

                            <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}