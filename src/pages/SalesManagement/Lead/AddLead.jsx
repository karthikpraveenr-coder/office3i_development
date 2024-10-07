import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FormContext from '../../../context/FormContext';

function AddLead() {
    const navigate = useNavigate();

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------


    const { firstName, setFirstName, lastName, setLastName, email, setEmail, selectedModule, setSelectedModule, password, setPassword } = useContext(FormContext);

    // const [firstName, setFirstName] = useState("");
    const [name, setName] = useState("");
    // const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState("");

    const [mobile, setMobile] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [description, setDescription] = useState('');
    // const [password, setPassword] = useState("");
    // const [selectedModule, setSelectedModule] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState('');
    // const [selectedModule, setSelectedModule] = useState('');
    const [plans, setPlans] = useState([]);
    const [modules, setModules] = useState([]);


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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const errors = {};

        if (!name) errors.name = 'Name is required.';
        if (!email) errors.email = 'Email is required.';
        if (!mobile) errors.mobile = 'Mobile number is required.';
        if (!companyName) errors.companyName = 'Company name is required.';
        if (!selectedPlan) errors.selectedPlan = 'Plan is required.';
        if (!description) errors.description = 'Description is required.';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            setLoading(false);
            return;
        }

        setFormErrors({});

        axios.post('https://office3i.com/development/api/public/api/contact_add_enquiry',
            {
                first_name: name,
                description: description,
                email: email,
                mobile_number: mobile,
                company_name: companyName,
                product_plan: selectedPlan,
                created_by: userempid,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                }
            }
        )
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
                    navigate('/admin/customerenquirylist');
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


    return (
        <div>
            <Form onSubmit={handleSubmit} style={{ padding: '20px 30px 0px 30px' }}>
                <h3 className='mb-4' style={{ fontWeight: 'bold', color: '#00275c' }}>Add Enquiry</h3>

                <div style={{ boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', padding: '30px 43px' }}>
                    <Row>
                        <Col>
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
                        </Col>
                        <Col>
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
                        </Col>

                    </Row>
                    <Row>
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
                    </Row>

                    <Row>
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
                            <Form.Group controlId="formDescription">
                                <Form.Label style={{ fontWeight: 'bold' }}>Description</Form.Label>
                                <Form.Control as="textarea" rows={3}
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description} />
                            </Form.Group>
                            {formErrors.description && <span className="text-danger">{formErrors.description}</span>}
                        </Col>
                    </Row>

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

export default AddLead;
