import React, { useEffect, useState } from 'react'
import './css/AddEmployeestyle.css'
import BasicDetails from './BasicDetails';
import EmployeeDetails from './EmployeeDetails';
import EmployeeRole from './EmployeeRole';
import Documents from './Documents';
import BankDetails from './BankDetails';

// nav bar images start
import navBasicDetails from './images/BasicDetails.svg'
import navBasicDetails_blue from './images/BasicDetails_blue.svg'

import navEmployeeDetails from './images/EmployeeDetails.svg'
import navEmployeeDetails_blue from './images/EmployeeDetails_blue.svg'

import navEmployeeRole from './images/EmployeeRole.svg'
import navEmployeeRole_blue from './images/EmployeeRole_blue.svg'

import navBankDetails from './images/BankDetails.svg'
import navBankDetails_blue from './images/BankDetails_blue.svg'

import navDocuments from './images/Documents.svg'
import navDocuments_blue from './images/Documents_blue.svg'
import axios from 'axios';
// nav bar images end


import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';




export const AddEmployee = () => {

  // ------------------------------------------------------------------------------------------------

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';

  const navigate = useNavigate();

  const handleVisitEmployeeprofile = () => {
    navigate('/admin/EmployeeList');
  };

  // ------------------------------------------------------------------------------------------------

  const [step, setStep] = useState(1);


  // -------------------------------- formData --------------------------------------------------------

  // const [formData, setFormData] = useState({
  //   // BasicDetails fields
  //   employeeId: '12345',
  //   employeePicture: 'url-to-dummy-picture.jpg',
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   gender: 'Male',
  //   status: 'Active',
  //   phoneNumber: '1234567890',
  //   whatsappNumber: '1234567890',
  //   email: 'john.doe@example1.com',
  //   dob: '1980-01-01',
  //   currentAddress: '123 Main St, City, State, Zip',
  //   permanentAddress: '456 Elm St, City, State, Zip',
  //   parentName: 'Jane Doe',
  //   maritalStatus: 'Married',
  //   spouseName: 'Jane Doe',
  //   aadharNumber: '1234-5678-9123',
  //   panNumber: 'ABCDE1234F',
  //   // EmployeeDetails fields
  //   employeeCategory: ['Full Time', 'Part Time'],
  //   selectedemployeeCategory: 'Full Time',
  //   dateOfJoining: '2020-01-01',
  //   probationPeriod: '6 Months',
  //   confirmationDate: '2020-07-01',
  //   employeeAgreementPeriod: '2 Years',
  //   noticePeriod: '3 Months',
  //   ctc: '600000',
  //   grossSalary: '50000',
  //   netSalary: '45000',
  //   lastWorkingDay: '20/02/2024',
  //   providentFund: 'Yes',
  //   uanNumber: 'UAN1234567',
  //   employeePfContribution: '1800',
  //   employerPfContribution: '1800',
  //   esi: 'Yes',
  //   esiNumber: 'ESI12345',
  //   employeeEsiContribution: '750',
  //   employerEsiContribution: '1750',

  //   // EmployeeRole fields
  //   userRole: { data: [{ id: '1', name: 'Manager' }, { id: '2', name: 'Staff' }] },
  //   selectedRoleId: '1',
  //   designation: 'Project Manager',
  //   supervisor: [{ id: '1', name: 'Senior Manager' }],
  //   selectedsupervisorId: '1',
  //   shiftRole: [{ id: '1', name: 'Day' }, { id: '2', name: 'Night' }],
  //   selectedshiftRoleId: '1',
  //   officialEmail: 'john.doe@company3.com',
  //   password: 'securepassword123',
  //   checkinCheckout: 'Enabled',
  //   overtime: 'Allowed',
  //   lateAllowed: '5 times/month',
  //   permissionAllowed: '2 times/month',

  //   // Bank Details fields
  //   bankAccountNumber: '123456789012',
  //   bankName: 'Any Bank',
  //   bankBranch: 'Any Branch',
  //   ifscCode: 'IFSC0001234',
  //   accountType: 'Savings',

  //   // Documents Fields
  //   // documentType: 'ID Proof',
  //   // documentName: 'Passport',
  //   // selectedFile: 'url-to-dummy-document.pdf'
  // });

  const [formData, setFormData] = useState({
    // BasicDetails fields
    employeeId: '',
    employeePicture: null,
    firstName: '',
    lastName: '',
    gender: '',
    status: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    dob: '',
    currentAddress: '',
    permanentAddress: '',
    parentName: '',
    maritalStatus: '',
    spouseName: '',
    aadharNumber: '',
    panNumber: '',
    // EmployeeDetails fields
    employeeJobType: [],
    selectedemployeeJobType: '',
    employeeCategory: [],
    selectedemployeeCategory: '',
    dateOfJoining: '',
    probationPeriod: '',
    confirmationDate: '',
    employeeAgreementPeriod: '',
    noticePeriod: '',
    ctc: '',
    grossSalary: '',
    netSalary: '',
    lastWorkingDay: '',
    providentFund: '',
    uanNumber: '',
    employeePfContribution: '',
    employerPfContribution: '',
    esi: '',
    esiNumber: '',
    employeeEsiContribution: '',
    employerEsiContribution: '',

    // EmployeeRole fields
    userRole: { data: [] },
    usersupervisorRole: { data: [] },
    selectedRoleId: '',
    selectedSupervisorRoleId: '',
    designation: '',
    supervisor: [],
    selectedsupervisorId: '',
    // shiftRole: [],
    // selectedshiftRoleId: '',
    officialEmail: '',
    password: '',
    checkinCheckout: '',
    overtime: '',
    lateAllowed: '',
    permissionAllowed: '',


    // Bank Details fields
    bankAccountNumber: '',
    bankName: '',
    bankBranch: '',
    ifscCode: '',
    accountType: '',

    // Documents Fields
    documentType: '',
    documentName: '',
    selectedFile: null
  });


  // ---------------------------------------------------------------------------------------------------

  const [copyAddress, setCopyAddress] = useState(false);

  const handleCheckboxChange = () => {
    setCopyAddress(!copyAddress);
    if (!copyAddress) { // If the checkbox is about to be checked
      setFormData(prevState => ({
        ...prevState,
        permanentAddress: prevState.currentAddress
      }));
    }
  };

  // ---------------------------------------------------------------------------------------------------

  // initial state
  const initialFormData = {
    employeeId: '',
    employeePicture: null,
    firstName: '',
    lastName: '',
    gender: '',
    status: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    dob: '',
    currentAddress: '',
    permanentAddress: '',
    parentName: '',
    maritalStatus: '',
    spouseName: '',
    aadharNumber: '',
    panNumber: '',
    employeeJobType: [],
    selectedemployeeJobType: '',
    employeeCategory: [],
    selectedemployeeCategory: '',
    dateOfJoining: '',
    probationPeriod: '',
    confirmationDate: '',
    employeeAgreementPeriod: '',
    noticePeriod: '',
    ctc: '',
    grossSalary: '',
    netSalary: '',
    lastWorkingDay: '',
    providentFund: '',
    uanNumber: '',
    employeePfContribution: '',
    employerPfContribution: '',
    esi: '',
    esiNumber: '',
    employeeEsiContribution: '',
    employerEsiContribution: '',
    userRole: { data: [] },
    usersupervisorRole: { data:[] },
    selectedRoleId: '',
    selectedSupervisorRoleId: '',
    designation: '',
    supervisor: [],
    selectedsupervisorId: '',
    officialEmail: '',
    password: '',
    checkinCheckout: '',
    overtime: '',
    lateAllowed: '',
    permissionAllowed: '',
    bankAccountNumber: '',
    bankName: '',
    bankBranch: '',
    ifscCode: '',
    accountType: '',
    documentType: '',
    documentName: '',
    selectedFile: null
  };

  const [clearform, setClearform] = useState(initialFormData);

  const resetFormData = () => {
    setClearform(initialFormData);
  };


  // ---------------------------------------------------------------------------------------------------

  // -------------------------------- formErrors -------------------------------------------------------
  const [formErrors, setFormErrors] = useState({
    // BasicDetails fields
    employeeId: '',
    employeePicture: null,
    firstName: '',
    lastName: '',
    gender: '',
    status: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    dob: '',
    currentAddress: '',
    permanentAddress: '',
    parentName: '',
    maritalStatus: '',
    spouseName: '',
    aadharNumber: '',
    panNumber: '',
    // EmployeeDetails fields
    employeeJobType: [],
    selectedemployeeJobType: '',
    employeeCategory: [],
    selectedemployeeCategory: '',
    dateOfJoining: '',
    probationPeriod: '',
    confirmationDate: '',
    employeeAgreementPeriod: '',
    noticePeriod: '',
    ctc: '',
    grossSalary: '',
    netSalary: '',
    lastWorkingDay: '',
    providentFund: '',
    uanNumber: '',
    employeePfContribution: '',
    employerPfContribution: '',
    esi: '',
    esiNumber: '',
    employeeEsiContribution: '',
    employerEsiContribution: '',

    // EmployeeRole fields
    userRole: [],
    usersupervisorRole:[],
    selectedRoleId: '',
    selectedSupervisorRoleId: '',
    designation: '',
    supervisor: [],
    selectedsupervisorId: '',
    // shiftRole: [],
    // selectedshiftRoleId: '',
    officialEmail: '',
    password: '',
    checkinCheckout: '',
    overtime: '',
    lateAllowed: '',
    permissionAllowed: '',


    // Bank Details fields
    bankAccountNumber: '',
    bankName: '',
    bankBranch: '',
    ifscCode: '',
    accountType: '',

    // Documents Fields
    documentType: [],
    selecteddocumentType: '',
    documentName: '',
    selectedFile: null
  });

  // ---------------------------------------------------------------------------------------------------



  // -----------------------------------handle change inputs --------------------------------------------


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => {
      const updatedState = {
        ...prevState,
        [name]: value
      };
      return updatedState;
    });
  };





  // const handlePictureChange = (e) => {
  //   const file = e.target.files[0];
  //   console.log("file---->", file)
  //   setFormData({
  //     ...formData,
  //     employeePicture: file
  //   });
  // };

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    console.log("file---->", file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
        setFormData({
          ...formData,
          employeePicture: file
        });
      };

      reader.readAsDataURL(file);
    } else {

      setImagePreviewUrl(null);
      setFormData({
        ...formData,
        employeePicture: null
      });
    }
  };



  // ---------------------------------------------------------------------------------------------------

  // ------------------------------------ handle changes documents---------------------------------------
  // document handler start

  const [fileSets, setFileSets] = useState([{ documentType: [], selecteddocumentType: [], documentName: '', selectedFile: null }]);


  const selectedDocumentTypes = fileSets.map(fileSet => fileSet.selecteddocumentType);
  console.log("selectedDocumentTypes", selectedDocumentTypes);

  const documentNames = fileSets.map(fileSet => fileSet.documentName);
  //  console.log("documentNames", documentNames);

  const selectedFiles = fileSets.map(fileSet => fileSet.selectedFile);
  //  console.log("selectedFiles", selectedFiles);


  const [filePreviews, setFilePreviews] = useState(Array.from({ length: fileSets.length }, () => null));


  // const handleChangedoc = (index, e) => {
  //   const { name, value, files } = e.target;
  //   const newFileSets = [...fileSets];
  //   if (name === "selectedFile") {
  //     newFileSets[index][name] = files[0];
  //   } else {
  //     newFileSets[index][name] = value;
  //   }
  //   setFileSets(newFileSets);
  // };


  // document handler end
  // ---------------------------------------------------------------------------------------------------



  // ------------------------------------ form submit --------------------------------------------------

  const handleChangedoc = (index, e) => {
    const { name, value, files } = e.target;
    const newFileSets = [...fileSets];

    if (name === "selectedFile") {
      newFileSets[index][name] = files[0];

      if (files[0]) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setFilePreviews(prevFilePreviews => {
            const updatedPreviews = [...prevFilePreviews];
            updatedPreviews[index] = reader.result;
            return updatedPreviews;
          });
        };

        reader.readAsDataURL(files[0]);
      }
    } else {
      newFileSets[index][name] = value;
    }

    setFileSets(newFileSets);
  };


  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const errors = {};
   

    //  // Validate Documents Fields
    // if (!formData.documentType) {
    //   errors.documentType = 'Document type is required';
    // }
    // if (!fileSets.documentName) {
    //   errors.documentName = 'Document name is required';
    // }
    // Add validations for other Documents Fields here

    // Validate selectedFile
    // if (!formData.selectedFile) {
    //   errors.selectedFile = 'Please select a file';
    // }

    fileSets.forEach((fileSet, index) => {
      console.log(`Validating fileSet at index: ${index}`, fileSet); // Debug log

      if (!fileSet.selecteddocumentType || fileSet.selecteddocumentType.length === 0) {
        errors[`selecteddocumentType_${index}`] = 'Document type is required';
      }
      if (fileSet.selecteddocumentType && fileSet.selecteddocumentType > 0) {
        if (!fileSet.documentName) {
          errors[`documentName_${index}`] = 'Document name is required';
        }
        if (!fileSet.selectedFile) {
          errors[`selectedFile_${index}`] = 'Please select a file';
        }
      }
    });





    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Error',
      //   text: 'Please fill in all required fields.',
      // });
      setTimeout(() => {

        setLoading(false);
      }, 1000);
      return;
    }

    // Clear form errors if there are no errors
    setFormErrors({});

    const formDataToSend = new FormData();


    // Append BasicDetails fields
    formDataToSend.append('employee_id', formData.employeeId);
    formDataToSend.append('emp_profile', formData.employeePicture);
    formDataToSend.append('first_name', formData.firstName);
    formDataToSend.append('last_name', formData.lastName);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('mobile_number', formData.phoneNumber);
    formDataToSend.append('whatsapp_number', formData.whatsappNumber);
    formDataToSend.append('email_id', formData.email);
    formDataToSend.append('date_of_birth', formData.dob);
    formDataToSend.append('current_address', formData.currentAddress);
    formDataToSend.append('permanent_address', formData.permanentAddress);
    formDataToSend.append('parent_guardian_name', formData.parentName);
    formDataToSend.append('marital_status', formData.maritalStatus);
    formDataToSend.append('spouse_name', formData.spouseName.trim() === "" ? "-" : formData.spouseName);
    formDataToSend.append('aadhar_no', formData.aadharNumber);
    formDataToSend.append('pan_no', formData.panNumber);

    // Append EmployeeDetails fields 
    formDataToSend.append('job_type', formData.selectedemployeeJobType);
    formDataToSend.append('employee_category', formData.selectedemployeeCategory);
    formDataToSend.append('doj', formData.dateOfJoining);
    formDataToSend.append('probation_period', formData.probationPeriod.trim() === "" ? "-" : formData.probationPeriod);
    formDataToSend.append('confiramation_date', formData.confirmationDate);
    formDataToSend.append('employee_agree_period', formData.employeeAgreementPeriod.trim() === "" ? "-" : formData.employeeAgreementPeriod);
    formDataToSend.append('notice_period', formData.noticePeriod);
    formDataToSend.append('ctc', formData.ctc);
    formDataToSend.append('gross_salary', formData.grossSalary);
    formDataToSend.append('net_salary', formData.netSalary);
    formDataToSend.append('last_working_day', formData.lastWorkingDay.trim() === "" ? "-" : formData.lastWorkingDay);
    formDataToSend.append('emp_pf', formData.providentFund);
    formDataToSend.append('uan_number', formData.uanNumber.trim() === "" ? "-" : formData.uanNumber);
    formDataToSend.append('employee_pf_contribution', formData.employeePfContribution.trim() === "" ? "-" : formData.employeePfContribution);
    formDataToSend.append('employer_pf_contribution', formData.employerPfContribution.trim() === "" ? "-" : formData.employerPfContribution);
    formDataToSend.append('emp_esi', formData.esi);
    formDataToSend.append('esi_number', formData.esiNumber.trim() === "" ? "-" : formData.esiNumber);
    formDataToSend.append('employee_esi_contribution', formData.employeeEsiContribution.trim() === "" ? "-" : formData.employeeEsiContribution);
    formDataToSend.append('employer_esi_contribution', formData.employerEsiContribution.trim() === "" ? "-" : formData.employerEsiContribution);

    // Append EmployeeRole fields
    formDataToSend.append('role', formData.selectedRoleId);
    formDataToSend.append('supervisor', formData.selectedSupervisorRoleId);
    formDataToSend.append('designation', formData.designation);
    formDataToSend.append('supervisor_name', formData.selectedsupervisorId);
    formDataToSend.append('official_email', formData.officialEmail);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('emp_punch', formData.checkinCheckout);
    formDataToSend.append('ot_status', formData.overtime.trim() === "" ? "-" : formData.overtime);
    formDataToSend.append('late_policy', formData.lateAllowed.trim() === "" ? "-" : formData.lateAllowed);
    formDataToSend.append('permission_policy', formData.permissionAllowed.trim() === "" ? "-" : formData.permissionAllowed);

    // Append Bank Details fields
    formDataToSend.append('account_number', formData.bankAccountNumber);
    formDataToSend.append('bank_name', formData.bankName);
    formDataToSend.append('branch_name', formData.bankBranch);
    formDataToSend.append('ifsc_code', formData.ifscCode);
    formDataToSend.append('account_type', formData.accountType);

    // Append Documents Fields
    // formDataToSend.append('emp_document_type', selectedDocumentTypes);

    selectedDocumentTypes.forEach((type, index) => {
      let typeValue = type;
      if (typeof type === "string") {
        typeValue = type.trim();
      } else if (type == null) {
        typeValue = "-";
      } else {
        typeValue = String(type).trim();  // Convert non-null, non-string types to string
      }
      formDataToSend.append('emp_document_type[]', typeValue === "" ? "-" : typeValue);
    });


    documentNames.forEach((name, index) => {
      formDataToSend.append('emp_document_name[]', name.trim() === "" ? "-" : name);
    });


    // formDataToSend.append('emp_document_name', documentNames);
    // Correctly handle file objects in the FormData
    selectedFiles.forEach((file, index) => {
      if (file instanceof File) {
        formDataToSend.append('emp_document_image[]', file);
      } else {
        // Handle the case where file might not be a file object
        formDataToSend.append('emp_document_image[]', "-");
      }
    });

    // formDataToSend.append('emp_document_image', selectedFiles);
    formDataToSend.append('created_by', userempid);


    // console.log("handle submit requested data list");
    // for (let pair of formDataToSend.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }


    // ====================



    try {
      const response = await fetch('https://office3i.com/development/api/public/api/add_employee', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${usertoken}`
        }
      });

      const data = await response.json();


      const { status, message } = data;


      if (status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: message,
        });
        resetFormData();
        handleVisitEmployeeprofile()
        setLoading(false);
      } else if (status === 'error') {
        // console.error('Failed to submit form: ', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,

        })
        setLoading(false);
      } else {
        // console.error('Failed to submit form: ', response.statusText);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: message,

        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error submitting form. Please try again later.',

      });
      setLoading(false);
    }
  };


  // ---------------------------------------------------------------------------------------------------




  // -------------------------------- Fetch employee ID-------------------------------------------------

  // Fetch employee ID
  useEffect(() => {
    const fetchEmployeeId = async () => {
      try {
        const response = await axios.get('https://office3i.com/development/api/public/api/employee_uid', {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });

        // setemployeeId(response.data.data);

        setFormData(prevFormData => ({
          ...prevFormData,
          employeeId: response.data.data
        }));
        // console.log('epkemployeeid-->', response.data.data)

      } catch (error) {
        console.error('Error fetching employee ID:', error);
      }
    };

    fetchEmployeeId();
  }, []);
  // ---------------------------------------------------------------------------------------------------

  // ---------------------------------- Fetch user roles ------------------------------------------------
  // Fetch user roles


  useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get('https://office3i.com/development/api/public/api/userrolelist', {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });
        const data = response.data
        // console.log("Fetched userRole data:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          userRole: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, []);


  // Fetch All user roles


  useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get('https://office3i.com/development/api/public/api/supervisor_userrole', {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });
        const data = response.data
        // console.log("Fetched userRole data:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          usersupervisorRole: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, []);

  // ---------------------------------------------------------------------------------------------------


  // -------------------------------  Fetch Supervisor roles -------------------------------------------

  // useEffect(() => {
  //   const fetchUserRoleDropdown = async () => {
  //     try {
  //       const response = await axios.get(`https://office3i.com/development/api/public/api/supervisor_list/${formData.selectedRoleId}`, {
  //         headers: {
  //           'Authorization': `Bearer ${usertoken}`
  //         }
  //       });

  //       const data = response.data.data; // Extracting data from response

  //       // console.log("Fetched supervisor_list:", data);

  //       setFormData(prevFormData => ({
  //         ...prevFormData,
  //         supervisor: data
  //       }));

  //     } catch (error) {
  //       console.error('Error fetching user roles:', error);
  //     }
  //   };

  //   fetchUserRoleDropdown();
  // }, [formData.selectedRoleId]);
  // ----------------------------------------------------------------------------------------------------

   // -------------------------------  Fetch Supervisor  roles -------------------------------------------

   useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get(`https://office3i.com/development/api/public/api/supervisorrole_list/${formData.selectedSupervisorRoleId}`, {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });

        const data = response.data.data; // Extracting data from response

        // console.log("Fetched supervisor_list:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          supervisor: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, [formData.selectedSupervisorRoleId]);
  // ----------------------------------------------------------------------------------------------------



  // ------------------------------------ shiftslotlist  -------------------------------------------------

  // useEffect(() => {
  //   const fetchUserRoleDropdown = async () => {
  //     try {
  //       const response = await axios.get(`https://office3i.com/development/api/public/api/shiftslotlist`, {
  //         headers: {
  //           'Authorization': `Bearer ${usertoken}`
  //         }
  //       });

  //       const data = response.data.data;

  //       // console.log("shiftslotlist-------------------------------->:", data);

  //       setFormData(prevFormData => ({
  //         ...prevFormData,
  //         shiftRole: data
  //       }));

  //     } catch (error) {
  //       console.error('Error fetching user roles:', error);
  //     }
  //   };

  //   fetchUserRoleDropdown();
  // }, []);

  // ------------------------------------------------------------------------------------------------------

  // ------------------------------ employee_document_typelist --------------------------------------------
  useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get(`https://office3i.com/development/api/public/api/employee_document_typelist`, {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });

        const data = response.data.data;

        // console.log("employee_document_typelist-------------------------------->:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          documentType: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, []);

  // --------------------------------------------------------------------------------------------------------

  // ------------------------------- employee_document_typelist ---------------------------------------------
  useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get(`https://office3i.com/development/api/public/api/employee_categorylist`, {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });

        const data = response.data.data;

        // console.log("employee_document_typelist-------------------------------->:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          employeeCategory: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, []);

  // ---------------------------------------------------------------------------------------------------------

  // ------------------------------- employee_job_type ---------------------------------------------
  useEffect(() => {
    const fetchUserRoleDropdown = async () => {
      try {
        const response = await axios.get(`https://office3i.com/development/api/public/api/getjobtype`, {
          headers: {
            'Authorization': `Bearer ${usertoken}`
          }
        });

        const data = response.data.data;

        console.log("getjobtype-------------------------------->:", data);

        setFormData(prevFormData => ({
          ...prevFormData,
          employeeJobType: data
        }));

      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoleDropdown();
  }, []);

  // ---------------------------------------------------------------------------------------------------------






  const nextStep = (e) => {
    e.preventDefault();

    // Clear previous errors
    setFormErrors({});
    const errors = {};

    // Step 1: Validate Basic Details fields
    if (step === 1) {

      // Validate BasicDetails fields
      if (!formData.employeeId) {
        errors.employeeId = 'Employee ID is required';
      }
      if (!formData.employeePicture) {
        errors.employeePicture = 'Employee picture is required';
      }
      if (!formData.firstName) {
        errors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        errors.lastName = 'Last name is required';
      }
      if (!formData.gender) {
        errors.gender = 'Gender is required';
      }
      if (!formData.status) {
        errors.status = 'Status is required';
      }

      if (!formData.phoneNumber) {
        errors.phoneNumber = 'Phone number is required';
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        errors.phoneNumber = 'Phone number must be 10 digits';
      }
      if (!formData.whatsappNumber) {
        errors.whatsappNumber = 'WhatsApp number is required';
      } else if (!/^\d{10}$/.test(formData.whatsappNumber)) {
        errors.whatsappNumber = 'WhatsApp number must be 10 digits';
      }
      // if (!formData.email) {
      //   errors.email = 'Email is required';
      // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      //   errors.email = 'Invalid email address';
      // }

      if (!formData.email) {
        errors.email = 'Email field is empty';
      } else if (!/^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        errors.email = 'Invalid email address';
      }




      if (!formData.dob) {
        errors.dob = 'Date of birth is required';
      }
      if (!formData.currentAddress) {
        errors.currentAddress = 'Current address is required';
      }
      if (!formData.permanentAddress) {
        errors.permanentAddress = 'Permanent address is required';
      }
      if (!formData.parentName) {
        errors.parentName = 'Parent name is required';
      }
      if (!formData.maritalStatus) {
        errors.maritalStatus = 'Marital status is required';
      }
      if (formData.maritalStatus === 'Married' && !formData.spouseName) {
        errors.spouseName = 'Spouse name is required for married employees';
      }
      if (!formData.aadharNumber) {
        errors.aadharNumber = 'Aadhar number is required';
      } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
        errors.aadharNumber = 'Aadhar number must be 12 digits';
      }
      if (!formData.panNumber) {
        errors.panNumber = 'PAN number is required';
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
        errors.panNumber = 'Invalid PAN number';
      }


      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        console.log("Validation Errors in Step 1:", errors);
        return;
      } else {
        setStep(2);
        return;
      }
    }

    // Step 2: Validate Employee Job Type
    if (step === 2) {

      // Validate EmployeeDetails fields
      if (!formData.selectedemployeeJobType) {
        errors.selectedemployeeJobType = 'Employee Job Type is required';
      }
      if (!formData.selectedemployeeCategory) {
        errors.selectedemployeeCategory = 'Employee Category is required';
      }
      if (!formData.dateOfJoining) {
        errors.dateOfJoining = 'Date of joining is required';
      }
      // if (!formData.probationPeriod) {
      //   errors.probationPeriod = 'Probation period is required';
      // }
      // if (!formData.confirmationDate) {
      //   errors.confirmationDate = 'Confirmation date is required';
      // }
      // if (!formData.employeeAgreementPeriod) {
      //   errors.employeeAgreementPeriod = 'Employee agreement period is required';
      // }
      if (!formData.noticePeriod) {
        errors.noticePeriod = 'Notice period is required';
      }
      if (!formData.ctc) {
        errors.ctc = 'CTC is required';
      }
      if (!formData.grossSalary) {
        errors.grossSalary = 'Gross salary is required';
      }
      if (!formData.netSalary) {
        errors.netSalary = 'Net salary is required';
      }
      // if (!formData.lastWorkingDay) {
      //   errors.lastWorkingDay = 'Last working day is required';
      // }
      if (!formData.providentFund) {
        errors.providentFund = 'Provident fund is required';
      }

      if (formData.providentFund == "Applicable") {
        if (!formData.uanNumber) {
          errors.uanNumber = 'UAN number is required';
        }
        if (!formData.employeePfContribution) {
          errors.employeePfContribution = 'Employee PF contribution is required';
        }
        if (!formData.employerPfContribution) {
          errors.employerPfContribution = 'Employer PF contribution is required';
        }
      }

      if (!formData.esi) {
        errors.esi = 'ESI is required';
      }



      if (formData.esi == "Applicable") {
        if (!formData.esiNumber) {
          errors.esiNumber = 'ESI number is required';
        }
        if (!formData.employeeEsiContribution) {
          errors.employeeEsiContribution = 'Employee ESI contribution is required';
        }
        if (!formData.employerEsiContribution) {
          errors.employerEsiContribution = 'Employer ESI contribution is required';
        }
      }


      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        console.log("Validation Errors in Step 2:", errors);
        return;
      } else {
        setStep(3);
        return;
      }
    }

    // Step 3: Validate Designation
    if (step === 3) {

      // Validate EmployeeRole fields
      if (!formData.selectedRoleId) {
        errors.selectedRoleId = 'User role is required';
      }
      if (!formData.selectedSupervisorRoleId) {
        errors.selectedSupervisorRoleId = 'Supervisor role is required';
      }

      if (!formData.designation) {
        errors.designation = 'Designation is required';
      }
      if (!formData.selectedsupervisorId) {
        errors.selectedsupervisorId = 'Supervisor is required';
      }

      // if (!formData.officialEmail) {
      //   errors.officialEmail = 'Official email is required';
      // } else if (!/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      //   errors.officialEmail = 'Invalid official email address';
      // }

      if (!formData.officialEmail) {
        errors.officialEmail = 'Official email is required';
      } else if (!/^[a-zA-Z]+[a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.officialEmail)) {
        errors.officialEmail = 'Invalid official email address';
      }

      // if (!formData.password) {
      //   errors.password = 'Password is required';
      // }


      if (!formData.password) {
        errors.password = 'Password is required.';
      } else {
        if (formData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        }
        // Check if password contains at least one number
        if (!/\d/.test(formData.password)) {
          errors.password = 'Password must contain at least one number';
        }
        // Check if password contains at least one uppercase letter
        if (!/[A-Z]/.test(formData.password)) {
          errors.password = 'Password must contain at least one uppercase letter';
        }
        // Check if password contains at least one special character
        if (!/[!@#$%^&*]/.test(formData.password)) {
          errors.password = 'Password must contain at least one special character';
        }
      }

      if (!formData.checkinCheckout) {
        errors.checkinCheckout = 'Check-in/Check-out time is required';
      }
      // if (!formData.overtime) {
      //   errors.overtime = 'Overtime details are required';
      // }
      // if (!formData.lateAllowed) {
      //   errors.lateAllowed = 'Late allowed details are required';
      // }
      // if (!formData.permissionAllowed) {
      //   errors.permissionAllowed = 'Permission allowed details are required';
      // }


      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        console.log("Validation Errors in Step 3:", errors);
        return;
      } else {
        setStep(4);
        return;
      }
    }

    // Step 4: Validate Bank Account Number
    if (step === 4) {

      // Validate Bank Details fields
      if (!formData.bankAccountNumber) {
        errors.bankAccountNumber = 'Bank account number is required';
      }
      if (!formData.bankName) {
        errors.bankName = 'Bank name is required';
      }
      if (!formData.bankBranch) {
        errors.bankBranch = 'Bank branch is required';
      }
      if (!formData.ifscCode) {
        errors.ifscCode = 'IFSC code is required';
      }
      if (!formData.accountType) {
        errors.accountType = 'Account type is required';
      }



      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        console.log("Validation Errors in Step 4:", errors);
        return;
      } else {
        setStep(5);
        return;
      }
    }


  };


  const prevStep = () => {
    setStep(step - 1);
  };


  const renderStep = () => {
    switch (step) {
      case 1:
        return <div><BasicDetails nextStep={nextStep} handlePictureChange={handlePictureChange} handleChange={handleChange} formData={formData} formErrors={formErrors} copyAddress={copyAddress} handleCheckboxChange={handleCheckboxChange} imagePreviewUrl={imagePreviewUrl} /></div>;
      case 2:
        return <div><EmployeeDetails nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} formErrors={formErrors} /></div>;
      case 3:
        return <div><EmployeeRole nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} formErrors={formErrors} /></div>;
      case 4:
        return <div><BankDetails nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} formData={formData} formErrors={formErrors} /></div>;
      case 5:
        return <div><Documents prevStep={prevStep} handleSubmit={handleSubmit} setFileSets={setFileSets} fileSets={fileSets} handleChangedoc={handleChangedoc} formData={formData} formErrors={formErrors} filePreviews={filePreviews} loading={loading} setFilePreviews={setFilePreviews} /></div>;
      default:
        return <div><BasicDetails /></div>;
    }
  };


  return (
    <div className="container addemployee__container">
      {/* <h2>Step {step} of 5</h2> */}
      <h2 className='mb-5'>Add Employee</h2>


      <div className="steps">
        <div className={`step z-index1 ${step === 1 ? 'active' : ''}`}>
          {step === 1 ? <img src={navBasicDetails_blue} alt='' className='navimg' /> : <img src={navBasicDetails} alt='' className='navimg' />}
        </div>

        <div className={`step z-index2 ${step === 2 ? 'active' : ''}`}>
          {step === 2 ? <img src={navEmployeeDetails_blue} alt='' className='navimg' /> : <img src={navEmployeeDetails} alt='' className='navimg' />}
        </div>

        <div className={`step z-index3 ${step === 3 ? 'active' : ''}`}>
          {step === 3 ? <img src={navEmployeeRole_blue} alt='' className='navimg' /> : <img src={navEmployeeRole} alt='' className='navimg' />}
        </div>

        <div className={`step z-index4 ${step === 4 ? 'active' : ''}`}>
          {step === 4 ? <img src={navBankDetails_blue} alt='' className='navimg' /> : <img src={navBankDetails} alt='' className='navimg' />}
        </div>

        <div className={`step z-index5 ${step === 5 ? 'active' : ''}`}>
          {step === 5 ? <img src={navDocuments_blue} alt='' className='navimg' /> : <img src={navDocuments} alt='' className='navimg' />}
        </div>
      </div>




      {renderStep()}

      {/* {step > 1 && (
        <button className="btn btn-secondary" onClick={prevStep}>Previous</button>
      )}
      {step < 5 && (
        <button className="btn btn-primary" onClick={nextStep}>Next</button>
      )} */}
      {/* {step === 5 && (
        <button className="btn btn-success">Submit</button>
      )} */}
    </div>
  )
}


