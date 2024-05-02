export function numberToTime(minutes: number): string {
  if (minutes === 0) {
    return "0m";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let timeString = "";

  if (hours > 0) {
    timeString += hours + "h";
  }

  if (remainingMinutes > 0) {
    if (timeString !== "") {
      timeString += " ";
    }
    timeString += remainingMinutes + "m";
  }

  return timeString;
}
