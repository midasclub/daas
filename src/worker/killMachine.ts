import { Machine } from "@daas/model"
import { Machines } from "@daas/db-adapter"
import { Communications, MessageType } from "@daas/communications"
import { EventHandler } from "./EventHandler"

export async function killMachine(machine: Machine): Promise<void> {
	const comms = await Communications.open(`${machine.id}`)
	await comms.sendMessage(MessageType.KILL_YOURSELF)

	await Promise.all([
		Machines.update(machine, { isTerminated: true }),
		comms.close(),
		EventHandler.unwatch(machine)
	])
}
