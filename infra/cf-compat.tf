data "cloudflare_zones" "main" {
  name = "nvd.codes"
}

resource "cloudflare_dns_record" "root" {
  count = var.cf_compat == true ? 1 : 0

  zone_id = data.cloudflare_zones.main.result[0].id
  name    = "nvd.codes"
  content = aws_cloudfront_distribution.website_sh.domain_name
  type    = "CNAME"
  proxied = true
  ttl     = 1
}
