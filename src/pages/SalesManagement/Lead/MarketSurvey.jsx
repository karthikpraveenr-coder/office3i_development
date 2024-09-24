import React, { useEffect, useState } from 'react';
import './css/SurveyReport.css';
import { Col, Form } from 'react-bootstrap';
import axios from 'axios';

const MarketSurvey = () => {

    // State for form values
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [selectedPlan, setSelectedPlan] = useState('');
    const [plans, setPlans] = useState([]);
    const [companyName, setCompanyName] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [designation, setDesignation] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [totalEmployeeCount, setTotalEmployeeCount] = useState('');
    const [softwareUsed, setSoftwareUsed] = useState('');
    const [requirements, setRequirements] = useState('');
    const [additionalRequirements, setAdditionalRequirements] = useState('');
    const [rmName, setRmName] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [purpose, setPurpose] = useState('');
    const [industry, setIndustry] = useState('');

    // State for form errors
    const [formErrors, setFormErrors] = useState({});


    useEffect(() => {
        // Fetch Plan options
        axios.get('https://office3i.com/user/api/public/api/webproduct_list')
            .then(response => {
                if (response.data && response.data.data) {
                    setPlans(response.data.data);
                    console.log("setPlans", response.data.data)
                }
            })
            .catch(error => console.error('Error fetching plans:', error));

    }, []);



    const [checkedNames, setCheckedNames] = useState({
        Dashboard: [],
        EmployeeManagement: [],
        AttendanceCalculation: [],
        Recruitment: [],
        Payroll: [],
        Accounts: [],
        SalesManagement: [],
        VisitorManagement: [],
        TeamManagement: [],
        AssetManagement: [],
        HelpDesk: [],
        Logs: []
    });



    const handleCheckboxChange = (event) => {
        const { value, checked, name } = event.target;
        setCheckedNames(prevState => ({
            ...prevState,
            [name]: checked ? [...prevState[name], value] : prevState[name].filter(item => item !== value)
        }));
    };

    console.log("checkedNames", checkedNames)


    const handleSubmit = (e) => {
        e.preventDefault();
        // Add form validation and submission logic here
    };

    return (
        <div className="container-fluid my-4 market__container">

            <div className='market'>
                <div className="text-center mb-5">
                    <h3 className="bg-title p-2">MARKET SURVEY REPORT</h3>
                </div>

                <Form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* Company Information Section */}

                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label className="freetrial_formlabel">Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Name"
                                />
                                {formErrors.name && <span className="text-danger">{formErrors.name}</span>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="companyName">
                                <Form.Label>Company Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Company Name"
                                />
                                {formErrors.companyName && <span className="text-danger">{formErrors.companyName}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="contactPerson">
                                <Form.Label>Contact Person</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={contactPerson}
                                    onChange={(e) => setContactPerson(e.target.value)}
                                    placeholder="Contact Person"
                                />
                                {formErrors.contactPerson && <span className="text-danger">{formErrors.contactPerson}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="designation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                    placeholder="Designation"
                                />
                                {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="mobileNo">
                                <Form.Label>Mobile No</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={mobileNo}
                                    onChange={(e) => setMobileNo(e.target.value)}
                                    placeholder="Mobile No"
                                />
                                {formErrors.mobileNo && <span className="text-danger">{formErrors.mobileNo}</span>}
                            </Form.Group>
                        </Col>

                        {/* RM Information Section */}
                        <Col md={4}>
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label className="freetrial_formlabel">Email ID</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email ID"
                                />
                                {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="totalEmployeeCount">
                                <Form.Label>Total Employee Count</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={totalEmployeeCount}
                                    onChange={(e) => setTotalEmployeeCount(e.target.value)}
                                    placeholder="Total Employee Count"
                                />
                                {formErrors.totalEmployeeCount && <span className="text-danger">{formErrors.totalEmployeeCount}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="softwareUsed">
                                <Form.Label>Software Used</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={softwareUsed}
                                    onChange={(e) => setSoftwareUsed(e.target.value)}
                                    placeholder="Software Used"
                                />
                                {formErrors.softwareUsed && <span className="text-danger">{formErrors.softwareUsed}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="requirements">
                                <Form.Label>Requirements</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    placeholder="Requirements"
                                />
                                {formErrors.requirements && <span className="text-danger">{formErrors.requirements}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="additionalRequirements">
                                <Form.Label>Additional Requirements</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={additionalRequirements}
                                    onChange={(e) => setAdditionalRequirements(e.target.value)}
                                    placeholder="Additional Requirements"
                                />
                                {formErrors.additionalRequirements && <span className="text-danger">{formErrors.additionalRequirements}</span>}
                            </Form.Group>
                        </Col>

                        {/* Empty Column for Future Use */}
                        <Col md={4}>
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

                            <Form.Group className="mb-3" controlId="rmName">
                                <Form.Label>RM Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={rmName}
                                    onChange={(e) => setRmName(e.target.value)}
                                    placeholder="RM Name"
                                />
                                {formErrors.rmName && <span className="text-danger">{formErrors.rmName}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="date">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                {formErrors.date && <span className="text-danger">{formErrors.date}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="location">
                                <Form.Label>Location</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Location"
                                />
                                {formErrors.location && <span className="text-danger">{formErrors.location}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="purpose">
                                <Form.Label>Purpose</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Purpose"
                                />
                                {formErrors.purpose && <span className="text-danger">{formErrors.purpose}</span>}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="industry">
                                <Form.Label>Industry</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder="Industry"
                                />
                                {formErrors.industry && <span className="text-danger">{formErrors.industry}</span>}
                            </Form.Group>
                        </Col>
                    </div>





                    <div className="container">
                        <div className="row">
                            {/* Dashboard */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Dashboard</h5>
                                <ul className="list-group">
                                    <li className="list-group-item">
                                        <label>
                                            <input
                                                type="checkbox"
                                                value="Dashboard"
                                                name="Dashboard"
                                                onChange={handleCheckboxChange}
                                            /> Dashboard
                                        </label>
                                    </li>
                                </ul>
                            </div>

                            {/* Employee Management Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Employee Management</h5>
                                <ul className="list-group">
                                    {['ORG Structure', 'Attendance Policy', 'Company Policy', 'Template', 'Employee Info'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="EmployeeManagement"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Attendance Calculation Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Attendance Calculation</h5>
                                <ul className="list-group">
                                    {['Daily Attendance', 'Monthly Attendance', 'Monthly Attendance Calendar View', 'Monthly List', 'HR Approval List', 'TL Approval List'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="AttendanceCalculation"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Recruitment Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Recruitment</h5>
                                <ul className="list-group">
                                    {['Post Job', 'List Job', 'Inbox Webmail', 'Candidate Tracker', 'Search Resume'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="Recruitment"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Payroll Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Payroll</h5>
                                <ul className="list-group">
                                    {['Overtime Calculation', 'Assign Employee Salary', 'Salary Calculation', 'General Payslip', 'Payslip List'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="Payroll"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Accounts Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Accounts</h5>
                                <ul className="list-group">
                                    {['Goods and Services', 'Company Details', 'Sales Invoice', 'Purchase Invoice', 'Daily Accounts'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="Accounts"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Sales Management Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Sales Management</h5>
                                <ul className="list-group">
                                    {['Lead', 'Pre Sales', 'Sales', 'Online Customer'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="SalesManagement"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Visitor Management Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Visitor Management</h5>
                                <ul className="list-group">
                                    {['Add Visitor', 'Visitor Log'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="VisitorManagement"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Team Management Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Team Management</h5>
                                <ul className="list-group">
                                    {['Events', 'Meeting', 'Team Task'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="TeamManagement"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Asset Management Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Asset Management</h5>
                                <ul className="list-group">
                                    {['Assets Type', 'Assign Assets', 'Assets List'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="AssetManagement"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* HelpDesk Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">HelpDesk</h5>
                                <ul className="list-group">
                                    {['Issue Type', 'Raise Ticket', 'Ticket List', 'Assign List'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="HelpDesk"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Logs Section */}
                            <div className="col-md-4 mb-5">
                                <h5 className="bg-secondary text-white p-2">Logs</h5>
                                <ul className="list-group">
                                    {['Activity Log', 'Employee Activity Log'].map(option => (
                                        <li key={option} className="list-group-item">
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    value={option}
                                                    name="Logs"
                                                    onChange={handleCheckboxChange}
                                                /> {option}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>



                    {/* Feedback Section */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <Form.Group className="mb-3">
                                <Form.Label className="bg-title text-center p-2">Feedback & Suggestions</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter your feedback and suggestions here"
                                />
                            </Form.Group>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">Submit</button>
                </Form>
            </div>

        </div>
    );
};

export default MarketSurvey;
