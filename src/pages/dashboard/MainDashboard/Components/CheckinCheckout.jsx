import React, { useState, useEffect } from 'react';
import '../css/CheckinCheckout.css';

function CheckinCheckout() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);
  const [timeWorked, setTimeWorked] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

  const handleCheckIn = () => {
    setCheckedIn(true);
    setCheckedOut(false);
    setTimeWorked({ hours: 0, minutes: 0, seconds: 0 }); // Reset time when checking in
  };

  const handleCheckOut = () => {
    setCheckedOut(true);
    setCheckedIn(false);
  };

  // Calculate total time in seconds for the progress bar (max 8 hours * 3600 seconds)
  const totalSecondsWorked = timeWorked.hours * 3600 + timeWorked.minutes * 60 + timeWorked.seconds;
  const maxShiftSeconds = 8 * 3600; // 8-hour shift

  return (
    <div className="checkin-checkout-container">
      <div className="date-section">
        <h4>15 Oct, Tuesday, 2024</h4>
      </div>
      <div className="progress-bar">
        <div className="hours-indicator">
          {timeWorked.hours}hrs {timeWorked.minutes}min {timeWorked.seconds}s
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
          disabled={checkedIn}
        >
          Check-In
        </button>
        <button
          className="checkout-btn"
          onClick={handleCheckOut}
          disabled={checkedOut}
        >
          Check-Out
        </button>
      </div>
    </div>
  );
}

export default CheckinCheckout;
