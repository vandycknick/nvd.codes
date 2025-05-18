terraform {
  required_version = "~> 1.11"

  required_providers {
    aws = {
      version = "~> 5.97"
      source  = "hashicorp/aws"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.7"
    }
  }
}

provider "aws" {
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

provider "cloudflare" {
}

provider "random" {
}

