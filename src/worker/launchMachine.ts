import { BotStatus, Machine } from "@daas/model"
import { Bots, getMachinesAdapter } from "@daas/db-adapter"
import { Communications, MessageType } from "@daas/communications"
import { sendManyTimes } from "./sendManyTimes"
import { EventHandler } from "./EventHandler"
import {launchComputeInstance} from "../compute/launchInstance"

export async function launchMachine(): Promise<Machine | null> {
	console.log("Launching one machine...")

	const [bots, Machines] = await Promise.all([
		Bots.findAllByStatus(BotStatus.OFFLINE).then(it =>
			it.filter(
				it => !it.disabledUntil || Date.now() > it.disabledUntil.getTime()
			)
		),
		getMachinesAdapter(true)
	])

	if (bots.length === 0) {
		// TODO "not enough bots" alert
		return null
	}

	const randomBot = bots[Math.floor(Math.random() * bots.length)]
	const machine = await Machines.insert({ bot: randomBot })

	console.log(`Selected bot #${randomBot.id}. Created machine #${machine.id}`)

	await launchComputeInstance(`daas-core ${machine.id}`, `${machine.id}`)
	const comms = await Communications.open(`${machine.id}`)

	await comms.waitForMessage(MessageType.BOOT_OK, 90000)
	console.log(`BOOT_OK received`)

	sendManyTimes(comms, MessageType.DOTA_BOT_INFO, { botId: randomBot.id })
	await comms.waitForMessage(MessageType.DOTA_OK, 90000)
	console.log(`DOTA_OK received`)

	await Machines.commit()

	console.log("Machine launched successfully")

	comms.close().catch(console.error)
	await EventHandler.watch(machine)

	return machine
}
