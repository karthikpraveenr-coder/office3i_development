import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useRef } from 'react';

const EditLead = () => {
    // const navigate = useNavigate();

    const { id } = useParams();
    // ------------------------------------------------------------------------------------------------
    const navigate = useNavigate();

    const GoTostatuspage = () => {
        navigate(`/admin/presalesleadlist`);
    };
    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------



    const [leadID, setLeadID] = useState('');
    const [leadDate, setleadDate] = useState('');
    const [userName, setuserName] = useState('');
    const [userEmail, setuserEmail] = useState('');
    const [userMobile, setuserMobile] = useState('');
    const [userWhatapp, setuserwhatapp] = useState('');
    const [gender, setGender] = useState('');
    const [CompanyName, setCompanyName] = useState('');
    const [website, setWebsite] = useState('');
    const [area, setArea] = useState('');
    const [pincode, setPincode] = useState('');
    const [ProductType, setProductType] = useState('');
    const [ProductName, setProductName] = useState('');
    const [Budgetmin, setBudgetmin] = useState('');
    const [Budgetmax, setBudgetmax] = useState('');
    const [Requirements, setRequirements] = useState('');
    const [SourceName, setSourceName] = useState('');
    const [SourceNumber, setSourceNumber] = useState('');
    const [callonDate, setCallonDate] = useState('');
    const [comments, setComments] = useState('');
    const [consultfeeFiletype, setConsultfeeFiletype] = useState('');
    const [consultDocument, setConsultDocument] = useState('');
    const [leadStatus, setleadStatus] = useState('');
    const [department, setDepartment] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    const [statusDate, setStatusDate] = useState('');
    const [leadStatusStatus, setLeadStatusStatus] = useState('');
    const [leadComments, setLeadComments] = useState('');

    const [formErrors, setFormErrors] = useState({});

    // ----------------------------


    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState([]);



    const handleAttachedResumeChange = (e) => {
        setConsultDocument(e.target.files[0]);
    };


    // ------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        axios.get('https://office3i.com/user/api/public/api/country_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                setCountries(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    // ------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------------


    useEffect(() => {
        if (selectedCountry) {
            axios.get(`https://office3i.com/user/api/public/api/state_list/${selectedCountry.value || selectedCountry}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setStates(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching states:', error);
                });
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    // ------------------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------------------

    useEffect(() => {
        if (selectedState) {
            axios.get(`https://office3i.com/user/api/public/api/city_list/${selectedState.value || selectedState}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            })
                .then(response => {
                    setCities(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching cities:', error);
                });
        } else {
            setCities([]);
        }
    }, [selectedState]);

    // ------------------------------------------------------------------------------------------------------------

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption.value);
        setSelectedState(null);
        setSelectedCity([]);
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption.value);
        setSelectedCity([]);
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption.value);

    };

    const formatCountryOptions = () =>
        countries.map(country => ({
            value: country.id,
            label: country.name
        }));

    const formatStateOptions = () =>
        states.map(state => ({
            value: state.id,
            label: state.name
        }));

    const formatCityOptions = () =>
        cities.map(city => ({
            value: city.id,
            label: city.name
        }));

    const getDefaultCountryOption = () =>
        formatCountryOptions().find(option => option.value === selectedCountry);

    const getDefaultStateOption = () =>
        formatStateOptions().find(option => option.value === selectedState);

    const getDefaultCityOptions = () =>
        formatCityOptions().filter(option => selectedCity.includes(option.value));



    // ------------------------------------------------------------------------------------------------------------------

    const [selectedPreferredLocation, setSelectedPreferredLocation] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        // Fetch city list from the API
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://office3i.com/user/api/public/api/all_city_list', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const options = response.data.data.map(city => ({
                    value: city.id,
                    label: city.name
                }));
                setCityOptions(options);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const handleLocationChange = (selectedOptions) => {
        setSelectedPreferredLocation(selectedOptions);
    };

    // ------------------------------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT

    const handleSubmit = (e) => {
        e.preventDefault();
        //  console.log('dss',consultDocument)
        // Validate input fields
        const errors = {};

        if (!leadID) {
            errors.leadID = 'Lead ID is required.';
        }
        if (!leadDate) {
            errors.leadDate = 'Lead Date is required.';
        }
        if (!userName) {
            errors.userName = 'Name is required.';
        }
        // if (!userEmail) {
        //     errors.userEmail = 'Email is required.';
        // }
        // if (!userMobile) {
        //     errors.userMobile = 'Mobile Number is required.';
        // }

        // Email validation
        if (!userEmail) {
            errors.userEmail = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
            errors.userEmail = 'Enter valid Email ID.';
        }

        // Mobile number validation
        if (!userMobile) {
            errors.userMobile = 'Mobile No is required.';
        } else if (!/^\d{10}$/.test(userMobile)) {
            errors.userMobile = 'Mobile Number must be a 10-digit number.';
        }
        // if (userWhatapp) {
        //     if (!/^\d{10}$/.test(userWhatapp)) {
        //         errors.userWhatapp = 'WhatsApp Number must be a 10-digit number.';
        //     }
        // }

        if (!gender) {
            errors.gender = 'Gender is required.';
        }
        if (!area) {
            errors.area = 'Area is required.';
        }
        if (!selectedCountry || (Array.isArray(selectedCountry) && selectedCountry.length === 0)) {
            errors.country = 'Country is required.';
        }
        if (!selectedState || (Array.isArray(selectedState) && selectedState.length === 0)) {
            errors.state = 'State is required.';
        }
        if (!selectedCity || (Array.isArray(selectedCity) && selectedCity.length === 0)) {
            errors.city = 'City is required.';
        }
        
        if (!ProductType) {
            errors.ProductType = 'Product Type is required.';
        }

        if (Budgetmin && Budgetmax) {
            if (parseFloat(Budgetmax) < parseFloat(Budgetmin)) {
                errors.Budgetmax = 'Max Budget must be greater than or equal to Min Budget.';
            }
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});



        const formData = new FormData();
        // const getValue = (input) => input?.value ?? input ?? '-';
        formData.append('id', id);
        formData.append('role_id', userrole);
        formData.append('user_leaddate', leadDate);
        formData.append('user_name', userName);
        formData.append('user_email', userEmail);
        formData.append('user_mobile', userMobile);
        formData.append('user_whatapp', userWhatapp || '0');
        formData.append('user_gender', gender);
        formData.append('user_country', selectedCountry.value || selectedCountry,);
        formData.append('user_state', selectedState.value || selectedState);
        formData.append('user_city', selectedCity.value || selectedCity);
        formData.append('user_area', area);
        formData.append('user_pincode', pincode || '0');
        formData.append('user_company', CompanyName || '-');
        formData.append('user_website', website || '-');
        formData.append('product_type', ProductType);
        formData.append('product_name', ProductName || '-');
        formData.append('min_budget', Budgetmin || '0');
        formData.append('max_budget', Budgetmax || '0');
        formData.append('description', Requirements || '-');
        formData.append('source_name', SourceName || '-');
        formData.append('source_number', SourceNumber || '-');
        formData.append('call_backon', callonDate === null ? '' : callonDate);
        formData.append('comment', comments || '-');
        formData.append('prooffiletype', consultfeeFiletype);
        formData.append('prooflead_document', consultDocument);
        formData.append('oldpath_document', consultDocument);
        formData.append('assign_sale_dep_id', department);
        formData.append('assign_sale_emp_id', employeeName);
        formData.append('status_date', statusDate);
        formData.append('lead_status', leadStatusStatus);
        formData.append('comments', leadComments);
        formData.append('updated_by', userempid);

        axios.post('https://office3i.com/user/api/public/api/editpresale_leadlist', formData, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, message } = response.data;
                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: message,
                    });
                    GoTostatuspage()

                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: message,
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error creating the Post Resume. Please try again later.',
                });
                console.error('API Error:', error);
            });
    };
    // ------------------------------------------------------------------------------------------------

    //const fileInputRef = useRef(null);
    // const handleCancel = () => {
    // Reset all form fields
    // setLeadID('');
    // setleadDate('');
    // setProjectWorkType('');
    // // setDepartment('');
    // // setAssignedTo('');
    // setStartDate('');
    // setEndDate('');
    // setStatus('');
    // setPriority('');
    // setDescription('');
    // setFormErrors({});
    // Reset file input
    //     if (fileInputRef.current) {
    //         fileInputRef.current.value = '';
    //     }
    // };

    // Handle form cancellation
    const handleCancel = () => {
        GoTostatuspage()
        setFormErrors({});
    };



    // ------------------------------------------------------------------------------------------------
    // getautogenerateLeadId ID FETCH FROM API



    // useEffect(() => {
    //     const fetchAssetId = async () => {
    //         try {
    //             const response = await axios.get('https://office3i.com/user/api/public/api/getautogenerateLeadId', {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
    //                 },
    //             });
    //             if (response.data.status === 'success') {
    //                 setLeadID(response.data.data);
    //             } else {
    //                 throw new Error('Failed to fetch asset ID');
    //             }
    //         } catch (err) {
    //             console.log(err.message);

    //         }
    //     };

    //     fetchAssetId();
    // }, []);
    // ------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------

    // Fetch data from the API
    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/viewedit_leadlist/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.data.status === "success") {

                    const data = response.data.data.Leadlist
                    const datastatus = response.data.data.Leadstatus
                    setLeadID(data.lead_id)
                    setleadDate(data.user_leaddate)
                    setuserName(data.user_name)
                    setuserEmail(data.user_email)
                    setuserMobile(data.user_mobile)
                    setuserwhatapp(data.user_whatapp)
                    setGender(data.user_gender)
                    setCompanyName(data.user_company)
                    setWebsite(data.user_website)
                    setArea(data.user_area)
                    setPincode(data.user_pincode)
                    setProductType(data.product_type)
                    setProductName(data.product_name)
                    setBudgetmin(data.min_budget)
                    setBudgetmax(data.max_budget)
                    setRequirements(data.description)
                    setSourceName(data.source_name)
                    setSourceNumber(data.source_number)
                    setCallonDate(data.call_backon)
                    setComments(data.comment)
                    setSelectedCountry(data.user_country)
                    setSelectedState(data.user_state)
                    setSelectedCity(data.user_city)
                    setConsultfeeFiletype(data.consultfee_filetype)
                    setConsultDocument(data.consultfee_document)
                    setleadStatus(datastatus)
                    setDepartment(data.sale_assign_department_id);
                    setEmployeeName(data.sale_assign_emp_id);

                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [id, usertoken]);

    // -------------------------------------------------------------------------------------------------------

    // -------------------------------------- Department ---------------------------------------------------
    const [departmentDropdown, setDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/user/api/public/api/userrolelist', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // ---------------------------------------------------------------------------------------------------

    // ------------------------------------  Employee  ---------------------------------------------------

    const [employeesDropdown, setEmployeesDropdown] = useState([]);

    // Fetch employee dropdown options based on selected department
    useEffect(() => {
        if (department) {
            const apiUrl = `https://office3i.com/user/api/public/api/employee_dropdown_list/${department}`;
            const fetchEmployees = async () => {
                try {
                    const response = await axios.get(apiUrl, {
                        headers: {
                            Authorization: `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data || [];
                    setEmployeesDropdown(data);
                } catch (error) {
                    console.error('Error fetching employee options:', error);
                }
            };
            fetchEmployees();
        }
    }, [department, usertoken]);

    // ---------------------------------------------------------------------------------------------------



    return (
        <div className='Addproject__container mt-5' style={{ padding: '0px 70px 30px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Lead</h3>
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>
                <div style={{ margin: '2rem 0' }}></div>
                <h5 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Personal Information</h5>
                <Form>
                    <Row>
                        <Col>
                            <Form.Group controlId="leadID">
                                <Form.Label>Lead ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={leadID}
                                    onChange={(e) => setLeadID(e.target.value)}
                                    disabled
                                />
                                {formErrors.leadID && <span className="text-danger">{formErrors.leadID}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="leadDate">
                                <Form.Label>Lead Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={leadDate}
                                    max="9999-12-31"
                                    onChange={(e) => setleadDate(e.target.value)}
                                />
                                {formErrors.leadDate && <span className="text-danger">{formErrors.leadDate}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setuserName(e.target.value)}
                                />
                                {formErrors.userName && <span className="text-danger">{formErrors.userName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Email</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={userEmail}
                                    onChange={(e) => setuserEmail(e.target.value)}
                                />
                                {formErrors.userEmail && <span className="text-danger">{formErrors.userEmail}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Mobile Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userMobile}
                                    onChange={(e) => setuserMobile(e.target.value)}
                                />
                                {formErrors.userMobile && <span className="text-danger">{formErrors.userMobile}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> WhatsApp Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={userWhatapp}
                                    onChange={(e) => setuserwhatapp(e.target.value)}
                                />
                                {formErrors.userWhatapp && <span className="text-danger">{formErrors.userWhatapp}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="">Select Gender</option>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>

                                </Form.Control>
                                {formErrors.gender && <span className="text-danger">{formErrors.gender}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={CompanyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                                {formErrors.CompanyName && <span className="text-danger">{formErrors.CompanyName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Website</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                                {formErrors.website && <span className="text-danger">{formErrors.website}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="country">
                                <Form.Label>Country</Form.Label>
                                <Select
                                    options={formatCountryOptions()}
                                    value={getDefaultCountryOption()}
                                    onChange={handleCountryChange}
                                    placeholder="Select Country"
                                />
                                {formErrors.country && <span className="text-danger">{formErrors.country}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="state">
                                <Form.Label>State</Form.Label>
                                <Select
                                    options={formatStateOptions()}
                                    value={getDefaultStateOption()}
                                    onChange={handleStateChange}
                                    placeholder="Select State"
                                    isDisabled={!selectedCountry}
                                />
                                {formErrors.state && <span className="text-danger">{formErrors.state}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="city">
                                <Form.Label>City</Form.Label>
                                <Select
                                    options={formatCityOptions()}
                                    value={getDefaultCityOptions()}
                                    onChange={handleCityChange}
                                    placeholder="Select City"
                                    isDisabled={!selectedState}
                                />
                                {formErrors.city && <span className="text-danger">{formErrors.city}</span>}
                            </Form.Group>
                        </Col>

                    </Row>


                    <Row>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Area</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                />
                                {formErrors.area && <span className="text-danger">{formErrors.area}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Pincode</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                {formErrors.pincode && <span className="text-danger">{formErrors.pincode}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                    <div style={{ margin: '2rem 0' }}></div>
                    <h5 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Requirement Details</h5>
                    <Row>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Product Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ProductType}
                                    onChange={(e) => setProductType(e.target.value)}
                                />
                                {formErrors.ProductType && <span className="text-danger">{formErrors.ProductType}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ProductName}
                                    onChange={(e) => setProductName(e.target.value)}
                                />
                                {formErrors.ProductName && <span className="text-danger">{formErrors.ProductName}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Budget(Min)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={Budgetmin}
                                    onChange={(e) => setBudgetmin(e.target.value)}
                                />
                                {formErrors.Budgetmin && <span className="text-danger">{formErrors.Budgetmin}</span>}

                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Budget(Max)</Form.Label>

                                <Form.Control
                                    type="number"
                                    value={Budgetmax}
                                    onChange={(e) => setBudgetmax(e.target.value)}
                                />
                                {formErrors.Budgetmax && <span className="text-danger">{formErrors.Budgetmax}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="description">
                                <Form.Label>Requirements / Specifications Details</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={Requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                />
                                {formErrors.Requirements && <span className="text-danger">{formErrors.Requirements}</span>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <div style={{ margin: '2rem 0' }}></div>
                    <h5 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Source</h5>
                    <Row>
                        <Col>
                            <Form.Group controlId="preferredLocation">
                                <Form.Label>Source Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={SourceName}
                                    onChange={(e) => setSourceName(e.target.value)}
                                />
                                {formErrors.SourceName && <span className="text-danger">{formErrors.SourceName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Source Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={SourceNumber}
                                    onChange={(e) => setSourceNumber(e.target.value)}
                                />
                                {formErrors.SourceNumber && <span className="text-danger">{formErrors.SourceNumber}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="leadDate">
                                <Form.Label>Call On</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={callonDate}
                                    max="9999-12-31"
                                    onChange={(e) => setCallonDate(e.target.value)}
                                />
                                {formErrors.callonDate && <span className="text-danger">{formErrors.callonDate}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="comments">
                                <Form.Label>Comments ( If any )</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                                {formErrors.comments && <span className="text-danger">{formErrors.comments}</span>}
                            </Form.Group>
                        </Col>

                    </Row>
                    <div style={{ margin: '2rem 0' }}></div>
                    <h5 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Presales Upload</h5>
                    <Row>
                        <Col>
                            <Form.Group controlId="preferredLocation">
                                <Form.Label>Proof Upload</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Image"
                                    value="image"
                                    checked={consultfeeFiletype === 'image'}
                                    onChange={(e) => setConsultfeeFiletype(e.target.value)}
                                />
                                <Form.Check
                                    type="radio"
                                    label="Audio"
                                    value="audio"
                                    checked={consultfeeFiletype === 'audio'}
                                    onChange={(e) => setConsultfeeFiletype(e.target.value)}
                                />
                                {formErrors.SourceName && <span className="text-danger">{formErrors.SourceName}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="preferredLocation">
                                {consultDocument !== '-' && (
                                    <>
                                        <strong style={{ margin: '10px' }}>Attached Link</strong>
                                        <button style={{}} className="btn-view" onClick={() => { window.open(`https://office3i.com/user/api/storage/app/${consultDocument}`, '_blank') }}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>
                                    </>
                                )}

                                <Form.Label>Proof Upload</Form.Label>
                                <Form.Control
                                    type="file"
                                    name={consultDocument}
                                    onChange={handleAttachedResumeChange}
                                />

                            </Form.Group>
                        </Col>



                        <Col>
                            <Form.Group controlId="formDepartment">
                                <Form.Label>Department</Form.Label>
                                <Form.Control as="select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                                    <option value="">Select Department</option>
                                    {departmentDropdown.map(dept => (
                                        <option key={dept.id} value={dept.id}>{dept.role_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.department && <span className="text-danger">{formErrors.department}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="formEmployeeName">
                                <Form.Label>Employee Name</Form.Label>
                                <Form.Control as="select" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} disabled={!department}>
                                    <option value="">Select Employee</option>
                                    {employeesDropdown.map(emp => (
                                        <option key={emp.emp_id} value={emp.emp_id}>{emp.emp_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.employeeName && <span className="text-danger">{formErrors.employeeName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <div style={{ margin: '2rem 0' }}></div>
                    <h5 style={{ fontSize: '22px' }}>Status</h5>
                    <Row>
                        <table className="table" style={{ minWidth: '100%', width: 'max-content' }}>
                            <thead className="thead-dark">
                                <tr>
                                    {/* <th>S.No</th> */}
                                    <th>Status Date</th>
                                    <th>Status</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leadStatus.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>No status data found</td>
                                    </tr>
                                ) : (
                                    leadStatus.map((row, index) => (
                                        <tr key={index}>
                                            {/* <td>{serialNumber}</td> */}
                                            <td>{row.status_date}</td>
                                            <td>{row.lead_status}</td>
                                            <td>{row.comments}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </Row>
                    <div style={{ margin: '2rem 0' }}></div>
                    <Row>
                        <Col>
                            <Form.Group controlId="leadDate">
                                <Form.Label>Lead Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={statusDate}
                                    max="9999-12-31"
                                    onChange={(e) => setStatusDate(e.target.value)}
                                />

                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control as="select" value={leadStatusStatus} onChange={(e) => setLeadStatusStatus(e.target.value)}>
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                    <option value="Achieved">Achieved</option>

                                </Form.Control>

                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="taskName">
                                <Form.Label> Comments</Form.Label>
                                <Form.Control
                                    type="textarea"
                                    value={leadComments}
                                    onChange={(e) => setLeadComments(e.target.value)}
                                />

                            </Form.Group>
                        </Col>
                    </Row>

                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Update
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleCancel} className="ml-2">
                        Cancel
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default EditLead;
