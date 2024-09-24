import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/navbar.css'
import Swal from 'sweetalert2';
import logo from '../assets/images/Office3iLogo.jpg'

function Navbar() {




    // ===========================================================================================================

    //  Retrieve userData from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    const usertoken = userData?.token || '';
    const userimage = userData?.userimage || '';
    const userempid = userData?.userempid || '';

    // ===========================================================================================================

    // ===========================================================================================================
    // sidebarToggle

    useEffect(() => {
        const handleSidebarToggle = (event) => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        };

        const sidebarToggle = document.body.querySelector('#sidebarToggle');
        if (sidebarToggle) {
            if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
                document.body.classList.toggle('sb-sidenav-toggled');
            }
            sidebarToggle.addEventListener('click', handleSidebarToggle);
        }

        return () => {
            sidebarToggle.removeEventListener('click', handleSidebarToggle);
        };
    }, []);
    // ===========================================================================================================




    // ===========================================================================================================

    // Logout

    const navigate = useNavigate();

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will be logged out!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, logout!',
                cancelButtonText: 'Cancel'
            });

            if (confirmed.isConfirmed) {
                const response = await fetch('https://office3i.com/user/api/public/api/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${usertoken}`
                    }
                });

                if (response.ok) {
                    localStorage.clear();
                    navigate('/login');
                } else {
                    const responseData = await response.json();
                    console.error('Logout failed:', responseData);
                    // Optionally, show an error message to the user
                    Swal.fire({
                        title: 'Logout Failed',
                        text: responseData.message || 'An error occurred while logging out',
                        icon: 'error',
                    });
                }
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };



    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         Swal.fire({
    //             title: 'Session Expired',
    //             text: 'Your session has expired. Please log in again.',
    //             icon: 'warning',
    //             confirmButtonText: 'OK'
    //         }).then(() => {
    //             navigate('/login');
    //         });
    //     }, 5 * 60 * 60 * 1000); 

    //     // Clean up the timer when the component is unmounted
    //     return () => clearTimeout(timer);
    // }, [navigate]);


    // ===========================================================================================================

    const imgstyle = {
        width: '80%',
        height: '60px',
        background: 'white',
        padding: '0px 25px',
        borderRadius: '35px'
    }



    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">

            <Link className="navbar-brand ps-3" to="/admin" style={{ fontWeight: 'bold' }}><img src={logo} alt='logo' style={imgstyle} /></Link>

            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!"><i className="fas fa-bars"></i></button>

            <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                <div className="input-group">
                    {/* <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" style={{ marginBottom: '0px', borderRadius: '18px' }} /> */}
                    {/* <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button> */}
                </div>

            </form>

            {/* <div className='Notification_bell'>
                <FontAwesomeIcon icon={faBell} />
            </div> */}
            <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                <li className="nav-item dropdown">
                    <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">

                        {/* <img src={`https://office3i.com/user/api/storage/app/${userimage}`} alt='user-profile' 
                    
                    style={{
                        width:'56px',
                        border:'3px solid white',
                        borderRadius:'50px',
                        height:'6vh'
                    }}
                    /> */}

                        {userimage ? (
                            <img src={`https://office3i.com/user/api/storage/app/${userimage}`} alt="User" className="user-image"

                                style={{
                                    width: '56px',
                                    border: '3px solid white',
                                    borderRadius: '50px',
                                    height: '57px',
                                    objectFit: 'cover'
                                }} />
                        ) : (
                            <i className="fas fa-user fa-fw"></i>
                        )}

                    </Link>


                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><Link className="dropdown-item" to={`/admin/viewprofile/${userempid}`}>Profile</Link></li>
                        {/* <li><Link className="dropdown-item" to="/admin/activitylog">Activity Log</Link></li> */}
                        <li><hr className="dropdown-divider" /></li>
                        <li><Link className="dropdown-item" to="#!" onClick={handleLogout}>Logout</Link></li>
                    </ul>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar