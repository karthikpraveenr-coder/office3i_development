import React, { useState } from 'react'
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import './css/addshiftslotstyle.css'
import Swal from 'sweetalert2';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { useReactToPrint } from 'react-to-print';
import 'jspdf-autotable';
import ReactPaginate from 'react-paginate';
import { ScaleLoader } from 'react-spinners';
import { faChevronRight, faStar, faStarOfLife } from '@fortawesome/free-solid-svg-icons';


import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function AttendancePolicy() {
    // ------------------------------------------------------------------------------------------------
    // Redirect to the edit page
    const navigate = useNavigate();

    const GoToEditPage = (id) => {
        navigate(`/admin/editattendancepolicy/${id}`);
    };


    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userempid = userData?.userempid || '';

    // ------------------------------------------------------------------------------------------------
    // Add Attendance slot submit



    const [formData, setFormData] = useState({
        shiftSlot: '',
        fromTime: '',
        toTime: '',
        totalHours: '',
        permission1From: '',
        permission1To: '',
        permission2From: '',
        permission2To: '',
        halfDay1From: '',
        halfDay1To: '',
        halfDay2From: '',
        halfDay2To: '',
        lateFrom: '',
        lateTo: '',
        late1: '',
        late1Deduction: '',
        late2: '',
        late2Deduction: '',
        late3: '',
        late3Deduction: ''
    });

    const [formErrors, setFormErrors] = useState({
        shiftSlot: '',
        fromTime: '',
        toTime: '',
        totalHours: '',
        permission1From: '',
        permission1To: '',
        permission2From: '',
        permission2To: '',
        halfDay1From: '',
        halfDay1To: '',
        halfDay2From: '',
        halfDay2To: '',
        lateFrom: '',
        lateTo: '',
        late1: '',
        late1Deduction: '',
        late2: '',
        late2Deduction: '',
        late3: '',
        late3Deduction: ''
    });

    const handleChange = (e) => {
        const { id, value, name } = e.target;
        // console.log('this is selected id',id);
        setFormData(prevState => ({ ...prevState, [id]: value }));

        if (id == 'late1' || id == 'late1Deduction' || id == 'late2' || id == 'late2Deduction' || id == 'late3' || id == 'late3Deduction') {

            if (value < 0) {
                // Reset the value to 1 or clear it
                e.target.value = '';
                // Show alert
                alert("You must select positive values only.");
                setFormData(prevState => ({ ...prevState, [id]: '' }));
                return;
            }

        }

        // if (id == 'permission1From' || id == 'permission1To' || id == 'permission2From' || id == 'permission2To') {

        //     validateTimes(name, value);
        //     console.log('this part running');

        // }

    };

    // const handleChange_1 = (e) => {
    //     let { id, value, name } = e.target;
    // }

    const errors = {};


    // const validateTimes = (changedField, changedValue) => {


    //     const permission1From = formData.permission1From;
    //     const permission1To = formData.permission1To;
    //     const permission2From = formData.permission2From;
    //     const permission2To = formData.permission2To;

    //     if (permission1From || permission2From) {

    //         if (permission1From == permission2From && permission1To == permission2To) {
    //             alert('Unable to select same time in both permission');
    //         }

    //     }


    //     // console.log('1', permission1From);
    //     // console.log('2', permission1To);
    //     // console.log('3', permission2From);
    //     // console.log('4', permission2To);

    //     // // If changing the first permission
    //     // if (changedField === 'permission1From' || changedField === 'permission1To') {
    //     //     if (permission2From && permission2To) {
    //     //         if ((changedField === 'permission1From' && (changedValue < permission2To && changedValue >= permission2From)) ||
    //     //             (changedField === 'permission1To' && (changedValue > permission2From && changedValue <= permission2To))) {
    //     //             errors.permission2From = 'Time overlap detected with Permission (2nd Half).';
    //     //         }
    //     //     }
    //     // }

    //     // // If changing the second permission
    //     // if (changedField === 'permission2From' || changedField === 'permission2To') {
    //     //     if (permission1From && permission1To) {
    //     //         if ((changedField === 'permission2From' && (changedValue < permission1To && changedValue >= permission1From)) ||
    //     //             (changedField === 'permission2To' && (changedValue > permission1From && changedValue <= permission1To))) {
    //     //             errors.permission1From = 'Time overlap detected with Permission (1st Half).';
    //     //             console.log('Time overlap detected with Permission (1st Half).');
    //     //         }
    //     //     }
    //     // }
    //     setFormErrors(errors);
    // };


    useEffect(() => {

        if (formData.fromTime && formData.toTime) {

            const fromParts = formData.fromTime.split(':');
            const toParts = formData.toTime.split(':');

            const from = new Date(1970, 0, 1, fromParts[0], fromParts[1], fromParts[2]);
            const to = new Date(1970, 0, 1, toParts[0], toParts[1], toParts[2]);


            if (to < from) {
                to.setDate(to.getDate() + 1); // Add a day if To Time is less than From Time
            }

            const diffInMilliseconds = to - from;
            console.log('diff', diffInMilliseconds);

            const totalSeconds = Math.max(0, diffInMilliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = Math.floor(totalSeconds % 60);

            const formattedTotalHours = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            console.log('this is time formatter', formattedTotalHours);

            setFormData((prevData) => ({
                ...prevData,
                totalHours: formattedTotalHours
            }));

        } else {
            setFormData((prevData) => ({
                ...prevData,
                totalHours: ''
            }));
        }

    }, [formData.fromTime, formData.toTime]);

    const [refreshKey, setRefreshKey] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate shift slot
        if (!formData.shiftSlot) {
            errors.shiftSlot = 'Shift slot is required';
        }

        // Validate from time
        if (!formData.fromTime) {
            errors.fromTime = 'From time is required';
        }

        // Validate to time
        if (!formData.toTime) {
            errors.toTime = 'To time is required';
        }

        // Validate total hours
        if (!formData.totalHours) {
            errors.totalHours = 'Total hours is required';
        }

        // Validate permission 1 from time
        if (!formData.permission1From) {
            errors.permission1From = 'Permission (1st Half) from time is required';
        }

        // Validate permission 1 to time
        if (!formData.permission1To) {
            errors.permission1To = 'Permission (1st Half) to time is required';
        }

        // Validate permission 2 from time
        if (!formData.permission2From) {
            errors.permission2From = 'Permission (2nd Half) from time is required';
        }

        // Validate permission 2 to time
        if (!formData.permission2To) {
            errors.permission2To = 'Permission (2nd Half) to time is required';
        }

        // Validate half day 1 from time
        if (!formData.halfDay1From) {
            errors.halfDay1From = 'HalfDay (1st Half) from time is required';
        }

        // Validate half day 1 to time
        if (!formData.halfDay1To) {
            errors.halfDay1To = 'HalfDay (1st Half) to time is required';
        }

        // Validate half day 2 from time
        if (!formData.halfDay2From) {
            errors.halfDay2From = 'HalfDay (2nd Half) from time is required';
        }

        // Validate half day 2 to time
        if (!formData.halfDay2To) {
            errors.halfDay2To = 'HalfDay (2nd Half) to time is required';
        }

        // Validate late from time
        if (!formData.lateFrom) {
            errors.lateFrom = 'Late from time is required';
        }

        // Validate late to time
        if (!formData.lateTo) {
            errors.lateTo = 'Late to time is required';
        }

        // Validate late 1
        if (!formData.late1) {
            errors.late1 = 'Late 1 is required';
        }

        // Validate late 1 deduction
        if (!formData.late1Deduction) {
            errors.late1Deduction = 'Late 1 deduction is required';
        }
        // Validate late 2
        if (!formData.late2) {
            errors.late2 = 'Late 2 is required';
        }

        // Validate late 2 deduction
        if (!formData.late2Deduction) {
            errors.late2Deduction = 'Late 2 deduction is required';
        }

        // Validate late 3
        if (!formData.late3) {
            errors.late3 = 'Late 3 is required';
        }

        // Validate late 3 deduction
        if (!formData.late3Deduction) {
            errors.late3Deduction = 'Late 3 deduction is required';
        }



        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear form errors if there are no errors
        setFormErrors({});

        const requestData = {
            shift_slot: formData.shiftSlot,
            form_time: formData.fromTime,
            to_time: formData.toTime,
            total_hrs: formData.totalHours,
            late_form_time: formData.lateFrom,
            late_to_time: formData.lateTo,
            fp_form_time: formData.permission1From,
            fp_to_time: formData.permission1To,
            ap_form_time: formData.permission2From,
            ap_to_time: formData.permission2To,
            fhalf_day_form_time: formData.halfDay1From,
            fhalf_day_to_time: formData.halfDay1To,
            ahalf_day_form_time: formData.halfDay2From,
            ahalf_day_to_time: formData.halfDay2To,
            late1: formData.late1,
            late2: formData.late2,
            late3: formData.late3,
            late1_deduction: formData.late1Deduction,
            late2_deduction: formData.late2Deduction,
            late3_deduction: formData.late3Deduction,
            policy_status: "Active",
            created_by: userempid,
        };

        // console.log("requestData--->", requestData)

        axios.post('https://office3i.com/development/api/public/api/attendancepolicyinsert', requestData, {
            headers: {
                'Content-Type': 'application/json',
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

                    setFormData({
                        shiftSlot: '',
                        fromTime: '',
                        toTime: '',
                        totalHours: '',
                        permission1From: '',
                        permission1To: '',
                        permission2From: '',
                        permission2To: '',
                        halfDay1From: '',
                        halfDay1To: '',
                        halfDay2From: '',
                        halfDay2To: '',
                        lateFrom: '',
                        lateTo: '',
                        late1: '',
                        late1Deduction: '',
                        late2: '',
                        late2Deduction: '',
                        late3: '',
                        late3Deduction: ''
                    });
                    setRefreshKey(prevKey => prevKey + 1);

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
                    text: 'There was an error creating the Attendance Slot. Please try again later.',
                });

                console.error('There was an error with the API:', error);

            });
    };


    const handleCancel = () => {
        setFormData({
            shiftSlot: '',
            fromTime: '',
            toTime: '',
            totalHours: '',
            permission1From: '',
            permission1To: '',
            permission2From: '',
            permission2To: '',
            halfDay1From: '',
            halfDay1To: '',
            halfDay2From: '',
            halfDay2To: '',
            lateFrom: '',
            lateTo: '',
            late1: '',
            late1Deduction: '',
            late2: '',
            late2Deduction: '',
            late3: '',
            late3Deduction: ''
        });
        setFormErrors({});
    };

    // ------------------------------------------------------------------------------------------------

    // Table list view api

    const [tableData, setTableData] = useState([]);



    useEffect(() => {
        fetchData();
    }, [refreshKey]);


    const fetchData = async () => {
        try {
            const response = await fetch('https://office3i.com/development/api/public/api/view_attendancepolicy', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.ok) {
                const responseData = await response.json();
                setTableData(responseData.data);
                // console.log('Attendance policy view ---> ', responseData.data)
                setLoading(false);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // ------------------------------------------------------------------------------------------------

    // delete the table list

    const handleDelete = async (id) => {
        try {
            const { value: reason } = await Swal.fire({
                title: 'Are you sure?',
                text: 'You are about to delete this Attendance Slot. This action cannot be reversed.',
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter reason for deletion',
                inputAttributes: {
                    maxLength: 100, // Limit input to 100 characters
                },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('Reason is required for deletion.');
                    }
                    return value;
                }
            });

            if (reason) {
                const response = await fetch('https://office3i.com/development/api/public/api/delete_attendancepolicy', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}` // Assuming usertoken is defined somewhere
                    },
                    body: JSON.stringify({
                        id: id,
                        updated_by: userempid,
                        reason: reason,
                    }),
                });

                if (response.ok || response.type === 'opaqueredirect') {

                    setTableData(tableData.filter(row => row.id !== id));
                    Swal.fire('Deleted!', 'Attendance Policy Attendance Slot has been Deleted.', 'success');
                } else {
                    throw new Error('Error deleting Attendance Slot');
                }
            }
        } catch (error) {
            console.error('Error deleting Attendance Slot:', error);
            Swal.fire('Error', 'An error occurred while deleting the Attendance Slot. Please try again later.', 'error');
        }
    };

    // ------------------------------------------------------------------------------------------------



    // Shift Slot view api

    const [shiftslot, setShiftslot] = useState([]);


    useEffect(() => {
        fetchShiftSlot();
    }, []);

    const fetchShiftSlot = async () => {
        try {
            const response = await axios.get('https://office3i.com/development/api/public/api/shiftslotlist', {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            if (response.status === 200) {
                setShiftslot(response.data.data);
                setLoading(false); // Update loading state
                // console.log('Shift slot view ---> ', response.data.data);
            } else {
                throw new Error('Error fetching data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    // ------------------------------------------------------------------------------------------------


    // ========================================
    // pagination, search, print state

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const componentRef = React.useRef();

    // loading state
    const [loading, setLoading] = useState(true);

    // ========================================
    // print start

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // print end
    // ========================================


    // ========================================
    // CSV start



    const handleExportCSV = () => {
        const csvData = tableData.map(({ shift_slot, form_time, to_time, status }, index) => ({
            '#': index + 1,
            shift_slot,
            form_time,
            to_time,
            status,
        }));

        const headers = [
            { label: 'S.No', key: '#' },
            { label: 'Shift Slot', key: 'shift_slot' },
            { label: 'From Time', key: 'form_time' },
            { label: 'To Time', key: 'to_time' },
            { label: 'Status', key: 'status' },
        ];

        const csvReport = {
            data: csvData,
            headers: headers,
            filename: 'AttendanceSlot.csv',
        };

        return <CSVLink {...csvReport}><i className="fas fa-file-csv" style={{ fontSize: '25px', color: '#0d6efd' }}></i></CSVLink>;
    };

    // csv end
    // ========================================


    // ========================================
    // PDF start

    const handleExportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // You can change to 'letter' or other sizes as needed
        const doc = new jsPDF('landscape', unit, size);

        const data = tableData.map(({ shift_slot, form_time, to_time, status }, index) => [
            index + 1,
            shift_slot,
            form_time,
            to_time,
            status,
        ]);

        doc.autoTable({
            head: [['S.No', 'Shift Slot', 'From Time', 'To Time', 'Status']],
            body: data,
            // styles: { fontSize: 10 },
            // columnStyles: { 0: { halign: 'center', fillColor: [100, 100, 100] } }, 
        });

        doc.save('AttendanceSlot.pdf');

    };

    // PDF End
    // ========================================

    // ========================================
    // Fillter start

    const filteredData = tableData.filter((row) =>
        Object.values(row).some(
            (value) =>
                (typeof value === 'string' || typeof value === 'number') &&
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Fillter End
    // ========================================

    const filteredleaveData = filteredData.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    // ============================================

    const myStyles = {
        color: 'white',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',
        borderRadius: '21px',
        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    const myStyles1 = {
        color: '#0d6efd',
        fontSize: '16px',
        border: '1px solid #0d6efd',
        marginRight: '15px',

        padding: '5px 7px',
        boxShadow: 'rgba(13, 110, 253, 0.5) 0px 0px 10px 1px'
    };

    // ===============================================



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

                <Container fluid className='shift__container'>
                    <h3 className='mb-5'>Add Attendance Slot</h3>

                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* Add Attendance slot form */}

                    <div className='mb-5 shift__row'>
                        <Row className='mb-5 '>
                            <Col>
                                <Form.Group controlId="shiftSlot">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Shift Slot <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={formData.shiftSlot}
                                        onChange={handleChange}
                                        disabled={loading}
                                    >
                                        <option value="" disabled>Select Shifts</option>
                                        {/* Map over the shiftslot array to dynamically generate options */}
                                        {shiftslot.map(slot => (
                                            <option key={slot.id} value={slot.id}>{slot.shift_slot}</option>
                                        ))}
                                    </Form.Control>
                                    {formErrors.shiftSlot && <span className="text-danger">{formErrors.shiftSlot}</span>}
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="fromTime">
                                    <Form.Label style={{ fontWeight: 'bold' }}>From Time <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="From Time"
                                        value={formData.fromTime}
                                        onChange={handleChange}
                                        name="fromTime"


                                    />
                                </Form.Group>
                                {formErrors.fromTime && <span className="text-danger">{formErrors.fromTime}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="toTime">
                                    <Form.Label style={{ fontWeight: 'bold' }}>To Time <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="To Time"
                                        value={formData.toTime}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.toTime && <span className="text-danger">{formErrors.toTime}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="totalHours">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Total Hours <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Total Hours"
                                        value={formData.totalHours}
                                        onChange={handleChange}
                                        readOnly

                                    />
                                </Form.Group>
                                {formErrors.totalHours && <span className="text-danger">{formErrors.totalHours}</span>}
                            </Col>
                        </Row>


                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="permission1From">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (1st Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>

                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        name="permission1From"
                                        placeholder="Permission (1st Half) From Time"
                                        value={formData.permission1From}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.permission1From && <span className="text-danger">{formErrors.permission1From}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="permission1To">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (1st Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="info-tooltip">
                                                    You should select a maximum of 3 hours. If you select a higher number of hours, you may encounter a punching error.                                </Tooltip>
                                            }
                                        >
                                            <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </span>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        name="permission1To"
                                        placeholder="Permission (1st Half) From To"
                                        value={formData.permission1To}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.permission1To && <span className="text-danger">{formErrors.permission1To}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="permission2From">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (2nd Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        name="permission2From"
                                        placeholder="Permission (2nd Half) From Time"
                                        value={formData.permission2From}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.permission2From && <span className="text-danger">{formErrors.permission2From}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="permission2To">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Permission (2nd Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="info-tooltip">
                                                    You should select a maximum of 3 hours. If you select a higher number of hours, you may encounter a punching error.                                </Tooltip>
                                            }
                                        >
                                            <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </span>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        name="permission2To"
                                        placeholder="Permission (2nd Half) From To"
                                        value={formData.permission2To}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.permission2To && <span className="text-danger">{formErrors.permission2To}</span>}
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="halfDay1From">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (1st Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (1st Half) From Time"
                                        value={formData.halfDay1From}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.halfDay1From && <span className="text-danger">{formErrors.halfDay1From}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="halfDay1To">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (1st Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="info-tooltip">
                                                    You should select a maximum of 5 hours only. If you select a higher number of hours, you may encounter a punching error.                                </Tooltip>
                                            }
                                        >
                                            <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </span>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (1st Half) From To"
                                        value={formData.halfDay1To}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.halfDay1To && <span className="text-danger">{formErrors.halfDay1To}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="halfDay2From">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (2nd Half) From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (2nd Half) From Time"
                                        value={formData.halfDay2From}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.halfDay2From && <span className="text-danger">{formErrors.halfDay2From}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="halfDay2To">
                                    <Form.Label style={{ fontWeight: 'bold' }}>HalfDay (2nd Half) To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup>
                                        <OverlayTrigger
                                            placement="top"
                                            overlay={
                                                <Tooltip id="info-tooltip">
                                                    You should select a maximum of 5 hours. If you select a higher number of hours, you may encounter a punching error.                                </Tooltip>
                                            }
                                        >
                                            <span style={{ marginLeft: '5px', cursor: 'pointer' }}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                            </span>
                                        </OverlayTrigger>
                                    </Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="HalfDay (2nd Half) From To"
                                        value={formData.halfDay2To}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.halfDay2To && <span className="text-danger">{formErrors.halfDay2To}</span>}
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="lateFrom">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late From <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Late From"
                                        value={formData.lateFrom}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.lateFrom && <span className="text-danger">{formErrors.lateFrom}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="lateTo">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late To <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="time"
                                        step="1"
                                        placeholder="Late To"
                                        value={formData.lateTo}
                                        onChange={handleChange}

                                    />
                                </Form.Group>
                                {formErrors.lateTo && <span className="text-danger">{formErrors.lateTo}</span>}
                            </Col>
                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="late1">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 1 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Late"
                                        value={formData.late1}
                                        onChange={handleChange}
                                        // onChange={(e) => {
                                        //     const value = Number(e.target.value); // Convert the input value to a number
                                        //     if (value >= 1) {
                                        //         handleChange(e); // Call your handleChange function if value is 1 or greater
                                        //     }
                                        // }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="1"
                                        required
                                    />
                                </Form.Group>
                                {formErrors.late1 && <span className="text-danger">{formErrors.late1}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late1Deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 1 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Day Deduction"
                                        value={formData.late1Deduction}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="0"
                                    />
                                </Form.Group>
                                {formErrors.late1Deduction && <span className="text-danger">{formErrors.late1Deduction}</span>}
                            </Col>

                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="late2">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 2 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Late"
                                        value={formData.late2}
                                        min="1"
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}

                                    />
                                </Form.Group>
                                {formErrors.late2 && <span className="text-danger">{formErrors.late2}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late2Deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 2 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Day Deduction"
                                        value={formData.late2Deduction}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="0"

                                    />
                                </Form.Group>
                                {formErrors.late2Deduction && <span className="text-danger">{formErrors.late2Deduction}</span>}
                            </Col>
                        </Row>

                        <Row className='mb-5'>
                            <Col>
                                <Form.Group controlId="late3">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 3 <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Late"
                                        value={formData.late3}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="1"

                                    />
                                </Form.Group>
                                {formErrors.late3 && <span className="text-danger">{formErrors.late3}</span>}
                            </Col>
                            <Col>
                                <Form.Group controlId="late3Deduction">
                                    <Form.Label style={{ fontWeight: 'bold' }}>Late 3 Deduction <sup><FontAwesomeIcon icon={faStarOfLife} style={{ color: '#fb1816', fontSize: '8px' }} /></sup></Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="No of Day Deduction"
                                        value={formData.late3Deduction}
                                        onChange={handleChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                                e.preventDefault();
                                            }
                                        }}
                                        min="0"

                                    />
                                </Form.Group>
                                {formErrors.late3Deduction && <span className="text-danger">{formErrors.late3Deduction}</span>}
                            </Col>

                        </Row>


                        <div className='submit__cancel'>
                            <Button variant="primary" type="submit" className='shift__submit__btn' onClick={handleSubmit}>
                                Submit
                            </Button>
                            <Button variant="secondary" onClick={handleCancel} className='shift__cancel__btn'>
                                Cancel
                            </Button>
                        </div>

                    </div>

                    {/* ------------------------------------------------------------------------------------------------ */}


                    {/* ------------------------------------------------------------------------------------------------ */}
                    {/* List table */}
                    <h3 className='mb-5'> Attendance Slot List</h3>
                    <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '10px', justifyContent: 'space-between', flexWrap:'wrap', gap:'17px' }}>
                        <div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={myStyles1}
                            />
                        </div>
                        <div>
                            <button style={myStyles}>{handleExportCSV()}</button>
                            <button style={myStyles} onClick={handleExportPDF}><i className="fas fa-file-pdf" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                            <button style={myStyles} onClick={handlePrint}><i className="fas fa-print" style={{ fontSize: '25px', color: '#0d6efd' }}></i></button>
                        </div>
                    </div>

                    <div ref={componentRef} style={{ overflowX: 'auto', width: '100%' }}>

                        <table className="table">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">S.No</th>
                                    <th scope="col">Shift Slot</th>

                                    <th scope="col">From Time</th>
                                    <th scope="col">To Time</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" className="no-print">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredleaveData.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: 'center' }}>No search data found</td>
                                        </tr>
                                    ) : (


                                        filteredleaveData.map((row, index) => {

                                            const serialNumber = currentPage * itemsPerPage + index + 1;

                                            return (
                                                <tr key={row.id}>
                                                    <th scope="row">{serialNumber}</th>
                                                    <td>{row.shift_slot}</td>
                                                    <td>{row.form_time}</td>
                                                    <td>{row.to_time}</td>
                                                    <td>{row.status || '-'}</td>
                                                    <td className="no-print" style={{ display: 'flex', gap: '10px' }}>
                                                        <button className="btn-edit" onClick={() => { GoToEditPage(row.id) }}>
                                                            <FontAwesomeIcon icon={faPen} />
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(row.id)}>
                                                            <FontAwesomeIcon icon={faTrashCan} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })

                                    )}
                            </tbody>
                        </table>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <ReactPaginate
                            previousLabel={<span aria-hidden="true">&laquo;</span>}
                            nextLabel={<span aria-hidden="true">&raquo;</span>}
                            breakLabel={<span>...</span>}
                            breakClassName={'page-item disabled'}
                            breakLinkClassName={'page-link'}
                            pageCount={Math.ceil(filteredData.length / itemsPerPage)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={5}
                            onPageChange={handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            pageClassName={'page-item'}
                            pageLinkClassName={'page-link'}
                            previousClassName={'page-item'}
                            previousLinkClassName={'page-link'}
                            nextClassName={'page-item'}
                            nextLinkClassName={'page-link'}
                            disabledClassName={'disabled'}
                            activeLinkClassName={'bg-dark text-white'}
                        />
                    </div>

                    {/* ------------------------------------------------------------------------------------------------ */}


                </Container >


            )
            }
        </>



    )
}

export default AttendancePolicy