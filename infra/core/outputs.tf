output "database_wallet_zip" {
  value     = oci_database_autonomous_database_wallet.nvd_codes_blog_db_wallet.content
  sensitive = true
}
