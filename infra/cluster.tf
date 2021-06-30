data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

resource "oci_containerengine_cluster" "nvd_codes_cluster" {
  compartment_id     = oci_identity_compartment.nvd_codes.id
  kubernetes_version = "v1.19.7"
  name               = "nvd-codes-cluster"
  vcn_id             = module.vcn.vcn_id

  options {
    add_ons {
      is_kubernetes_dashboard_enabled = false
      is_tiller_enabled               = false
    }
    kubernetes_network_config {
      pods_cidr     = var.pods_cidr_block
      services_cidr = var.services_cidr_block
    }
    service_lb_subnet_ids = [oci_core_subnet.nvd_codes_public_subnet_a.id]
  }
}

resource "oci_containerengine_node_pool" "nvd_codes_pool_1" {
  cluster_id         = oci_containerengine_cluster.nvd_codes_cluster.id
  compartment_id     = oci_identity_compartment.nvd_codes.id
  kubernetes_version = "v1.19.7"
  name               = "nvd-codes-pool-1"
  node_config_details {
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
      subnet_id           = oci_core_subnet.nvd_codes_private_subnet_a.id
    }
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[1].name
      subnet_id           = oci_core_subnet.nvd_codes_private_subnet_a.id
    }
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[2].name
      subnet_id           = oci_core_subnet.nvd_codes_private_subnet_a.id
    }
    size = 3
  }
  node_shape = "VM.Standard.E2.1.Micro"

  node_source_details {
    image_id    = "Oracle-Linux-8.4-2021.06.20-0"
    source_type = "image"
  }

  initial_node_labels {
    key   = "name"
    value = "pool1"
  }
}
