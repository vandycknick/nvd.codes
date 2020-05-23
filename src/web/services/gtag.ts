/* eslint-disable @typescript-eslint/camelcase */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || ""

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageView = (url: string): void => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  })
}

type EventArgs = {
  action: string
  category: string
  label: string
  value: string
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: EventArgs): void => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}
