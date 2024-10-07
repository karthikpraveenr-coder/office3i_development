import React, { useState, useEffect } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';
import axios from 'axios'; // Ensure axios is installed: npm install axios

import 'primereact/resources/themes/saga-blue/theme.css'; // Theme CSS
import 'primereact/resources/primereact.min.css'; // Core CSS
import 'primeicons/primeicons.css'; // Icons CSS
import 'primeflex/primeflex.css'; // Utility CSS
import './css/orgstyle.css'; // Custom CSS for organization chart
import error from '../../assets/admin/assets/img/error.png'
import OrganizationChartPopUp from './OrganizationChartPopUp';

// ErrorBoundary component to catch rendering errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state to indicate error
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please refresh the page or try again later.</div>;
        }

        return this.props.children;
    }
}

export default function ColoredDemo() {

    // ----------------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ----------------------------------------------------------------------------------------------------------

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // State to track loading state
    const [error, setError] = useState(null); // State to track any errors

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/orgchart_list/0', {
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });
                if (response.data.status === 'success') {
                    const formattedData = formatData(response.data.data);
                    console.log("Formatted Data:", formattedData); // Debugging: log the formatted data
                    setData(formattedData);
                } else {
                    setError('Failed to fetch data');
                }
            } catch (error) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatData = (data) => {
        return data.map(item => ({
            expanded: true,
            type: 'person',
            className: 'node-class bg-indigo-500 text-white',
            style: { borderRadius: '12px' },
            data: {
                image: item.profile_img ? `https://office3i.com/development/api/storage/app/${item.profile_img}` : 'https://via.placeholder.com/150',
                name: `${item.first_name} ${item.last_name}`,
                title: item.department_name,
                id: item.id
            },
            children: item.subordinates ? item.subordinates.map(sub => ({
                expanded: true,
                type: 'person',
                className: 'node-class bg-purple-500 text-white',
                style: { borderRadius: '12px' },
                data: {
                    image: sub.profile_img ? `https://office3i.com/development/api/storage/app/${sub.profile_img}` : 'https://via.placeholder.com/150',
                    name: `${sub.first_name} ${sub.last_name}`,
                    title: sub.department_name,
                    id: sub.id
                },
                children: sub.subordinates ? formatData(sub.subordinates) : [] // Recursively format subordinates, if any
            })) : [] // Ensure that children is an array, even if empty
        }));
    };

    // --------------------------------------------------------------------------------------------
    const [announcementModel, setAnnouncementModel] = useState(false); 
    const [orgHistory, setOrgHistory] = useState('')

    const datapop = async (id) => {
        console.log('clicked', id);
        try {
            const response = await axios.get(`https://office3i.com/development/api/public/api/orgchart_employee_data/${id}`, {
                headers: {
                    'Authorization': `Bearer ${usertoken}`
                }
            });
            const data = response.data;

            if (data.status === "success") {
                setOrgHistory(data.data);
                console.log(data.data);
                setAnnouncementModel(true); // Show the modal after setting orgHistory
            } else {
                console.error('Error fetching data:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCloseannouncement = () => setAnnouncementModel(false);


    // --------------------------------------------------------------------------------------------





    // onClick={() => { datapop(node.data.id) }}
    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-column align-items-center" style={{ cursor: 'pointer' }} onClick={() => datapop(node.data.id)}>
                    <img alt={node.data.name} src={node.data.image} className="mb-3 w-3rem h-3rem" />
                    <div className='name__title'>
                        <span className="font-bold mb-2" style={{ whiteSpace: 'nowrap' }}>{node.data.name}</span>
                        <span style={{ whiteSpace: 'nowrap' }}>{node.data.title}</span>
                        {/* <span style={{ whiteSpace: 'nowrap' }}>{node.data.id}</span> */}
                    </div>

                </div>
            );
        }

        return <div>{node.label}

           
        </div>;
    };



    // Conditional rendering based on loading state and error
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ErrorBoundary>
            <div className="card overflow-x-auto">
                {error ? (
                    <div>Error:  {error}</div>
                ) : (
                    <OrganizationChart value={data} nodeTemplate={nodeTemplate} style={{ lineHeight: '1.5' }} />
                )}
            </div>
            {orgHistory && (
                <OrganizationChartPopUp
                    announcementModel={announcementModel}
                    handleCloseannouncement={handleCloseannouncement}
                    orgHistory={orgHistory}
                />
            )}
        </ErrorBoundary>
    );
}
