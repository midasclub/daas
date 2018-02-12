import { Lobbies } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const getAllLobbies = createController(async () => {
	const lobbies = await Lobbies.findAll()

	return [
		200,
		lobbies.map(it => it.serialize()).map(it => {
			// findAll won't return the lobby players even if they do have.
			// Don't return the players property so we don't confuse users.
			delete it.players
			return it
		})
	]
})
