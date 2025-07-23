resource "aws_s3_bucket" "website_sh" {
  bucket = var.domain_name

  tags = {
    app         = "website"
    environment = terraform.workspace
  }
}

resource "aws_s3_bucket_ownership_controls" "website_sh" {
  bucket = aws_s3_bucket.website_sh.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "website_sh" {
  bucket                  = aws_s3_bucket.website_sh.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "website_sh" {
  bucket = aws_s3_bucket.website_sh.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_control" "website_sh" {
  name                              = "oac-${replace(var.domain_name, ".", "-")}"
  description                       = "OAC for ${aws_s3_bucket.website_sh.bucket}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always" # always sign origin requests
  signing_protocol                  = "sigv4"  # required for S3
}

resource "aws_acm_certificate" "cert_sh" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = var.alternative_names

  provider = aws.us_east_1

  lifecycle {
    create_before_destroy = true
  }

  tags = {
    app         = "website"
    environment = terraform.workspace
  }
}

resource "aws_cloudfront_response_headers_policy" "security_headers_policy" {
  name = "security-headers-policy-${terraform.workspace}"

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
  name        = "default-cache-policy-${terraform.workspace}"
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

resource "aws_cloudfront_cache_policy" "astro_cache_policy" {
  name        = "astro-cache-policy-${terraform.workspace}"
  comment     = "Cache policy for files in _astro folder"
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

resource "aws_cloudfront_function" "website_sh_dir_indexes" {
  name    = "dir-indexes-${terraform.workspace}"
  runtime = "cloudfront-js-2.0"
  comment = "Append index.html for directory-style URLs"
  publish = true
  code    = <<-EOF
  function handler(event) {
    var request = event.request;
    var uri = request.uri;
    if (uri.endsWith('/')) {
      request.uri += 'index.html';
    } else if (uri.indexOf('.') === -1) {
      request.uri += '/index.html';
    }
    return request;
  }
EOF
}

resource "aws_cloudfront_distribution" "website_sh" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  aliases             = concat([var.domain_name], var.alternative_names)
  http_version        = "http2and3"

  origin {
    domain_name              = aws_s3_bucket.website_sh.bucket_regional_domain_name
    origin_id                = aws_s3_bucket.website_sh.id
    origin_access_control_id = aws_cloudfront_origin_access_control.website_sh.id
  }

  ordered_cache_behavior {
    target_origin_id = aws_s3_bucket.website_sh.id
    path_pattern     = "/_astro/*"

    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    cache_policy_id        = aws_cloudfront_cache_policy.astro_cache_policy.id
    viewer_protocol_policy = "redirect-to-https"
  }

  default_cache_behavior {
    target_origin_id = aws_s3_bucket.website_sh.id
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]

    cache_policy_id            = aws_cloudfront_cache_policy.default_cache_policy.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers_policy.id

    viewer_protocol_policy = "redirect-to-https"

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.website_sh_dir_indexes.arn
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.cert_sh.arn
    minimum_protocol_version = "TLSv1.2_2021" # https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/secure-connections-supported-viewer-protocols-ciphers.html
    ssl_support_method       = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  lifecycle {
    ignore_changes = [
      origin
    ]
  }

  tags = {
    app         = "website"
    environment = terraform.workspace
  }
}

data "aws_iam_policy_document" "website_sh_allow_cloudfront" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = [
      aws_s3_bucket.website_sh.arn,
      "${aws_s3_bucket.website_sh.arn}/*"
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.website_sh.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "website_sh" {
  bucket = aws_s3_bucket.website_sh.id
  policy = data.aws_iam_policy_document.website_sh_allow_cloudfront.json
}
