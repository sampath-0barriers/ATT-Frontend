export default function formatTimestamp(isoString) {
  const date = new Date(isoString);

  // Convert the date to the local timezone using `toLocaleString`
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // Keeps hours in 24-hour format
  };

  // Use `toLocaleString` without specifying a timeZone to get local time
  const formattedDate = date.toLocaleString('en-US', options);

  // The result will be in the format MM/DD/YY, HH:MM
  return formattedDate.replace(',', '');
}