import * as dotenv from "dotenv"

dotenv.config()

import { Entity } from "@daas/model"
import {
	getConfigAdapter, getLobbiesAdapter, getMachinesAdapter,
	PubSub
} from "@daas/db-adapter"
import { launchMachine } from "./launchMachine"
import { killMachine } from "./killMachine"
import { sendLobbyToMachine } from "./sendLobbyToMachine"
import { setNonOverlappingInterval } from "./setNonOverlappingInterval"

const loggableList = (elements: Array<Entity>) =>
	elements.length === 0
		? "none"
		: `${elements.map(it => `#${it.id}`).join(", ")} (total: ${
				elements.length
			})`

async function maintainActiveMachines() {
	console.log(`Beginning maintainActiveMachines()`)

	const [{ alwaysActiveMachines }, idleMachines] = await Promise.all([
		getConfigAdapter().then(it => it.get()),
		getMachinesAdapter().then(it => it.findAllIdle())
	])

	const difference = idleMachines.length - alwaysActiveMachines

	console.log(`There is a difference of ${difference}`)

	if (difference < 0) {
		// We have less active machines than we want to. Spawn one more.
		// We will launch only one at a time so we don't accidentally
		// launch the same bot twice.
		await launchMachine()
	} else if (difference > 0) {
		// We have more machines than we want to. Kill the oldest ones until we have
		// the desired quantity.
		const machinesToKill = idleMachines
			.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
			.slice(0, difference)

		console.log(
			`Killing the following machines: ${loggableList(machinesToKill)}`
		)

		await Promise.all(machinesToKill.map(killMachine))
	}

	console.log(`Finished maintainActiveMachines()`)
}

async function replaceOldMachines() {
	console.log(`Beginning replaceOldMachines()`)

	const idleMachines = await getMachinesAdapter().then(it => it.findAllIdle())

	await Promise.all(
		idleMachines.map(async machine => {
			// TODO allow to customize this value
			if (
				Date.now() - machine.startedAt.getTime() >=
				10 /*m*/ * 60 /*s*/ * 1000 /*ms*/
			) {
				// If a machine is too old, spawn a new one to take its place
				// maintainActiveMachines() will take care of killing the
				console.log(
					`The machine ${machine} has been idle for too long. Launching its replacement...`
				)
				await launchMachine()
			}
		})
	)

	console.log(`Finished replaceOldMachines()`)
}

async function handleLobbiesChanged() {
	console.log(`Beginning handleLobbiesChanged()`)

	const [lobbiesWithoutMachine, idleMachines] = await Promise.all([
		getLobbiesAdapter().then(it => it.findAllWithoutMachine()),
		getMachinesAdapter().then(it => it.findAllIdle())
			// Sort by the oldest machines, which are mor likely to be up and running
			.then(m =>
				m.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
			)
	])

	console.log(`Lobbies without machine: ${loggableList(lobbiesWithoutMachine)}`)
	console.log(`Idle machines: ${loggableList(idleMachines)}`)

	const lobbiesToWait = [...lobbiesWithoutMachine]
	// Take as many lobbies as idle machines are and put them in lobbiesToBeSent
	// The rest will stay at lobbiesToWait
	const lobbiesToBeSent = lobbiesToWait.splice(0, idleMachines.length)

	console.log(`Lobbies to wait: ${loggableList(lobbiesToWait)}`)
	console.log(`Lobbies to be sent: ${loggableList(lobbiesToBeSent)}`)

	await Promise.all(
		lobbiesToBeSent.map((lobby, i) =>
			sendLobbyToMachine(lobby, idleMachines[i])
		)
	)

	// If there are still lobbies that are unprocessed, spawn more machines and try again
	if (lobbiesToWait.length > 0) {
		await new Promise(r => setTimeout(r, 5000))
		await maintainActiveMachines()
		await handleLobbiesChanged()
	}

	console.log(`Finished handleLobbiesChanged()`)
}

export async function main() {
	setNonOverlappingInterval(async () => {
		await maintainActiveMachines()
		await replaceOldMachines()
	}, 60000 /* TODO make this customizable */)
	await PubSub.listen("database_changes", () =>
		handleLobbiesChanged().catch(console.error)
	)
}

main().catch(console.error)
