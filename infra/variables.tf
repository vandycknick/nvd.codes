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

variable "base_cidr_block" {
  type        = string
  description = "Base VCN CIDR block"
}

variable "pods_cidr_block" {
  type        = string
  description = "Kubernetes Pods CIDR block"
}

variable "services_cidr_block" {
  type        = string
  description = "Kubernetes Services CIDR block"
}

variable "database_ip_safe_list" {
  type    = list(string)
  default = []
}

variable "nvd_codes_blog_public_key" {
  type        = string
  description = "Public key for blog api user"
}
