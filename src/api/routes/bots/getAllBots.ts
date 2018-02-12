import { Bots } from "@daas/db-adapter"
import { createController } from "../../support/createController"

export const getAllBots = createController(async () => {
	const bots = await Bots.findAll()

	return [200, bots.map(it => it.serialize())]
})
