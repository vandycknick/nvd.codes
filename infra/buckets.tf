data "oci_objectstorage_namespace" "ns" {
  compartment_id = oci_identity_compartment.nvd_codes.id
}

resource "oci_objectstorage_bucket" "nvd_codes_images_bucket" {
  compartment_id        = oci_identity_compartment.nvd_codes.id
  namespace             = data.oci_objectstorage_namespace.ns.namespace
  name                  = "nvd-codes-images-20210715-1645"
  access_type           = "NoPublicAccess"
  auto_tiering          = "Disabled"
  object_events_enabled = "false"
  storage_tier          = "Standard"
  versioning            = "Disabled"
}
