import type { EventContext } from '@vtex/api'
import { LogLevel, NotFoundError, ResolverError } from '@vtex/api'

import type { Clients } from '../clients'

export async function skuChange(ctx: EventContext<Clients>) {
  const {
    clients: { catalog: catalogClient },
  } = ctx

  const { IdSku, HasStockKeepingUnitModified, IsActive } = ctx.body

  if (!HasStockKeepingUnitModified && !IsActive) return false

  let sku
  let skuImages

  try {
    sku = await catalogClient.getSku(IdSku)
  } catch (error) {
    const erroMessage = `SKU ${IdSku} not found.`
    const splunkError = {
      error: erroMessage,
      detail: error,
    }

    ctx.vtex.logger.log(splunkError, LogLevel.Error)
    throw new NotFoundError(erroMessage)
  }

  try {
    skuImages = await catalogClient.getSkuImage(IdSku)
  } catch (error) {
    const erroMessage = `SKU IMAGES ${IdSku} not found.`
    const splunkError = {
      error: erroMessage,
      detail: error,
    }

    ctx.vtex.logger.log(splunkError, LogLevel.Error)
    throw new NotFoundError(erroMessage)
  }

  if (skuImages.Images.length > 0) return false

  try {
    const bodyPayload = {
      ProductId: sku.ProductId,
      Name: sku.Name,
      PackagedHeight: sku.PackagedHeight,
      PackagedLength: sku.PackagedLength,
      PackagedWidth: sku.PackagedWidth,
      PackagedWeightKg: sku.PackagedWeightKg,
      IsActive: false,
      ActivateIfPossible: false
    }

    await catalogClient.updateSku(bodyPayload, sku.Id)
  } catch (error) {
    const erroMessage = `SKU ${sku.Id} cannot be updated.`
    const splunkError = {
      error: erroMessage,
      detail: error,
    }

    console.log('error', error)

    ctx.vtex.logger.log(splunkError, LogLevel.Error)
    throw new ResolverError(erroMessage)
  }

  return true
}
