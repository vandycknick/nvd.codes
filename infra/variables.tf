variable "domain_name" {
  type        = string
  default     = "nvd.sh"
  description = "The root domain name of the website."
}

variable "alternative_names" {
  type        = list(string)
  default     = ["www.nvd.sh"]
  description = "Any alternative names that should route through cloudfront and be added to the certificate."
}

variable "cf_compat" {
  type        = bool
  default     = true
  description = "Used to migrate from nvd.codes to nvd.sh."
}
