import { ApiKeys } from "@daas/db-adapter"
import { createMiddleware } from "../../support/createMiddleware"

export const queryApiKey = createMiddleware(async req => {
	const key = await ApiKeys.findByFragment(req.params.fragment)

	if (key === null) {
		return [404]
	} else {
		req.queriedApiKey = key
	}
})
