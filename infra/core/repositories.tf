resource "oci_artifacts_container_repository" "nvd_codes_api" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  display_name   = "nvd-codes/api"

  is_immutable = false
  is_public    = false
}

resource "oci_artifacts_container_repository" "nvd_codes_blog" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  display_name   = "nvd-codes/blog"

  is_immutable = false
  is_public    = false
}

resource "oci_artifacts_container_repository" "nvd_codes_images" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  display_name   = "nvd-codes/images"

  is_immutable = false
  is_public    = false
}

resource "oci_artifacts_container_repository" "nvd_codes_web" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  display_name   = "nvd-codes/web"

  is_immutable = false
  is_public    = false
}
