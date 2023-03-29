import React from "react"
import { getShortMonth } from "../utils"
import cx from "classnames"

type TimeProps = {
  dateTime: string | Date
  className?: string
}

const parseDate = (dateTime: string | Date): string => {
  const date = new Date(dateTime)
  return `${date.getDate()} ${getShortMonth(date)} ${date.getFullYear()}`
}

const stringify = (dateTime: string | Date): string =>
  typeof dateTime === "string" ? dateTime : dateTime.toString()

const Time = ({ dateTime, className }: TimeProps) => (
  <time
    className={cx("text-nord-600 dark:text-nord-100", className)}
    dateTime={stringify(dateTime)}
  >
    {parseDate(dateTime)}
  </time>
)

export default Time
