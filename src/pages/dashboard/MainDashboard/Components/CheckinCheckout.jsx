import React, { useState, useEffect } from 'react';
import '../css/CheckinCheckout.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { detect } from 'detect-browser';

function CheckinCheckout() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [timeWorked, setTimeWorked] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const [loading, setLoading] = useState(false);
  const [loadingcheckin, setLoadingcheckin] = useState(false);
  const [loadingcheckout, setLloadingcheckout] = useState(false);

  const [checkintime, setCheckintime] = useState('');
  const [checkouttime, setCheckouttime] = useState('');
  const [workingHours, setWorkingHours] = useState('');
  const [attendanceType, setAttendanceType] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  // Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';
  const userrole = userData?.userrole || '';

  // Max shift time set to 12 hours for the progress bar
  const maxShiftSeconds = 12 * 3600; // 12-hour shift

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

  // To fetch User Device Name
  const browser = detect();

  const getDeviceName = () => {
    if (browser) {
      return `${browser.name} ${browser.version}`;
    }
    return 'Unknown Device';
  };

  // To fetch User IP Address
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

  // Check In Handler
  const handleCheckIn = () => {
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

  // Check Out Handler
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

  // Timer and Progress Bar Updates
  useEffect(() => {
    let interval;

    if (checkedIn && !checkedOut) {
      interval = setInterval(() => {
        setTimeWorked(prevTime => {
          const { hours, minutes, seconds } = prevTime;

          if (seconds < 59) {
            return { ...prevTime, seconds: seconds + 1 };
          } else if (minutes < 59) {
            return { hours, minutes: minutes + 1, seconds: 0 };
          } else if (hours < 12) {
            return { hours: hours + 1, minutes: 0, seconds: 0 };
          } else {
            clearInterval(interval); // Stop at 12 hours (end of shift)
            return prevTime;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [checkedIn, checkedOut]);

  const totalSecondsWorked = timeWorked.hours * 3600 + timeWorked.minutes * 60 + timeWorked.seconds;


  // ----------------------------------------------------------------------------------------------
  const currentDate = new Date();

  // Extract the required components
  const day = currentDate.getDate(); // Get the day of the month
  const month = currentDate.toLocaleString("en-US", { month: "short" }); // Get short month (e.g., "Nov")
  const dayName = currentDate.toLocaleString("en-US", { weekday: "long" }); // Get full day name (e.g., "Wednesday")
  const year = currentDate.getFullYear(); // Get the year


  return (
    <div className="checkin-checkout-container">
      <div className="date-section">
        <h5> {day} {month}, {dayName}, {year}</h5>
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
        <div className="shift-info">Shift Timing - 9am to 9pm</div>
      </div>
      <div className="button-section">
        <button
          className="checkin-btn"
          onClick={handleCheckIn}
          disabled={attendanceType === '0'}
        >
          {loadingcheckin ? (
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <i className="fa fa-circle-notch fa-spin" style={{ fontSize: '16px' }}></i> Check In
            </span>
          ) : (
            'Check In'
          )}
        </button>
        <button
          className="checkout-btn"
          onClick={handleCheckOut}
          disabled={!checkedIn || checkedOut || loadingcheckout}
        >
          {loadingcheckout ? (
            <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <i className="fa fa-circle-notch fa-spin" style={{ fontSize: '16px' }}></i> Check Out
            </span>
          ) : (
            'Check Out'
          )}
        </button>
      </div>
    </div>
  );
}

export default CheckinCheckout;
