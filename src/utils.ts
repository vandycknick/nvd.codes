export const noop = () => {}

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
  "Dec",
]

export const getShortMonth = (date: Date): string => months[date.getMonth()]

export const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max)
