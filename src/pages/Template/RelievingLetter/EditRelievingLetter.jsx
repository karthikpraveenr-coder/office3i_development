import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function EditRelievingLetter() {

    const { id } = useParams();
    const navigate = useNavigate();

    const GoToEventList = () => {
        navigate(`/admin/relievingletterList`);
    };

    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';

    const [headerAttachment, setHeaderAttachment] = useState(null);
    console.log("headerAttachment******************", headerAttachment)
    const [footerAttachment, setFooterAttachment] = useState(null);
    
    const [date, setDate] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [designation, setDesignation] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [joiningDate, setJoiningDate] = useState('');
    const [lastWorkingDay, setLastWorkingDay] = useState('');
    const [authorisedPersonName, setAuthorisedPersonName] = useState('');
    const [authorisedPersonDesignation, setAuthorisedPersonDesignation] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const today = new Date().toISOString().split('T')[0];
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSave = async (e) => {
        e.preventDefault();

        const errors = {};

        if (!headerAttachment) {
            errors.headerAttachment = 'Header Attachment is required.';
        }
        if (!footerAttachment) {
            errors.footerAttachment = 'Footer Attachment is required.';
        }
        if (!date) {
            errors.date = 'Date is required.';
        }
        if (!employeeName) {
            errors.employeeName = 'Employee Name is required.';
        }
        if (!designation) {
            errors.designation = 'Designation is required.';
        }
        if (!companyName) {
            errors.companyName = 'Company Name is required.';
        }
        if (!joiningDate) {
            errors.joiningDate = 'Joining Date is required.';
        }
        if (!lastWorkingDay) {
            errors.lastWorkingDay = 'Last Working Day is required.';
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
        formData.append('id', id);

        if (headerAttachment instanceof File) {
            formData.append('header_attachment', headerAttachment);
        } else {
            formData.append('header_oldpath', headerAttachment);
        }
    
        if (footerAttachment instanceof File) {
            formData.append('footer_attached', footerAttachment);
        } else {
            formData.append('footer_oldpath', footerAttachment);
        }

        formData.append('date', date);
        formData.append('employee_name', employeeName);
        formData.append('designation', designation);
        formData.append('company_name', companyName);
        formData.append('joining_date', joiningDate);
        formData.append('last_working_day', lastWorkingDay);
        formData.append('authorised_person_name', authorisedPersonName);
        formData.append('authorised_person_designation', authorisedPersonDesignation);
        formData.append('updated_by', userData.userempid);

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/update_relieving_letter', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                setHeaderAttachment(null);
                setFooterAttachment(null);
                setDate('');
                setEmployeeName('');
                setDesignation('');
                setCompanyName('');
                setJoiningDate('');
                setLastWorkingDay('');
                setAuthorisedPersonName('');
                setAuthorisedPersonDesignation('');
                setRefreshKey(prevKey => prevKey + 1);

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Relieving Letter Added Successfully.',
                });
                GoToEventList();
            } else {
                throw new Error("Can't able to Edit Relieving Letter.");
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };

    const fileInputRef = useRef(null);
    const handleCancel = () => {
        GoToEventList()
    };

    // --------------------------------------------------------------------------------------------

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/edit_relieving_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    console.log("setData----------->", res.data.data)
                    const data = res.data.data

                    setHeaderAttachment(data.header_attachment)
                    setFooterAttachment(data.footer_attached)
                    setDate(data.date)
                    setEmployeeName(data.employee_name)
                    setDesignation(data.designation)

                    setCompanyName(data.company_name)
                    setJoiningDate(data.joining_date)
                    setLastWorkingDay(data.last_working_day)
                    setAuthorisedPersonName(data.authorised_person_name)
                    setAuthorisedPersonDesignation(data.authorised_person_designation)
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);

    // --------------------------------------------------------------------------------------------

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [footerImagePreviewUrl, setFooterImagePreviewUrl] = useState('');



    useEffect(() => {
        if (headerAttachment && headerAttachment instanceof File) {
            setImagePreviewUrl(URL.createObjectURL(headerAttachment));
        } else if (headerAttachment) {
            setImagePreviewUrl(`https://office3i.com/development/api/storage/app/${headerAttachment}`);
        }
        // Cleanup URL when component unmounts or file changes
        return () => {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
        };
    }, [headerAttachment, headerAttachment]);
    


    useEffect(() => {
        if (footerAttachment && footerAttachment instanceof File) {
            setFooterImagePreviewUrl(URL.createObjectURL(footerAttachment));
        } else if (footerAttachment) {
            setFooterImagePreviewUrl(`https://office3i.com/development/api/storage/app/${footerAttachment}`);
        }
        // Cleanup URL when component unmounts or file changes
        return () => {
            if (footerImagePreviewUrl) {
                URL.revokeObjectURL(footerImagePreviewUrl);
            }
        };
    }, [footerAttachment, footerAttachment]);


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
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Relieving Letter</h3>
            <div style={{ boxShadow: '#0000007d 0px 0px 10px 1px', padding: '35px 50px' }}>
                <form onSubmit={handleSave}>
                    <Row className="mb-3">
                        <Col md={6}>
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
                                        <img src={imagePreviewUrl} alt="Header Preview" style={{ width: '25%', height: 'auto' }} />
                                    </div>
                                )}
                            </div>
                        </Col>
                        <Col md={6}>
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
                                    min={today}
                                    max="9999-12-31"
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Employee Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                />
                                {formErrors.employeeName && <span className="text-danger">{formErrors.employeeName}</span>}
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
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Joining Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={joiningDate}
                                    max={today}
                                    onChange={(e) => setJoiningDate(e.target.value)}
                                />
                                {formErrors.joiningDate && <span className="text-danger">{formErrors.joiningDate}</span>}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-3">
                                <label className="form-label">Last Working Day</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={lastWorkingDay}
                                    // min={joiningDate}
                                    max={today}
                                    onChange={(e) => setLastWorkingDay(e.target.value)}
                                />
                                {formErrors.lastWorkingDay && <span className="text-danger">{formErrors.lastWorkingDay}</span>}
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

                    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Edit Relieving Letter</button>
                    <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#0d6efd' }} onClick={handleCancel}>Cancel</button>
                </form>
            </div>
        </div>
    );
}
