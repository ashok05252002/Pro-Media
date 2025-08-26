import React, { useEffect, useState } from 'react';

const ShowLanguageAndRegion = () => {
  const timeZones = Intl.supportedValuesOf('timeZone');

  const defaultTimeZone = localStorage.getItem('timezone') || 'UTC';
  const defaultTimeFormat = localStorage.getItem('timeformat') || '12';

  const [timezone, setTimezone] = useState(defaultTimeZone);
  const [timeFormat, setTimeFormat] = useState(defaultTimeFormat);
  const [currentTime, setCurrentTime] = useState(''); // formatted string

  // Helper to format the time
  const getFormattedTime = (date, tz, format) => {
    const hour12 = format === '12';
    const datePart = date.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    const timePart = date.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour12,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    return `${datePart} | Local time: ${timePart}`;
  };

  useEffect(() => {
    // set immediately and update every second
    setCurrentTime(getFormattedTime(new Date(), timezone, timeFormat));
    const timer = setInterval(() => {
      setCurrentTime(getFormattedTime(new Date(), timezone, timeFormat));
    }, 1000);

    return () => clearInterval(timer);
  }, [timezone, timeFormat]);

  const sortedTimeZones = [timezone, ...timeZones.filter(z => z !== timezone)];

  const handleClick = () => {
    localStorage.setItem('timezone', timezone);
    localStorage.setItem('timeformat', timeFormat);
    console.log(`Saved timezone: ${timezone}, timeFormat: ${timeFormat}`);
  };

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">Language & Region</h2>
      <p className="text-gray-500 dark:text-gray-400">Choose your preferred regional settings.</p>
      <div className="mt-4 space-y-4">

        <label htmlFor="timezoneSelect" className="block text-sm font-medium mb-1">Timezone</label>
        <select
          id="timezoneSelect"
          value={timezone}
          onChange={e => setTimezone(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
        >
          {sortedTimeZones.map((zone) => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>

        <label htmlFor="timeFormatSelect" className="block text-sm font-medium mt-4 mb-1">Time Format</label>
        <select
          id="timeFormatSelect"
          value={timeFormat}
          onChange={e => setTimeFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary dark:bg-gray-700"
        >
          <option value="12">12-hrs</option>
          <option value="24">24-hrs</option>
        </select>

        <button
          onClick={handleClick}
          className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-theme-accent hover:bg-opacity-90 text-white rounded-md"
        >
          Change
        </button>

        <div className="mt-4 text-center text-lg font-medium">
          {currentTime}
        </div>
      </div>
    </div>
  );
};

export default ShowLanguageAndRegion;
