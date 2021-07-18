module "subnet_addrs" {
  source = "hashicorp/subnets/cidr"

  base_cidr_block = var.base_cidr_block
  networks = [
    {
      name     = "kubernetes_api_endpoint"
      new_bits = 12
    },
    {
      name     = "node_subnet"
      new_bits = 8
    },
    {
      name     = "service_lb_subnet"
      new_bits = 8
    },
  ]
}

module "vcn" {
  source  = "oracle-terraform-modules/vcn/oci"
  version = "2.2.0"

  compartment_id = oci_identity_compartment.nvd_codes.id
  region         = var.region
  vcn_name       = "nvd-codes"
  vcn_dns_label  = "nvdcodes"

  internet_gateway_enabled = true
  nat_gateway_enabled      = true
  service_gateway_enabled  = true
  vcn_cidr                 = module.subnet_addrs.base_cidr_block
}

resource "random_string" "dns_label_suffix" {
  length  = 5
  upper   = false
  special = false
}

resource "oci_core_subnet" "kubernetes_api_endpoint_subnet" {
  display_name               = "kubernetes-api-endpoint-subnet"
  compartment_id             = oci_identity_compartment.nvd_codes.id
  vcn_id                     = module.vcn.vcn_id
  cidr_block                 = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
  route_table_id             = module.vcn.ig_route_id
  security_list_ids          = [oci_core_security_list.kubernetes_api_endpoint_subnet_sec_list.id]
  prohibit_public_ip_on_vnic = false
  dns_label                  = "kubeapi${random_string.dns_label_suffix.result}"
}

resource "oci_core_security_list" "kubernetes_api_endpoint_subnet_sec_list" {
  display_name   = "kubernetes-api-endpoint-sec-list"
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id

  egress_security_rules {
    stateless        = "false"
    description      = "Allow Kubernetes Control Plane to communicate with OKE"
    destination      = "all-ams-services-in-oracle-services-network"
    destination_type = "SERVICE_CIDR_BLOCK"
    protocol         = local.protocols.TCP
  }
  egress_security_rules {
    description      = "All traffic to worker nodes"
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = "false"
  }
  egress_security_rules {
    description      = "Path discovery"
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.ICMP
    stateless        = "false"
    icmp_options {
      code = "4"
      type = "3"
    }
  }

  ingress_security_rules {
    description = "External access to Kubernetes API endpoint"
    protocol    = local.protocols.TCP
    source      = "0.0.0.0/0"
    stateless   = "false"
  }
  ingress_security_rules {
    description = "Kubernetes worker to Kubernetes API endpoint communication"
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.node_subnet
    stateless   = "false"
  }
  ingress_security_rules {
    description = "Kubernetes worker to control plane communication"
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.node_subnet
    stateless   = "false"
  }
  ingress_security_rules {
    description = "Path discovery"
    source      = module.subnet_addrs.network_cidr_blocks.node_subnet
    protocol    = local.protocols.ICMP
    stateless   = "false"
    icmp_options {
      code = "4"
      type = "3"
    }
  }
}

resource "oci_core_subnet" "node_subnet" {
  display_name               = "node-subnet"
  compartment_id             = oci_identity_compartment.nvd_codes.id
  vcn_id                     = module.vcn.vcn_id
  cidr_block                 = module.subnet_addrs.network_cidr_blocks.node_subnet
  route_table_id             = module.vcn.nat_route_id
  security_list_ids          = [oci_core_security_list.node_subnet_sec_list.id]
  prohibit_public_ip_on_vnic = true
  dns_label                  = "nodeg${random_string.dns_label_suffix.result}"
}

resource "oci_core_security_list" "node_subnet_sec_list" {
  display_name   = "node-subnet-sec-list"
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id

  egress_security_rules {
    description      = "Allow pods on one worker node to communicate with pods on other worker nodes"
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  egress_security_rules {
    description      = "Access to Kubernetes API Endpoint"
    destination      = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = "false"
  }
  egress_security_rules {
    description      = "Kubernetes worker to control plane communication"
    destination      = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = "false"
  }
  egress_security_rules {
    description      = "Path discovery"
    destination      = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.ICMP
    stateless        = "false"
    icmp_options {
      code = "4"
      type = "3"
    }
  }
  egress_security_rules {
    description      = "Allow nodes to communicate with OKE to ensure correct start-up and continued functioning"
    destination      = "all-ams-services-in-oracle-services-network"
    destination_type = "SERVICE_CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = "false"
  }
  egress_security_rules {
    description      = "ICMP Access from Kubernetes Control Plane"
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.ICMP
    stateless        = "false"
    icmp_options {
      code = "4"
      type = "3"
    }
  }
  egress_security_rules {
    description      = "Worker Nodes access to Internet"
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
    stateless        = "false"
  }
  ingress_security_rules {
    description = "Allow pods on one worker node to communicate with pods on other worker nodes"
    protocol    = "all"
    source      = module.subnet_addrs.network_cidr_blocks.node_subnet
    stateless   = "false"
  }
  ingress_security_rules {
    description = "Path discovery"
    protocol    = local.protocols.ICMP
    source      = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
    stateless   = "false"
    icmp_options {
      code = "4"
      type = "3"
    }
  }
  ingress_security_rules {
    description = "TCP access from Kubernetes Control Plane"
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.kubernetes_api_endpoint
    stateless   = "false"
  }
  ingress_security_rules {
    description = "Inbound SSH traffic to worker nodes"
    protocol    = local.protocols.TCP
    source      = "0.0.0.0/0"
    stateless   = "false"
  }

  ingress_security_rules {
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.service_lb_subnet
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      max = 10256
      min = 10256
    }
  }
  ingress_security_rules {
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.service_lb_subnet
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      max = 30496
      min = 30496
    }
  }
  ingress_security_rules {
    protocol    = local.protocols.TCP
    source      = module.subnet_addrs.network_cidr_blocks.service_lb_subnet
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      max = 30957
      min = 30957
    }
  }

}

resource "oci_core_subnet" "service_lb_subnet" {
  display_name               = "service-lb-subnet"
  compartment_id             = oci_identity_compartment.nvd_codes.id
  vcn_id                     = module.vcn.vcn_id
  cidr_block                 = module.subnet_addrs.network_cidr_blocks.service_lb_subnet
  route_table_id             = module.vcn.ig_route_id
  security_list_ids          = [oci_core_security_list.service_lb_sec_list.id]
  prohibit_public_ip_on_vnic = false
  dns_label                  = "lbsub${random_string.dns_label_suffix.result}"
}

resource "oci_core_security_list" "service_lb_sec_list" {
  display_name   = "service-lb-subnet-sec-list"
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id

  egress_security_rules {
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = false

    tcp_options {
      max = 10256
      min = 10256
    }
  }
  egress_security_rules {
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = false

    tcp_options {
      max = 30496
      min = 30496
    }
  }
  egress_security_rules {
    destination      = module.subnet_addrs.network_cidr_blocks.node_subnet
    destination_type = "CIDR_BLOCK"
    protocol         = local.protocols.TCP
    stateless        = false

    tcp_options {
      max = 30957
      min = 30957
    }
  }

  ingress_security_rules {
    protocol    = local.protocols.TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      max = 443
      min = 443
    }
  }
  ingress_security_rules {
    protocol    = local.protocols.TCP
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    stateless   = false

    tcp_options {
      max = 80
      min = 80
    }
  }

}
