import React from "react";



export default function OpeningHours({ openingHours }) {

    const formatString = (hour, minute) => {

        if (minute < 10) {
            minute = "0" + minute;
        }
        if (hour > 12) {
            
            return `${hour - 12}:${minute} PM`;
        }
        else if (hour === 12) {
            return `${hour}:${minute} PM`;
        }
        else {
            return `${hour}:${minute} AM`;
        }
    }
    const daysOfWeek = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return (
        <div>
        <h3>Opening Hours</h3>
        

        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {daysOfWeek.map((dayName, dayIndex) => {
            const period = openingHours.find(p => p.open.day === dayIndex);

            return (
            <li
                key={dayName}
                style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '4px 0',
                }}
            >
                <strong>{dayName}:</strong>
                <span>
                {period
                    ? `${formatString(period.open.hour, period.open.minute)} – ${formatString(period.close.hour, period.close.minute)}`
                    : 'Closed'}
                </span>
            </li>
            );
        })}
        </ul>



        </div>
    );

}