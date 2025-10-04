import React, { useEffect, useState } from 'react';

const Time = () => {
    const [formattedTime, setFormattedTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'P.M.' : 'A.M.';
            hours = hours % 12 || 12;

            const month = now.toLocaleString('en-US', { month: 'long' });
            const day = now.getDate();
            const year = now.getFullYear();
            const weekday = now.toLocaleString('en-US', { weekday: 'long' });

            setFormattedTime(`${hours}:${minutes} ${ampm} ${month} ${day}, ${year} - ${weekday}`);
        };

        updateTime(); // Initial render

        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        let intervalId: NodeJS.Timeout;

        const timeoutId = setTimeout(() => {
            updateTime();
            intervalId = setInterval(updateTime, 60000);
        }, msUntilNextMinute);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };

    }, []);

    return (
        <div>
            <p className="font-xs md:font-sm tracking-wide text-gray-400">{formattedTime}</p>
        </div>
    );
};

export default Time;
