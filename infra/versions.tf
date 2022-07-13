terraform {
  required_version = "~> 1.2"

  required_providers {
    aws = {
      version = "~> 4.0"
      source  = "hashicorp/aws"
    }

    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 3.0"
    }

    random = {
      source  = "hashicorp/random"
      version = "~> 3.3"
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

