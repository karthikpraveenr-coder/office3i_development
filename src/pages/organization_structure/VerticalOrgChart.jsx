import React, { useEffect, useState } from 'react';
import OrgChart from '@dabeng/react-orgchart';
import Modal from 'react-bootstrap/Modal'; // Import Bootstrap Modal
import Button from 'react-bootstrap/Button'; // Import Bootstrap Button
import './VerticalOrgchart.css';
import axios from 'axios';

// Org chart data
// const orgData = {
//   "id": 1,
//   "name": "Managing Director",
//   "title": "",
//   "image": "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
//   "children": [
//       {
//           "id": 2,
//           "name": "Human Resource",
//           "title": "",
//           "children": [
//               {
//                   "id": "2-2",
//                   "emp_id": 2,
//                   "name": "Pavithra Anandan",
//                   "title": "Talent Acquisition – Lead",
//                   "children": []
//               }
//           ]
//       },
//       {
//           "id": 3,
//           "name": "Information Technology",
//           "title": "",
//           "children": [
//               {
//                   "id": "3-3",
//                   "emp_id": 3,
//                   "name": "Annapriya R",
//                   "title": "IT-Technical Lead",
//                   "children": [
//                       {
//                           "id": "3-3-5",
//                           "emp_id": 5,
//                           "name": "Vivek A",
//                           "title": "IT",
//                           "children": []
//                       },
//                       {
//                           "id": "3-3-6",
//                           "emp_id": 6,
//                           "name": "Mohamed Afsal Hussain",
//                           "title": "IT",
//                           "children": []
//                       },
//                       {
//                           "id": "3-3-7",
//                           "emp_id": 7,
//                           "name": "Sathiya M",
//                           "title": "IT",
//                           "children": []
//                       },
//                       {
//                           "id": "3-3-8",
//                           "emp_id": 8,
//                           "name": "Sonia P",
//                           "title": "Software Testing",
//                           "children": []
//                       },
//                       {
//                           "id": "3-3-10",
//                           "emp_id": 10,
//                           "name": "Mohamed Riswan R",
//                           "title": "Network Engineer",
//                           "children": []
//                       },
//                       {
//                           "id": "3-3-13",
//                           "emp_id": 13,
//                           "name": "Bommi R",
//                           "title": "Test engineer",
//                           "children": []
//                       }
//                   ]
//               },
//               {
//                   "id": "3-4",
//                   "emp_id": 4,
//                   "name": "Karthik Praveen R",
//                   "title": "IT",
//                   "children": []
//               },
//               {
//                   "id": "3-12",
//                   "emp_id": 12,
//                   "name": "Testing R",
//                   "title": "IT-Technical Lead",
//                   "children": []
//               }
//           ]
//       },
//       {
//           "id": 4,
//           "name": "Digital Marketing",
//           "title": "",
//           "children": []
//       },
//       {
//           "id": 5,
//           "name": "Accounts",
//           "title": "",
//           "children": [
//               {
//                   "id": "5-9",
//                   "emp_id": 9,
//                   "name": "Prabhakaran R",
//                   "title": "Accounts",
//                   "children": []
//               }
//           ]
//       },
//       {
//           "id": 6,
//           "name": "Sales",
//           "title": "",
//           "children": [
//               {
//                   "id": "6-11",
//                   "emp_id": 11,
//                   "name": "Martin J",
//                   "title": "ASM",
//                   "children": []
//               }
//           ]
//       },
//       {
//           "id": 7,
//           "name": "test1",
//           "title": "",
//           "children": []
//       },
//       {
//           "id": 8,
//           "name": "test",
//           "title": "",
//           "children": []
//       },
//       {
//           "id": 9,
//           "name": "TESTING",
//           "title": "",
//           "children": []
//       },
//       {
//           "id": 10,
//           "name": "Test",
//           "title": "",
//           "children": []
//       },
//       {
//           "id": 11,
//           "name": "test",
//           "title": "",
//           "children": []
//       }
//   ]
// };

