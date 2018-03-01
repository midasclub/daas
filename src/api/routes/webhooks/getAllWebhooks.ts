import { WebHooks } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const getAllWebhooks = createController(async () => {
	const webhooks = await WebHooks.findAll()

	return [200, webhooks.map(it => it.serialize())]
})
