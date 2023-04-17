import { getShortMonth } from "../utils"

type ParsedTimeFormat = "default" | "slick" | "short"

type TimeProps = {
  dateTime: string | Date
  className?: string
  format?: ParsedTimeFormat
  label?: string
}

const parseDate = (
  dateTime: string | Date,
  format: ParsedTimeFormat,
): string => {
  const date = new Date(dateTime)

  switch (format) {
    case "default":
      return `${date.getDate()} ${getShortMonth(date)} ${date.getFullYear()}`
    case "slick":
      return `${getShortMonth(date)} ${date.getDate()}, ${date.getFullYear()}`
    case "short":
      return `${getShortMonth(date)} ${date.getFullYear()}`
  }
}

const stringify = (dateTime: string | Date): string =>
  typeof dateTime === "string" ? dateTime : dateTime.toISOString()

export const Time = ({ dateTime, className, format, label }: TimeProps) => (
  <time className={className} dateTime={stringify(dateTime)}>
    {label ? label : parseDate(dateTime, format ?? "default")}
  </time>
)

export default Time
