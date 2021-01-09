const securityHeaders: Record<string, string> = {
  "Content-Security-Policy": "upgrade-insecure-requests",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Xss-Protection": "1; mode=block",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",

  "Report-To": JSON.stringify({
    group: "default",
    max_age: 10886400,
    endpoints: [{ url: "https://nvdcodes.report-uri.com/a/d/g" }],
    include_subdomains: true,
  }),
}

export const addSecurityHeaders = (response: Response): Response => {
  const headers = new Headers(response.headers)
  if (!headers.get("Content-Type")?.includes("text/html")) {
    return response
  }

  Object.keys(securityHeaders).map((name) => {
    headers.set(name, securityHeaders[name])
  })

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
