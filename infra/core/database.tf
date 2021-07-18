resource "oci_database_autonomous_database" "nvd_codes_blog_db" {
  compartment_id           = oci_identity_compartment.nvd_codes.id
  db_name                  = "nvdcodesdb"
  display_name             = "nvdcodesdb20210714235108"
  db_version               = "19c"
  db_workload              = "DW"
  cpu_core_count           = 1
  data_storage_size_in_gb  = 20
  data_storage_size_in_tbs = 1

  admin_password = var.database_admin_password

  is_auto_scaling_enabled = false
  is_data_guard_enabled   = false
  is_dedicated            = false
  is_free_tier            = true

  license_model = "LICENSE_INCLUDED"

  whitelisted_ips = concat(["${module.vcn.vcn_id};${module.subnet_addrs.network_cidr_blocks.node_subnet}"], var.database_ip_safe_list)
}

resource "oci_database_autonomous_database_wallet" "nvd_codes_blog_db_wallet" {
  autonomous_database_id = oci_database_autonomous_database.nvd_codes_blog_db.id
  password               = var.database_wallet_password

  base64_encode_content = true
  generate_type         = "SINGLE"
}
