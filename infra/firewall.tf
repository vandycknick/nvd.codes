# resource "cloudflare_rule" "allow_specific_ip_for_subdomain" {
#   count       = var.allowed_ip != "" ? 1 : 0
#   zone_id     = data.cloudflare_zone.sh.id
#   description = "Only allow access from trusted ips."
#   enabled     = true
#   action      = "block" # block by default, then override with allow
#
#   filter {
#     expression = <<EOT
#     (http.host in {"${var.cloudflare_zone}" "www.${var.cloudflare_zone}"} and not ip.src in {${var.allowed_ip}})
#     EOT
#   }
# }
