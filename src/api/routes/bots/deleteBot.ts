import { Bots } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const deleteBot = createController(async req => {
	// TODO what happens if the bot is assigned to a machine or is currently in lobby?
	await Bots.delete(req.bot!)
	return [204]
})
