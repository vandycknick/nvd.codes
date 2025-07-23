data "cloudflare_zones" "sh" {
  name = var.domain_name
}

locals {
  zone_id = data.cloudflare_zones.sh.result[0].id
}

resource "cloudflare_dns_record" "website_sh_root" {
  zone_id = local.zone_id
  name    = var.domain_name
  content = aws_cloudfront_distribution.website_sh.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "website_sh_www" {
  zone_id = local.zone_id
  name    = "www.${var.domain_name}"
  content = aws_cloudfront_distribution.website_sh.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "acm_sh_verify" {
  for_each = {
    for dvo in aws_acm_certificate.cert_sh.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = local.zone_id
  name    = each.value.name
  content = each.value.record
  type    = each.value.type
  proxied = false
  ttl     = 60
}
