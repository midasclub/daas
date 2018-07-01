import { LobbyStatus } from "@daas/model"
import { Communications, MessageType } from "@daas/communications"
import { oneLine } from "common-tags"
import { createController } from "../../../../support/createController"
import { generateError } from "../../../../support/generateError"

export const resendInvite = createController(async req => {
	const lobby = req.lobby!
	const player = req.player!

	if (lobby.status !== LobbyStatus.OPEN) {
		return generateError("CANNOT_RESEND_INVITE_LOBBY_NOT_OPEN")
	}

	if (!lobby.machine) {
		console.error(oneLine`The lobby #${lobby.id} doesn't have a 
		machine but is open (when trying to resend an invite to 
		player ${player.steamId})`)
		return [500]
	}

	const comms = await Communications.open(`${lobby.machine.id}`)
	await comms.sendMessage(MessageType.RESEND_INVITE, {
		playerSteamId: player.steamId
	})

	comms.close().catch(console.error)

	return [200]
})
