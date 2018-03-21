import { Lobbies } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const deleteLobby = createController(async req => {
	await Lobbies.delete(req.lobby!)
	return [204]
})
