import React, { useState, useEffect } from 'react';
import '../css/CheckinCheckout.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { detect } from 'detect-browser';

function CheckinCheckout() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [timeWorked, setTimeWorked] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const savedCheckInTime = localStorage.getItem('checkinTime');
    if (savedCheckInTime && !checkedOut) {
      const elapsedTime = calculateElapsedTime(new Date(savedCheckInTime), new Date());
      setTimeWorked(elapsedTime);
      setCheckedIn(true);
    }
  }, [checkedOut]);

  useEffect(() => {
    let interval;

    if (checkedIn && !checkedOut) {
      // Start an interval to update time every second
      interval = setInterval(() => {
        setTimeWorked(prevTime => {
          const { hours, minutes, seconds } = prevTime;

          if (seconds < 59) {
            return { ...prevTime, seconds: seconds + 1 };
          } else if (minutes < 59) {
            return { hours, minutes: minutes + 1, seconds: 0 };
          } else if (hours < 8) {
            return { hours: hours + 1, minutes: 0, seconds: 0 };
          } else {
            clearInterval(interval); // Stop at 8 hours (end of shift)
            return prevTime;
          }
        });
      }, 1000); // Update every second
    }

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [checkedIn, checkedOut]);

  // const handleCheckIn = () => {
  // setCheckedIn(true);
  // setCheckedOut(false);
  // setTimeWorked({ hours: 0, minutes: 0, seconds: 0 }); 
  // };

  // const handleCheckOut = () => {
  //   setCheckedOut(true);
  //   setCheckedIn(false);
  // };

  const calculateElapsedTime = (checkInTime, currentTime) => {
    const diff = Math.abs(currentTime - checkInTime);
    const hours = Math.floor(diff / 1000 / 3600);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds };
  };

  // Calculate total time in seconds for the progress bar (max 8 hours * 3600 seconds)
  const totalSecondsWorked = timeWorked.hours * 3600 + timeWorked.minutes * 60 + timeWorked.seconds;
  const maxShiftSeconds = 8 * 3600; // 8-hour shift

  // ===========================================================================

  //  Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));

  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';

  // ===========================================================================
  // ===========================================================================

  // loading state
  const [loading, setLoading] = useState(false);
  const [loadingcheckin, setLoadingcheckin] = useState(false);
  const [loadingcheckout, setLloadingcheckout] = useState(false);
  // ===========================================================================

  // ===========================================================================

  // dashboard  values

  const [checkintime, setCheckintime] = useState('');
  const [checkouttime, setCheckouttime] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [attendanceType, setAttendanceType] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    userCheckInCheckOutCount();
  }, [refreshKey]);

  const userCheckInCheckOutCount = async () => {
    const requestData = {
      emp_id: userempid
    };

    try {
      const response = await fetch('https://office3i.com/development/api/public/api/employeeIndexinouttime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken}`
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const responseData = await response.json();
        // setAnnouncementList(responseData.data);
        console.log("responseData--->", responseData);

        // Assuming responseData.data contains these fields
        setAttendanceType(responseData.attendance_type);
        setCheckintime(responseData.userempcheckintime);
        setCheckouttime(responseData.userempcheckouttime);
        setWorkingHours(responseData.userempchecktotaltime);

      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);

    } finally {
      setLoading(false);
    }
  };

  // ===========================================================================

  // ===========================================================================
  // To Fetch User Device Name
  const browser = detect();

  const getDeviceName = () => {
    if (browser) {
      console.log("browser:", browser)
      return `${browser.name} ${browser.version}`;
    }
    return 'Unknown Device';
  };

  // ===========================================================================

  // ===========================================================================
  //To Fetch Use Ip Address
  const [userIP, setUserIP] = useState('');

  const getUserIP = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return 'Unknown IP';
    }
  };

  useEffect(() => {
    const fetchIP = async () => {
      const ip = await getUserIP();
      setUserIP(ip);
    };

    fetchIP();
  }, []);

  // ===========================================================================

  // ===========================================================================
  // check In

  const handleCheckIn = () => {
    // handleCheckInsingle()
    const checkInTime = new Date();
    localStorage.setItem('checkinTime', checkInTime); // Save check-in time

    setLoadingcheckin(true);

    const checkInData = {
      checkinuserempid: userempid,
      checkinuseripaddress: userIP,
      device: getDeviceName(),
      checking_type: 'Web',
      created_by: userempid,
    };

    fetch('https://office3i.com/development/api/public/api/insertwebcheckin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      },
      body: JSON.stringify(checkInData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Check-in Successful',
            text: data.message,
          });
          setLoadingcheckin(false);
          setCheckedIn(true);
          setCheckedOut(false);
          setTimeWorked({ hours: 0, minutes: 0, seconds: 0 });
          setCheckintime(checkInTime.toLocaleTimeString());
          setRefreshKey((prevKey) => prevKey + 1);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Check-in Failed',
            text: data.message || 'An error occurred. Please try again.',
          });
          setLoadingcheckin(false);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Check-in failed. Please try again.',
        });
        console.error('Error:', error);
        setLoadingcheckin(false);
      });
  };

  // ===========================================================================


  // ===========================================================================
  //Check out

  const handleCheckOut = () => {

    setLloadingcheckout(true);

    const checkOutData = {
      checkinuserempid: userempid,
      updated_by: userempid
    };

    fetch('https://office3i.com/development/api/public/api/insertcheckout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${usertoken}`
      },
      body: JSON.stringify(checkOutData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Check-out Successful',
            text: data.message,
          });
          setRefreshKey(prevKey => prevKey + 1);
          setLloadingcheckout(false);

          setCheckedOut(true);
          setCheckedIn(false);
          setCheckouttime(new Date().toLocaleTimeString());
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Check-out Failed',
            text: data.message || 'An error occurred. Please try again.',
          });
          setLloadingcheckout(false);
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Check-out failed. Please try again.',
        });
        console.error('Error:', error);
        setLloadingcheckout(false);
      });
  };
  // ===========================================================================

  return (
    <div className="checkin-checkout-container">
      <div className="date-section">
        <h4>15 Oct, Tuesday, 2024</h4>
      </div>
      <div className="progress-bar">
        <div className="hours-indicator">
          {timeWorked.hours}hrs {timeWorked.minutes}min {timeWorked.seconds}s
        </div>
        <div className='checkinandcheckout'>
          <p>{checkintime}</p>
          <p>{checkouttime}</p>

        </div>
        <div className="bar">
          <div
            className="filled-bar"
            style={{ width: `${(totalSecondsWorked / maxShiftSeconds) * 100}%` }}
          ></div>
        </div>
        <div className="shift-info">Shift Timing - 9am to 6pm</div>
      </div>
      <div className="button-section">
        <button
          className="checkin-btn"
          onClick={handleCheckIn}
          disabled={attendanceType == '0'}
        >
          {loadingcheckin ? (
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Check-in
            </span>
          ) : (
            'Check-in'
          )}
        </button>
        <button
          className="checkout-btn"
          onClick={handleCheckOut}
          disabled={checkouttime !== '00:00:00'}
        >
          {loadingcheckout ? (
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Check-out
            </span>
          ) : (
            'Check-out'
          )}
        </button>
      </div>
    </div>
  );
}

export default CheckinCheckout;
