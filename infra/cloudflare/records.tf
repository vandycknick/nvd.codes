resource "cloudflare_record" "images_nvd_codes" {
  name    = "images"
  proxied = true
  ttl     = 1
  type    = "A"
  value   = local.load_balancer_ip
  zone_id = data.cloudflare_zones.main.id
}
