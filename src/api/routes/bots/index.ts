import { Router } from "express"
import { ApiAccessLevel } from "@daas/model"
import { methodNotAllowed } from "../../middleware/methodNotAllowed"
import { requirePerm } from "../../middleware/requirePerms"
import { getAllBots } from "./getAllBots"
import { createBot } from "./createBot"
import { createBotValidations } from "./validations/createBotValidations"
import { queryBot } from "./queryBot"
import { getBot } from "./getBot"
import { deleteBot } from "./deleteBot"

const router = Router()

router
	.route("/")
	.get(requirePerm("bots", ApiAccessLevel.READ), getAllBots)
	.post(
		requirePerm("bots", ApiAccessLevel.WRITE),
		createBotValidations,
		createBot
	)
	.all(methodNotAllowed)

router.use("/:id", queryBot)

router
	.route("/:id")
	.get(requirePerm("bots", ApiAccessLevel.READ), getBot)
	.delete(requirePerm("bots", ApiAccessLevel.WRITE), deleteBot)
	.all(methodNotAllowed)

export { router as bots }
