import { LobbyStatus, MatchResult } from "@daas/model"
import { body } from "express-validator/check"
import { createEnumValidator } from "../../../support/validation/createEnumValidator"

export const updateLobbyValidations = [
	body("status")
		.custom(createEnumValidator(LobbyStatus))
		.optional({ nullable: true }),
	body("matchResult")
		.custom(createEnumValidator(MatchResult))
		.optional({ nullable: true })
]
