import { Router } from "express"
import { ApiAccessLevel } from "@daas/model"
import { requirePerm } from "../../middleware/requirePerms"
import { methodNotAllowed } from "../../middleware/methodNotAllowed"
import { getAllApiKeys } from "./getAllApiKeys"
import { createApiKeyValidations } from "./validations/createApiKeyValidations"
import { createApiKey } from "./createApiKey"
import { queryApiKey } from "./queryApiKey"
import { getApiKey } from "./getApiKey"
import { deleteApiKey } from "./deleteApiKey"
import { updateApiKey } from "./updateApiKey"
import { updateApiKeyValidations } from "./validations/updateApiKeyValidations"

const router = Router()

router
	.route("/")
	.get(requirePerm("apiKeys", ApiAccessLevel.READ), getAllApiKeys)
	.post(
		requirePerm("apiKeys", ApiAccessLevel.WRITE),
		createApiKeyValidations,
		createApiKey
	)
	.all(methodNotAllowed)

router.use("/:fragment", queryApiKey)

router
	.route("/:fragment")
	.get(requirePerm("apiKeys", ApiAccessLevel.READ), getApiKey)
	.put(
		requirePerm("apiKeys", ApiAccessLevel.WRITE),
		updateApiKeyValidations,
		updateApiKey
	)
	.patch(
		requirePerm("apiKeys", ApiAccessLevel.WRITE),
		updateApiKeyValidations,
		updateApiKey
	)
	.delete(requirePerm("apiKeys", ApiAccessLevel.WRITE), deleteApiKey)
	.all(methodNotAllowed)

export { router as apiKeys }
