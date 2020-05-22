import React from "react"

type TimeProps = {
  dateTime: string | Date
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dev",
]

const parseDate = (dateTime: string | Date): string => {
  const date = new Date(dateTime)
  const month = months[date.getMonth()]
  return `${date.getDate()} ${month} ${date.getFullYear()}`
}

const stringify = (dateTime: string | Date): string =>
  typeof dateTime === "string" ? dateTime : dateTime.toString()

const Time: React.FC<TimeProps> = ({ dateTime }) => (
  <time dateTime={stringify(dateTime)}>{parseDate(dateTime)}</time>
)

export default Time
