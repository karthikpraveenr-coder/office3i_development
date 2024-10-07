import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Button, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import FormContext from '../../../context/FormContext';
import Select from 'react-select';


function EditCustomerEnquiryList() {
    const navigate = useNavigate();
    const { id } = useParams();
    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // STATE MANAGEMENT



    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const [mobile, setMobile] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [password, setPassword] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [plans, setPlans] = useState([]);
    const [modules, setModules] = useState([]);
    const [membersCount, setMembersCount] = useState('');
    const [mode, setMode] = useState('');
    console.log("membersCount---------------->", membersCount)

    const [gstin, setGstin] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [pincode, setPincode] = useState('');
    const [products, setProducts] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [planDuration, setPlanDuration] = useState("monthly");
    console.log("planDuration", planDuration)
    const [employeeCount, setEmployeeCount] = useState(0);
    const [planPrice, setPlanPrice] = useState(0);
    const [addedEmployeeAmount, setAddedEmployeeAmount] = useState(0);
    const [member, setMember] = useState(0);

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    useEffect(() => {
        // Fetch Plan options
        axios.get('https://office3i.com/development/api/public/api/webproduct_list')
            .then(response => {
                if (response.data && response.data.data) {
                    setPlans(response.data.data);

                    console.log("setPlans", response.data.data)
                }
            })
            .catch(error => console.error('Error fetching plans:', error));

        // Fetch Module options
        axios.get('https://office3i.com/development/api/public/api/webmodule_list')
            .then(response => {


                if (response.data && response.data.data) {
                    setModules(response.data.data);

                    console.log("setModules", response.data.data)
                }
            })
            .catch(error => console.error('Error fetching modules:', error));
    }, []);

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const errors = {};

        if (!firstName) errors.firstName = 'First name is required.';
        if (!lastName) errors.lastName = 'Last name is required.';
        if (!email) errors.email = 'Email is required.';
        if (!mobile) errors.mobile = 'Mobile number is required.';
        if (!companyName) errors.companyName = 'Company name is required.';
        if (!password) errors.password = 'Password is required.';
        if (!selectedPlan) errors.selectedPlan = 'Plan is required.';
        if (!selectedModule) errors.selectedModule = 'Module is required.';
        if (!mode) errors.mode = 'Demo mode is required.';

        if (mode === 'Sales-Team' && mode !== '') {
            if (!selectedDepartment) errors.selectedDepartment = 'Department is required.';
            if (!selectedEmployee) errors.selectedEmployee = 'Employee is required.';
        }

        if (selectedModule !== '1' && selectedModule !== '') {
            if (!gstin) errors.gstin = 'GSTIN is required.';
            if (!billingAddress) errors.billingAddress = 'Billing address is required.';
            if (!selectedCountry) errors.selectedCountry = 'Country is required.';
            if (!selectedState) errors.selectedState = 'State is required.';
            if (!selectedCity) errors.selectedCity = 'City is required.';
            if (!pincode) errors.pincode = 'Pincode is required.';
            if (!selectedPaymentMethod) errors.selectedPaymentMethod = 'Payment Method is required.';
            if (!reason) errors.reason = 'Reason is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        setFormErrors({});

        const payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            mobile_number: mobile,
            company_name: companyName,
            password: password,
            module_id: selectedModule,
            plan_id: selectedPlan,
            demo_mode: mode,
            assign_department: selectedDepartment,
            assign_member: selectedEmployee,
            created_by: userempid,
            gstin: gstin,
            billing_address: billingAddress,

            country: selectedCountry.value,
            state: selectedState.value,
            city: selectedCity.value,

            pin_code: pincode,
            payment_method: selectedPaymentMethod.value,
            pay_reason: reason,
            add_emp_count: employeeCount,
            total_emp_count: addedEmployeeCount,
            plan_period: planDuration,
            total_plan_amt: total_plan_amt,
            add_emp_amt: addedEmployeeAmount,
            tax_amt: gst,
            discount_amount: discount,
            overall_amt: overallAmount,
            enq_id: id
        };

        axios.post('https://office3i.com/development/api/public/api/office3i_enquiryadd_lead', payload, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                setLoading(false);
                if (response.data.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.message,
                        confirmButtonText: 'Ok'
                    });
                    setFormErrors({});
                } else if (response.data.status === "error") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: response.data.message,
                        confirmButtonText: 'Ok'
                    });
                    setFormErrors({ formError: response.data.message });
                }
            })
            .catch(() => {
                setLoading(false);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'There was an error submitting the form. Please try again later.',
                    confirmButtonText: 'Okay'
                });
                setFormErrors({ formError: "There was an error submitting the form. Please try again later." });
            });
    };



    // ---------------------------------------------------------------------------------------------

    // State
    const [departmentDropdown, setDepartmentDropdown] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [employeesDropdown, setEmployeesDropdown] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');

    // Fetch Departments
    useEffect(() => {
        const fetchrole = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setDepartmentDropdown(data);
            } catch (error) {
                console.error('Error fetching department options:', error);
            }
        };

        fetchrole();
    }, []);

    const formattedDepartmentDropdown = departmentDropdown.map(department => ({
        label: department.role_name,
        value: department.id
    }));

    const handleSelectDepartmentChange = (selectedOption) => {
        setSelectedDepartment(selectedOption.value);
    };

    const formattedSelectedDepartment = selectedDepartment ? selectedDepartment : null;

    // Fetch Employees
    useEffect(() => {
        const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${formattedSelectedDepartment}`;
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                setEmployeesDropdown(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [formattedSelectedDepartment]);

    const formattedEmployeesDropdown = employeesDropdown.map(employee => ({
        label: employee.emp_name,
        value: employee.emp_id
    }));

    const handleSelectEmployeeChange = (selectedOption) => {
        setSelectedEmployee(selectedOption.value);
    };

    const formattedSelectedEmployees = selectedEmployee ? selectedEmployee : null;

    // --------------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------------
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);  // Changed from selectedCityIds to selectedCity

    // ------------------------------------------------------------------------------------------------------------
    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/office3i_country_list', {
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

    useEffect(() => {
        if (selectedCountry) {
            axios.get(`https://office3i.com/development/api/public/api/office3i_state_list/${selectedCountry.value}`, {
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

    useEffect(() => {
        if (selectedState) {
            axios.get(`https://office3i.com/development/api/public/api/office3i_city_list/${selectedState.value}`, {
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
        setSelectedCity(null);  // Reset selected city when the country changes
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);  // Reset selected city when the state changes
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);  // Handle single selection for city
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

    useEffect(() => {
        // Fetching data from the API
        axios.get(`https://office3i.com/development/api/public/api/webproductmodule_list/${selectedPlan}`)
            .then(response => {
                console.log("setProducts----->", response.data.data);
                console.log("First Product Price----->", response.data.data[0].price);
                setMembersCount(response.data.data[0].member)
                setPlanPrice(parseFloat(response.data.data[0].price)); // Make sure it's a number
                setMember(response.data.data[0].monthly_member); // Make sure it's a number

                if (Array.isArray(response.data.data)) {
                    const sortedProducts = response.data.data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    setProducts(sortedProducts);
                    console.log("sortedProducts---->", sortedProducts);
                } else {
                    console.error("Unexpected response structure", response.data);
                    setError("Unexpected response structure");
                }
            })
            .catch(error => {
                console.error("There was an error fetching the products!", error);
                setError("Failed to load products. Please try again later.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedPlan]);


    const handleEmployeeCountChange = (delta) => {
        setEmployeeCount(prevCount => Math.max(0, prevCount + delta));
    };

    const addedEmployeeCount = Number(employeeCount) + Number(membersCount);

    useEffect(() => {
        setAddedEmployeeAmount(employeeCount * member || 0);
    }, [employeeCount]);

    const calculateTotal = () => {
        const price = planDuration === "yearly" ? planPrice * 12 : planPrice;
        return (price + addedEmployeeAmount).toFixed(2);
    };

    const calculateGST = () => {
        const price = planDuration === "yearly" ? planPrice * 12 : planPrice;
        return ((price + addedEmployeeAmount) * 0.18).toFixed(2);
    };

    const calculateDiscount = () => {
        return planDuration === "yearly" ? (planPrice * 12 * 0.10).toFixed(2) : 0;
    };

    const total_plan_amt = planPrice + addedEmployeeAmount;

    // console.log("total_plan_amt", total_plan_amt)

    const totalBeforeDiscountAndGST = parseFloat(calculateTotal());
    const gst = parseFloat(calculateGST());
    const discount = parseFloat(calculateDiscount());
    const overallAmount = (totalBeforeDiscountAndGST + gst - discount).toFixed(2);

    // console.log("overallAmount", overallAmount);
    // console.log("discount", discount);
    // console.log("gst", gst);


    // --------------------------------------------------------------------------------------------


    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [reason, setReason] = useState('');


    useEffect(() => {
        axios.get('https://office3i.com/development/api/public/api/payment_method_status', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                console.log("API Response:", response);  // Log the entire response
                console.log("Data:", response.data);  // Log the data part of the response

                const paymentMethods = response.data.data; // Access the array inside response.data
                console.log("Payment Methods:", paymentMethods);  // Log the payment methods array

                const formattedOptions = paymentMethods.map(method => ({
                    value: method.id,
                    label: method.payment_method
                }));

                console.log("Formatted Options:", formattedOptions);  // Log the formatted options
                setPaymentMethodOptions(formattedOptions);
            })
            .catch(error => console.error('Error fetching payment methods:', error));
    }, []);



    const handlePaymentMethodChange = (selectedOption) => {
        setSelectedPaymentMethod(selectedOption);
    };

    // --------------------------------------------------------------------------------

    useEffect(() => {
        axios.get(`https://office3i.com/development/api/public/api/contact_editview_enquiry/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    // setData(res.data.data);
                    const data = res.data.data[0];

                    console.log("data--->", data)

                    setFirstName(data.first_name || '');
                    setEmail(data.email || '');
                    setCompanyName(data.company_name || '');
                    setMobile(data.mobile_number || '');
                
                
                    setSelectedPlan(data.plan_id || '');

                    setLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, [id, usertoken]);




    return (
        <div>
            <Form onSubmit={handleSubmit} style={{ padding: '20px 30px 0px 30px' }}>
                <h3 className='mb-4' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Lead</h3>

                <div style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '30px 43px' }}>

                    <Row>
                        <Col>
                            <Form.Group className="mb-3" controlId="firstName">
                                <Form.Label className="freetrial_formlabel">First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="First Name"
                                />
                                {formErrors.firstName && <span className="text-danger">{formErrors.firstName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="lastName">
                                <Form.Label className="freetrial_formlabel">Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Last Name"
                                />
                                {formErrors.lastName && <span className="text-danger">{formErrors.lastName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="freetrial_formlabel">Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email ID"
                                    disabled
                                />
                                {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            <Form.Group className="mb-3" controlId="mobile">
                                <Form.Label className="freetrial_formlabel">Mobile Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value)}
                                    placeholder="Mobile Number"
                                />
                                {formErrors.mobile && <span className="text-danger">{formErrors.mobile}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="companyName">
                                <Form.Label className="freetrial_formlabel">Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Company Name"
                                />
                                {formErrors.companyName && <span className="text-danger">{formErrors.companyName}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label className="freetrial_formlabel">Create Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create Password"
                                />
                                {formErrors.password && <span className="text-danger">{formErrors.password}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>

                        <Col>
                            <Form.Group className="mb-3" controlId="moduleSelect">
                                <Form.Label className="freetrial_formlabel">Select Module</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedModule}
                                    onChange={(e) => setSelectedModule(e.target.value)}
                                >
                                    <option value="">Select a Module</option>
                                    {modules.map(module => (
                                        <option key={module.id} value={module.id}>{module.module_name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.selectedModule && <span className="text-danger">{formErrors.selectedModule}</span>}
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" controlId="planSelect">
                                <Form.Label className="freetrial_formlabel">Select Plan</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedPlan}
                                    onChange={(e) => setSelectedPlan(e.target.value)}
                                >
                                    <option value="">Select a Plan</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </Form.Control>
                                {formErrors.selectedPlan && <span className="text-danger">{formErrors.selectedPlan}</span>}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="planSelect">
                                <Form.Label className="freetrial_formlabel">Select Demo</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="">Select a Mode</option>
                                    <option value="Online">Online</option>
                                    <option value="Sales-Team">Sales-Team</option>

                                </Form.Control>
                                {formErrors.mode && <span className="text-danger">{formErrors.mode}</span>}
                            </Form.Group>
                        </Col>
                    </Row>
                    {mode === 'Sales-Team' && (
                        <Row>
                            <Col>
                                <Form.Group controlId="formRole">

                                    <Form.Label className="freetrial_formlabel">Department Name</Form.Label>
                                    <Select
                                        options={formattedDepartmentDropdown}
                                        value={formattedDepartmentDropdown.find(option => option.value === selectedDepartment)}
                                        onChange={handleSelectDepartmentChange}
                                        placeholder="Select Department"
                                    />
                                    {formErrors.selectedDepartment && <span className="text-danger">{formErrors.selectedDepartment}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formEmployee">

                                    <Form.Label className="freetrial_formlabel"> Employee Name</Form.Label>
                                    <Select
                                        options={formattedEmployeesDropdown}
                                        value={formattedEmployeesDropdown.find(option => option.value === selectedEmployee)}
                                        onChange={handleSelectEmployeeChange}
                                        placeholder="Select Employee"
                                    />
                                    {formErrors.selectedEmployee && <span className="text-danger">{formErrors.selectedEmployee}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                    )}



                    {/* ------------------------------------------------------------ */}
                    {selectedModule !== '1' && selectedModule !== '' && (
                        <>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3" controlId="gstin">
                                        <Form.Label className="freetrial_formlabel">GSTIN</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={gstin}
                                            onChange={(e) => setGstin(e.target.value)}
                                            placeholder="GSTIN"
                                        />
                                        {formErrors.gstin && <span className="text-danger">{formErrors.gstin}</span>}

                                    </Form.Group>
                                </Col>
                                <Col>

                                    <Form.Group className="mb-3" controlId="billingAddress">
                                        <Form.Label className="freetrial_formlabel">Billing Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            rows={3}
                                            value={billingAddress}
                                            onChange={(e) => setBillingAddress(e.target.value)}
                                            placeholder="Billing Address"
                                        />
                                        {formErrors.billingAddress && <span className="text-danger">{formErrors.billingAddress}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* ----------------------------------------------------------------------------- */}


                            <Row className="mb-3">
                                <Col sm={6}>
                                    <Form.Group controlId="country">
                                        <Form.Label>Country</Form.Label>
                                        <Select
                                            options={formatCountryOptions()}
                                            value={selectedCountry}
                                            onChange={handleCountryChange}
                                            placeholder="Select Country"
                                        />
                                        {formErrors.selectedCountry && <span className="text-danger">{formErrors.selectedCountry}</span>}
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="state">
                                        <Form.Label>State</Form.Label>
                                        <Select
                                            options={formatStateOptions()}
                                            value={selectedState}
                                            onChange={handleStateChange}
                                            placeholder="Select State"
                                            isDisabled={!selectedCountry}
                                        />
                                        {formErrors.selectedState && <span className="text-danger">{formErrors.selectedState}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col sm={6}>
                                    <Form.Group controlId="city">
                                        <Form.Label>City</Form.Label>
                                        <Select
                                            options={formatCityOptions()}
                                            value={selectedCity}  // Single selection for city
                                            onChange={handleCityChange}
                                            placeholder="Select City"
                                            isDisabled={!selectedState}
                                        />
                                        {formErrors.selectedCity && <span className="text-danger">{formErrors.selectedCity}</span>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group className="mb-3" controlId="pincode">
                                        <Form.Label className="freetrial_formlabel">Pincode</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="Pincode"
                                        />
                                        {formErrors.pincode && <span className="text-danger">{formErrors.pincode}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={6}>
                                    <Form.Group controlId="paymentMethod">
                                        <Form.Label>Payment Method</Form.Label>
                                        <Select
                                            options={paymentMethodOptions}
                                            value={selectedPaymentMethod}
                                            onChange={handlePaymentMethodChange}
                                            placeholder="Select Payment Method"
                                        />
                                        {formErrors.selectedPaymentMethod && <span className="text-danger">{formErrors.selectedPaymentMethod}</span>}
                                    </Form.Group>
                                </Col>

                                <Col sm={6}>
                                    <Form.Group controlId="reason">
                                        <Form.Label>Reason</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            placeholder="Enter Reason"
                                        />
                                        {formErrors.reason && <span className="text-danger">{formErrors.reason}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* ----------------------------------------------------------------------------- */}


                            <div>
                                <h3 className="Right_title_freetrial mb-4 mt-5">Payment Details</h3>
                                <div className="payment-details">
                                    <h6 style={{ color: "#004A78" }}>Choose Plan Amount</h6>
                                    <div className="d-flex align-items-center mb-3">
                                        <Form.Check
                                            type="radio"
                                            label={`Rs.${planPrice}/month`}
                                            name="planDuration"
                                            id="monthly"
                                            checked={planDuration === "monthly"}
                                            onChange={() => setPlanDuration("monthly")}
                                        />
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Form.Check
                                                type="radio"
                                                label={`Rs.${planPrice * 12}/year`}
                                                name="planDuration"
                                                id="yearly"
                                                checked={planDuration === "yearly"}
                                                onChange={() => setPlanDuration("yearly")}
                                                className="ms-3"
                                            />
                                            <span>(10% Off)</span>
                                        </div>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mt-5 mb-3">
                                        <h6>Employee Count</h6>
                                        <InputGroup className="employee-count" style={{ width: '15%' }}>
                                            <Button variant="outline-secondary" onClick={() => handleEmployeeCountChange(-1)}>-</Button>
                                            <Form.Control type="text" value={employeeCount} readOnly className="text-center" />
                                            <Button variant="outline-secondary" onClick={() => handleEmployeeCountChange(1)}>+</Button>
                                        </InputGroup>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6>Plan Amount ({planDuration === "monthly" ? "monthly" : "yearly"})</h6>
                                        <span>Rs.{planDuration === "monthly" ? planPrice.toFixed(2) : (planPrice * 12).toFixed(2)}</span>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6>Added Employee Amount</h6>
                                        <span>Rs.{addedEmployeeAmount.toFixed(2)}</span>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between mb-3">
                                        <h6>GST (18%)</h6>
                                        <span>Rs.{calculateGST()}</span>
                                    </div>

                                    {planDuration === "yearly" && (
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <h6>Discount (10% Off)</h6>
                                            <span>Rs.{calculateDiscount()}</span>
                                        </div>
                                    )}

                                    <hr className="my-3" />

                                    <div className="d-flex align-items-center justify-content-between mb-4">
                                        <strong>Total Amount</strong>
                                        <strong style={{ color: "#004A78" }}>Rs.{overallAmount}</strong>
                                    </div>
                                    <hr className="my-3" />
                                </div>
                            </div>

                        </>
                    )}
                    <Button
                        variant="primary"
                        type="submit"
                        className="freetrial_submit mt-3 btn-loading"
                        disabled={loading}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                Submit
                            </span>
                        ) : (
                            'Submit'
                        )}
                    </Button>

                </div>
            </Form>
        </div>
    );
}

export default EditCustomerEnquiryList;
