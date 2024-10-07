
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import DonutChart from 'react-donut-chart';
import SalaryCalculationList from './SalaryCalculationList';
import { useDispatch, useSelector } from 'react-redux';

function SalaryCalculation() {

    // ------------------------------------------------------------------------------------------------

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';

    // ------------------------------------------------------------------------------------------------
    // FETCH CURRENTDATE STATE VALUE FROM REDUX

    const currentDate = useSelector((state) => state.date.currentDate);

    // ------------------------------------------------------------------------------------------------
    const [salarychart, setSalarychart] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // setLoading(true);
            try {
                const response = await fetch('https://office3i.com/development/api/public/api/graph_salary_calculation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${usertoken}`,
                    },
                    body: JSON.stringify({
                        yearmonth: currentDate,
                    })
                });

                if (response.ok) {
                    const responseData = await response.json();
                    setSalarychart(responseData.data);
                    console.log("setSalarychart--->", responseData.data);

                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setLoading(false);
            }
        };

        if (currentDate) {
            fetchData();
        }
    }, [currentDate, usertoken]);

    
    // ------------------------------------------------------------------------------------------------


    return (
        <div className="container mt-5" style={{ padding: '0px 70px 0px' }}>

            <h3 className='mb-5' style={{ fontWeight: 'bold', color: '#00275c' }}>Salary Calculation</h3>

            <Row>
                <Col>
                    <div style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 5px 0.5px', padding: '15px 25px', borderRadius: '10px' }}>
                        <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#00275c' }}>Payout Details</h4>

                        <DonutChart
                            data={[
                                {
                                    label: 'Gross Pay',
                                    value: salarychart.total_gross_pay,
                                    color: 'red',
                                },
                                {
                                    label: 'Net Pay',
                                    value: salarychart.total_net_pay,
                                },
                                {
                                    label: 'Deductions',
                                    value: salarychart.total_deductions,
                                },
                            ]}
                            colors={['#0A63F2', '#F20A8C', '#3B609D']}
                            height={340}
                            width={500}


                        />
                    </div>
                </Col>
                <Col style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 5px 0.5px', padding: '20px 30px', width: '56%', borderRadius: '10px' }}>
                        <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#00275c' }}>Total no of Days</h4>
                        <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#00275c' }}>{salarychart.total_days_in_month}</h1>
                    </div>
                    <div style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 5px 0.5px', padding: '20px 30px', width: '56%', borderRadius: '10px' }}>
                        <h4 className="mb-3" style={{ fontWeight: 'bold', color: '#00275c' }}>Total Employee</h4>
                        <h1 style={{ textAlign: 'center', fontWeight: 'bold', color: '#00275c' }}>{salarychart.employee_count}</h1>
                    </div>
                </Col>
            </Row>

            <SalaryCalculationList />

        </div>
    );
}

export default SalaryCalculation;
