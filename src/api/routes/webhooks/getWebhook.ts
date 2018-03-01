import { createController } from "../../support/createController"

export const getWebhook = createController(async req => [
	200,
	req.webhook!.serialize()
])
