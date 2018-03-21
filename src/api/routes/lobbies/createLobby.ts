import { getLobbiesAdapter } from "@daas/db-adapter"
import { Server, GameMode } from "@daas/model"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"

export const createLobby = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req)
	const dataToInsert = { ...data }
	delete dataToInsert.players

	dataToInsert.server = Server[data.server]
	dataToInsert.gameMode = GameMode[data.gameMode]

	const LobbiesTransaction = await getLobbiesAdapter(true)

	const lobby = await LobbiesTransaction.insert(dataToInsert as any)
	await LobbiesTransaction.concerning(lobby).Players.insert(data.players)

	// This will trigger handleLobbiesChanged in the worker and send the lobby to a support
	await LobbiesTransaction.commit()

	return [201, lobby.serialize()]
})
