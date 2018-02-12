import { body } from "express-validator/check"

export const createBotValidations = [
	body("username").isLength({ min: 1 }),
	body("password").isLength({ min: 1 }),
	body("steamGuardCode")
		.isLength({ min: 1 })
		.optional({ nullable: true })
]
