resource "oci_database_autonomous_database" "nvd_codes_blog_db" {
  compartment_id          = oci_identity_compartment.nvd_codes.id
  db_name                 = "nvdcodesdb"
  db_version              = "19c"
  db_workload             = "DW"
  data_storage_size_in_gb = 20
  cpu_core_count          = 1

  is_access_control_enabled = true
  is_auto_scaling_enabled   = false
  is_data_guard_enabled     = false
  is_dedicated              = false
  is_free_tier              = true

  kms_key_id    = "ORACLE_MANAGED_KEY"
  license_model = "LICENSE_INCLUDED"

  whitelisted_ips = concat(["${module.vcn.vcn_id};${module.subnet_addrs.network_cidr_blocks.node_subnet}"], var.database_ip_safe_list)
}
