import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useRef } from 'react';

const PresalesAddLead = () => {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToTaskListPage = () => {
        navigate(`/admin/presalesleadlist`);
    };

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


    const [formErrors, setFormErrors] = useState({});



    // ----------------------------
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);



    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    console.log("countries", selectedCountry)
    console.log("states", selectedState)
    console.log("cities", selectedCity)

    // useEffect(()=>{
    //     console.log("countries",selectedCountry.value)
    //     console.log("states",selectedState.value)
    //     console.log("cities",selectedCity.value)
    // },[selectedCountry, selectedState, selectedCity])
    // ------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/country_list', {
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
            axios.get(`https://office3i.com/development/api/public/api/state_list/${selectedCountry.value}`, {
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
            axios.get(`https://office3i.com/development/api/public/api/city_list/${selectedState.value}`, {
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
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        setSelectedCity(null);
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
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


    // ------------------------------------------------------------------------------------------------------------------

    const [selectedPreferredLocation, setSelectedPreferredLocation] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

    useEffect(() => {
        // Fetch city list from the API
        const fetchCities = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/all_city_list', {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        if (userWhatapp) {
            if (!/^\d{10}$/.test(userWhatapp)) {
                errors.userWhatapp = 'WhatsApp Number must be a 10-digit number.';
            }
        }

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
            if (parseFloat(Budgetmax) <= parseFloat(Budgetmin)) {
                errors.Budgetmax = 'Max Budget must be greater than Min Budget.';
            }
        }




        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});



        const formData = new FormData();
        const getValue = (input) => input?.value ?? input ?? '-';
        formData.append('role_id', userrole);
        formData.append('user_leaddate', leadDate);
        formData.append('user_name', userName);
        formData.append('user_email', userEmail);
        formData.append('user_mobile', userMobile);
        formData.append('user_whatapp', userWhatapp || '0');
        formData.append('user_gender', gender);
        formData.append('user_country', getValue(selectedCountry));
        formData.append('user_state', getValue(selectedState));
        formData.append('user_city', getValue(selectedCity));
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
        formData.append('call_backon', callonDate);
        formData.append('comment', comments || '-');


        formData.append('created_by', userempid);



        axios.post('https://office3i.com/development/api/public/api/sales_addlead', formData, {
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
                    GoToTaskListPage()

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

    const fileInputRef = useRef(null);
    const handleCancel = () => {
        setleadDate('')
        setuserName('')
        setuserEmail('')
        setuserMobile('')
        setuserwhatapp('')
        setGender('')
        setCompanyName('')
        setWebsite('')
        setArea('')
        setPincode('')
        setProductType('')
        setProductName('')
        setBudgetmin('')
        setBudgetmax('')
        setRequirements('')
        setSourceName('')
        setSourceNumber('')
        setCallonDate('')
        setComments('')
        setSelectedCountry('')
        setSelectedState('')
        setSelectedCity('')
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ------------------------------------------------------------------------------------------------
    // getautogenerateLeadId ID FETCH FROM API



    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/getautogenerateLeadId', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    setLeadID(response.data.data);
                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                console.log(err.message);

            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------




    return (
        <div className='Addproject__container mt-5' style={{ padding: '0px 70px 30px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Lead</h3>
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>

                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Personal Information</h3>
                <Form onSubmit={handleSubmit}>
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
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>

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
                                    value={selectedCountry}
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
                                    value={selectedState}
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
                                    value={selectedCity}
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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Requirement Details</h3>
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
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Source</h3>
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

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleCancel} className="ml-2">
                        Cancel
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default PresalesAddLead;
