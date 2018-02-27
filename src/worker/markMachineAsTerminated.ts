import { Machine } from "@daas/model"
import { getMachinesAdapter } from "@daas/db-adapter"

export async function markMachineAsTerminated(machine: Machine) {
	await getMachinesAdapter().then(it =>
		it.update(machine, { isTerminated: true })
	)
}
