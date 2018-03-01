import { body } from "express-validator/check"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"
import { WebHookEventType } from "@daas/model"

export const updateWebhookValidations = [
	body("eventType")
		.custom(createEnumValidator(WebHookEventType))
		.optional({ nullable: true }),
	body("url")
		.isLength({ min: 1 })
		.optional({ nullable: true }),
	body("regenerateSecret")
		.isBoolean()
		.optional({ nullable: true })
]
