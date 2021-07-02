resource "oci_artifacts_container_repository" "test_container_repository" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  display_name   = "nvd-codes-repo"

  is_immutable = false
  is_public    = false
}
