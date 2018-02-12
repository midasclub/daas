import { ApiKeys } from "@daas/db-adapter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"

export const deleteApiKey = createController(async req => {
	if (req.apiKey.id === req.queriedApiKey!.id) {
		return generateError(
			"IMPOSSIBLE_ACTION",
			"You cannot revoke your own API Key"
		)
	}
	await ApiKeys.delete(req.queriedApiKey!)
	return [204]
})
