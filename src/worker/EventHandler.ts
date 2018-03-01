import { Lobby, Machine, MatchResult, WebHookEventType } from "@daas/model"
import { Communications, MessageType } from "@daas/communications"
import { Observable } from "rxjs"
import { markMachineAsTerminated } from "./markMachineAsTerminated"
import { disableBot } from "../support/disableBot"
import { getLobbiesAdapter } from "@daas/db-adapter"
import { sendWebhooks } from "./sendWebhooks"

export class EventHandler {
	/**
	 * Watches for the events a machine might send, and handles them accordingly
	 *
	 * @param machine The machine to watch
	 */
	public static async watch(machine: Machine) {
		const comms = await Communications.open(machine.id + "")

		console.log(`Started watching machine #${machine.id}`)

		const stream = (type: MessageType) =>
			comms.adapterMessageStream.filter(it => it.type === type)
		const fp = Observable.fromPromise
		const close = () =>
			fp(
				comms
					.close()
					.then(() => console.log(`Stopped watching machine #${machine.id}`))
			)

		const subscriptions = [
			stream(MessageType.PLAYER_STATUS_UPDATE).flatMap(msg =>
				fp(
					this.handlePlayerReadyStatusUpdate(
						machine,
						msg.info.steamId,
						msg.info.isReady
					)
				)
			),
			stream(MessageType.GAME_STARTED).flatMap(() =>
				fp(this.handleGameStarted(machine))
			),
			stream(MessageType.GAME_FINISHED)
				.flatMap(msg =>
					fp(this.handleGameFinished(machine, msg.info.matchResult))
				)
				.flatMap(close),
			stream(MessageType.GAME_CANCELLED)
				.flatMap(msg =>
					fp(this.handleGameCancelled(machine, msg.info.notReadyPlayers))
				)
				.flatMap(close)
		]

		subscriptions.forEach(it => it.subscribe(() => {}, console.error))
	}

	private static async handlePlayerReadyStatusUpdate(
		machine: Machine,
		playerSteamId: string,
		isReady: boolean
	) {
		const lobby = await EventHandler.getLobby(machine)
		await sendWebhooks(WebHookEventType.PLAYER_READY_STATUS_UPDATE, lobby, {
			player: {
				steamId: playerSteamId,
				isReady
			}
		})
	}

	private static async handleGameStarted(machine: Machine) {
		const lobby = await EventHandler.getLobby(machine)
		await sendWebhooks(WebHookEventType.GAME_STARTED, lobby, {
			matchId: lobby.matchId
		})
	}

	private static async handleGameFinished(
		machine: Machine,
		matchResult: MatchResult
	) {
		await Promise.all([
			markMachineAsTerminated(machine),
			disableBot(machine.bot, 3 /*h*/ * 60 /*m*/), // TODO allow to customize
			EventHandler.getLobby(machine).then(lobby =>
				sendWebhooks(WebHookEventType.GAME_FINISHED, lobby, {
					matchResult: MatchResult[matchResult]
				})
			)
		])
	}

	private static async handleGameCancelled(
		machine: Machine,
		notReadyPlayerIds: Array<string>
	) {
		await Promise.all([
			markMachineAsTerminated(machine),
			disableBot(machine.bot, 30 /*m*/), // TODO allow to customize
			EventHandler.getLobby(machine).then(lobby =>
				sendWebhooks(WebHookEventType.GAME_CANCELLED, lobby, {
					notReadyPlayerIds
				})
			)
		])
	}

	private static async getLobby(machine: Machine): Promise<Lobby> {
		const lobby = await getLobbiesAdapter().then(it =>
			it.findByMachine(machine)
		)

		if (lobby === null) {
			throw new Error(
				`Cannot find the lobby handled by machine #${machine.id}!`
			)
		}

		return lobby
	}
}
