module "subnet_addrs" {
  source = "hashicorp/subnets/cidr"

  base_cidr_block = var.base_cidr_block
  networks = [
    {
      name     = "private_subnet_a"
      new_bits = 8
    },
    {
      name     = "public_subnet_a"
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

resource "oci_core_security_list" "nvd_codes_private_seclist" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id

  display_name = "nvd-codes-seclist-private-subnets"


  egress_security_rules {
    stateless        = false
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
  }

  ingress_security_rules {
    stateless   = false
    source      = module.subnet_addrs.base_cidr_block
    source_type = "CIDR_BLOCK"
    protocol    = local.protocols.TCP
    tcp_options {
      min = 22
      max = 22
    }
  }

  ingress_security_rules {
    stateless   = false
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    protocol    = local.protocols.ICMP

    icmp_options {
      type = 3
      code = 4
    }
  }

  ingress_security_rules {
    stateless   = false
    source      = module.subnet_addrs.base_cidr_block
    source_type = "CIDR_BLOCK"
    protocol    = local.protocols.ICMP
    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 3
    }
  }
}

resource "oci_core_subnet" "nvd_codes_private_subnet_a" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id
  cidr_block     = module.subnet_addrs.network_cidr_blocks.private_subnet_a

  route_table_id    = module.vcn.nat_route_id
  security_list_ids = [oci_core_security_list.nvd_codes_private_seclist.id]
  display_name      = "nvd-codes-private-subnet-a"
}

resource "oci_core_security_list" "nvd_codes_public_seclist" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id
  display_name   = "nvd-codes-seclist-public-subnets"

  egress_security_rules {
    stateless        = false
    destination      = "0.0.0.0/0"
    destination_type = "CIDR_BLOCK"
    protocol         = "all"
  }

  ingress_security_rules {
    stateless   = false
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml TCP is 6
    protocol = local.protocols.TCP
    tcp_options {
      min = 22
      max = 22
    }
  }

  ingress_security_rules {
    stateless   = false
    source      = "0.0.0.0/0"
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml ICMP is 1
    protocol = local.protocols.ICMP

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 3
      code = 4
    }
  }

  ingress_security_rules {
    stateless   = false
    source      = module.subnet_addrs.base_cidr_block
    source_type = "CIDR_BLOCK"
    # Get protocol numbers from https://www.iana.org/assignments/protocol-numbers/protocol-numbers.xhtml ICMP is 1
    protocol = local.protocols.ICMP

    # For ICMP type and code see: https://www.iana.org/assignments/icmp-parameters/icmp-parameters.xhtml
    icmp_options {
      type = 3
    }
  }
}


resource "oci_core_subnet" "nvd_codes_public_subnet_a" {
  compartment_id = oci_identity_compartment.nvd_codes.id
  vcn_id         = module.vcn.vcn_id
  cidr_block     = module.subnet_addrs.network_cidr_blocks.public_subnet_a

  route_table_id    = module.vcn.ig_route_id
  security_list_ids = [oci_core_security_list.nvd_codes_public_seclist.id]
  display_name      = "nvd-codes-public-subnet-a"
}

resource "oci_core_dhcp_options" "nvd_codes_dhcp_options" {

  # Required
  compartment_id = "oci_identity_compartment.nvd_codes.id"
  vcn_id         = module.vcn.vcn_id
  options {
    type        = "DomainNameServer"
    server_type = "VcnLocalPlusInternet"
  }

  # Optional
  display_name = "nvd-codes-dhcp-options"
}
