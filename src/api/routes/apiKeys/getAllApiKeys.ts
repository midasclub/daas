import { ApiKeys } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const getAllApiKeys = createController(async () => {
	const apiKeys = await ApiKeys.findAll()

	return [200, apiKeys.map(it => it.serialize())]
})
