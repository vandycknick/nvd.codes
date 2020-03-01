import React from "react"

type TimeProps = {
  dateTime: string
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

const parseDate = (dateString: string): string => {
  const date = new Date(dateString)
  const month = months[date.getMonth()]
  return `${month} ${date.getDate()}, ${date.getFullYear()}`
}

const Time: React.FC<TimeProps> = ({ dateTime }) => (
  <time dateTime={dateTime}>{parseDate(dateTime)}</time>
)

export default Time
