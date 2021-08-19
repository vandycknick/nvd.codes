resource "oci_identity_user" "nvd_codes_blog" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  name           = "nvd-codes-blog"
  description    = "User used to authenticate blog-api with OCI"
}

resource "oci_identity_user_capabilities_management" "nvd_codes_blog_capabilities" {
  user_id = oci_identity_user.nvd_codes_blog.id

  can_use_api_keys             = "true"
  can_use_auth_tokens          = "false"
  can_use_console_password     = "false"
  can_use_customer_secret_keys = "false"
  can_use_smtp_credentials     = "false"
}

resource "oci_identity_api_key" "nvd_codes_blog_key" {
  user_id   = oci_identity_user.nvd_codes_blog.id
  key_value = var.nvd_codes_blog_public_key
}

resource "oci_identity_group" "nvd_codes_bucket_wrangler" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  name           = "nvd-codes-bucket-wrangler"
  description    = "Group to manage and read buckets and objects."
}

resource "oci_identity_user_group_membership" "nvd_codes_blog_bucket_wrangler_membership" {
  group_id = oci_identity_group.nvd_codes_bucket_wrangler.id
  user_id  = oci_identity_user.nvd_codes_blog.id
}

resource "oci_identity_policy" "nvd_codes_bucket_wrangler_policy" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  name           = "nvd-codes-bucket-wrangler"
  description    = "Gives access to nvd-codes-bucket-wrangler to manage and read buckets and objects."

  statements = [
    "Allow group nvd-codes-bucket-wrangler to read buckets in compartment nvd-codes",
    "Allow group nvd-codes-bucket-wrangler to read objects in compartment nvd-codes",
    // https://docs.oracle.com/en-us/iaas/Content/Identity/Reference/objectstoragepolicyreference.htm#Details_for_Object_Storage_Archive_Storage_and_Data_Transfer
    "Allow group nvd-codes-bucket-wrangler to manage objects in compartment nvd-codes where any {request.permission='OBJECT_CREATE', request.permission='OBJECT_INSPECT', request.permission='OBJECT_OVERWRITE'}"
  ]

  depends_on = [
    oci_identity_group.nvd_codes_bucket_wrangler
  ]
}
