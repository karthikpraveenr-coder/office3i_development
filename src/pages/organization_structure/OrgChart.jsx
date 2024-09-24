import React from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import './css/orgstyle.css';

const OrgChart = ({ data }) => {
    const renderNode = (node) => {
        return (
            <TreeNode
                label={
                    <div className="node">
                        <img src={node.profile_img} alt={`${node.first_name} ${node.last_name}`} className="profile-img" />
                        <div className="node-details">
                            <h4>{node.first_name} {node.last_name}</h4>
                            <p>{node.role_name}</p>
                            <p>{node.department_name}</p>
                            <p>Supervisor: {node.supervisor_first_name} {node.supervisor_last_name}</p>
                        </div>
                    </div>
                }
                key={node.id}
            >
                {node.subordinates && node.subordinates.length > 0 && node.subordinates.map(sub => renderNode(sub))}
            </TreeNode>
        );
    };

    return (
        <div className="org-chart">
            <Tree
                label={
                    <div className="root-node">
                        <h2>Organization Chart</h2>
                    </div>
                }
            >
                {data.map(node => renderNode(node))}
            </Tree>
        </div>
    );
};

export default OrgChart;
