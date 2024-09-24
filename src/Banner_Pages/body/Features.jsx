import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './css/Features.css'
import Ellipse1 from './images/Features_image.png'

function Features() {
    return (
        <Container>
            <div className='Features'>
                <div className='image-container'>
                    <img src={Ellipse1} alt='Ellipse1' className='Ellipse1' />
                    <h1 className='Features-text'>Elevate Your Experience: Features Designed for You!</h1>
                </div>
            </div>

            <Row>
                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Core HR</h3>
                        <p>Single app to manage all your people data to make routine simpler</p>
                    </div>
                </Col>
                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Attendance Management</h3>
                        <p>Manage employee schedules hassle free. Automate workforce management to ensure errorless attendance tracking</p>
                    </div>
                </Col>


                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Leave Management</h3>
                        <p>Approvals now made easy. Let your HR track all leave requests on a well-structured dashboard</p>
                    </div>
                </Col>
                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Payroll</h3>
                        <p>Streamline payroll by assigning multiple pay group categories for employees with a single click</p>
                    </div>
                </Col>

                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Task Management</h3>
                        <p>Easily assign individuals tasks for team members by setting deadlines and track their progress.</p>
                    </div>
                </Col>
                <Col className='feature__card__col mb-4' md={6}>
                    <div className='feature__card'>
                        <h3>Roster Management</h3>
                        <p>Multiple shift policies to efficiently manage and update employee roster to ensure optimal staffing.</p>
                    </div>
                </Col>
            </Row>

        </Container>
    )
}

export default Features
