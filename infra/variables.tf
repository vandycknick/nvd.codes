variable "password_enabled" {
  type    = bool
  default = false
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudlfare account id"
}

variable "domain_name" {
  type    = string
  default = "nvd.codes"
}

vairable "alternative_names" {
  type    = list(string)
  default = ["www.nvd.codes"]
}
