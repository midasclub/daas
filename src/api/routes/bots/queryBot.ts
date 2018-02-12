import { Bots } from "@daas/db-adapter"
import { createMiddleware } from "../../support/createMiddleware"

export const queryBot = createMiddleware(async req => {
	const bot = await Bots.findById(req.params.id)

	if (bot === null) {
		return [404]
	} else {
		req.bot = bot
	}
})
