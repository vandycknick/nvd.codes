resource "aws_s3_bucket" "website" {
  bucket = "nvd.codes"

  tags = {
    Name = "Blog"
  }
}

resource "aws_s3_bucket_acl" "website_acl" {
  bucket = aws_s3_bucket.website.id
  acl    = "private"
}

resource "aws_s3_bucket_website_configuration" "website_config" {
  bucket = aws_s3_bucket.website.id
  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "404.html"
  }
}

resource "random_password" "referer" {
  count = var.password_enabled ? 1 : 0

  length  = 32
  special = false
}

# resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
#   comment = "nvd.codes Cloudfront origin access identity"
# }

data "aws_iam_policy_document" "s3_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.website.arn}/*"]

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    dynamic "condition" {
      for_each = [for r in random_password.referer : r.result]

      content {
        test     = "StringEquals"
        variable = "aws:referer"
        values   = [condition.value]
      }
    }
  }
}

resource "aws_s3_bucket_policy" "website_s3_policy" {
  bucket = aws_s3_bucket.website.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

resource "aws_s3_bucket_public_access_block" "website_access" {
  bucket = aws_s3_bucket.website.id
}

# Certs for cloudfront have to be created in us-east-1
resource "aws_acm_certificate" "cert" {
  domain_name               = "nvd.codes"
  validation_method         = "DNS"
  subject_alternative_names = ["www.nvd.codes"]

  provider = aws.us_east_1

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudfront_response_headers_policy" "security_headers_policy" {
  name = "security_headers_policy"

  security_headers_config {
    content_type_options {
      override = true
    }

    frame_options {
      frame_option = "DENY"
      override     = true
    }

    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      override                   = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
  }

  custom_headers_config {
    items {
      header   = "x-powered-by"
      value    = "Passion and tiny cute kittens"
      override = true
    }

    items {
      header   = "x-nananana"
      value    = "Batcache"
      override = true
    }
  }
}

resource "aws_cloudfront_cache_policy" "default_cache_policy" {
  name        = "default_cache_policy"
  comment     = "default cache policy"
  default_ttl = 60
  min_ttl     = 1
  max_ttl     = 120

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

resource "aws_cloudfront_cache_policy" "nextjs_cache_policy" {
  name        = "nextjs_cache_policy"
  comment     = "Cache policy for files in _next folder"
  default_ttl = 3794400
  min_ttl     = 1
  max_ttl     = 31536000

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
  }
}

locals {
  s3_website_origin_id = "nvd.codes"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.website_config.website_endpoint
    origin_id   = local.s3_website_origin_id

    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    dynamic "custom_header" {
      for_each = [for referrer in random_password.referer : { "name" : "referer", "value" : referrer.result }]

      content {
        name  = custom_header.value["name"]
        value = custom_header.value["value"]
      }
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = ["nvd.codes", "www.nvd.codes"]

  ordered_cache_behavior {
    target_origin_id = local.s3_website_origin_id
    path_pattern     = "/_next/*"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id        = aws_cloudfront_cache_policy.nextjs_cache_policy.id
    viewer_protocol_policy = "redirect-to-https"
  }

  default_cache_behavior {
    target_origin_id = local.s3_website_origin_id
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]

    cache_policy_id            = aws_cloudfront_cache_policy.default_cache_policy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers_policy.id

    viewer_protocol_policy = "redirect-to-https"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert.arn
    minimum_protocol_version = "TLSv1.2_2021" # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html
    ssl_support_method       = "sni-only"
  }
}
