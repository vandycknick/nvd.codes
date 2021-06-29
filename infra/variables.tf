variable "tenancy_ocid" {
  type        = string
  description = "OCID of your tenancy."
}

variable "user_ocid" {
  type        = string
  description = "OCID of the user executing the plan."
}

variable "private_key" {
  type        = string
  description = "Contents of the private key."
  sensitive   = true
}

variable "fingerprint" {
  type        = string
  description = " Fingerprint for the key pair being used."
}

variable "region" {
  type        = string
  description = "OCI Region"
  default     = "eu-amsterdam-1"
}

# ocid1.tenancy.oc1..aaaaaaaa2c2ovde3376dys5fiffoj23scnms2ch6ek6hlyitmahlmn2lvwbq
