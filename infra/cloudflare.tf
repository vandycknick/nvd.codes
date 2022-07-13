data "cloudflare_zones" "main" {
  filter {
    name = "nvd.codes"
  }
}

locals {
  zone_id = data.cloudflare_zones.main.zones[0].id
}

resource "cloudflare_record" "acm_verify" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = local.zone_id
  name    = each.value.name
  value   = each.value.record
  type    = each.value.type
  ttl     = 60
}

resource "cloudflare_record" "root" {
  zone_id = local.zone_id
  name    = "nvd.codes"
  value   = aws_cloudfront_distribution.s3_distribution.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
