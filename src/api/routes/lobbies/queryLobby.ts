import { Lobbies } from "@daas/db-adapter"
import { createMiddleware } from "../../support/createMiddleware"

export const queryLobby = createMiddleware(async req => {
	const lobby = await Lobbies.findById(req.params.id)

	if (lobby === null) {
		return [404]
	} else {
		req.lobby = lobby
	}
})
