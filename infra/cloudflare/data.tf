data "terraform_remote_state" "core" {
  backend = "remote"

  config = {
    organization = "nvd"
    workspaces = {
      name = "nvd-codes"
    }
  }
}

data "oci_load_balancer_load_balancers" "cluster_lb" {
  compartment_id = vardata.terraform_remote_state.core.outputs.compartment_id
}

data "cloudflare_zones" "main" {
  filter {
    name = "nvd.codes"
  }
}

locals {
  load_balancer_ip = oci_load_balancer_load_balancers.cluster_lb.load_balancers[0].ip_address_details.ip_address
}
