import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';

import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faAngleLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ResumeForm = () => {

    // ------------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoTostatuspage = () => {
        navigate(`/admin/candidatestatus`);
    };

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------

    // General Section States
    const [source, setSource] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [positionApplyingFor, setPositionApplyingFor] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [alternateMobileNo, setAlternateMobileNo] = useState('');
    const [dob, setDob] = useState('');


    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [preferredLocation, setPreferredLocation] = useState('');


    const [languagesKnown, setLanguagesKnown] = useState('');
    const [underGraduateDegree, setUnderGraduateDegree] = useState('');
    const [underGraduateSpecialization, setUnderGraduateSpecialization] = useState('');
    const [underGraduateYearOfPassing, setUnderGraduateYearOfPassing] = useState('');
    const [underGraduateSchool, setUnderGraduateSchool] = useState('');
    const [postGraduateDegree, setPostGraduateDegree] = useState('');
    const [postGraduateSpecialization, setPostGraduateSpecialization] = useState('');
    const [postGraduateYearOfPassing, setPostGraduateYearOfPassing] = useState('');
    const [postGraduateSchool, setPostGraduateSchool] = useState('');
    const [certification, setCertification] = useState('');
    const [attachment, setAttachment] = useState('');

    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    // Career Section States
    const [currentEmployer, setCurrentEmployer] = useState('');
    const [functionalArea, setFunctionalArea] = useState('');
    const [areaOfSpecialization, setAreaOfSpecialization] = useState('');
    const [industry, setIndustry] = useState('');
    const [currentDesignation, setCurrentDesignation] = useState('');
    const [employmentType, setEmploymentType] = useState('');
    const [totalExperience, setTotalExperience] = useState('');
    const [currentCTC, setCurrentCTC] = useState('');
    const [expectedCTC, setExpectedCTC] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');

    const [candidateStatus, setCandidateStatus] = useState('');

    const [dateofjoining, setDateofjoining] = useState('');
    const [attachedResume, setAttachedResume] = useState('');
    const [keySkills, setKeySkills] = useState('');
    const [socialmedialink, setsocialmedialink] = useState('');
    // ------------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------------

    const [currentSection, setCurrentSection] = useState('general'); // Track current section

    const handleNext = () => {
        setCurrentSection('career');
    };

    const handlePrevious = () => {
        setCurrentSection('general');
    };

    // ------------------------------------------------------------------------------------------------
    const formData = {
        source,
        candidateName,
        positionApplyingFor,
        gender,
        email,
        mobileNo,
        alternateMobileNo,
        dob,
        // country,
        // state,
        // city,
        // preferredLocation,
        languagesKnown,
        underGraduateDegree,
        underGraduateSpecialization,
        underGraduateYearOfPassing,
        underGraduateSchool,
        postGraduateDegree,
        postGraduateSpecialization,
        postGraduateYearOfPassing,
        postGraduateSchool,
        certification,
        attachment,
        currentEmployer,
        functionalArea,
        areaOfSpecialization,
        industry,
        currentDesignation,
        employmentType,
        totalExperience,
        currentCTC,
        expectedCTC,
        noticePeriod,
        candidateStatus,
        attachedResume,
        keySkills
    };

    // console.log("gender-------->", gender)

    const [formErrors, setFormErrors] = useState({});
    // ------------------------------------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form fields
        const errors = {};

        // Basic required field validation
        if (!source) {
            errors.source = 'Source is required.';
        }
        if (!candidateName) {
            errors.candidateName = 'Candidate Name is required.';
        }
        if (!positionApplyingFor) {
            errors.positionApplyingFor = 'Position Applying For is required.';
        }
        if (!gender) {
            errors.gender = 'Gender is required.';
        }

        // Email validation
        // if (!email) {
        //     errors.email = 'Email is required.';
        // } else if (!/\S+@\S+\.\S+/.test(email)) {
        //     errors.email = 'A valid Email is required.';
        // }
        if (!email) {
            errors.email = 'Email is required.';
        } else if (!/^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errors.email = 'A valid Email is required.';
        }



        // Mobile number validation
        if (!mobileNo) {
            errors.mobileNo = 'Mobile No is required.';
        } else if (!/^\d{10}$/.test(mobileNo)) {
            errors.mobileNo = 'Mobile No must be a 10-digit number.';
        }



        // Date of Birth validation
        if (!dob) {
            errors.dob = 'Date of Birth is required.';
        } else if (new Date(dob) > new Date()) {
            errors.dob = 'Date of Birth cannot be in the future.';
        }

        // Country, State, and City validation
        if (!selectedCountry || (Array.isArray(selectedCountry) && selectedCountry.length === 0)) {
            errors.country = 'Country is required.';
        }
        if (!selectedState || (Array.isArray(selectedState) && selectedState.length === 0)) {
            errors.state = 'State is required.';
        }
        if (!selectedCity || (Array.isArray(selectedCity) && selectedCity.length === 0)) {
            errors.city = 'City is required.';
        }

        // Preferred Location validation
        if (!selectedPreferredLocation || selectedPreferredLocation.length === 0) {
            errors.selectedPreferredLocation = 'Preferred Location is required.';
        }

        // Education and Career validations
        if (!underGraduateDegree) {
            errors.underGraduateDegree = 'Under Graduate Degree is required.';
        }
        if (!underGraduateSpecialization) {
            errors.underGraduateSpecialization = 'Under Graduate Specialization is required.';
        }
        if (!underGraduateYearOfPassing || !/^\d{4}$/.test(underGraduateYearOfPassing)) {
            errors.underGraduateYearOfPassing = 'Valid Under Graduate Year of Passing is required.';
        }
        // if (!underGraduateSchool) {
        //     errors.underGraduateSchool = 'Under Graduate School/University is required.';
        // }

        // if (!postGraduateDegree) {
        //     errors.postGraduateDegree = 'Post Graduate Degree is required.';
        // }
        // if (!postGraduateSpecialization) {
        //     errors.postGraduateSpecialization = 'Post Graduate Specialization is required.';
        // }
        // if (!postGraduateYearOfPassing || !/^\d{4}$/.test(postGraduateYearOfPassing)) {
        //     errors.postGraduateYearOfPassing = 'Valid Post Graduate Year of Passing is required.';
        // }
        // if (!postGraduateSchool) {
        //     errors.postGraduateSchool = 'Post Graduate School/University is required.';
        // }

        if (!currentEmployer) {
            errors.currentEmployer = 'Current Employer is required.';
        }
        if (!functionalArea) {
            errors.functionalArea = 'Functional Area is required.';
        }
        if (!areaOfSpecialization) {
            errors.areaOfSpecialization = 'Area of Specialization is required.';
        }
        if (!industry) {
            errors.industry = 'Industry is required.';
        }
        if (!currentDesignation) {
            errors.currentDesignation = 'Current Designation is required.';
        }
        if (!employmentType) {
            errors.employmentType = 'Employment Type is required.';
        }
        if (!totalExperience || isNaN(totalExperience)) {
            errors.totalExperience = 'Total Experience must be a number.';
        }
        if (!currentCTC || isNaN(currentCTC)) {
            errors.currentCTC = 'Current CTC must be a number.';
        }
        if (!expectedCTC || isNaN(expectedCTC)) {
            errors.expectedCTC = 'Expected CTC must be a number.';
        }
        if (!noticePeriod) {
            errors.noticePeriod = 'Notice Period is required.';
        }
        if (!keySkills) {
            errors.keySkills = 'Key Skills are required.';
        }
        if (!candidateStatus) {
            errors.candidateStatus = 'Candidate Status is required.';
        }
        if (candidateStatus && ['Offered', 'Joined'].includes(candidateStatus.value)) {
            if (!dateofjoining) {
                errors.dateofjoining = 'Date of Joining is required.';
            }
        }
        if (!attachedResume) {
            errors.attachedResume = 'Resume or Attachment is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        const formData = new FormData();

        const getValue = (input) => input?.value ?? input ?? '-';


        // General Section
        formData.append('source', getValue(source));
        formData.append('candidate_name', candidateName || '-');
        formData.append('position_applying', positionApplyingFor || '-');
        formData.append('gender', getValue(gender));
        formData.append('email', email || '-');
        formData.append('mobile_no', mobileNo || '-');
        formData.append('alter_mobile_no', alternateMobileNo || '-');
        formData.append('dob', dob || '-');

        formData.append('current_country', getValue(selectedCountry));
        formData.append('current_state', getValue(selectedState));
        formData.append('current_city', getValue(selectedCity));
        // formData.append('preferred_location', selectedPreferredLocation.value || '-');

        const selectedLocationValues = selectedPreferredLocation.map(location => location.value).join(',');
        formData.append('preferred_location', selectedLocationValues); // Append as comma-separated string

        formData.append('languages', languagesKnown || '-');

        formData.append('under_graduate', getValue(underGraduateDegree));
        formData.append('ug_specialization', underGraduateSpecialization || '-');
        formData.append('ug_year_of_passing', underGraduateYearOfPassing || '-');
        formData.append('ug_university', underGraduateSchool || '-');

        formData.append('post_graduate', postGraduateDegree.value || '-');
        formData.append('pg_specialization', postGraduateSpecialization || '-');
        formData.append('pg_year_of_passing', postGraduateYearOfPassing || '-');
        formData.append('pg_university', postGraduateSchool || '-');

        formData.append('certification', certification || '-');
        formData.append('certification_attach', attachment || null);
        formData.append('social_link', socialmedialink || '-');


        // Career Section
        formData.append('current_employer', currentEmployer || '-');
        formData.append('functionality_area', getValue(functionalArea));
        formData.append('area_specialization', getValue(areaOfSpecialization) || '-');
        formData.append('industry', getValue(industry) || '-');
        formData.append('current_designation', currentDesignation || '-');
        formData.append('employment_type', getValue(employmentType));
        formData.append('total_exp', totalExperience || '-');
        formData.append('current_ctc', currentCTC || '-');
        formData.append('expected_ctc', expectedCTC || '-');
        formData.append('key_skills', keySkills || '-');
        formData.append('notice_period', getValue(noticePeriod));
        formData.append('status', getValue(candidateStatus));
        formData.append('date_of_join', dateofjoining || '-');
        formData.append('attached_resume', attachedResume || null);
        formData.append('created_by', userempid || '-');

        axios.post('https://office3i.com/user/api/public/api/addhr_resume_upload', formData, {
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


    const sourceOptions = [
        { value: 'Social Media', label: 'Social Media' },
        { value: 'News Paper', label: 'Newspaper' },
        { value: 'Advertisement', label: 'Advertisement' },
        { value: 'Friends Referral', label: 'Friends Referral' },
        { value: 'Other', label: 'Other' }  // Example of an extra field
    ];



    // --------------------------------------------------------------------------------------------------------------
    const [underGraduateOptions, setUnderGraduateOptions] = useState([]);

    useEffect(() => {
        // Fetch data from the API for undergraduate degrees
        fetch('https://office3i.com/user/api/public/api/ug_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Parse the API response to get options for dropdown
                const options = data.data.map(item => ({
                    value: item.id,
                    label: item.degree_lists
                }));
                setUnderGraduateOptions(options);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    // --------------------------------------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------------------------------------
    const [postGraduateOptions, setPostGraduateOptions] = useState([]);

    useEffect(() => {
        // Fetch data from your API
        fetch('https://office3i.com/user/api/public/api/pg_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Parse the API response to get options for dropdown
                const options = data.data.map(item => ({
                    value: item.id,
                    label: item.degree_lists
                }));
                setPostGraduateOptions(options);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    // --------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------
    const [industryOptions, setIndustryOptions] = useState([]); // State to hold industry options

    useEffect(() => {
        // Fetch data from the API for industries
        fetch('https://office3i.com/user/api/public/api/industry_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                // Parse the API response to get options for dropdown
                const options = data.data.map(item => ({
                    value: item.id,
                    label: item.name
                }));
                setIndustryOptions(options);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);
    // --------------------------------------------------------------------------------------------------------------
    // --------------------------------------------------------------------------------------------------------------


    const [functionalAreaOptions, setFunctionalAreaOptions] = useState([]);
    const [areaOfSpecializationOptions, setAreaOfSpecializationOptions] = useState([]);

    // Fetch Functional Areas
    useEffect(() => {
        fetch('https://office3i.com/user/api/public/api/functional_list', {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                const options = data.data.map(item => ({
                    value: item.id,
                    label: item.category
                }));
                setFunctionalAreaOptions(options);
            })
            .catch(error => console.error('Error fetching functional areas:', error));
    }, []);

    // Fetch Area of Specialization based on selected Functional Area
    useEffect(() => {
        if (functionalArea) {
            fetch(`https://office3i.com/user/api/public/api/area_specialization_list/${functionalArea.value}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    const options = data.data.map(item => ({
                        value: item.id,
                        label: item.category
                    }));
                    setAreaOfSpecializationOptions(options);
                })
                .catch(error => console.error('Error fetching area of specialization:', error));
        } else {
            setAreaOfSpecializationOptions([]);
            setAreaOfSpecialization(null);
        }
    }, [functionalArea]);
    // --------------------------------------------------------------------------------------------------------------

    const genderOptions = [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Non-binary', label: 'Non-binary' },
    ];


    const employmentTypeOptions = [
        { value: 'Fulltime / Permanent', label: 'Fulltime / Permanent' },
        { value: 'Parttime / Temporary', label: 'Parttime / Temporary' },
        { value: 'Internship', label: 'Internship' },
        { value: 'Freelance', label: 'Freelance' }
    ];

    const noticePeriodOptions = [
        { value: 'Immediate', label: 'Immediate' },
        { value: 'Less than 15 days', label: 'Less than 15 days' },
        { value: '15-30 days', label: '15-30 days' },
        { value: '30-45 days', label: '30-45 days' },
        { value: '45-60 days', label: '45-60 days' },
        { value: 'Above 60 days', label: 'Above 60 days' }
    ];

    const candidateStatusOptions = [
        { value: 'Offered', label: 'Offered' },
        { value: 'Joined', label: 'Joined' },
        { value: 'Shortlisted', label: 'Shortlisted' },
        { value: 'Rejected', label: 'Rejected' },
        { value: 'Not suitable', label: 'Not suitable' }
    ];




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
            axios.get(`https://office3i.com/user/api/public/api/state_list/${selectedCountry.value}`, {
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
            axios.get(`https://office3i.com/user/api/public/api/city_list/${selectedState.value}`, {
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
    // ------------------------------------------------------------------------------------------------------------------
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    // Update state on file input change
    const handleAttachmentChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
                setAttachment(file); // Set the file in the state
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl('');
            setAttachment(null); // Reset the state if no file is selected
        }
    };


    const handleAttachedResumeChange = (e) => {
        setAttachedResume(e.target.files[0]);
    };

    console.log("selectedPreferredLocation", selectedPreferredLocation)
    return (
        <Container style={{ padding: '20px 40px' }}>
            <h2>Add Resume</h2>
            <Form onSubmit={handleSubmit} style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '40px' }} className='mt-5'>
                {/* General Section */}
                {currentSection === 'general' && (
                    <>
                        {/* General Section */}
                        <h4>General</h4>
                        <Row>
                            <Col>
                                <Form.Group controlId="source">
                                    <Form.Label>Source</Form.Label>
                                    <Select
                                        options={sourceOptions}
                                        value={source}
                                        onChange={(selectedOption) => setSource(selectedOption)}
                                        isClearable
                                        placeholder="Select Source"
                                    />
                                    {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="candidateName">
                                    <Form.Label>Candidate Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={candidateName}
                                        onChange={(e) => setCandidateName(e.target.value)}

                                    />
                                    {formErrors.candidateName && <span className="text-danger">{formErrors.candidateName}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="positionApplyingFor">
                                    <Form.Label>Position Applying For</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={positionApplyingFor}
                                        onChange={(e) => setPositionApplyingFor(e.target.value)}

                                    />
                                    {formErrors.positionApplyingFor && <span className="text-danger">{formErrors.positionApplyingFor}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="gender">
                                    <Form.Label>Gender</Form.Label>
                                    <Select
                                        options={genderOptions}
                                        value={genderOptions.find(option => option.value === gender)}
                                        onChange={(selectedOption) => setGender(selectedOption)}
                                        isClearable
                                        placeholder="Select Gender"
                                    />
                                    {formErrors.gender && <span className="text-danger">{formErrors.gender}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}

                                    />
                                    {formErrors.email && <span className="text-danger">{formErrors.email}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="mobileNo">
                                    <Form.Label>Mobile No</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={mobileNo}
                                        onChange={(e) => setMobileNo(e.target.value)}

                                    />
                                    {formErrors.mobileNo && <span className="text-danger">{formErrors.mobileNo}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="alternateMobileNo">
                                    <Form.Label>Alternate Mobile No</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={alternateMobileNo}
                                        onChange={(e) => setAlternateMobileNo(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="dob">
                                    <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dob}
                                        max="9999-12-31"
                                        onChange={(e) => setDob(e.target.value)}

                                    />
                                    {formErrors.dob && <span className="text-danger">{formErrors.dob}</span>}
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* ---------------------------------------------------------------------------- */}

                        {/* ---------------------------------------------------------------------------- */}

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
                        </Row>

                        <Row>
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
                            <Col>
                                <Form.Group controlId="preferredLocation">
                                    <Form.Label>Preferred Location</Form.Label>
                                    <Select
                                        isMulti
                                        value={selectedPreferredLocation}
                                        onChange={handleLocationChange}
                                        options={cityOptions}
                                    />
                                    {formErrors.selectedPreferredLocation && <span className="text-danger">{formErrors.selectedPreferredLocation}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="6">
                                <Form.Group controlId="languagesKnown">
                                    <Form.Label>Languages Known</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={languagesKnown}
                                        onChange={(e) => setLanguagesKnown(e.target.value)}

                                    />
                                    {formErrors.candidateName && <span className="text-danger">{formErrors.candidateName}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Undergraduate Section */}
                        <h4 className="mt-4">Under Graduate</h4>
                        <Row>
                            <Col>
                                <Form.Group controlId="underGraduateDegree">
                                    <Form.Label>Degree</Form.Label>
                                    <Select
                                        options={underGraduateOptions}
                                        value={underGraduateDegree}
                                        onChange={(selectedOption) => setUnderGraduateDegree(selectedOption)}
                                        isClearable
                                        placeholder="Select Degree"
                                    />
                                    {formErrors.underGraduateDegree && <span className="text-danger">{formErrors.underGraduateDegree}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="underGraduateSpecialization">
                                    <Form.Label>Specialization</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="underGraduateSpecialization"
                                        value={underGraduateSpecialization}
                                        onChange={(e) => setUnderGraduateSpecialization(e.target.value)}

                                    />
                                    {formErrors.underGraduateSpecialization && <span className="text-danger">{formErrors.underGraduateSpecialization}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="underGraduateYearOfPassing">
                                    <Form.Label>Year of Passing</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="underGraduateYearOfPassing"
                                        value={underGraduateYearOfPassing}
                                        onChange={(e) => setUnderGraduateYearOfPassing(e.target.value)}

                                    />
                                    {formErrors.underGraduateYearOfPassing && <span className="text-danger">{formErrors.underGraduateYearOfPassing}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="underGraduateSchool">
                                    <Form.Label>School/University</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="underGraduateSchool"
                                        value={underGraduateSchool}
                                        onChange={(e) => setUnderGraduateSchool(e.target.value)}

                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Postgraduate Section */}
                        <h4 className="mt-4">Post Graduate</h4>
                        <Row>
                            <Col>
                                <Form.Group controlId="postGraduateDegree">
                                    <Form.Label>Degree</Form.Label>
                                    <Select
                                        options={postGraduateOptions}
                                        value={postGraduateDegree}
                                        onChange={(selectedOption) => setPostGraduateDegree(selectedOption)}
                                        isClearable
                                        placeholder="Select Degree"
                                    />
                                    {/* {formErrors.postGraduateDegree && <span className="text-danger">{formErrors.postGraduateDegree}</span>} */}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="postGraduateSpecialization">
                                    <Form.Label>Specialization</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="postGraduateSpecialization"
                                        value={postGraduateSpecialization}
                                        onChange={(e) => setPostGraduateSpecialization(e.target.value)}
                                    />
                                    {/* {formErrors.postGraduateSpecialization && <span className="text-danger">{formErrors.postGraduateSpecialization}</span>} */}
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="postGraduateYearOfPassing">
                                    <Form.Label>Year of Passing</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="postGraduateYearOfPassing"
                                        value={postGraduateYearOfPassing}
                                        onChange={(e) => setPostGraduateYearOfPassing(e.target.value)}
                                    />
                                    {/* {formErrors.postGraduateYearOfPassing && <span className="text-danger">{formErrors.postGraduateYearOfPassing}</span>} */}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="postGraduateSchool">
                                    <Form.Label>School/University</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="postGraduateSchool"
                                        value={postGraduateSchool}
                                        onChange={(e) => setPostGraduateSchool(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Certification */}
                        <Row>
                            <Col>
                                <Form.Group controlId="certification">
                                    <Form.Label>Certification</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="certification"
                                        value={certification}
                                        onChange={(e) => setCertification(e.target.value)}
                                    />

                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="attachment">
                                    <Form.Label>Attachment</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        name="attachment"
                                        onChange={handleAttachmentChange}
                                    />

                                    {imagePreviewUrl && (
                                        <div style={{ marginTop: '10px' }}>
                                            <img src={imagePreviewUrl} alt="Employee Preview" style={{ width: '25%', height: 'auto' }} />
                                        </div>
                                    )}

                                </Form.Group>
                            </Col>
                        </Row>



                        {/* Next Button */}
                        <Row className="mt-3">
                            <Col>
                                <Button variant="primary" onClick={handleNext}>
                                    Next <FontAwesomeIcon icon={faChevronRight} />
                                </Button>
                            </Col>
                        </Row>



                    </>
                )}

                {/* Career Section */}
                {currentSection === 'career' && (
                    <>
                        <h4>Career</h4>
                        <Row>
                            <Col>
                                <Form.Group controlId="currentEmployer">
                                    <Form.Label>Current Employer</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentEmployer"
                                        value={currentEmployer}
                                        onChange={(e) => setCurrentEmployer(e.target.value)}

                                    />
                                    {formErrors.currentEmployer && <span className="text-danger">{formErrors.currentEmployer}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="currentDesignation">
                                    <Form.Label>Current Designation</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentDesignation"
                                        value={currentDesignation}
                                        onChange={(e) => setCurrentDesignation(e.target.value)}

                                    />
                                    {formErrors.currentDesignation && <span className="text-danger">{formErrors.currentDesignation}</span>}
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="functionalArea">
                                    <Form.Label>Functional Area</Form.Label>
                                    <Select
                                        options={functionalAreaOptions}
                                        value={functionalArea}
                                        onChange={setFunctionalArea}
                                        isClearable
                                        placeholder="Select Functional Area"
                                    />
                                    {formErrors.functionalArea && <span className="text-danger">{formErrors.functionalArea}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="areaOfSpecialization">
                                    <Form.Label>Area of Specialization</Form.Label>
                                    <Select
                                        options={areaOfSpecializationOptions}
                                        value={areaOfSpecialization}
                                        onChange={setAreaOfSpecialization}
                                        isClearable
                                        placeholder="Select Area of Specialization"
                                        isDisabled={!functionalArea} // Disable until functional area is selected
                                    />
                                    {formErrors.areaOfSpecialization && <span className="text-danger">{formErrors.areaOfSpecialization}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="industry">
                                    <Form.Label>Industry</Form.Label>
                                    <Select
                                        options={industryOptions}
                                        value={industry}
                                        onChange={selectedOption => setIndustry(selectedOption)}
                                        isClearable
                                        placeholder="Select Industry"
                                    />
                                    {formErrors.industry && <span className="text-danger">{formErrors.industry}</span>}
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="employmentType">
                                    <Form.Label>Employment Type</Form.Label>
                                    <Select
                                        options={employmentTypeOptions}
                                        name="employmentType"
                                        value={employmentType}
                                        onChange={(selectedOption) => setEmploymentType(selectedOption)}
                                        isClearable
                                        placeholder="Select Employment Type"

                                    />
                                    {formErrors.employmentType && <span className="text-danger">{formErrors.employmentType}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="totalExperience">
                                    <Form.Label>Total Experience</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="totalExperience"
                                        value={totalExperience}
                                        onChange={(e) => setTotalExperience(e.target.value)}

                                    />
                                    {formErrors.totalExperience && <span className="text-danger">{formErrors.totalExperience}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="currentCTC">
                                    <Form.Label>Current CTC</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="currentCTC"
                                        value={currentCTC}
                                        onChange={(e) => setCurrentCTC(e.target.value)}

                                    />
                                    {formErrors.currentCTC && <span className="text-danger">{formErrors.currentCTC}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="expectedCTC">
                                    <Form.Label>Expected CTC</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="expectedCTC"
                                        value={expectedCTC}
                                        onChange={(e) => setExpectedCTC(e.target.value)}

                                    />
                                    {formErrors.expectedCTC && <span className="text-danger">{formErrors.expectedCTC}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="noticePeriod">
                                    <Form.Label>Notice Period</Form.Label>
                                    <Select
                                        options={noticePeriodOptions}
                                        name="noticePeriod"
                                        value={noticePeriod}
                                        onChange={(selectedOption) => setNoticePeriod(selectedOption)}
                                        isClearable
                                    />
                                    {formErrors.noticePeriod && <span className="text-danger">{formErrors.noticePeriod}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="candidateStatus">
                                    <Form.Label>Candidate Status</Form.Label>
                                    <Select
                                        options={candidateStatusOptions}
                                        name="candidateStatus"
                                        value={candidateStatus}
                                        onChange={(selectedOption) => setCandidateStatus(selectedOption)}
                                        isClearable
                                    />
                                    {formErrors.candidateStatus && <span className="text-danger">{formErrors.candidateStatus}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="dateofjoining">
                                    <Form.Label>Date Of Joining</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="dateofjoining"
                                        max="9999-12-31"
                                        value={dateofjoining}
                                        onChange={(e) => setDateofjoining(e.target.value)}
                                        disabled={
                                            candidateStatus &&
                                            ['Shortlisted', 'Rejected', 'Not suitable'].includes(candidateStatus.value)
                                        }
                                    />
                                    {formErrors.dateofjoining && <span className="text-danger">{formErrors.dateofjoining}</span>}
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>

                            <Col md="6">
                                <Form.Group controlId="keySkills">
                                    <Form.Label>Key Skills</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="keySkills"
                                        value={keySkills}
                                        onChange={(e) => setKeySkills(e.target.value)}

                                    />
                                    {formErrors.keySkills && <span className="text-danger">{formErrors.keySkills}</span>}
                                </Form.Group>
                            </Col>
                            <Col md="6">
                                <Form.Group controlId="socialmedialink">
                                    <Form.Label>Social Media Link</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="socialmedialink"
                                        value={socialmedialink}
                                        onChange={(e) => setsocialmedialink(e.target.value)}

                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <Form.Group controlId="attachedResume">
                                    <Form.Label>Attached Resume</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="attachedResume"
                                        onChange={handleAttachedResumeChange}
                                    />
                                    {formErrors.attachedResume && <span className="text-danger">{formErrors.attachedResume}</span>}
                                </Form.Group>
                            </Col>

                        </Row>

                        <Row className="mt-3">
                            <Col>
                                <Button variant="outline-secondary" onClick={handlePrevious}>
                                    <FontAwesomeIcon icon={faAngleLeft} /> Previous
                                </Button>
                            </Col>
                            <Col className="text-right">
                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </>
                )}
            </Form>
        </Container>
    );
};

export default ResumeForm;
