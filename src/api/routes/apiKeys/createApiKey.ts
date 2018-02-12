import { ApiKeys } from "@daas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"
import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"

export const createApiKey = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req)
	const dataToInsert = { ...data }

	const convert = (v: any) => ApiAccessLevel[v as keyof typeof ApiAccessLevel]

	dataToInsert.permissions = {
		bots: convert(dataToInsert.permissions.bots),
		lobbies: convert(dataToInsert.permissions.lobbies),
		apiKeys: convert(dataToInsert.permissions.apiKeys)
	}

	const apiKey = await ApiKeys.insert(dataToInsert as any)

	return [
		200,
		{
			...apiKey.serialize(),
			value: apiKey.value
		}
	]
})
