import { Router } from "express"
import { ApiAccessLevel } from "@daas/model"
import { requirePerm } from "../../middleware/requirePerms"
import { methodNotAllowed } from "../../middleware/methodNotAllowed"
import { getAllLobbies } from "./getAllLobbies"
import { queryLobby } from "./queryLobby"
import { getLobby } from "./getLobby"
import { createLobby } from "./createLobby"
import { createLobbyValidations } from "./validations/createLobbyValidations"
import { players } from "./players"
import { deleteLobby } from "./deleteLobby"
import { updateLobby } from "./updateLobby"
import { updateLobbyValidations } from "./validations/updateLobbyValidations"

const router = Router()

router
	.route("/")
	.get(requirePerm("lobbies", ApiAccessLevel.READ), getAllLobbies)
	.post(
		requirePerm("lobbies", ApiAccessLevel.WRITE),
		createLobbyValidations,
		createLobby
	)
	.all(methodNotAllowed)

router.use("/:id", queryLobby)

router
	.route("/:id")
	.get(requirePerm("lobbies", ApiAccessLevel.READ), getLobby)
	.put(
		requirePerm("lobbies", ApiAccessLevel.WRITE),
		updateLobbyValidations,
		updateLobby
	)
	.patch(
		requirePerm("lobbies", ApiAccessLevel.WRITE),
		updateLobbyValidations,
		updateLobby
	)
	.delete(requirePerm("lobbies", ApiAccessLevel.WRITE), deleteLobby)
	.all(methodNotAllowed)

router.use("/:id/players", players)

export { router as lobbies }
