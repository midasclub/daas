import { WebHooks } from "@daas/db-adapter"
import { createMiddleware } from "../../support/createMiddleware"

export const queryWebhook = createMiddleware(async req => {
	const webhook = await WebHooks.findById(req.params.id)

	if (webhook === null) {
		return [404]
	} else {
		req.webhook = webhook
	}
})
