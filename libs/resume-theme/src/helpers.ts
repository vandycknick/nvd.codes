// Months names
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Exports
export const prettyDate = (dateString: string) => {
  if (!dateString) return dateString

  const date = new Date(dateString)
  return `${months[date.getMonth()]} ${date.getFullYear()}`
}
