export function getCustomDate(days = 0) {
  const today = new Date();
  today.setDate(today.getDate() + days);

  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "short" });
  const formattedDate = `${day} ${month}`;
  return formattedDate;
}

export function getTimeDifference(date: string) {
  const apiDate = new Date(date);
  const currentDate = new Date();
  // Calculate the difference in milliseconds
  const differenceInMillis = currentDate.getTime() - apiDate.getTime();

  const differenceInSeconds = Math.floor(differenceInMillis / 1000);
  const differenceInMinutes = Math.floor(differenceInMillis / (1000 * 60));
  const differenceInHours = Math.floor(differenceInMillis / (1000 * 60 * 60));
  const differenceInDays = Math.floor(
    differenceInMillis / (1000 * 60 * 60 * 24)
  );

  if (differenceInSeconds < 60) {
    return `${differenceInSeconds}s`;
  } else if (differenceInMinutes < 60) {
    return `${differenceInMinutes}m`;
  } else if (differenceInHours < 24) {
    return `${differenceInHours}h`;
  } else {
    return `${differenceInDays}d`;
  }
}
