import { Lobby, Machine } from "@daas/model"
import { getLobbiesAdapter } from "@daas/db-adapter"
import { Communications, MessageType } from "@daas/communications"
import { sendManyTimes } from "./sendManyTimes"

export async function sendLobbyToMachine(
	lobby: Lobby,
	machine: Machine
): Promise<void> {
	lobby = await getLobbiesAdapter().then(it => it.update(lobby, { machine }))

	const comms = await Communications.open(machine.id + "")
	sendManyTimes(comms, MessageType.LOBBY_INFO, { lobbyId: lobby.id })

	console.log(`Sent lobby #${lobby.id} to machine #${machine.id}.`)
}
