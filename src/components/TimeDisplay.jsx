import React from "react";

const TimeDisplay = ({ timestamp }) => {
  if (!timestamp) return null;

  const timezone = localStorage.getItem("timezone") || "UTC";
  const timeFormat = localStorage.getItem("timeformat") || "12";
  const hour12 = timeFormat === "12";

  const date = new Date(timestamp);

  // Date part
  const datePart = date.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Time part
  const timePart = date.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour12: hour12,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return <span>{`${datePart} | Local time: ${timePart}`}</span>;
};

export default TimeDisplay;
