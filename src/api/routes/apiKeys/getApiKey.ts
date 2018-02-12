import { createController } from "../../support/createController"

export const getApiKey = createController(async req => [
	200,
	req.queriedApiKey!.serialize()
])
