import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Swal from 'sweetalert2';

function SearchResume() {
    // --------------------------------------------------------------------------------------------

    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToviewdetailsPage = (id) => {
        navigate(`/admin/viewdetails/${id}`);
    };
    // --------------------------------------------------------------------------------------------


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------




    // ------------------------------------------------------------------------------------------------
    // USESTATE DESIGNATION SALARAY AND EXPERIENCE

    const [designation, setDesignation] = useState('');
    const [keySkills, setKeySkills] = useState('');
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [experienceMin, setExperienceMin] = useState('');
    const [experienceMax, setExperienceMax] = useState('');
    const [formErrors, setFormErrors] = useState({});


    // COUNTY STATE CITY 
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
    // PREFERRED LOCATION

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


    // --------------------------------------------------------------------------------------------------------------
    // FUNCTIONAL AREA AND AREA OF SPECIALIZATION

    const [functionalArea, setFunctionalArea] = useState('');
    const [areaOfSpecialization, setAreaOfSpecialization] = useState('');

    const [functionalAreaOptions, setFunctionalAreaOptions] = useState([]);
    const [areaOfSpecializationOptions, setAreaOfSpecializationOptions] = useState([]);

    // Fetch Functional Areas
    useEffect(() => {
        fetch('https://office3i.com/development/api/public/api/functional_list', {
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
            fetch(`https://office3i.com/development/api/public/api/area_specialization_list/${functionalArea.value}`, {
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

    // --------------------------------------------------------------------------------------------------------------
    // INDUSTRY

    const [industry, setIndustry] = useState('');

    const [industryOptions, setIndustryOptions] = useState([]); // State to hold industry options

    useEffect(() => {

        fetch('https://office3i.com/development/api/public/api/industry_list', {
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
    // SEARCH RESUME

    const [candidates, setCandidates] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        const anyFilterFilled = designation || keySkills || selectedCountry || selectedState || selectedCity || selectedPreferredLocation.length > 0 || functionalArea || areaOfSpecialization || industry || salaryMin || salaryMax || experienceMin || experienceMax;
        // Validate form fields
        const errors = {};

        if (!anyFilterFilled) {
            errors.general = 'At least one filter must be selected.';
        }

        if (selectedCountry) {
            if (!selectedState) {
                errors.state = 'State is required.';
            }
        }

        if (selectedState) {
            if (!selectedCity) {
                errors.city = 'City is required.';
            }
        }

        if (salaryMin !== '' && salaryMax !== '' && parseInt(salaryMin) > parseInt(salaryMax)) {
            errors.salaryMin = 'Minimum salary cannot be greater than maximum salary';
            errors.salaryMax = 'Maximum salary cannot be less than minimum salary';
        }

        if (experienceMin !== '' && experienceMax !== '' && parseInt(experienceMin) > parseInt(experienceMax)) {
            errors.experienceMin = 'Minimum experience cannot be greater than maximum experience';
            errors.experienceMax = 'Maximum experience cannot be less than minimum experience';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setFormErrors({});

        const formData = new FormData();

        const getValue = (input) => input?.value ?? input ?? '';

        formData.append('designation', designation || '');
        formData.append('current_city', getValue(selectedCity));

        const selectedLocationValues = selectedPreferredLocation.map(location => location.value).join(',');
        formData.append('preferred_location', selectedLocationValues); // Append as comma-separated string

        formData.append('functional_area', getValue(functionalArea));
        formData.append('area_specialization', getValue(areaOfSpecialization));
        formData.append('industry', getValue(industry));
        formData.append('exp_min', experienceMin);
        formData.append('exp_max', experienceMax);
        formData.append('salary_min', salaryMin);
        formData.append('salary_max', salaryMax);
        formData.append('key_skills', keySkills);

        axios.post('https://office3i.com/development/api/public/api/search_resume_list', formData, {
            headers: {
                'Authorization': `Bearer ${usertoken}`
            }
        })
            .then(response => {
                const { status, data } = response.data;
                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Resumes retrieved successfully.',
                    });
                    setCandidates(data || []);
                    console.log('Resumes:', data); // Display the resumes data in the console
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Operation Failed',
                        text: 'Failed to retrieve resumes. Please try again.',
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'There was an error retrieving resumes. Please try again later.',
                });
                console.error('API Error:', error);
            });
    };


    const handleReset = () => {
        setDesignation('');
        setKeySkills('');
        setSalaryMin('');
        setSalaryMax('');
        setExperienceMin('');
        setExperienceMax('');
        setSelectedCountry(null);
        setSelectedState(null);
        setSelectedCity(null);
        setSelectedPreferredLocation([]);
        setFunctionalArea('');
        setAreaOfSpecialization('');
        setIndustry('');
        setFormErrors({});
        setCandidates([])
    };

    // --------------------------------------------------------------------------------------------------------------

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage, setEntriesPerPage] = useState(6);

    // Pagination logic
    const totalPages = Math.ceil(candidates.length / entriesPerPage);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = candidates.slice(indexOfFirstEntry, indexOfLastEntry);

    const paginate = (page) => setCurrentPage(page);

    const paginationBasic = () => {
        let active = currentPage;
        let items = [];
        let visiblePages = 5; // You can adjust how many pages you want to show here
        let startPage = active - 2 > 1 ? active - 2 : 1;
        let endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;

        if (active - 2 <= 1) {
            endPage = startPage + visiblePages - 1 > totalPages ? totalPages : startPage + visiblePages - 1;
        }

        if (totalPages > visiblePages && active + 2 > totalPages) {
            startPage = totalPages - (visiblePages - 1);
        }

        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <Pagination.Item key={number} active={number === active} onClick={() => paginate(number)}>
                    {number}
                </Pagination.Item>
            );
        }

        return (
            <Pagination>
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
                {startPage > 1 && <Pagination.Ellipsis disabled />}
                {items}
                {endPage < totalPages && <Pagination.Ellipsis disabled />}
                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
            </Pagination>
        );
    };

    return (
        <div style={{ padding: '10px 50px' }}>
            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Search Resume</h3>

            <Form onSubmit={handleSearch} style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '40px' }} className='mt-5 mb-5'>
                {formErrors.general && <h5 className="text-danger">{formErrors.general}</h5>}
                <Row>
                    <Col>
                        <Form.Group controlId="formDesignation">
                            <Form.Label>Designation</Form.Label>
                            <Form.Control
                                type="text"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                                placeholder="Enter Designation"
                            />
                            {formErrors.designation && <span className="text-danger">{formErrors.designation}</span>}
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
                                placeholder="Area of Specialization"
                                isDisabled={!functionalArea} // Disable until functional area is selected
                            />
                            {formErrors.areaOfSpecialization && <span className="text-danger">{formErrors.areaOfSpecialization}</span>}
                        </Form.Group>
                    </Col>
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
                <Row>
                    <Col sm={3}>
                        <Form.Group controlId="formkeySkills">
                            <Form.Label>Key Skills</Form.Label>
                            <Form.Control
                                type="text"
                                value={keySkills}
                                onChange={(e) => setKeySkills(e.target.value)}
                                placeholder="Enter keySkills"
                            />
                            {formErrors.keySkills && <span className="text-danger">{formErrors.keySkills}</span>}
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mt-3">

                    <Col style={{ display: 'flex', gap: '10px' }}>
                        <Button variant="primary" type="submit">
                            Search
                        </Button>

                        <Button variant="secondary" onClick={handleReset}>
                            Reset
                        </Button>
                    </Col>
                </Row>
            </Form>


            <div>
                <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Search Result</h3>

                {currentEntries.length > 0 ? (
                    currentEntries.map((candidate, index) => (
                        <div key={index} className="card">
                            <div className="card-body-container">
                                <div>
                                    <span className='card-body-content'>
                                        <h5 className="card-title-content">Name: </h5>
                                        <span>{candidate.candidate_name}</span>
                                    </span>
                                    <span className='card-body-content'>
                                        <h5 className="card-title-content">Designation: </h5>
                                        <span>{candidate.current_designation}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className='card-body-content'>
                                        <h5 className="card-title-content">Total Experience: </h5>
                                        <span>{candidate.total_exp}</span>
                                    </span>
                                    <span className='card-body-content'>
                                        <h5 className="card-title-content">Current CTC: </h5>
                                        <span>{candidate.current_ctc}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className='card-body-content'>
                                        <h5 className="card-title-content">Candidate Status </h5>
                                    </span>
                                    <div className='candidatestatus' style={{ textAlign: 'center' }}>{candidate.status}</div>
                                </div>
                                <div>
                                    <button className="details-button" onClick={() => GoToviewdetailsPage(candidate.id)}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='Resume__DataNot'>Resume List Data Not Found!.</div>
                )}

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {paginationBasic()}
                </div>
            </div>

        </div>
    )
}

export default SearchResume