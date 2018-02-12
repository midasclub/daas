import { Bots } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const deleteBot = createController(async req => {
	await Bots.delete(req.bot!)
	return [204]
})
