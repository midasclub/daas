import { body } from "express-validator/check"
import { GameMode, Server } from "@daas/model"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"
import { createObjectHasKeysValidator } from "../../../support/validation/createObjectHasKeysValidator"
import { isArray } from "util"

export const createLobbyValidations = [
	body("name").isLength({ min: 1 }),
	body("server").custom(createEnumValidator(Server)),
	body("gameMode").custom(createEnumValidator(GameMode)),
	body("radiantHasFirstPick").isBoolean(),
	body("players")
		.exists()
		.custom(value => {
			if (!isArray(value)) {
				throw new Error("Must be an array")
			}

			return true
		}),
	body("players.*").custom(
		createObjectHasKeysValidator(["steamId", "isRadiant", "isCaptain"])
	),
	body("players.*.steamId").isLength({ min: 1 }),
	body("players.*.isRadiant").isBoolean(),
	body("players.*.isCaptain").isBoolean(),
	body("players").custom((value: Array<any>) => {
		const radiantPlayers = value.filter(it => it && it.isRadiant)
		const direPlayers = value.filter(it => it && !it.isRadiant)

		if (radiantPlayers.length !== 5) {
			throw new Error("Radiant must have 5 players.")
		}

		if (direPlayers.length !== 5) {
			throw new Error("Radiant must have 5 players.")
		}

		value.forEach(player => {
			if (value.filter(it => it.steamId === player.steamId).length > 1) {
				throw new Error(`Player ${player.steamId} appears more than once.`)
			}
		})

		return true
	})
]
