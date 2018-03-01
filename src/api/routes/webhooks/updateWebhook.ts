import { createController } from "../../support/createController"
import { validationResult } from "express-validator/check"
import { generateError } from "../../support/generateError"
import { matchedData } from "express-validator/filter"
import { WebHooks } from "@daas/db-adapter"
import { WebHookEventType } from "@daas/model"

export const updateWebhook = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any
	const dataToUpdate = { ...data }

	if (dataToUpdate.eventType) {
		dataToUpdate.eventType = WebHookEventType[dataToUpdate.eventType]
	}

	const webhook = await WebHooks.update(req.webhook!, dataToUpdate)
	return [200, webhook.serialize()]
})
