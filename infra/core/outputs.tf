output "compartment_id" {
  value = oci_identity_compartment.nvd_codes.id
}

output "database_wallet_zip" {
  value     = oci_database_autonomous_database_wallet.nvd_codes_blog_db_wallet.content
  sensitive = true
}
