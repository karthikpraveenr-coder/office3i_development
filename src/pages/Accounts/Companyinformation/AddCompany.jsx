import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useRef } from 'react';

const AddCompany = () => {

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
        navigate(`/admin/companyList`);
    };

    // ------------------------------------------------------------------------------------------------

    const [CompanyName, setCompanyName] = useState('');
    const [mailingName, setmailingName] = useState('');
    const [companyAddress, setcompanyAddress] = useState('');
    const [gstinUin, setgstinUin] = useState('');
    const [companyType, setcompanyType] = useState('');
    const [holderName, setholderName] = useState('');
    const [accountNo, setaccountNo] = useState('');
    const [ifscCode, setifscCode] = useState('');
    const [bankName, setbankName] = useState('');
    const [branchName, setbranchName] = useState('');
    const [bankAddress, setbankAddress] = useState('');
    const [panNO, setpanNO] = useState('');
    const [status, setStatus] = useState('');
    const [formErrors, setFormErrors] = useState({});

    // ----------------------------
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
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

        if (!CompanyName) {
            errors.CompanyName = 'Company Name is required.';
        }
        if (!mailingName) {
            errors.mailingName = 'Mailing Name is required.';
        }
        if (!companyAddress) {
            errors.companyAddress = 'Company Address is required.';
        }
        if (!gstinUin) {
            errors.gstinUin = 'GSTIN / UIN is required.';
        }
        if (!companyType) {
            errors.companyType = 'Company Type is required.';
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
        if (!holderName) {
            errors.holderName = 'Holder Name Type is required.';
        }
        if (!accountNo) {
            errors.accountNo = 'Account Number is required.';
        }
        if (!ifscCode) {
            errors.ifscCode = 'IFSC Code is required.';
        }
        if (!bankName) {
            errors.bankName = 'Bank Name is required.';
        }
        if (!branchName) {
            errors.branchName = 'Branch Name is required.';
        }
        if (!bankAddress) {
            errors.bankAddress = 'Bank Address is required.';
        }

        if (!panNO) {
            errors.panNO = 'PAN number is required';
        } else {
            if (!/^[A-Z]{5}/.test(panNO)) {
                errors.panNO = 'First 5 characters should be uppercase letters';
            } else if (!/[0-9]{4}/.test(panNO.substring(5, 9))) {
                errors.panNO = 'Next 4 characters should be digits';
            } else if (!/[A-Z]{1}/.test(panNO.charAt(9))) {
                errors.panNO = 'Last character should be an uppercase letter';
            } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNO)) {
                errors.panNO = 'Invalid PAN number format';
            }
        }
        if (!status) {
            errors.status = 'Status is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});


        const formData = new FormData();
        const getValue = (input) => input?.value ?? input ?? '-';
        formData.append('company_name', CompanyName);
        formData.append('mailing_name', mailingName);
        formData.append('address', companyAddress);
        formData.append('country', getValue(selectedCountry));
        formData.append('state', getValue(selectedState));
        formData.append('city', getValue(selectedCity));
        formData.append('gstin_uin', gstinUin);
        formData.append('company_type', companyType);
        formData.append('account_holder_name', holderName);
        formData.append('account_number', accountNo);
        formData.append('ifsc_code', ifscCode);
        formData.append('branch_name', branchName);
        formData.append('bank_address', bankAddress);
        formData.append('bank_name', bankName);
        formData.append('pan_no', panNO);
        formData.append('status', status);
        formData.append('created_by', userempid);


        axios.post('https://office3i.com/development/api/public/api/addcompany_information', formData, {
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
        setCompanyName('')
        setmailingName('')
        setcompanyAddress('')
        setgstinUin('')
        setcompanyType('')
        setholderName('')
        setaccountNo('')
        setifscCode('')
        setbankName('')
        setbranchName('')
        setbankAddress('')
        setpanNO('')
        setSelectedCountry('')
        setSelectedState('')
        setSelectedCity('')
        setStatus('')
        setFormErrors({})
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------




    return (
        <div className='Addproject__container mt-5' style={{ padding: '0px 70px 30px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Company</h3>
            <div style={{ boxShadow: 'rgba(0, 0, 0, 0.49) 0px 0px 10px 1px', padding: '35px 50px' }}>

                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Company Information</h3>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                            <Form.Group controlId="companyNmae">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={CompanyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                                {formErrors.CompanyName && <span className="text-danger">{formErrors.CompanyName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="mailingName">
                                <Form.Label>Mailing Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={mailingName}
                                    onChange={(e) => setmailingName(e.target.value)}
                                />
                                {formErrors.mailingName && <span className="text-danger">{formErrors.mailingName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="companyAddress">
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={companyAddress}
                                    onChange={(e) => setcompanyAddress(e.target.value)}
                                />
                                {formErrors.companyAddress && <span className="text-danger">{formErrors.companyAddress}</span>}
                            </Form.Group>
                        </Col>
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
                    </Row>
                    <Row>

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
                            <Form.Group controlId="gstinUin">
                                <Form.Label>GSTIN / UIN</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={gstinUin}
                                    onChange={(e) => setgstinUin(e.target.value)}
                                />
                                {formErrors.gstinUin && <span className="text-danger">{formErrors.gstinUin}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="companyType">
                                <Form.Label>Company Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={companyType}
                                    onChange={(e) => setcompanyType(e.target.value)}
                                />
                                {formErrors.companyType && <span className="text-danger">{formErrors.companyType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Bank Details</h3>
                    <Row>
                        <Col>
                            <Form.Group controlId="holderName">
                                <Form.Label>Holder Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={holderName}
                                    onChange={(e) => setholderName(e.target.value)}
                                />
                                {formErrors.holderName && <span className="text-danger">{formErrors.holderName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="accountNo">
                                <Form.Label>Account No</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={accountNo}
                                    onChange={(e) => setaccountNo(e.target.value)}
                                />
                                {formErrors.accountNo && <span className="text-danger">{formErrors.accountNo}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="bankName">
                                <Form.Label>Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={bankName}
                                    onChange={(e) => setbankName(e.target.value)}
                                />
                                {formErrors.bankName && <span className="text-danger">{formErrors.bankName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="branchName">
                                <Form.Label>Branch Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={branchName}
                                    onChange={(e) => setbranchName(e.target.value)}
                                />
                                {formErrors.branchName && <span className="text-danger">{formErrors.branchName}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="ifscCode">
                                <Form.Label>IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => setifscCode(e.target.value)}
                                />
                                {formErrors.ifscCode && <span className="text-danger">{formErrors.ifscCode}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="bankAddress">
                                <Form.Label>Bank Address</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={bankAddress}
                                    onChange={(e) => setbankAddress(e.target.value)}
                                />
                                {formErrors.bankAddress && <span className="text-danger">{formErrors.bankAddress}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Form.Group controlId="panNO">
                                <Form.Label>Pan No</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={panNO}
                                    onChange={(e) => setpanNO(e.target.value)}
                                />
                                {formErrors.panNO && <span className="text-danger">{formErrors.panNO}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="status">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="In-Active">In-Active</option>
                                </Form.Control>
                                {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
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

export default AddCompany;
