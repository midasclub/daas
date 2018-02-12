import { ApiKeys } from "@daas/db-adapter"
import { createMiddleware } from "../support/createMiddleware"
import { generateError } from "../support/generateError"

export const authenticate = createMiddleware(async req => {
	const plainTextKey = req.get("X-DaaS-Api-Key")

	if (plainTextKey) {
		const key = await ApiKeys.findByPlainTextKey(plainTextKey)

		if (key) {
			req.apiKey = key
			ApiKeys.update(key, { lastUsed: new Date() }).catch((err: any) => {
				console.error(
					`Error when updating the lastUsed property of apiKey ${key.fragment}`
				)
				console.error(err)
			})
		} else {
			return generateError("API_KEY_INVALID")
		}
	} else {
		return generateError("API_KEY_NOT_PRESENT")
	}
})
