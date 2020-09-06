import React from "react"
import { getShortMonth } from "utils/time"

type TimeProps = {
  dateTime: string | Date
}

const parseDate = (dateTime: string | Date): string => {
  const date = new Date(dateTime)
  return `${date.getDate()} ${getShortMonth(date)} ${date.getFullYear()}`
}

const stringify = (dateTime: string | Date): string =>
  typeof dateTime === "string" ? dateTime : dateTime.toString()

const Time: React.FC<TimeProps> = ({ dateTime }) => (
  <time dateTime={stringify(dateTime)}>{parseDate(dateTime)}</time>
)

export default Time
