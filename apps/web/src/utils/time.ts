const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dev",
]

const getShortMonth = (date: Date): string => months[date.getMonth()]

export { getShortMonth }
