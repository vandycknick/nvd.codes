variable "zone" {
  type        = string
  description = "The root CF zone that holds all dns records."
}

variable "domain_name" {
  type        = string
  description = "The root domain name of the website."
}

variable "alternative_names" {
  type        = list(string)
  description = "Any alternative names that should route through cloudfront and be added to the certificate."
}

# variable "allowed_ip" {
#   description = "The IP address allowed to access the app"
#   type        = string
#   sensitive   = true
#   default     = ""
# }