const VerticalOrgChart = () => {
  // State to manage the visibility of each node
  const [expandedNodes, setExpandedNodes] = useState({
    '1': true, // CEO is expanded by default
  });

  // State to manage modal visibility and selected employee details
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null); // State for handling errors

  // Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const usertoken = userData?.token || '';


  // ------------------------------------------------------------------------------------------
  const [hierarchy, setHierarchy] = useState(null);
  
  useEffect(() => {
    // Fetch employee hierarchy when the component is mounted
    const fetchHierarchy = async () => {
      try {
        const token = "your-auth-token"; // Replace with your actual token
        const response = await axios.get(
          "https://office3i.com/development/api/public/api/employee-hierarchy",
          {
            headers: {
              Authorization: `Bearer ${usertoken}`, // Pass token for authorization if required
            },
          }
        );
        setHierarchy(response.data);
      } catch (error) {
        setError("Failed to fetch employee hierarchy");
      }
    };

    fetchHierarchy();
  }, []);
  // ------------------------------------------------------------------------------------------

  // Toggle the visibility of the clicked node's children
  const handleNodeClick = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId], // Toggle visibility of the clicked node
    }));
  };

  // --------------------------------------------------------------------------------------------------------------

  // Function to fetch and open the modal with selected employee details (3rd level onward)
  const handleNodeDetails = async (employee) => {

 

    // Check if the node is third level or deeper (id length >= 2 indicates 3rd level onward)
    if (employee.id.length >= 2) {
      try {
        setLoading(true); // Set loading to true
        setError(null); // Clear any previous error




        // Fetch employee details from the API
        const response = await axios.get(
          `https://office3i.com/development/api/public/api/orgchart_employee_data/${employee.emp_id}`,
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );
        setSelectedEmployee(response.data.data); // Store API data in state
        setShowModal(true); // Open the modal
      } catch (err) {
        setError('Failed to fetch employee details. Please try again.'); // Handle error
      } finally {
        setLoading(false); // Set loading to false
      }
    }
  };

  const { employee_details, position_history } = selectedEmployee || {}; // Destructure selected employee data

  // --------------------------------------------------------------------------------------------------------------

  // Function to process the org chart data recursively
  const processOrgData = (node) => {

    if (node.children && node.children.length > 0) {
      if (!expandedNodes[node.id]) {
        return {
          ...node,
          children: [],
        };
      }
    }

    // Recursively process the children
    return {
      ...node,
      children: node.children ? node.children.map(processOrgData) : [],
    };
  };

  // Recursively process the org chart data
  // const processedOrgData = processOrgData(hierarchy);
  const processedOrgData = hierarchy ? processOrgData(hierarchy) : {};




  return (
    <div>
      {/* <h3>Organization Chart</h3> */}
      <OrgChart 
        datasource={processedOrgData}
        chartClass="vertical-chart"
        // pan={true}
        // zoom={true}
        onClickNode={(node) => {
          handleNodeClick(node.id); // Toggle expand/collapse department or employee
          handleNodeDetails(node); // Show detailed info in modal
        }}
      />

      {/* Modal for displaying employee details */}
      {selectedEmployee && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <div className="image__name">
              <img
                src={`https://office3i.com/development/api/storage/app/${employee_details?.profile_img}`}
                alt={employee_details?.first_name}
                className="header__image"
              />
              <div className="header__names">
                <h3 className="org__username">
                  {employee_details?.first_name} {employee_details?.last_name}
                </h3>
                <p className="org__Designation">
                  Current Designation: {employee_details?.department_name || 'N/A'}
                </p>
              </div>
            </div>
          </Modal.Header>

          <Modal.Body>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : (
              <div className="position__container">
                {position_history?.map((position, index) => (
                  <div key={index} className="position__item">
                    <div className="current__Designation">
                      <h5>{position?.department_name || 'N/A'}</h5>
                      {index !== position_history.length - 1 && (
                        <div className="vertical-line"></div>
                      )}
                    </div>
                    <div className="position__history">
                      {position?.department_salaries.map((salary, salaryIndex) => (
                        <p key={salaryIndex}>
                          <h6>
                            {salary?.ctc_start_month} - {salary?.ctc_end_month}
                          </h6>
                          CTC: {salary?.annual_ctc / 100000} LPA
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default VerticalOrgChart;
