resource "cloudflare_record" "nvd_codes" {
  name    = "nvd.codes"
  proxied = true
  ttl     = 1
  type    = "A"
  value   = local.load_balancer_ip
  zone_id = local.zone_id
}

resource "cloudflare_record" "api_nvd_codes" {
  name    = "api"
  proxied = true
  ttl     = 1
  type    = "A"
  value   = local.load_balancer_ip
  zone_id = local.zone_id
}

resource "cloudflare_record" "images_nvd_codes" {
  name    = "images"
  proxied = true
  ttl     = 1
  type    = "A"
  value   = local.load_balancer_ip
  zone_id = local.zone_id
}
