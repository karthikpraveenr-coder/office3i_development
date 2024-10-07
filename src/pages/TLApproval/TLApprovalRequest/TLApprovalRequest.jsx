import React, { useEffect, useState } from 'react';
import '../css/TLApprovalstyles.css';
import Ontime from '../../../assets/admin/assets/img/Dashboard/leave.png';
import employee from '../../../assets/admin/assets/img/Dashboard/employee.png';
import permission from "../../../assets/admin/assets/img/Dashboard/absent.png";
import slow from "../../../assets/admin/assets/img/Dashboard/late.png";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function TLApprovalRequest() {


    // ----------------------------------------------------------------------------------------------------
    // Redirect to the Request page

    const navigate = useNavigate();

    const handleVisitLeaveRequest = () => {
        navigate('/admin/tlleaverequest');
    };

    const handleVisitPermissionRequest = () => {
        navigate('/admin/tlpermissionrequest');
    };

    const handleVisitHaldDayRequest = () => {
        navigate('/admin/tlhalfdayrequest');
    };
    const handleVisitOTRequest = () => {
        navigate('/admin/tlovertimerequest');
    };



    const dataBoxStyle = {
        cursor: 'pointer',
    };

    // ----------------------------------------------------------------------------------------------------


    // ----------------------------------------------------------------------------------------------------
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const userrole = userData?.userrole || '';
    const userempid = userData?.userempid || '';

    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------


    const [person, setPerson] = useState('');

    const [category, setCategory] = useState('');
    const [type, setType] = useState('');

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [permissionFromDate, setPermissionFromDate] = useState('');
    const [toTime, setToTime] = useState('');
    const [reason, setReason] = useState('');
    const [attachment, setAttachment] = useState(null);


    // ----------------------------------------------------------------------------------------------------

    // ----------------------------------------------------------------------------------------------------

    // leave / permission/ half day popup open

    const [isTimeOff, setIsTimeOff] = useState(false)

    const openIsTimeOff = () => {
        setIsTimeOff(true);
    };

    const handleCloseIsTimeOff = () => {
        setIsTimeOff(false);
    }

    // ----------------------------------------------------------------------------------------------------
    // Employee List

    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://officeinteriorschennai.com/api/public/api/employeelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                setData([{ "id": "0", "first_name": "Select", "last_name": "Employee" }, ...response.data.data]);
            } catch (error) {
                console.log(error.message);
            }
        };
        fetchData();
    }, []);


    const NameArray = data.map(employee => ({
        id: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
    }));

    // ----------------------------------------------------------------------------------------------------\


    // ---------------------------------- Fetch user roles ------------------------------------------------
    // Fetch user roles
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('https://office3i.com/user/api/public/api/userrolelist', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                // console.log("Fetched department data:", data);
                setDepartments(data);
            } catch (error) {
                console.error('Error fetching user roles:', error);
            }
        };

        fetchDepartments();
    }, [usertoken]);

    // console.log("selectedDepartment", selectedDepartment)



    // ---------------------------------------------------------------------------------------------------


    // -------------------------------  Fetch Supervisor roles -------------------------------------------
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');

    useEffect(() => {
        if (selectedDepartment) {
            const fetchMembers = async () => {
                try {
                    const response = await axios.get(`https://office3i.com/user/api/public/api/employee_dropdown_list/${selectedDepartment}`, {
                        headers: {
                            'Authorization': `Bearer ${usertoken}`
                        }
                    });
                    const data = response.data.data;
                    // console.log("Fetched supervisor list:", data);
                    setMembers(data);
                } catch (error) {
                    console.error('Error fetching members:', error);
                }
            };

            fetchMembers();
        }
    }, [selectedDepartment, usertoken]);

    // console.log("members", members)
    // ----------------------------------------------------------------------------------------------------


    // ----------------------------------------------------------------------------------------------------
    // Leave Request Category

    const [isCategory, setIsCategory] = useState([{ "id": "0", "leave_category_name": "Select Category Type" }]);


    useEffect(() => {
        const apiUrl = 'https://office3i.com/user/api/public/api/leave_category_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                // console.log("response.data.data", response.data.data)
                setIsCategory([{ "id": "0", "leave_category_name": "Select Category Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------
    // Leave request Type

    const [isLeave, setIsLeave] = useState([{ "cid": "0", "leave_type_name": "Select Type" }]);

    useEffect(() => {
        const apiUrl = 'https://office3i.com/user/api/public/api/leave_type_list';
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                const data = response.data.data;
                setIsLeave([{ "cid": "0", "leave_type_name": "Select Type" }, ...data]);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);


    // ----------------------------------------------------------------------------------------------------


    // Add leave/permission/offday submit

    const submitData = async () => {

        
        const formData = new FormData();

        const fromTimeUpdated = `${fromTime}:00`;
        const toTimeUpdated = `${toTime}:00`;

        // Appending form data
        formData.append('emp_id', selectedMember);
        formData.append('hr_id', userData.userempid);
        formData.append('slot_id', '4');
        formData.append('request_type', type);
        formData.append('request_category', category);


        formData.append('from_date', fromDate);
        formData.append('to_date', toDate);
        formData.append('permission_date', permissionFromDate);
        formData.append('permission_timefrom', fromTimeUpdated);
        formData.append('permission_timeto', toTimeUpdated);
        formData.append('leave_reason', reason);
        formData.append('leave_document', attachment);

        // console.log("formData----->", formData);

        try {
            const response = await fetch('https://office3i.com/user/api/public/api/add_menualentry', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            // Check if response is OK and has content
            if (response.ok) {
                const text = await response.text();
                const data = text ? JSON.parse(text) : {};

                if (data.status === 'success') {
                    // Clearing the form fields upon successful submission
                    setPerson('');
                    setCategory('');
                    setType('');
                    setFromDate('');
                    setToDate('');
                    setFromTime('');
                    setToTime('');
                    setReason('');
                    setAttachment(null); // Assuming setAttachment is used to clear file input
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Attendance Added Successfully.`,
                    });
                    setIsTimeOff(false);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `Error in adding Attendance: ${data.message || 'Unknown error'}`,
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Server responded with status: ${response.status}`,
                });
            }
        } catch (error) {
            // console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error in adding Attendance: ${error.message || 'Unknown error'}`,
            });
        }
    };

    const handleSubmitTimeoff = (e) => {
        e.preventDefault();

        // Validating the required fields
        if (!type || !category || 
            (!fromDate && type === '1') ||
            (!toDate && type === '1') ||
            (!permissionFromDate && (type === '2' || type === '3')) ||
            (!fromTime && (type === '2' || type === '3')) ||
            (!toTime && (type === '2' || type === '3')) ||
            !reason) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Fill all details`,
            });
            return;
        }

        submitData();
    };

    // ----------------------------------------------------------------------------------------------------



    // ----------------------------------------------------------------------------------------------------

    // Add Attendance
    const [formData, setFormData] = useState({
        emp_id: userempid,
        request_date: "",
        request_fromtime: "",
        request_totime: "",
        attendance_reason: "",

    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const [isAttendance, setIsAttendance] = useState(false);

    const handleopenAttendance = () => {
        setIsAttendance(true);
    };

    const handleCloseAttendance = () => {
        setIsAttendance(false);
    };

    // Add Attendance submit

    const handleSubmitAttendance = async (e) => {
        e.preventDefault();

        if (
            !person ||
            !formData.request_date ||
            !formData.request_fromtime
            // !formData.request_totime

        ) {
            // console.error("All fields are required");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all the required fields.',
            });
            return;
        }


        // console.log(formData)


        // Set default value "00:00:00" for request_totime if not selected
        const request_totimeUpdated = formData.request_totime ? `${formData.request_totime}:00` : '00:00:00';


        const formDataToSend = new FormData();

        // const request_totimeupdated = `${formData.request_totime}:00`;


        formDataToSend.append('e_id', person);
        formDataToSend.append('hr_id', formData.emp_id);
        formDataToSend.append('request_date', formData.request_date);
        formDataToSend.append('request_fromtime', formData.request_fromtime);

        formDataToSend.append('request_totime', request_totimeUpdated);



        try {

            const response = await fetch('https://officeinteriorschennai.com/api/public/api/add_hr_attendance', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });

            if (response.ok) {
                // console.log("Form submitted successfully karthik testing");
                setIsTimeOff(false);
                setFormData({
                    ...formData,

                    request_date: "",
                    request_fromtime: "",
                    request_totime: ""

                });

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Form submitted successfully',
                });
            } else {
                console.error("Failed to submit form");

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to submit form',
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error submitting form. Please try again later.',
            });
        }
    };

    // ----------------------------------------------------------------------------------------------------


    useEffect(() => {
        const checkShiftSlot = async () => {
            if (fromDate) {
                try {
                    const response = await fetch('https://office3i.com/user/api/public/api/shift_slot_checking', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${usertoken}`
                        },
                        body: JSON.stringify({
                            emp_id: selectedMember,
                            date: fromDate,
                            from_time: '', 
                            to_time: '',
                        }),
                    });

                    const result = await response.json();
                    if (result.status === 'success') {
                        // console.log('Shift Info:', result);
                        // Handle the response as needed
                    } else {
                        console.error('Error fetching shift slot:', result);
                    }
                } catch (error) {
                    console.error('API call failed:', error);
                }
            }
        };

        checkShiftSlot();
    }, [fromDate]);

    return (
        <div>


            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '5%', paddingLeft: '5%', paddingTop: '5%', marginBottom: '40px' }}>

                <h3 style={{ fontWeight: 'bold', color: '#00275c' }}>Leave Approval</h3>
               
            </div>


            {/* ---------------------------------------------------------------------------------------------------- */}

           
           
            <div className='TLApproval-dashboard mb-5'>

                {/* Leave Request */}
                <div className='data-box' onClick={handleVisitLeaveRequest} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={Ontime} alt='employee' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Leave Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Permission Request */}
                <div className='data-box' onClick={handleVisitPermissionRequest} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={employee} alt='Ontime' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Permission Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Half Day Request */}
                <div className='data-box' onClick={handleVisitHaldDayRequest} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={permission} alt='permission' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>Half Day Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

                {/* Half Day Request */}
                <div className='data-box' onClick={handleVisitOTRequest} style={dataBoxStyle}>
                    <div className='box-content'>
                        <span>
                            <span className='img-alignment'>
                                <img src={slow} alt='permission' className='dash-img' />
                            </span>
                            <h4 className='dash-title'>OT Request</h4>
                            <h4 className='dash-values'></h4>
                        </span>
                    </div>
                </div>

              

            </div>

            {/* ---------------------------------------------------------------------------------------------------- */}

        </div>
    );
}