import React, { useEffect, useState } from 'react';
import '../css/ViewJobstyle.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const ViewJob = () => {

  // --------------------------------------------------------------------------------------------

  // Redirect to the edit page
  const navigate = useNavigate();

  const GoTolistjobPage = () => {
    navigate(`/admin/listjob`);
};

  // --------------------------------------------------------------------------------------------
  // Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const usertoken = userData?.token || '';

  const { id } = useParams();

  // --------------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------------

  // Fetch data from API to store the initial state for edit fields
  const [viewjob, setViewjob] = useState(null);


  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://office3i.com/user/api/public/api/post_job_editlist/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken}`
          },
        });
        if (response.data.status === 'success') {
          const data = response.data.data;
          setViewjob(data);
        } else {
          throw new Error('Failed to fetch job details');
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchJobDetails();
  }, [id, usertoken]);


  // --------------------------------------------------------------------------------------------

  // --------------------------------------------------------------------------------------------

  // Utility function to strip HTML tags
  const stripHTML = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };
  // --------------------------------------------------------------------------------------------


  return (
    <div className="container my-5" style={{padding:'10px 60px'}}>

      {viewjob && (
        <>
          <span className='back__btn' onClick={GoTolistjobPage}><FontAwesomeIcon icon={faAngleLeft} /> Back</span>
          <div className="card mt-5">
            <div className="card-body">
              <h3 className="card-title">{viewjob.designation}</h3>
              <div className="row">

                <div className="col-md-6">
                  <p className="lh"><strong>No. of vacancies:</strong> {viewjob.no_of_vacancies}</p>
                  <p className="lh"><strong>Job Type:</strong> {viewjob.job_type}</p>
                  <p className="lh"><strong>Experience:</strong> {viewjob.experience_min} - {viewjob.experience_max} years</p>
                  <p className="lh"><strong>Schedule/Shift:</strong> {viewjob.shift}</p>
                  <p className="lh"><strong>Job Status:</strong> {viewjob.job_status}</p>
                  <p className="lh"><strong>Valid Till:</strong> {viewjob.valid_till}</p>
                </div>

                <div className="col-md-6">
                  <p className="lh"><strong>Key Skills:</strong> {viewjob.key_skills && viewjob.key_skills.split(',').join(', ')}</p>
                  <p className="lh"><strong>Job Location:</strong> {`${viewjob.country_name}, ${viewjob.state_name}, ${viewjob.city_names}`}</p>
                  <p className="lh"><strong>Employment Type:</strong> {viewjob.emp_type}</p>
                  <p className="lh"><strong>Salary:</strong> {viewjob.salary_min} - {viewjob.salary_max}</p>
                </div>

                <div className="col-md-12">
                  <strong className="lh">Roles & Responsibilities</strong>
                  <p>{stripHTML(viewjob.roles_responsiblities)}</p>
                </div>

                <div className="col-md-12">
                  <strong className="lh">Preferred Candidate</strong>
                  <p>{stripHTML(viewjob.preferred_candidate)}</p>
                </div>

                <div className="col-md-12">
                  <strong className="lh">Other Benefits</strong>
                  <p>{stripHTML(viewjob.other_benefits)}</p>
                </div>

              </div>
            </div>
          </div>
        </>
      )}


    </div>
  );
};

export default ViewJob;
