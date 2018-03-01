import { WebHooks } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const deleteWebhook = createController(async req => {
	await WebHooks.delete(req.webhook!)
	return [204]
})
