import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useNavigate, useParams } from 'react-router-dom';
import { ScaleLoader } from 'react-spinners';
import Swal from 'sweetalert2';
const today = new Date().toISOString().split('T')[0];

const EditAssets = () => {

    // ------------------------------------------------------------------------------------------------
    // Redirect to the add Assetslist page

    const { id } = useParams();
    const navigate = useNavigate();
    const handleVisitAssetslist = () => {
        navigate(`/admin/assetslist`);
    };
    // loading state
    const [loading, setLoading] = useState(true);

    // ------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    // ----------------------------------------------------------------------------------------------------
    // State for each form field
    const [department, setDepartment] = useState('');
    const [employeeName, setEmployeeName] = useState('');
    // const [assetID, setAssetID] = useState('');
    // const [assetType, setAssetType] = useState('');
    const [assetDetails, setAssetDetails] = useState('');
    const [assetValue, setAssetValue] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [validTill, setValidTill] = useState('');
    const [returnOn, setReturnOn] = useState('');
    const [status, setStatus] = useState('');
    const [remarks, setRemarks] = useState('');
    const [formErrors, setFormErrors] = useState({});
    // ------------------------------------------------------------------------------------------------
    // FETCH DATA FROM API TO STORE THE INITIAL STATE FOR EDIT FEILDS

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssetId = async () => {
            try {
                const response = await axios.get(`https://office3i.com/development/api/public/api/edit_assign_assetlist/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                });
                if (response.data.status === 'success') {
                    console.log("edit----->", response.data.data)

                    setDepartment(response.data.data.department);
                    setEmployeeName(response.data.data.emp_id);
                    // setSelectedAssetType(response.data.data.asset_type);
                    setAssetDetails(response.data.data.asset_details);
                    setAssetValue(response.data.data.asset_value);
                    setIssueDate(response.data.data.issue_date);
                    setValidTill(response.data.data.valid_till);
                    setReturnOn(response.data.data.return_on);
                    setStatus(response.data.data.status);
                    setRemarks(response.data.data.remarks);
                    const employeeArray = response.data.data.asset_type ? response.data.data.asset_type.split(',').map(member => member.trim()) : [];
                    setSelectedAssetType(employeeArray);
                    setLoading(false)


                } else {
                    throw new Error('Failed to fetch asset ID');
                }
            } catch (err) {
                setError(err.message);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: error,
                });
            }
        };

        fetchAssetId();
    }, []);
    // ------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT

    const handleSave = async (e) => {
        e.preventDefault();

        // Validate input fields
        const errors = {};

        if (!department) {
            errors.department = 'Department Name is required.';
        }
        if (!employeeName) {
            errors.employeeName = 'Employee Name is required.';
        }
        if (!assetDetails) {
            errors.assetDetails = 'Asset Details is required.';
        }
        if (!assetValue) {
            errors.assetValue = 'Asset Value is required.';
        }
        if (!issueDate) {
            errors.issueDate = 'Issues Date is required.';
        }
        if (!validTill) {
            errors.validTill = 'Valid TIll is required.';
        }
        if (!remarks) {
            errors.remarks = 'Remarks is required.';
        }
        if (!status) {
            errors.status = 'Status is required.';
        }
        if (selectedAssetType.length == 0) {
            errors.selectedAssetType = 'Asset Type required.';
        }


        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        const formData = {
            id: id,
            department: department,
            emp_id: employeeName,
            asset_type: selectedAssetType.join(','),
            asset_details: assetDetails,
            asset_value: assetValue,
            issue_date: issueDate,
            valid_till: validTill,
            return_on: returnOn,
            remarks: remarks,
            status: status,
            updated_by: userData.userempid
        };

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/update_assign_asset', {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            const data = await response.json();

            if (data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: data.message || 'Assign Asset Type Successfully Added',
                });
                handleVisitAssetslist()
                // Optionally, you can call fetchTableData() or any other function to update the table or the UI.
            } else {
                throw new Error(data.message || "Can't able to add asset.");
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error: ${error.message}`,
            });
        }
    };



    // -----------------------------------------------------------------------------------------------------

    const handleCancel = () => {
        handleVisitAssetslist()
        setFormErrors({});
    };

    // -------------------------------------- Department ---------------------------------------------------
    const [departmentDropdown, setDepartmentDropdown] = useState([]);

    // Fetch department dropdown options
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
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
            const apiUrl = `https://office3i.com/development/api/public/api/employee_dropdown_list/${department}`;
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

    // -------------------------------------- Asset Type -------------------------------------------------

    const [assetTypeDropdown, setAssetTypeDropdown] = useState([]);
    const [selectedAssetType, setSelectedAssetType] = useState('');

    useEffect(() => {
        const fetchAssetTypes = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/asset_name', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data || [];
                setAssetTypeDropdown(data);
            } catch (error) {
                console.error('Error fetching asset types:', error);
            }
        };

        fetchAssetTypes();
    }, [usertoken]);

    const formattedAssetTypeDropdown = assetTypeDropdown.map(asset => ({
        label: asset.asset_type_name,
        value: asset.id.toString()
    }));

    const handleSelectAssetTypeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedAssetType(selectedIds);
    };

    const formattedSelectedAssetType = Array.isArray(selectedAssetType)
        ? selectedAssetType.map(type => ({
            label: formattedAssetTypeDropdown.find(option => option.value === type)?.label,
            value: type
        }))
        : [];
    // ---------------------------------------------------------------------------------------------------

    return (
        <>
            {loading ? (
                <div style={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: '#f6f6f6'
                }}>
                    <ScaleLoader color="rgb(20 166 249)" />
                </div>
            ) : (
                <div className="AssignAssets__container" style={{ padding: '10px 40px' }}>
                    <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Edit Assets</h3>
                    <div className="form__container" style={{ background: '#ffffff', padding: '40px 50px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                        <Form onSubmit={handleSave}>

                            <Row className="mb-3">
                                <Col md={6}>
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
                                <Col md={6}>
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

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formAssetType">
                                        <Form.Label>Asset Type</Form.Label>
                                        <MultiSelect
                                            options={formattedAssetTypeDropdown}
                                            value={formattedSelectedAssetType}
                                            onChange={handleSelectAssetTypeChange}
                                            labelledBy="Select"
                                        />
                                    </Form.Group>
                                    {formErrors.selectedAssetType && <span className="text-danger">{formErrors.selectedAssetType}</span>}
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formAssetValue">
                                        <Form.Label>Asset Value</Form.Label>
                                        <Form.Control type="number" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} />
                                    </Form.Group>
                                    {formErrors.assetValue && <span className="text-danger">{formErrors.assetValue}</span>}
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formIssueDate">
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control type="date" min={today} max="9999-12-31" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
                                        {formErrors.issueDate && <span className="text-danger">{formErrors.issueDate}</span>}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formValidTill">
                                        <Form.Label>Valid Till</Form.Label>
                                        <Form.Control type="date" min={today} max="9999-12-31" value={validTill} onChange={(e) => setValidTill(e.target.value)} />
                                        {formErrors.validTill && <span className="text-danger">{formErrors.validTill}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={6}>
                                    <Form.Group controlId="formReturnOn">
                                        <Form.Label>Return On</Form.Label>
                                        <Form.Control type="date" min={today} max="9999-12-31" value={returnOn} onChange={(e) => setReturnOn(e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formStatus">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control as="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="">Select Status</option>
                                            <option value="Allocated">Allocated</option>
                                            <option value="Returned">Returned</option>

                                        </Form.Control>
                                        {formErrors.status && <span className="text-danger">{formErrors.status}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={12}>
                                    <Form.Group controlId="formAssetDetails">
                                        <Form.Label>Asset Details</Form.Label>
                                        <Form.Control as="textarea" value={assetDetails} onChange={(e) => setAssetDetails(e.target.value)} />
                                        {formErrors.assetDetails && <span className="text-danger">{formErrors.assetDetails}</span>}
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row className="mb-5">
                                <Col md={12}>
                                    <Form.Group controlId="formRemarks">
                                        <Form.Label>Remarks</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                        {formErrors.remarks && <span className="text-danger">{formErrors.remarks}</span>}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col md={1}>
                                    <Button type="submit" variant="primary">Submit</Button>
                                </Col>
                                <Col md={1}>
                                    <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>

            )}
        </>
    );
};

export default EditAssets;
