import { getShortMonth } from "../utils"

type ParsedTimeFormat = "default" | "slick" | "short"

type TimeProps = {
  dateTime: string | Date
  className?: string
  format?: ParsedTimeFormat
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
  typeof dateTime === "string" ? dateTime : dateTime.toString()

export const Time = ({ dateTime, className, format }: TimeProps) => (
  <time className={className} dateTime={stringify(dateTime)}>
    {parseDate(dateTime, format ?? "default")}
  </time>
)

export default Time
