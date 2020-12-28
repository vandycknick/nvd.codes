/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
  (...args: any[]): void

  error(...args: any[]): void

  warn(...args: any[]): void

  info(...args: any[]): void

  verbose(...args: any[]): void
}
