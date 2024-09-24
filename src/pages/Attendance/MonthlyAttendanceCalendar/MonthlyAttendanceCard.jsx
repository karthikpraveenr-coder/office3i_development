import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './css/calendarstyle.css';
import { Col, Container, Row } from 'react-bootstrap';

function MonthlyAttendanceCard({ events, calendarRef, handleDatesSet }) {


  return (
    <div>
      {/* -------------------------------------------------------------------------------------------------------- */}
      {/* Full Calendar Design */}
      <div className='calendar__container'>
        <FullCalendar
          id="calendar"
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: 'today prev,next',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height={'100vh'}
          events={events}
          views={{
            dayGridMonth: { buttonText: 'Month' },
            timeGridWeek: { buttonText: 'Week' },
            timeGridDay: { buttonText: 'Day' },
          }}
          eventContent={renderEventContent}
          datesSet={handleDatesSet}
          eventClassNames={getEventClassNames}
        />
      </div>
      {/* -------------------------------------------------------------------------------------------------------- */}

      {/* -------------------------------------------------------------------------------------------------------- */}
      {/* Full calendar color details in footer */}
      <div className='Attendance_color__picker mb-5' style={{ padding: '0px 15px', width: '80%' }}>

        <Container>
          <Row>
            <Col xs={6} md={4} lg={2} xl={2}  className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#05637B', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#05637B' }}>Present</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#C0000C', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#C0000C' }}>Leave</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#C20076', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#C20076' }}>Absent</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#6B057B', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#6B057B' }}>Half Day</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#FB5A00', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#FB5A00' }}>Late</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#9BB500 ', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#9BB500' }}>Permission</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#00275C', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#00275C' }}>Over Time</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#028A00', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#028A00' }}>Holiday</span>
            </Col>
            <Col xs={6} md={4} lg={2} xl={2} className="d-flex align-items-center mb-2">
              <div style={{ width: '25px', height: '25px', backgroundColor: '#5E20C8', marginRight: '10px', borderRadius: '5px' }}></div>
              <span style={{ fontWeight: 'bold', color: '#5E20C8' }}>Week Off</span>
            </Col>
          </Row>
        </Container>

      </div>
      {/* -------------------------------------------------------------------------------------------------------- */}

    </div>
  );
}

function renderEventContent(eventInfo) {

  const { title, extendedProps } = eventInfo.event;
  const style = getEventStyle(eventInfo.event);

  return (
    <div className="event-wrapper">


      <div className="event-content" style={style}>
        <div className="event-title">{title}</div>
      </div>

      <div className="event-details">
        {extendedProps.description && (
          <div className="event-description"
            style={{
              color: '#028A00',
              fontSize: '17px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            {extendedProps.description}
          </div>
        )}
        {eventInfo.event.extendedProps.late && (
          <div style={{
            background: '#FB5A00',
            fontSize: '17px',
            fontWeight: 'bold',
            border: '1px solid #FB5A00',
            color: 'white',
            borderLeft: '6px solid #FB5A00',
            textAlign: 'center',
            marginBottom: '3px'
          }}>Late</div>
        )}
        {eventInfo.event.extendedProps.permission && (
          <div style={{
            background: '#9BB500',
            fontSize: '17px',
            fontWeight: 'bold',
            border: '1px solid #9BB500',
            color: 'white',
            borderLeft: '6px solid #9BB500',
            textAlign: 'center',
            marginBottom: '3px'
          }}>Permission</div>
        )}
        {eventInfo.event.extendedProps.HalfDay && (
          <div style={{
            background: '#6B057B',
            fontSize: '17px',
            fontWeight: 'bold',
            border: '1px solid #6B057B',
            color: 'white',
            borderLeft: '6px solid #6B057B',
            textAlign: 'center',
            marginBottom: '3px'
          }}>Half Day</div>
        )}
        {eventInfo.event.extendedProps.Absent && (
          <div style={{
            background: '#FDA8DB',
            fontSize: '17px',
            fontWeight: 'bold',
            border: '1px solid #C20076',
            color: '#C20076',
            borderLeft: '6px solid #C20076',
            textAlign: 'center',
            marginBottom: '3px'
          }}>Absent</div>
        )}
        {eventInfo.event.extendedProps.Leave && (
          <div style={{
            background: '#FFB6BA',
            fontSize: '17px',
            fontWeight: 'bold',
            border: '1px solid #C0000C',
            color: '#C0000C',
            borderLeft: '6px solid #C0000C',
            textAlign: 'center',
            marginBottom: '3px'
          }}>Leave</div>
        )}
        {extendedProps.Intime && (
          <div className="event-detail">In Time - <span>{extendedProps.Intime.split(' ')[1]}</span></div>

        )}
        {extendedProps.Outtime && (
          <div className="event-detail">Out Time - <span>{extendedProps.Outtime.split(' ')[1]}</span></div>

        )}
      </div>

    </div>
  );
}



function getEventClassNames(event) {
  switch (event.title) {
    case 'Week Off':
      return ['week-off'];
    case 'Absent':
      return ['absent'];
    case 'Overtime':
      return ['overtime'];
    case 'In Time':
      return ['in-time'];
    case 'Present':
      return ['present'];
    case 'On Duty':
      return ['on-duty'];
    case 'Holiday':
      return ['holiday'];
    default:
      return ['default'];
  }
}


function getEventStyle(event) {

  switch (event.title) {
    case 'Week Off':
      return {
        background: '#EBDFFF',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #5E20C8',
        color: '#5E20C8',
        borderLeft: '6px solid #5E20C8',
        textAlign: 'center',
      };
    case 'Absent':
      return {
        background: '#00275C',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #00275C',
        color: 'white',
        borderLeft: '6px solid #00275C',
        textAlign: 'center',
        marginBottom: '3px'
      };
    case 'Holiday':
      return {
        background: '#C8FFC7',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #028A00',
        color: '#028A00',
        borderLeft: '6px solid #028A00',
        textAlign: 'center'
      };
    case 'Overtime':
      return {
        background: '#00275C',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #00275C',
        color: 'white',
        borderLeft: '6px solid #00275C',
        textAlign: 'center',
        marginBottom: '3px'
      };
    case 'In Time':
      return {
        background: '#00275C',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #00275C',
        color: 'white',
        borderLeft: '6px solid #00275C',
        textAlign: 'center'
      };
    case 'Present':
      return {
        background: 'white',
        fontSize: '17px',
        fontWeight: 'bold',
        border: '1px solid #05637B',
        color: '#05637B',
        borderLeft: '6px solid #05637B',
        textAlign: 'center',
        marginBottom: '3px'
      };
    case 'Absent':
      return {
        background: 'red',
        color: 'white',
        fontSize: '17px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '5px',
        borderRadius: '4px'
      };
    case 'On Duty':
      return {
        background: 'rgb(245, 124, 0)',
        color: 'white',
        fontSize: '17px',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '5px',
        borderRadius: '4px'
      };
    default:
      return {};
  }
}

export default MonthlyAttendanceCard;
