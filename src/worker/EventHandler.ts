import { Lobby, Machine, MatchResult, WebHookEventType } from "@daas/model"
import { Communications, MessageType } from "@daas/communications"
import { getLobbiesAdapter } from "@daas/db-adapter"
import { Observable, Subject, Subscription } from "rxjs"
import { markMachineAsTerminated } from "./markMachineAsTerminated"
import { disableBot } from "../support/disableBot"
import { sendWebhooks } from "./sendWebhooks"

export class EventHandler {
	private static unwatchCommandStream = new Subject<Machine>()

	/**
	 * Watches for the events a machine might send, and handles them accordingly.
	 *
	 * @param machine The machine to watch
	 */
	public static async watch(machine: Machine) {
		const comms = await Communications.open(machine.id + "")

		console.log(`Started watching machine #${machine.id}`)

		const stream = (type: MessageType) =>
			comms.adapterMessageStream.filter(it => it.type === type)
		const fp = Observable.fromPromise

		let subscriptions: Array<Subscription> = []
		const close = () =>
			fp(
				comms
					.close()
					.then(() => console.log(`Stopped watching machine #${machine.id}`))
					.then(() => subscriptions.forEach(it => it.unsubscribe()))
			)

		const streams = [
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
				.flatMap(close),
			this.unwatchCommandStream
				.filter(it => it.id === machine.id)
				.flatMap(close)
		]

		subscriptions = streams.map(it => it.subscribe(() => {}, console.error))
	}

	/**
	 * Stops watching for machine events. If the machine exits by itself (the game is cancelled,
	 * or the game finishes successfully), it will stop watching automatically. However, if the
	 * machine is automatically killed (sent the KILL_YOURSELF message), then this is needed
	 * in order to free up a database connection.
	 *
	 * @param machine The machine to watch
	 */
	public static unwatch(machine: Machine) {
		this.unwatchCommandStream.next(machine)
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
