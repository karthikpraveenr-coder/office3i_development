import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, Tooltip, OverlayTrigger, Overlay } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCalendarWeek, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../css/Holidays.css';
import axios from 'axios';

function Holidays() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const usertoken = userData?.token || '';
    const [festivals, setFestivals] = useState([]);
    const [currentFestivalIndex, setCurrentFestivalIndex] = useState(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipTarget, setTooltipTarget] = useState(null);

    useEffect(() => {
        const fetchEmployeeEvents = async () => {
            try {
                const response = await axios.get('https://office3i.com/development/api/public/api/adminIndexTodayCount', {
                    headers: {
                        Authorization: `Bearer ${usertoken}`,
                    },
                });

                // Choose either current_holiday or futured_holiday based on length of current_holiday
                // Combine current_holiday and futured_holiday into a single array
                const holidayList = [
                    ...response.data.holiday_list.current_holiday,
                    ...response.data.holiday_list.futured_holiday,
                ];


                const mappedFestivals = holidayList.map(festival => {
                    const dateParts = festival.h_date.split(' ');
                    let parsedDate = null;
                    if (dateParts.length === 3) {
                        const day = parseInt(dateParts[0], 10);
                        const month = new Date(`${dateParts[1]} 1, ${dateParts[2]}`).getMonth();
                        const year = `20${dateParts[2]}`;
                        parsedDate = new Date(year, month, day);
                    }
                    return {
                        name: festival.h_name,
                        date: festival.h_date,
                        dateObject: parsedDate,
                    };
                });

                setFestivals(mappedFestivals);
                console.log("mappedFestivals",)
            } catch (error) {
                console.error('Error fetching employee events:', error);
            }
        };

        fetchEmployeeEvents();
    }, [usertoken]);

    const handleNext = () => {
        setCurrentFestivalIndex((prevIndex) => (prevIndex + 1) % festivals.length);
    };

    const handlePrev = () => {
        setCurrentFestivalIndex((prevIndex) =>
            prevIndex === 0 ? festivals.length - 1 : prevIndex - 1
        );
    };

    const handleMoreClick = () => {
        setShowCalendar(!showCalendar);
    };

    const handleDateChange = (date, event) => {
        setSelectedDate(date);
        const matchingFestival = festivals.find(
            (festival) =>
                festival.dateObject.getDate() === date.getDate() &&
                festival.dateObject.getMonth() === date.getMonth() &&
                festival.dateObject.getFullYear() === date.getFullYear()
        );
        if (matchingFestival) {
            setCurrentFestivalIndex(festivals.indexOf(matchingFestival));
            setShowTooltip(true);
            setTooltipTarget(event.target); // Set the target for the tooltip
        } else {
            setShowTooltip(false);
        }
    };

    const closeCalendar = () => {
        setShowCalendar(false);
        setShowTooltip(false);
    };

    // Conditional rendering to ensure festivals[currentFestivalIndex] is defined
    if (!festivals || festivals.length === 0) {
        return <p>Loading holidays...</p>;
    }

    const { name, date } = festivals[currentFestivalIndex];

    return (
        <>
            <div className='Holiday__list__container'>
                {!showCalendar && (
                    <span className='Holidays_text__container'>
                        <p className='Holidays_text mb-2'>Holidays</p>
                        <p className='Holidays_more' onClick={handleMoreClick}>
                            <FontAwesomeIcon icon={faCalendarWeek} />
                        </p>
                    </span>
                )}

                <div className='Holidays__container'>
                    {!showCalendar ? (
                        <div className='Holiday__list'>
                            <span className='faAngleLeft' onClick={handlePrev}>
                                <FontAwesomeIcon icon={faAngleLeft} />
                            </span>
                            <div className='Festival__content'>
                                <p className='Festival__name'>{name}</p>
                                <p className='Festival__date'>{date}</p>
                            </div>
                            <span className='faAngleRight' onClick={handleNext}>
                                <FontAwesomeIcon icon={faAngleRight} />
                            </span>
                        </div>
                    ) : (
                        <div className='Calendar__container'>
                            <div className='Calendar__header'>
                                <Button variant="secondary" onClick={closeCalendar} style={{ borderRadius: '50px' }}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </Button>
                            </div>
                            <DatePicker
                                inline
                                selected={selectedDate}
                                onChange={handleDateChange}
                                highlightDates={festivals.map(festival => festival.dateObject)}
                            />

                            {/* Tooltip for clicked holiday date */}
                            {showTooltip && (
                                <Overlay target={tooltipTarget} show={showTooltip} placement="top">
                                    {(props) => (
                                        <Tooltip id="holiday-tooltip" {...props}>
                                            <strong>{name}</strong> - {date}
                                        </Tooltip>
                                    )}
                                </Overlay>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Holidays;
