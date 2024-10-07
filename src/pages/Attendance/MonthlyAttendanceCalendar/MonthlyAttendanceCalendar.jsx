import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MonthlyAttendanceCount from './MonthlyAttendanceCount';
import MonthlyAttendanceCard from './MonthlyAttendanceCard';

function MonthlyAttendanceCalendar() { 

  // ----------------------------------------------------------------------------------------------------------
  // To get the Id and Name from URL

  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('name');
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // Retrieve userData from local storage
  const userData = JSON.parse(localStorage.getItem('userData'));
  const usertoken = userData?.token || '';
  const userempid = userData?.userempid || '';

  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------
  // Calendar data store
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `https://office3i.com/user/api/public/api/view_calendarAttendancelist`,
          { empid: id || userempid },
          {
            headers: {
              Authorization: `Bearer ${usertoken}`,
            },
          }
        );

        const { attendance_data, holiday_data, weekoff_data, ot_data } = response.data;

        // Transforming API response data into FullCalendar events format
        const transformedEvents = attendance_data.map(event => {
          const start = event.checkin_time ? event.checkin_time.split(' ')[0] : null;
          const end = event.checkout_time ? event.checkout_time.split(' ')[0] : null;

          return {
            title: event.emp_present === 'P' ? 'Present' : '',
            start: start,
            end: end,
            late: event.emp_late === 'LA',
            permission: event.emp_permission === 'PR',
            HalfDay: event.emp_present === 'HL',
            Absent: event.emp_present === 'A',
            Leave: event.emp_present === 'L',
            Onduty: event.emp_onduty !== '-',
            Intime: event.checkin_time || null,
            Outtime: event.checkout_time || null,
          };
        });

        const holidayEvents = holiday_data.map(event => ({
          // title: event.h_name,
          title: 'Holiday',
          start: event.h_date,
          end: event.h_date,
          className: 'publicholidayevent',
          description: event.h_name,
        }));

        // Log holidayEvents to verify description is set
        console.log('Holiday Events:', holidayEvents);


        const weekOffEvents = weekoff_data.map(date => ({
          title: 'Week Off',
          start: date,
          end: date,
          className: 'week-off-event',
        }));

        const otEvents = ot_data.map(date => ({
          title: 'Overtime',
          start: date,
          end: date,
          className: 'overtime-event',
        }));

        const allEvents = [
          ...transformedEvents,
          ...holidayEvents,
          ...weekOffEvents,
          ...otEvents,
        ];

        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchData();
  }, [id, usertoken]);
  // ----------------------------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------------------------


  // ----------------------------------------------------------------------------------------------------------
  // Full calendar fetch month Dynamically
  const [centerDate, setCenterDate] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      setCenterDate(calendarApi.getDate());
    }
  }, []);

  const handleDatesSet = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const newCenterDate = calendarApi.getDate();
      setCenterDate(newCenterDate);
    }
  };

  const formattedCenterDate = centerDate.toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });

  // ----------------------------------------------------------------------------------------------------------


  return (
    <>
      <MonthlyAttendanceCount events={events} formattedCenterDate={formattedCenterDate} username={username} />
      <MonthlyAttendanceCard events={events} handleDatesSet={handleDatesSet} calendarRef={calendarRef} />
    </>
  );
}

export default MonthlyAttendanceCalendar;
