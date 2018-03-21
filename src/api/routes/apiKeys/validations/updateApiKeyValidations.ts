import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"
import { body } from "express-validator/check"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"

export const updateApiKeyValidations = [
	body("label")
		.isLength({ min: 1, max: 30 })
		.optional({ nullable: true }),
	body("permissions")
		.custom(it => typeof it === "object")
		.optional({ nullable: true }),
	...["bots", "lobbies", "apiKeys", "webhooks"].map(perm =>
		body(`permissions.${perm}`)
			.custom(createEnumValidator(ApiAccessLevel))
			.optional()
	)
]
