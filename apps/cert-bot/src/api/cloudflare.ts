import querystring from "querystring"
import { Err, Ok, Result } from "@nvd.codes/monad"

import { CloudflareApiResult, DnsRecord } from "../models/dns"
import { getEnvVar } from "../utils"
import { sendJsonRequest } from "./request"

const apiEndpoint = "https://api.cloudflare.com/client/v4"

export const getApiToken = () => getEnvVar("CLOUDFLARE_API_TOKEN")

export type CloudflareDnsApi = {
  listDnsRecords: (
    name: string,
    content: string,
    type: "TXT",
  ) => Promise<Result<DnsRecord[], string>>
  createDnsRecord: (
    name: string,
    content: string,
    type: "TXT",
  ) => Promise<Result<string, string>>
  deleteDnsRecord: (id: string) => Promise<Result<boolean, string>>
}

export const createCloudflareDnsApi = async (
  zoneId: string,
): Promise<Result<CloudflareDnsApi, string>> => {
  const tokenOrError = getApiToken()

  if (tokenOrError.isNone()) {
    return Err(
      "No cloudflare API token found, please provide CLOUDFLARE_API_TOKEN as an environment variable!",
    )
  }

  const api = {
    listDnsRecords: async (
      name: string,
      content: string,
      type: "TXT",
    ): Promise<Result<DnsRecord[], string>> => {
      const token = tokenOrError.unwrap()
      const search = querystring.stringify({ name, content, type })
      const response = await sendJsonRequest<CloudflareApiResult<DnsRecord[]>>(
        `${apiEndpoint}/zones/${zoneId}/dns_records?${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      return response.mapOrElse(
        (result) =>
          result.success ? Ok(result.result) : Err(result.errors[0]),
        (error) => Err(error.message),
      )
    },

    createDnsRecord: async (
      name: string,
      content: string,
      type: "TXT",
    ): Promise<Result<string, string>> => {
      const token = tokenOrError.unwrap()
      const data: Partial<DnsRecord> = {
        name,
        content,
        type,
      }
      const response = await sendJsonRequest<CloudflareApiResult<DnsRecord>>(
        `${apiEndpoint}/zones/${zoneId}/dns_records`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        },
      )

      return response.mapOrElse(
        (result) =>
          result.success ? Ok(result.result.id) : Err(result.errors[0]),
        (error) => Err(error.message),
      )
    },

    deleteDnsRecord: async (id: string): Promise<Result<boolean, string>> => {
      const token = tokenOrError.unwrap()

      const response = await sendJsonRequest<CloudflareApiResult<DnsRecord>>(
        `${apiEndpoint}/zones/${zoneId}/dns_records/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "DELETE",
        },
      )

      return response.mapOrElse(
        (apiResult) =>
          apiResult.success ? Ok(true) : Err(apiResult.errors[0]),
        (error) => Err(error.message),
      )
    },
  }

  return Ok(api)
}
