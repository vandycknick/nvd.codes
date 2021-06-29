terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "nvd"

    workspaces {
      name = "nvd-codes"
    }
  }
}
