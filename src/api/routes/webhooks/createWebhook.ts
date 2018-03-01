import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"
import { WebHooks } from "@daas/db-adapter"
import { WebHookEventType } from "@daas/model"

export const createWebhook = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req) as any
	const dataToInsert = { ...data }

	dataToInsert.eventType = WebHookEventType[dataToInsert.eventType]

	const webhook = await WebHooks.insert(dataToInsert)
	return [200, webhook.serialize()]
})
