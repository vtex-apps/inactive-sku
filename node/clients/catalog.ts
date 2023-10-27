import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

interface UpdateBody {
  ProductId: number,
  Name: string,
  PackagedHeight: number,
  PackagedLength: number,
  PackagedWidth: number,
  PackagedWeightKg: number,
  IsActive: boolean,
  ActivateIfPossible: boolean,
}

const PRODUCT_URL = '/catalog/pvt/product/'
const SKU_URL = '/catalog/pvt/stockkeepingunit/'
const SKU_URL_image = "/catalog_system/pvt/sku/stockkeepingunitbyid/"
// https://{accountName}.{environment}.com.br/api/catalog/pvt/stockkeepingunit/{skuId}

export default class Catalog extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(`http://${context.account}.myvtex.com/api`, context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie:
          context.adminUserAuthToken ?? context.authToken ?? '',
        'X-Vtex-Use-Https': 'true',
      },
    })
  }

  public async getSku(skuId: string) {
    return this.http.get(`${SKU_URL}${skuId}`, {
      metric: 'get-product-by-sku-id',
    })
  }

  public async getSkuImage(skuId: string) {
    return this.http.get(`${SKU_URL_image}${skuId}`, {
      metric: 'get-product-by-sku-id',
    })
  }

  public async getProduct(productId: string) {
    return this.http.get(`${PRODUCT_URL}${productId}`, {
      metric: 'get-product-by-product-id',
    })
  }

  public async updateSku(data: UpdateBody, skuId: string) {
    return this.http.put(`${SKU_URL}${skuId}`, data, {
      metric: 'update-sku-by-sku-id',
    })
  }

  public async updateProduct(data: UpdateBody, productId: string) {
    return this.http.put(`${PRODUCT_URL}${productId}`, data, {
      metric: 'update-product-by-product-id',
    })
  }
}
