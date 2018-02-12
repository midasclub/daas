import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"
import { body } from "express-validator/check"
import { createObjectHasKeysValidator } from "../../../support/validation/createObjectHasKeysValidator"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"

export const createApiKeyValidations = [
	body("label").isLength({ min: 1, max: 30 }),
	body("permissions").custom(
		createObjectHasKeysValidator(["bots", "lobbies", "apiKeys"])
	),
	body("permissions.*").custom(createEnumValidator(ApiAccessLevel))
]
