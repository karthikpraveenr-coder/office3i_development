import React, { useState } from 'react';
import OrgChart from '@dabeng/react-orgchart';
// import '@dabeng/react-orgchart/dist/style.min.css';
import './VerticalOrgchart.css';

const orgData = {
  id: '1',
  name: 'CEO',
  title: 'Chief Executive Officer',
  children: [
    {
      id: '2',
      name: 'IT',
      title: 'IT Department',
      children: [
        { 
          id: '2-1', 
          name: 'Karthik', 
          title: 'Senior Developer', 
          children: [
            { id: '2-1-1', name: 'John', title: 'Junior Developer' },
            { id: '2-1-2', name: 'Emma', title: 'Intern Developer' }
          ]
        },
        { id: '2-2', name: 'Afsal', title: 'Developer' },
        { id: '2-3', name: 'Sarah', title: 'IT Support', children: [
            { id: '2-3-1', name: 'Mike', title: 'Support Engineer' },
            { id: '2-3-2', name: 'Alice', title: 'Support Intern' }
          ] 
        }
      ]
    },
    {
      id: '3',
      name: 'Sales',
      title: 'Sales Department',
      children: [
        { id: '3-1', name: 'Dharani', title: 'Sales Manager' },
        { id: '3-2', name: 'Pavithra', title: 'Sales Associate' },
        { id: '3-3', name: 'Raj', title: 'Sales Lead', children: [
            { id: '3-3-1', name: 'Sam', title: 'Sales Executive' }
          ] 
        }
      ]
    },
    {
      id: '4',
      name: 'Marketing',
      title: 'Marketing Department',
      children: [
        { id: '4-1', name: 'Sathiya', title: 'Marketing Head' },
        { id: '4-2', name: 'Vivek', title: 'Marketing Associate' }
      ]
    },
    {
      id: '5',
      name: 'HR',
      title: 'HR Department',
      children: [
        { id: '5-1', name: 'Priya', title: 'HR Manager' },
        { id: '5-2', name: 'Priyanka', title: 'HR Associate' }
      ]
    }
  ]
};

const VerticalOrgChart = () => {
  // State to manage the visibility of each node
  const [expandedNodes, setExpandedNodes] = useState({
    '1': true, // CEO
  });

  // Toggle the visibility of the clicked node's children
  const handleNodeClick = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId] // Toggle visibility of the clicked node
    }));
  };

  // Function to process the org chart data recursively
  const processOrgData = (node) => {
    // If the node has children and is not expanded, hide its children
    if (node.children && node.children.length > 0) {
      if (!expandedNodes[node.id]) {
        return {
          ...node,
          children: [] // Hide children when the node is not expanded
        };
      }
    }

    // Recursively process the children
    return {
      ...node,
      children: node.children ? node.children.map(processOrgData) : []
    };
  };

  // Recursively process the org chart data
  const processedOrgData = processOrgData(orgData);

  return (
    <div>
      <h3>Organization Chart</h3>
      <OrgChart
        datasource={processedOrgData}
        chartClass="vertical-chart"
        pan={true}
        zoom={true}
        onClickNode={(node) => {
          handleNodeClick(node.id); // Handle click to expand/collapse department or employee
        }}
      />
    </div>
  );
};

export default VerticalOrgChart;
