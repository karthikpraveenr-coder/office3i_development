import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Select from 'react-select';

import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditResume = () => {

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

    const [resumeData, setResumeData] = useState(null);
    const { id } = useParams();

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


    const [formErrors, setFormErrors] = useState({});
    // ------------------------------------------------------------------------------------------------
    const handleSave = (e) => {
        e.preventDefault();

        console.log("error inside the submit")
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
        if (!setSelectedPreferredLocation || setSelectedPreferredLocation.length === 0) {
            errors.setSelectedPreferredLocation = 'Preferred Location is required.';
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
        if (!dateofjoining) {
            errors.dateofjoining = 'Date of Joining is required.';
        }
        if (!attachedResume) {
            errors.attachedResume = 'Resume or Attachment is required.';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        console.log("error inside the submit 1")
        setFormErrors({});


        console.log("error inside the submit 2")
        const formData = new FormData();

        // General Section
        formData.append('id', id);
        formData.append('source', source.value || source);
        formData.append('candidate_name', candidateName);
        formData.append('position_applying', positionApplyingFor);
        formData.append('gender', gender.value || gender);
        formData.append('email', email);
        formData.append('mobile_no', mobileNo);
        formData.append('alter_mobile_no', alternateMobileNo);
        formData.append('dob', dob);


        formData.append('current_country', selectedCountry.value || selectedCountry,);
        formData.append('current_state', selectedState.value || selectedState);
        formData.append('current_city', selectedCity.value || selectedCity);
        formData.append('preferred_location', selectedPreferredLocation);

        formData.append('languages', languagesKnown);
        formData.append('under_graduate', underGraduateDegree.value || underGraduateDegree);
        formData.append('ug_specialization', underGraduateSpecialization);
        formData.append('ug_year_of_passing', underGraduateYearOfPassing);
        formData.append('ug_university', underGraduateSchool);
        formData.append('post_graduate', postGraduateDegree.value || postGraduateDegree);
        formData.append('pg_specialization', postGraduateSpecialization);
        formData.append('pg_year_of_passing', postGraduateYearOfPassing);
        formData.append('pg_university', postGraduateSchool);

        formData.append('certification', certification);
        formData.append('oldpath_certification', attachment);
        formData.append('certification_attach', attachment);
        formData.append('social_link', socialmedialink);


        // Career Section
        formData.append('current_employer', currentEmployer);
        formData.append('functionality_area', functionalArea.value || functionalArea);
        formData.append('area_specialization', areaOfSpecialization.value || areaOfSpecialization);
        formData.append('industry', industry.value || industry);
        formData.append('current_designation', currentDesignation || currentDesignation);
        formData.append('employment_type', employmentType.value || employmentType);
        formData.append('total_exp', totalExperience);
        formData.append('current_ctc', currentCTC);
        formData.append('expected_ctc', expectedCTC);
        formData.append('key_skills', keySkills);
        formData.append('notice_period', noticePeriod.value || noticePeriod);
        formData.append('status', candidateStatus.value || candidateStatus);

        formData.append('date_of_join', dateofjoining);
        formData.append('oldpath_resume_upload', attachedResume);
        formData.append('attached_resume', attachedResume);
        formData.append('updated_by', userempid);

        axios.post('https://office3i.com/user/api/public/api/update_hr_resume', formData, {
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
            fetch(`https://office3i.com/user/api/public/api/area_specialization_list/${functionalArea.value || functionalArea}`, {
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
    const [selectedCity, setSelectedCity] = useState([]);

    // console.log("selectedCountry", selectedCountry.value)
    // console.log("selectedState", selectedState.value)
    // console.log("selectedCity", selectedCity)

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

    // Update state on file input change
    // const handleAttachmentChange = (e) => {
    //     setAttachment(e.target.files[0]);
    // };

    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        if (attachment) {
            setImagePreviewUrl(`https://office3i.com/user/api/storage/app/${attachment}`);
            console.log("attachment", attachment)
        }
    }, [attachment]);

    // console.log("attachment--->1", attachment)
    // console.log("imagePreviewUrl--->1", imagePreviewUrl)

    // Update state on file input change
    const handleAttachmentChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreviewUrl('');
        }
    };

    const handleAttachedResumeChange = (e) => {
        setAttachedResume(e.target.files[0]);
    };


    // -------------------------------------------------------------------------------------------------------

    // Fetch data from the API
    useEffect(() => {
        axios.get(`https://office3i.com/user/api/public/api/resume_edit_list/${id}`, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                if (response.data.status === "success") {

                    const data = response.data.data[0]

                    setResumeData(data);
                    setSource(data.source)
                    setCandidateName(data.candidate_name)
                    setPositionApplyingFor(data.position_applying)
                    setGender(data.gender)
                    setEmail(data.email)
                    setMobileNo(data.mobile_no)
                    setAlternateMobileNo(data.alter_mobile_no)
                    setDob(data.dob)

                    setSelectedCountry(data.current_country)
                    setSelectedState(data.current_state)
                    setSelectedCity(data.current_city)
                    const locationIds = data.preferred_location.split(',').map(id => id.trim());
                    setSelectedPreferredLocation(locationIds);





                    // console.log("setJobCountry-->", data.current_country)
                    // console.log("setJobState-->", data.current_state)
                    // console.log("setJobCity-->", data.current_city)
                    // console.log("setPreferredJobCity-->", data.preferred_location)

                    setLanguagesKnown(data.languages)

                    setUnderGraduateDegree(data.under_graduate)
                    setUnderGraduateSpecialization(data.ug_specialization)
                    setUnderGraduateYearOfPassing(data.ug_year_of_passing)
                    setUnderGraduateSchool(data.ug_university)

                    setPostGraduateDegree(data.post_graduate)
                    setPostGraduateSpecialization(data.pg_specialization)
                    setPostGraduateYearOfPassing(data.pg_year_of_passing)
                    setPostGraduateSchool(data.pg_university)

                    setCertification(data.certification)
                    setAttachment(data.certification_attach)


                    setCurrentEmployer(data.current_employer)
                    setCurrentDesignation(data.current_designation)
                    setFunctionalArea(data.functionality_area)
                    setAreaOfSpecialization(data.area_specialization)
                    setIndustry(data.industry)

                    setEmploymentType(data.employment_type)
                    setTotalExperience(data.total_exp)
                    setCurrentCTC(data.current_ctc)
                    setExpectedCTC(data.expected_ctc)
                    setNoticePeriod(data.notice_period)
                    setCandidateStatus(data.status)
                    console.log("data.status--------------------------------------------------->", data.status)
                    setDateofjoining(data.date_of_join)

                    setAttachedResume(data.attached_resume)
                    setKeySkills(data.key_skills)
                    setsocialmedialink(data.social_link)
                    console.log("setSelectedPreferredLocation", data.preferred_location)


                }
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, [id, usertoken]);

    // -------------------------------------------------------------------------------------------------------

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
                    value: city.id.toString(),
                    label: city.name
                }));
                setCityOptions(options);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, [usertoken]);

    const handleLocationChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedPreferredLocation(values);
    };

    const formatindividualCityOptions = () =>
        cityOptions;

    const getDefaultindividualCityOptions = () =>
        cityOptions.filter(option => selectedPreferredLocation.includes(option.value));



    // ------------------------------------------------------------------------------------------------------------------



    return (
        <Container style={{ padding: '20px 40px' }}>
            <h2>Edit Resume</h2>
            <Form onSubmit={handleSave} style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '40px' }} className='mt-5'>
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
                                        value={sourceOptions.find(option => option.value === source)}
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
                        <Row className="mb-3">
                            <Col sm={6}>
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
                            <Col sm={6}>
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

                        </Row>

                        <Row className="mb-3">
                            <Col sm={6}>
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
                            <Col sm={6}>
                                <Form.Group controlId="preferredLocation">
                                    <Form.Label>Preferred Location</Form.Label>
                                    <Select
                                        isMulti
                                        options={formatindividualCityOptions()}
                                        value={getDefaultindividualCityOptions()}
                                        onChange={handleLocationChange}
                                    />
                                    {formErrors.setSelectedPreferredLocation && <span className="text-danger">{formErrors.setSelectedPreferredLocation}</span>}
                                </Form.Group>
                            </Col>

                        </Row>
                        {/* ---------------------------------------------------------------------------- */}

                        {/* <Row>
                            <Col>
                                <Form.Group controlId="country">
                                    <Form.Label>Country</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                       
                                    />
                                {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="state">
                                    <Form.Label>State</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                       
                                    />
                                {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
                                </Form.Group>
                            </Col>
                        </Row> */}

                        {/* <Row>
                            <Col>
                                <Form.Group controlId="city">
                                    <Form.Label>City</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                       
                                    />
                                {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="preferredLocation">
                                    <Form.Label>Preferred Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={preferredLocation}
                                        onChange={(e) => setPreferredLocation(e.target.value)}
                                    />
                                {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
                                </Form.Group>
                            </Col>
                        </Row> */}

                        <Row>
                            <Col md="6">
                                <Form.Group controlId="languagesKnown">
                                    <Form.Label>Languages Known</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={languagesKnown}
                                        onChange={(e) => setLanguagesKnown(e.target.value)}

                                    />
                                    {formErrors.source && <span className="text-danger">{formErrors.source}</span>}
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
                                        value={underGraduateOptions.find(option => option.value === underGraduateDegree)}
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
                                        value={postGraduateOptions.find(option => option.value === postGraduateDegree)}
                                        onChange={(selectedOption) => setPostGraduateDegree(selectedOption)}
                                        isClearable
                                        placeholder="Select Degree"
                                    />

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
                                    Next
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
                                        value={functionalAreaOptions.find(option => option.value === functionalArea)}
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
                                        value={areaOfSpecializationOptions.find(option => option.value === areaOfSpecialization)}
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
                                        value={industryOptions.find(option => option.value === industry)}
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
                                        value={employmentTypeOptions.find(option => option.value === employmentType)}
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
                                        value={noticePeriodOptions.find(option => option.value === noticePeriod)}
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
                                        value={candidateStatusOptions.find(option => option.value === candidateStatus)}
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
                                        value={dateofjoining}
                                        onChange={(e) => setDateofjoining(e.target.value)}

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
                                    Previous
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

export default EditResume;
