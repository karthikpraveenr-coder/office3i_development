import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';

export default function AppointmentLetter() {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';

    // State management
    const headerFileInputRef = useRef(null);
    const footerFileInputRef = useRef(null);
    const [headerAttachment, setHeaderAttachment] = useState(null);
    const [footerAttachment, setFooterAttachment] = useState(null);

    const [header_footer_layout_id, setheader_footer_layout_id] = useState('');
    const [date, setDate] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [designation, setDesignation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [grossSalary, setGrossSalary] = useState('');
    const [probationPeriod, setProbationPeriod] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');
    const [noticePeriodinword, setNoticePeriodinword] = useState('');
    const [employmentTerms, setEmploymentTerms] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [authorisedPersonName, setAuthorisedPersonName] = useState('');
    const [authorisedPersonDesignation, setAuthorisedPersonDesignation] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const [headerFooterData, setHeaderFooterData] = useState([]); // Initialize with an empty array

    const [loading, setLoading] = useState(true);

    const [refreshKey, setRefreshKey] = useState(0);


    const handleCancel = () => {
        // setHeaderAttachment(null);
        // setFooterAttachment(null);
        // setImagePreviewUrl('');
        // setFooterImagePreviewUrl('');
        // headerFileInputRef.current.value = null;
        // footerFileInputRef.current.value = null;

        setheader_footer_layout_id('');
        setDate('');
        setCandidateName('');
        setAddressLine1('');
        setAddressLine2('');
        setDesignation('');
        setStartDate('');
        setCompanyName('');
        setGrossSalary('');
        setProbationPeriod('');
        setNoticePeriod('');
        setNoticePeriodinword('');
        setAuthorisedPersonName('');
        setAuthorisedPersonDesignation('');
        setEmploymentTerms('');
        setFormErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!header_footer_layout_id) errors.header_footer_layout_attachment = 'Layout company name is required.';

        // if (!headerAttachment) {
        //     errors.headerAttachment = 'Header Attachment is required.';
        // }

        // if (!footerAttachment) {
        //     errors.footerAttachment = 'Footer Attachment is required.';
        // }

        if (!date) {
            errors.date = 'Date is required.';
        }
        if (!candidateName) {
            errors.candidateName = 'Candidate Name is required.';
        }
        if (!addressLine1) {
            errors.addressLine1 = 'Address Line 1 is required.';
        }
        if (!addressLine2) {
            errors.addressLine2 = 'Address Line 2 is required.';
        }
        if (!designation) {
            errors.designation = 'Designation is required.';
        }
        if (!startDate) {
            errors.startDate = 'Start Date is required.';
        }
        if (!companyName) {
            errors.companyName = 'Company Name is required.';
        }
        if (!grossSalary) {
            errors.grossSalary = 'Gross Salary is required.';
        }
        if (!probationPeriod) {
            errors.probationPeriod = 'Probation Period is required.';
        }
        // if (!noticePeriod) {
        //     errors.noticePeriod = 'Notice Period is required.';
        // }
        if (!noticePeriodinword) {
            errors.noticePeriodinword = 'Notice Period is required.';
        }
        if (!employmentTerms) {
            errors.employmentTerms = 'Employment Terms & Conditions are required.';
        }
        if (!authorisedPersonName) {
            errors.authorisedPersonName = 'Authorised Person Name is required.';
        }
        if (!authorisedPersonDesignation) {
            errors.authorisedPersonDesignation = 'Authorised Person Designation is required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const formData = new FormData();

        console.log('layout_id', header_footer_layout_id);

        formData.append('header_footer_layout_id', header_footer_layout_id);
        formData.append('header_attach', headerAttachment);
        formData.append('footer_attached', footerAttachment);
        formData.append('date', date);
        formData.append('candidate_name', candidateName);
        formData.append('address_line1', addressLine1);
        formData.append('address_line2', addressLine2);
        formData.append('designation', designation);
        formData.append('start_date', startDate);
        formData.append('company_name', companyName);
        formData.append('gross_salary', grossSalary);
        formData.append('probation_period', probationPeriod);
        formData.append('notice_period', noticePeriod || '-');
        formData.append('noties_period_text', noticePeriodinword);
        formData.append('authroised_person_name', authorisedPersonName);
        formData.append('authroised_designation', authorisedPersonDesignation);
        formData.append('employment_tc', employmentTerms);
        formData.append('created_by', userData.userempid);

        try {
            const response = await axios.post('https://office3i.com/development/api/public/api/add_appointment_letter', formData, {
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
                    text: 'Appointment Letter Added Successfully',
                });
                navigate('/admin/appointmentletterlist');
            } else {
                throw new Error('Failed to add appointment letter.');
            }
            } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };

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


    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [footerImagePreviewUrl, setFooterImagePreviewUrl] = useState('');

    const handleHeaderAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setHeaderAttachment(file);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl('');
            setHeaderAttachment(null);
        }
    };

    const handleFooterAttachmentChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFooterImagePreviewUrl(reader.result);
                setFooterAttachment(file);
            };
            reader.readAsDataURL(file);
        } else {
            setFooterImagePreviewUrl('');
            setFooterAttachment(null);
        }
    };

    return (
        <>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (<div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Appointment Letter</h3>
                <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }} className='mb-5'>
                    <form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            {/* <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Insert Header</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={headerFileInputRef}
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
                            {/* <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Insert Footer</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={footerFileInputRef}
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
                            <Col md={12}>
                                {/* Select Salutation */}
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
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={date}
                                        // max={today}
                                        onChange={(e) => {
                                            setDate(e.target.value)
                                            if (startDate) {
                                                setStartDate('') // Correctly update startingDate using setStartingDate
                                            }
                                        }
                                        }
                                    />
                                    {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Candidate Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={candidateName}
                                        onChange={(e) => setCandidateName(e.target.value)}
                                    />
                                    {formErrors.candidateName && <span className="text-danger">{formErrors.candidateName}</span>}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Address Line 1</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addressLine1}
                                        onChange={(e) => setAddressLine1(e.target.value)}
                                    />
                                    {formErrors.addressLine1 && <span className="text-danger">{formErrors.addressLine1}</span>}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Address Line 2</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={addressLine2}
                                        onChange={(e) => setAddressLine2(e.target.value)}
                                    />
                                    {formErrors.addressLine2 && <span className="text-danger">{formErrors.addressLine2}</span>}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
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
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={startDate}
                                        min={date || "0001-01-01"}
                                        max="9999-12-31"
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    {formErrors.startDate && <span className="text-danger">{formErrors.startDate}</span>}

                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Company Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                    />
                                    {formErrors.companyName && <span className="text-danger">{formErrors.companyName}</span>}
                                </div>
                            </Col>
                            <Col md={6}>

                                <div className="mb-3">
                                    <label className="form-label">Gross Salary</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={grossSalary}
                                        onChange={(e) => setGrossSalary(e.target.value)}
                                    />
                                    {formErrors.grossSalary && <span className="text-danger">{formErrors.grossSalary}</span>}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>

                                <div className="mb-3">
                                    <label className="form-label">Probation Period</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={probationPeriod}
                                        min={'1'}
                                        onKeyDown={(e) => {
                                            // Prevent entering 'e', 'E', '+', '-'
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setProbationPeriod(e.target.value)}
                                    />
                                    {formErrors.probationPeriod && <span className="text-danger">{formErrors.probationPeriod}</span>}
                                </div>
                            </Col>
                            {/* <Col md={3}>

                            <div className="mb-3">
                                <label className="form-label">Notice Period</label>
                                <input
                                    type="Number"
                                    className="form-control"
                                    value={noticePeriod}
                                    onChange={(e) => setNoticePeriod(e.target.value)}
                                    placeholder='In Number'
                                />
                                {formErrors.noticePeriod && <span className="text-danger">{formErrors.noticePeriod}</span>}
                            </div>
                        </Col> */}
                            <Col md={6}>

                                <div className="mb-3">
                                    <label className="form-label">Notice Period</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={noticePeriodinword}
                                        min={'1'}
                                        onKeyDown={(e) => {
                                            // Prevent entering 'e', 'E', '+', '-'
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => setNoticePeriodinword(e.target.value)}
                                    // placeholder='In Words'
                                    />
                                    {formErrors.noticePeriodinword && <span className="text-danger">{formErrors.noticePeriodinword}</span>}
                                </div>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Authorised Person Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={authorisedPersonName}
                                        onChange={(e) => setAuthorisedPersonName(e.target.value)}
                                    />
                                    {formErrors.authorisedPersonName && <span className="text-danger">{formErrors.authorisedPersonName}</span>}
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Authorised Person Designation</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={authorisedPersonDesignation}
                                        onChange={(e) => setAuthorisedPersonDesignation(e.target.value)}
                                    />
                                    {formErrors.authorisedPersonDesignation && <span className="text-danger">{formErrors.authorisedPersonDesignation}</span>}
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <div className="mb-3">
                                    <label className="form-label">Employment Terms & Conditions</label>
                                    <textarea
                                        className="form-control"
                                        value={employmentTerms}
                                        onChange={(e) => setEmploymentTerms(e.target.value)}
                                    ></textarea>
                                    {formErrors.employmentTerms && <span className="text-danger">{formErrors.employmentTerms}</span>}
                                </div>
                            </Col>
                        </Row>

                        <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Add Appointment Letter</button>

                        <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </div>
            )}
        </>
    );
}