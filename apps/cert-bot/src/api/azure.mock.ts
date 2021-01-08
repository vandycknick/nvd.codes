import { AzureApi } from "./azure"

interface MockedAzureApi {
  listResources: jest.MockedFunction<AzureApi["listResources"]>
  cdn: jest.Mocked<AzureApi["cdn"]>
  vault: jest.Mocked<AzureApi["vault"]>
  mockRestore(): void
  mockClear(): void
}

export const createAzureApiMock = (): MockedAzureApi => ({
  listResources: jest.fn(),
  cdn: {
    getEndpoint: jest.fn(),
    listCustomDomains: jest.fn(),
    getCustomDomainCertificate: jest.fn(),
    setCustomDomainCertificate: jest.fn(),
  },
  vault: {
    getSecret: jest.fn(),
    setSecret: jest.fn(),
    getCertificate: jest.fn(),
    setCertificate: jest.fn(),
  },

  mockRestore() {
    this.listResources.mockRestore()
    this.cdn.getEndpoint.mockRestore()
    this.cdn.listCustomDomains.mockRestore()
    this.cdn.getCustomDomainCertificate.mockRestore()
    this.cdn.setCustomDomainCertificate.mockRestore()
    this.vault.getSecret.mockRestore()
    this.vault.setSecret.mockRestore()
    this.vault.getCertificate.mockRestore()
    this.vault.setCertificate.mockRestore()
  },

  mockClear() {
    this.listResources.mockClear()
    this.cdn.getEndpoint.mockClear()
    this.cdn.listCustomDomains.mockClear()
    this.cdn.getCustomDomainCertificate.mockClear()
    this.cdn.setCustomDomainCertificate.mockClear()
    this.vault.getSecret.mockClear()
    this.vault.setSecret.mockClear()
    this.vault.getCertificate.mockClear()
    this.vault.setCertificate.mockClear()
  },
})
