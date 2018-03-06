import { createMiddleware } from "../../../support/createMiddleware"

export const queryPlayer = createMiddleware(async req => {
	const players = req.lobby ? req.lobby.players : []
	const player = players.find(it => it.steamId === req.params.playerId)

	if (!player) {
		return [404]
	} else {
		req.player = player
	}
})
