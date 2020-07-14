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

const getMonthPrefix = (date: Date): string => months[date.getMonth()]

export { getMonthPrefix }
