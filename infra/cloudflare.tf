data "cloudflare_zones" "main" {
  name = "nvd.codes"
}

locals {
  zone_id = data.cloudflare_zones.main.result[0].id
}

resource "cloudflare_dns_record" "acm_verify" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
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

resource "cloudflare_dns_record" "root" {
  zone_id = local.zone_id
  name    = "nvd.codes"
  content = aws_cloudfront_distribution.s3_distribution.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
