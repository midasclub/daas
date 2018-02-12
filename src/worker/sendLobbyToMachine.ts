import { Lobby, Machine } from "@daas/model"
import { Communications, MessageType } from "@daas/communications"
import { sendManyTimes } from "./sendManyTimes"

export async function sendLobbyToMachine(
	lobby: Lobby,
	machine: Machine
): Promise<void> {
	const comms = await Communications.open(machine.id + "")
	sendManyTimes(comms, MessageType.LOBBY_INFO, { lobbyId: lobby.id })
}
