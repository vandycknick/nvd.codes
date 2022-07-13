terraform {
  backend "s3" {
    bucket = "nvd-codes-terraform"
    key    = "blog.tfstate"
  }
}
