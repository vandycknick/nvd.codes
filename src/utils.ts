import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function formatDate(date: Date) {
  return Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date)
}
