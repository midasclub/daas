import { body } from "express-validator/check"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"
import { WebHookEventType } from "@daas/model"

export const createWebhookValidations = [
	body("eventType").custom(createEnumValidator(WebHookEventType)),
	body("url").isLength({ min: 1 })
]
