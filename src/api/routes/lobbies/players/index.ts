import { Router } from "express"
import { queryPlayer } from "./queryPlayer"
import { getPlayer } from "./getPlayer"
import { methodNotAllowed } from "../../../middleware/methodNotAllowed"
import { invites } from "./invites"

const router = Router()

router.use("/:playerId", queryPlayer)

router
	.route("/:playerId")
	.get(getPlayer)
	.all(methodNotAllowed)

router.use("/:playerId/invites", invites)

export { router as players }
