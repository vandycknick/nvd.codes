data "oci_identity_availability_domains" "ads" {
  compartment_id = var.tenancy_ocid
}

resource "oci_containerengine_cluster" "nvd_codes_cluster" {
  compartment_id     = oci_identity_compartment.nvd_codes.id
  kubernetes_version = "v1.20.11"
  name               = "nvd-codes-cluster"
  vcn_id             = module.vcn.vcn_id

  endpoint_config {
    is_public_ip_enabled = "true"
    subnet_id            = oci_core_subnet.kubernetes_api_endpoint_subnet.id
  }

  options {
    add_ons {
      is_kubernetes_dashboard_enabled = false
      is_tiller_enabled               = false
    }
    kubernetes_network_config {
      pods_cidr     = var.pods_cidr_block
      services_cidr = var.services_cidr_block
    }
    service_lb_subnet_ids = [oci_core_subnet.service_lb_subnet.id]
  }
}

resource "oci_containerengine_node_pool" "nvd_codes_pool_1" {
  count              = 0
  cluster_id         = oci_containerengine_cluster.nvd_codes_cluster.id
  compartment_id     = oci_identity_compartment.nvd_codes.id
  kubernetes_version = "v1.20.8"
  name               = "nvd-codes-pool-1"
  node_config_details {
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
      subnet_id           = oci_core_subnet.node_subnet.id
    }
    size = 3
  }
  node_shape = "VM.Standard.A1.Flex"

  node_shape_config {
    memory_in_gbs = 6
    ocpus         = 1
  }

  node_source_details {
    # https://docs.oracle.com/en-us/iaas/images/image/f3727add-b1a2-47d8-8064-a1a9741096a0/
    image_id    = "ocid1.image.oc1.eu-amsterdam-1.aaaaaaaay4mtwt7fafcm7bdmxweoldowmwyudbbnfjqtvnfvy4wiewsfvueq"
    source_type = "image"
  }

  initial_node_labels {
    key   = "name"
    value = "pool1"
  }
}

resource "oci_containerengine_node_pool" "nvd_codes_pool_2" {
  count              = 1
  cluster_id         = oci_containerengine_cluster.nvd_codes_cluster.id
  compartment_id     = oci_identity_compartment.nvd_codes.id
  kubernetes_version = "v1.20.8"
  name               = "nvd-codes-pool-2"
  node_config_details {
    placement_configs {
      availability_domain = data.oci_identity_availability_domains.ads.availability_domains[0].name
      subnet_id           = oci_core_subnet.node_subnet.id
    }
    size = 3
  }
  node_shape = "VM.Standard.A1.Flex"

  node_shape_config {
    memory_in_gbs = 6
    ocpus         = 1
  }

  node_source_details {
    # https://docs.oracle.com/en-us/iaas/images/image/6bf73d2b-8465-4dff-98b7-ad8798ec4dda/
    image_id    = "ocid1.image.oc1.eu-amsterdam-1.aaaaaaaamlbp3cerkom2e5rcbvaxce4zunkhu6tt7y2jekqo2zq6onwmw74q"
    source_type = "image"
  }

  initial_node_labels {
    key   = "name"
    value = "pool2"
  }
}
