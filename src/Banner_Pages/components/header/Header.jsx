import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import './Header.css'; // Import custom CSS
import banner_logo from '../../assets/images/HREntityLogo.png'
const Header = () => {
    return (
        <Navbar bg="white" expand="lg" className="custom-navbar">

            <Container>

                <Navbar.Brand href="#home" className="custom-logo">
                    <img src={banner_logo} alt="Logo" className="logo-img" />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">

                        <Nav.Link href="#home" className="custom-nav-link">
                            Home
                        </Nav.Link>

                        <NavDropdown title="Features" id="basic-nav-dropdown" className="custom-nav-link">
                            <NavDropdown.Item href="#action/3.1">Core HR</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Attendance Management</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Leave Management</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.4">Payroll Processing</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.5">Recruitment & Onboarding</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.6">Performance Management System</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.7">Employee Engagement</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#customers" className="custom-nav-link">
                            Customers
                        </Nav.Link>


                        <Nav.Link href="#pricing" className="custom-nav-link">
                            Pricing
                        </Nav.Link>

                        <Nav.Link href="#contact" className="custom-nav-link">
                            Contact
                        </Nav.Link>

                        <Nav.Link href="login" className="custom-nav-link">
                            <Button>
                                Login
                            </Button>

                        </Nav.Link>

                    </Nav>
                </Navbar.Collapse>

            </Container>

        </Navbar>
    );
};

export default Header;
