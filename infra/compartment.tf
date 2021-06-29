resource "oci_identity_compartment" "nvd_codes" {
  compartment_id = var.tenancy_ocid
  description    = "Compartment for Terraform resources."
  name           = "nvd-codes"
}
