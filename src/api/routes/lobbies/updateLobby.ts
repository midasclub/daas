import { LobbyStatus, MatchResult } from "@daas/model"
import { Lobbies } from "@daas/db-adapter"
import { Communications, MessageType } from "@daas/communications"
import { matchedData } from "express-validator/filter"
import { validationResult } from "express-validator/check"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"

export const updateLobby = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const lobby = req.lobby!

	const data = matchedData(req)
	const diff = {} as any

	const matchResult = data.matchResult
		? MatchResult[data.matchResult as keyof typeof MatchResult]
		: null
	const status = data.status
		? LobbyStatus[data.status as keyof typeof LobbyStatus]
		: null

	if (matchResult !== null) {
		diff.matchResult = matchResult

		if (lobby.machine && !lobby.machine.isTerminated) {
			// We already know the match result, so there's no point on keeping
			// the bot alive.
			const comms = await Communications.open(`${lobby.machine.id}`)
			await comms.sendMessage(MessageType.KILL_YOURSELF)
			await comms.close()
		}
	}

	if (status !== null) {
		if (status === LobbyStatus.CANCELLED) {
			// TODO instruct the daas core to cancel the lobby
			return [
				501,
				{
					error: {
						code: "NOT_IMPLEMENTED",
						message:
							"Programmatically cancelling lobbies will be available in future" +
							" versions of DaaS."
					}
				}
			]
		} else {
			return [
				422,
				{
					error: {
						code: "INVALID_DATA",
						message:
							"Cannot make the lobby status be anything other than CANCELLED."
					}
				}
			]
		}
	}

	const updatedLobby = await Lobbies.update(lobby, diff)
	return [200, updatedLobby.serialize()]
})
