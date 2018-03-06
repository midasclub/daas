import { Router } from "express"
import { ApiAccessLevel } from "@daas/model"
import { requirePerm } from "../../../../middleware/requirePerms"
import { methodNotAllowed } from "../../../../middleware/methodNotAllowed"
import { resendInvite } from "./resendInvite"

const router = Router()

router
	.route("/")
	.post(requirePerm("lobbies", ApiAccessLevel.WRITE), resendInvite)
	.all(methodNotAllowed)

export { router as invites }
