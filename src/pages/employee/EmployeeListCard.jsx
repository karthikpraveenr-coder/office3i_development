import React from 'react'
import '../employee/css/Employeecardstyle.css'
import { useNavigate } from 'react-router-dom';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function EmployeeListCard(props) {

    const { name, role, department_name, hrms_emp_id, mobile, email, picture, id, empid } = props;


    const navigate = useNavigate();
    const handleVisitProfile = () => {
        navigate(`/admin/viewprofile/${id}`);
    };


    return (

        <div className='full-card-container'>
            <div className='Empcard'>


                <div className='upper-container'>
                    <div className='image-container'>
                        <img src={`https://office3i.com/development/api/storage/app/${picture}`} alt="" style={{ width: '100px', height: '100px' }} className='empprofile' />
                    </div>
                </div>

                <div>
                    <h4 className='Employee__name'>{name}</h4>
                    <h5 className='Employee__role'>{role}</h5>

                </div>

                <div className='lower-contaier'>
                    

                    <div className='Employee__department__id'>
                        <div style={{width:'50%'}}>
                            <h6 style={{ fontWeight: 'bold', color:'#3a3a3a' }}>Department</h6>
                            <p style={{ fontWeight: '600', color:'#3a3a3a', textOverflow:'ellipsis',overflow:'hidden',width:'99%', whiteSpace:'nowrap'  }}>{department_name}</p>

                        </div>
                        <div>
                            <h6 style={{ fontWeight: 'bold', color:'#3a3a3a', whiteSpace:'nowrap'  }}>Employee ID</h6>
                            <p style={{ fontWeight: '600', color:'#3a3a3a'  }}>{hrms_emp_id}</p>

                        </div>

                    </div>
                    <h6><FontAwesomeIcon icon={faPhone} style={{paddingRight:'15px'}}/>  +91 {mobile}</h6>
                    <h6 style={{whiteSpace:'nowrap',textOverflow:'ellipsis',overflow:'hidden',width:'99%'}}><FontAwesomeIcon icon={faEnvelope}  style={{paddingRight:'15px'}}/>  {email}</h6>

                </div>

                <div className='Employee__btn'>
                    <button className='bt1' onClick={handleVisitProfile}>View profile</button>
                </div>



            </div>

        </div>
    )
}
