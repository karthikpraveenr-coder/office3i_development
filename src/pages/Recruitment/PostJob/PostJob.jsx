import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import JoditEditor from 'jodit-react';
import {
    GetCountries,
    GetState,
    GetCity,
} from "react-country-state-city";
import { MultiSelect } from 'primereact/multiselect';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import '../css/tagsinput-custom.css'
import axios from 'axios';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const PostJob = () => {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoTolistjobpage = () => {
        navigate(`/admin/listjob`);
    };

    // ------------------------------------------------------------------------------------------------

    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';
    const userrole = userData?.userrole || '';

    // Form state
    const [designation, setDesignation] = useState('');
    const [vacancies, setVacancies] = useState('');
    const [jobCountry, setJobCountry] = useState('');
    const [jobState, setJobState] = useState('');
    const [jobCity, setJobCity] = useState('');
    const [jobType, setJobType] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [scheduleShift, setScheduleShift] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [experienceMin, setExperienceMin] = useState('');
    const [experienceMax, setExperienceMax] = useState('');
    const [keySkills, setKeySkills] = useState([]);
    const [preferredCandidate, setPreferredCandidate] = useState('');
    const [rolesResponsibilities, setRolesResponsibilities] = useState('');
    const [otherBenefits, setOtherBenefits] = useState('');
    const [jobStatus, setJobStatus] = useState('');
    const [validTill, setValidTill] = useState('');
    const [formErrors, setFormErrors] = useState({});

    console.log("jobCountry-------------->", jobCountry)

    const handleCancel = () => {
        setDesignation('');
        setVacancies('');
        setJobCountry('');
        setJobState('');
        setJobCity('');
        setJobType('');
        setEmploymentType('');
        setScheduleShift('');
        setSalaryMin('');
        setSalaryMax('');
        setExperienceMin('');
        setExperienceMax('');
        setKeySkills([]);
        setPreferredCandidate('');
        setRolesResponsibilities('');
        setOtherBenefits('');
        setJobStatus('');
        setValidTill('');
        setFormErrors({});

        setSelectedCountry('')
        setSelectedState('')
        setSelectedCityIds('')
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        if (!designation) {
            errors.designation = 'Designation is required.';
        }
        if (!vacancies) {
            errors.vacancies = 'Number of vacancies is required.';
        }

        // Country, State, and City validation
        if (!selectedCountry || (Array.isArray(selectedCountry) && selectedCountry.length === 0)) {
            errors.country = 'Country is required.';
        }
        if (!selectedState || (Array.isArray(selectedState) && selectedState.length === 0)) {
            errors.state = 'State is required.';
        }
        if (!selectedCityIds || (Array.isArray(selectedCityIds) && selectedCityIds.length === 0)) {
            errors.city = 'City is required.';
        }

        if (!jobType) {
            errors.jobType = 'Job type is required.';
        }
        if (!employmentType) {
            errors.employmentType = 'Employment type is required.';
        }
        if (!scheduleShift) {
            errors.scheduleShift = 'Schedule/shift is required.';
        }
        if (!salaryMin) {
            errors.salaryMin = 'Minimum salary is required.';
        }
        if (!salaryMax) {
            errors.salaryMax = 'Maximum salary is required.';
        }
        if (!experienceMin) {
            errors.experienceMin = 'Minimum experience is required.';
        }
        if (!experienceMax) {
            errors.experienceMax = 'Maximum experience is required.';
        }
        if (keySkills.length === 0) {
            errors.keySkills = 'Key skills are required.';
        }
        if (!preferredCandidate) {
            errors.preferredCandidate = 'Preferred candidate details are required.';
        }
        if (!rolesResponsibilities) {
            errors.rolesResponsibilities = 'Roles and responsibilities are required.';
        }
        if (!otherBenefits) {
            errors.otherBenefits = 'Other benefits details are required.';
        }
        if (!jobStatus) {
            errors.jobStatus = 'Job status is required.';
        }
        if (!validTill) {
            errors.validTill = 'Valid till date is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        const formData = new FormData();
        formData.append('designation', designation);
        formData.append('no_of_vacancies', vacancies);

        formData.append('job_countries', selectedCountry.value);
        formData.append('job_states', selectedState.value);
        formData.append('job_cities', selectedCityIds);

        formData.append('job_type', jobType);
        formData.append('emp_type', employmentType);
        formData.append('shift', scheduleShift);
        formData.append('salary_min', salaryMin);
        formData.append('salary_max', salaryMax);
        formData.append('experience_min', experienceMin);
        formData.append('experience_max', experienceMax);
        formData.append('key_skills', keySkills.join(',')); // Ensure keySkills is serialized if needed
        formData.append('preferred_candidate', preferredCandidate);
        formData.append('roles_responsiblities', rolesResponsibilities);
        formData.append('other_benefits', otherBenefits);
        formData.append('job_status', jobStatus);
        formData.append('valid_till', validTill);
        formData.append('created_by', userempid);

        axios.post('https://office3i.com/development/api/public/api/add_job_post', formData, {
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

                    GoTolistjobpage()
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
                    text: 'There was an error creating the job post. Please try again later.',
                });
                console.error('API Error:', error);
            });
    };



    // ----------------------------

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCityIds, setSelectedCityIds] = useState([]);

    // console.log("selectedCountry", selectedCountry.value)
    // console.log("selectedState", selectedState.value)
    // console.log("selectedCityIds", selectedCityIds)

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
        setSelectedCityIds([]);
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCityIds([]);
    };

    const handleCityChange = (selectedOptions) => {
        // Extract IDs from the selected city options
        const cityIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedCityIds(cityIds);
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

    const handleChange = (tags) => {
        setKeySkills(tags);
    };

    const handleInputChange = (setter) => (event) => {
        const value = event.target.value;
        if (value.length <= 250) {
            setter(value);
        }
    };

    const handleDesignationChange = (e) => {
        const { value } = e.target;
        const regex = /^[A-Za-z\s]+$/; // Regular expression to allow only letters and spaces

        if (!regex.test(value)) {
            setFormErrors({
                ...formErrors,
                designation: 'Numbers are not allowed in the designation',
            });
        } else {
            setFormErrors({
                ...formErrors,
                designation: '',
            });
        }

        setDesignation(value);
    };




    return (
        <Container style={{ padding: '10px 50px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Post Job</h3>

            <div style={{ paddingBottom: '80px' }}>

                <Form onSubmit={handleSubmit}
                    style={{
                        background: '#ffffff',
                        padding: '60px 40px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.43)',
                        margin: '2px'
                    }}>

                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formDesignation">
                                <Form.Label>Designation</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={designation}
                                    onChange={handleDesignationChange}
                                    placeholder="Enter Designation"
                                />
                                {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formVacancies">
                                <Form.Label>No. of Vacancies</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={vacancies}
                                    onChange={(e) => setVacancies(e.target.value)}
                                    placeholder="Enter number of vacancies"
                                />
                                {formErrors.vacancies && <span className="text-danger">{formErrors.vacancies}</span>}
                            </Form.Group>
                        </Col>
                    </Row>


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
                                {formErrors.country && <span className="text-danger">{formErrors.country}</span>}
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
                                {formErrors.state && <span className="text-danger">{formErrors.state}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">

                        <Col sm={6}>
                            <Form.Group controlId="city">
                                <Form.Label>City</Form.Label>
                                <Select
                                    options={formatCityOptions()}
                                    value={formatCityOptions().filter(option => selectedCityIds.includes(option.value))}
                                    onChange={handleCityChange}
                                    placeholder="Select City"
                                    isMulti
                                    isDisabled={!selectedState}
                                />
                                {formErrors.city && <span className="text-danger">{formErrors.city}</span>}
                            </Form.Group>
                        </Col>

                        <Col sm={6}>
                            <Form.Group controlId="formJobType">
                                <Form.Label>Job Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                >
                                    <option value="">Select Job Type</option>
                                    <option value="Remote">Remote</option>
                                    <option value="On-site">On-site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </Form.Control>
                                {formErrors.jobType && <span className="text-danger">{formErrors.jobType}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formEmploymentType">
                                <Form.Label>Employment Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={employmentType}
                                    onChange={(e) => setEmploymentType(e.target.value)}
                                >
                                    <option value="">Select Employment Type</option>
                                    <option value="Full time / Permanent">Full time / Permanent</option>
                                    <option value="Part time / Temporary">Part time / Temporary</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                </Form.Control>
                                {formErrors.employmentType && <span className="text-danger">{formErrors.employmentType}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formScheduleShift">
                                <Form.Label>Schedule / Shift</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={scheduleShift}
                                    onChange={(e) => setScheduleShift(e.target.value)}
                                >
                                    <option value="">Select Schedule / Shift</option>
                                    <option value="General Shift">General Shift</option>
                                    <option value="Night Shift">Night Shift</option>
                                    <option value="Rotational Shift">Rotational Shift</option>
                                </Form.Control>
                                {formErrors.scheduleShift && <span className="text-danger">{formErrors.scheduleShift}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col sm={3}>
                            <Form.Group controlId="formSalaryMin">
                                <Form.Label>Salary (Min)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={salaryMin}
                                    onChange={(e) => setSalaryMin(e.target.value)}
                                    placeholder="Enter Minimum Salary"
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.salaryMin && <span className="text-danger">{formErrors.salaryMin}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group controlId="formSalaryMax">
                                <Form.Label>Salary (Max)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={salaryMax}
                                    onChange={(e) => setSalaryMax(e.target.value)}
                                    placeholder="Enter Maximum Salary"
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-' || e.key === '.') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.salaryMax && <span className="text-danger">{formErrors.salaryMax}</span>}
                            </Form.Group>
                        </Col>

                        <Col sm={3}>
                            <Form.Group controlId="formExperienceMin">
                                <Form.Label>Experience (Min)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={experienceMin}
                                    onChange={(e) => setExperienceMin(e.target.value)}
                                    placeholder="Enter Minimum Experience (Years)"
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.experienceMin && <span className="text-danger">{formErrors.experienceMin}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={3}>
                            <Form.Group controlId="formExperienceMax">
                                <Form.Label>Experience (Max)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={experienceMax}
                                    onChange={(e) => setExperienceMax(e.target.value)}
                                    placeholder="Enter Maximum Experience (Years)"
                                    onKeyDown={(e) => {
                                        // Prevent entering 'e', 'E', '+', '-', and '.'
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {formErrors.experienceMax && <span className="text-danger">{formErrors.experienceMax}</span>}
                            </Form.Group>
                        </Col>
                    </Row>



                    <Form.Group className="mb-3" controlId="formKeySkills">
                        <Form.Label>Key Skills</Form.Label>
                        <TagsInput
                            value={keySkills}
                            onChange={handleChange}
                        // inputProps={{ placeholder: 'Key Skills' }}
                        />
                        {formErrors.keySkills && <span className="text-danger">{formErrors.keySkills}</span>}
                    </Form.Group>


                    {/* 
                    <Form.Group className="mb-3" controlId="formRolesResponsibilities">
                        <Form.Label>Roles & Responsibilities</Form.Label>
                        <JoditEditor
                            value={rolesResponsibilities}
                            onChange={(newContent) => setRolesResponsibilities(newContent)}
                        />
                        {formErrors.rolesResponsibilities && <span className="text-danger">{formErrors.rolesResponsibilities}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPreferredCandidate">
                        <Form.Label>Preferred Candidate</Form.Label>
                        <JoditEditor
                            value={preferredCandidate}
                            onChange={(newContent) => setPreferredCandidate(newContent)}

                        />
                        {formErrors.preferredCandidate && <span className="text-danger">{formErrors.preferredCandidate}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formOtherBenefits">
                        <Form.Label>Other Benefits</Form.Label>
                        <JoditEditor
                            value={otherBenefits}
                            onChange={(newContent) => setOtherBenefits(newContent)}
                        />
                        {formErrors.otherBenefits && <span className="text-danger">{formErrors.otherBenefits}</span>}
                    </Form.Group> */}

                    <Form.Group className="mb-3" controlId="formRolesResponsibilities">
                        <Form.Label>Roles & Responsibilities</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={rolesResponsibilities}
                            onChange={handleInputChange(setRolesResponsibilities)}
                        />
                        <div>{rolesResponsibilities.length}/250</div>
                        {formErrors.rolesResponsibilities && <span className="text-danger">{formErrors.rolesResponsibilities}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPreferredCandidate">
                        <Form.Label>Preferred Candidate</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={preferredCandidate}
                            onChange={handleInputChange(setPreferredCandidate)}
                        />
                        <div>{preferredCandidate.length}/250</div>
                        {formErrors.preferredCandidate && <span className="text-danger">{formErrors.preferredCandidate}</span>}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formOtherBenefits">
                        <Form.Label>Other Benefits</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={otherBenefits}
                            onChange={handleInputChange(setOtherBenefits)}
                        />
                        <div>{otherBenefits.length}/250</div>
                        {formErrors.otherBenefits && <span className="text-danger">{formErrors.otherBenefits}</span>}
                    </Form.Group>


                    <Row className="mb-3">
                        <Col sm={6}>
                            <Form.Group controlId="formJobStatus">
                                <Form.Label>Job Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={jobStatus}
                                    onChange={(e) => setJobStatus(e.target.value)}
                                >
                                    <option value="">Select Job Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </Form.Control>
                                {formErrors.jobStatus && <span className="text-danger">{formErrors.jobStatus}</span>}
                            </Form.Group>
                        </Col>
                        <Col sm={6}>
                            <Form.Group controlId="formValidTill">
                                <Form.Label>Valid Till</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={validTill}
                                    max="9999-12-31"
                                    onChange={(e) => setValidTill(e.target.value)}
                                />
                                {formErrors.validTill && <span className="text-danger">{formErrors.validTill}</span>}
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group>
                        <Button type="submit" variant="primary">Submit</Button>
                        <Button variant="secondary" onClick={handleCancel} style={{ marginLeft: '10px' }}>Cancel</Button>
                    </Form.Group>
                </Form>

            </div>

        </Container >
    );
};

export default PostJob;
