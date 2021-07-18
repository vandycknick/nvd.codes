terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 2.0"
    }
  }
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "nvd"

    workspaces {
      name = "nvd-codes-cloudflare"
    }
  }
}
