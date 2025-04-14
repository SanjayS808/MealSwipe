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
    const is24_7 = Array.isArray(openingHours) && openingHours.length === 1 && !openingHours[0]?.close;
    const period = openingHours?.[0];
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
                    {!openingHours ? (
                      'Closed'
                    ) : is24_7 ? (
                      'Open 24/7'
                    ) : period?.close ? (
                      `${formatString(period?.open?.hour ?? 0, period?.open?.minute ?? 0)} – ${formatString(
                        period?.close?.hour ?? 0,
                        period?.close?.minute ?? 0
                      )}`
                    ) : (
                      `${formatString(period?.open?.hour ?? 0, period?.open?.minute ?? 0)} – 24 Hours`
                    )}
                  </span>
                </li>
              );

        })}
        </ul>



        </div>
    );

}