export function getCustomDate(days = 0) {
  const today = new Date();
  today.setDate(today.getDate() + days);

  const day = today.getDate();
  const month = today.toLocaleString("en-US", { month: "long" });
  const formattedDate = `${day} ${month}`;
  console.log(formattedDate);
  return formattedDate;
}
