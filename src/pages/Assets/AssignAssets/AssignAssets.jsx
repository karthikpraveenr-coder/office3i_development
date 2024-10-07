import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import Swal from 'sweetalert2';

const AssignAssets = () => {
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
    const today = new Date().toISOString().split('T')[0];
    const [formErrors, setFormErrors] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);
    // ----------------------------------------------------------------------------------------------------
    // HANDLE SUBMIT ADD EVENT

    const handleSubmit = async (e) => {
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

        const formData = new FormData();
        formData.append('department', department);
        formData.append('emp_id', employeeName);
        formData.append('asset_type', selectedAssetType);
        formData.append('asset_details', assetDetails);
        formData.append('asset_value', assetValue);
        formData.append('issue_date', issueDate);
        formData.append('valid_till', validTill);
        formData.append('return_on', returnOn);
        formData.append('remarks', remarks);
        formData.append('status', status);
        formData.append('created_by', userData.userempid);

        try {
            const response = await fetch('https://office3i.com/development/api/public/api/add_assign_asset', {
                method: 'POST',
                body: formData,
                headers: {
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

                setDepartment('');
                setEmployeeName('');

                setSelectedAssetType([]);
                setAssetDetails('');
                setAssetValue('');
                setIssueDate('');
                setValidTill('');
                setReturnOn('');
                setStatus('');
                setRemarks('');
                // Increment the refreshKey to trigger re-render
                setRefreshKey(prevKey => prevKey + 1);
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
        setDepartment('');
        setEmployeeName('');

        setSelectedAssetType([]);
        setAssetDetails('');
        setAssetValue('');
        setIssueDate('');
        setValidTill('');
        setReturnOn('');
        setStatus('');
        setRemarks('');
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

    const [assetTypeDropdown, setAssetTypeDropdown] = useState([]);
    const [selectedAssetType, setSelectedAssetType] = useState([]);
    console.log("selectedAssetType", selectedAssetType)

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
                console.log("data", data)
            } catch (error) {
                console.error('Error fetching asset types:', error);
            }
        };

        fetchAssetTypes();
    }, []);

    const formattedAssetTypeDropdown = assetTypeDropdown.map(asset => ({
        label: asset.asset_type_name,
        value: asset.id
    }));

    const handleSelectAssetTypeChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map(option => option.value);
        setSelectedAssetType(selectedIds);
    };

    const formattedSelectedAssetType = selectedAssetType ? selectedAssetType.join(',') : null;



    return (
        <div className="AssignAssets__container" style={{ padding: '10px 40px' }}>
            <h3 className="mb-5" style={{ fontWeight: 'bold', color: '#00275c' }}>Assign Assets</h3>
            <div className="form__container" style={{ background: '#ffffff', padding: '40px 50px', boxShadow: '0px 0px 10px rgb(0 0 0 / 43%)', margin: '2px' }}>
                <Form onSubmit={handleSubmit}>
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
                                    value={formattedAssetTypeDropdown.filter(option => selectedAssetType.includes(option.value))}
                                    onChange={handleSelectAssetTypeChange}
                                    labelledBy="Select"
                                />
                                {formErrors.selectedAssetType && <span className="text-danger">{formErrors.selectedAssetType}</span>}
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="formAssetValue">
                                <Form.Label>Asset Value</Form.Label>
                                <Form.Control type="text" value={assetValue} onChange={(e) => setAssetValue(e.target.value)} />
                                {formErrors.assetValue && <span className="text-danger">{formErrors.assetValue}</span>}
                            </Form.Group>
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
    );
};

export default AssignAssets;
