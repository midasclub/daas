import { Machine, MatchResult } from "@daas/model"
import { Communications, MessageType } from "@daas/communications"
import { Observable } from "rxjs"
import { markMachineAsTerminated } from "./markMachineAsTerminated"

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
		const close = () => Observable.fromPromise(comms.close().then(() => console.log(`Stopped watching machine #${machine.id}`)))

		const subscriptions = [
			// TODO handle stream(MessageType.PLAYER_STATUS_UPDATE)
			// TODO handle stream(MessageType.GAME_STARTED)
			stream(MessageType.GAME_FINISHED)
				.flatMap(msg => this.handleGameFinished(machine, msg.info.matchResult))
				.flatMap(close),
			stream(MessageType.GAME_CANCELLED)
				.flatMap(msg =>
					this.handleGameCancelled(machine, msg.info.notReadyPlayers)
				)
				.flatMap(close)
		]

		subscriptions.forEach(it => it.subscribe(() => {}, console.error))
	}

	private static async handleGameFinished(
		machine: Machine,
		matchResult: MatchResult
	) {
		await markMachineAsTerminated(machine)

		// TODO send the match result as webhook
	}

	private static async handleGameCancelled(
		machine: Machine,
		notReadyPlayerIds: Array<string>
	) {
		await markMachineAsTerminated(machine)

		// TODO send the match result as webhook
	}
}
