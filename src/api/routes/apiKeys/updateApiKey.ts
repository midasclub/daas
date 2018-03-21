import { ApiKeys } from "@daas/db-adapter"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"
import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"
import { isKeyTheLastWithKeyWritePermissions } from "./support/isKeyTheLastWithKeyWritePermissions"

export const updateApiKey = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const key = req.queriedApiKey!
	const data = matchedData(req)
	const dataToUpdate = { ...data }

	const convert = (v: any) => ApiAccessLevel[v as keyof typeof ApiAccessLevel]

	if (dataToUpdate.permissions) {
		if (dataToUpdate.permissions.bots) {
			dataToUpdate.permissions.bots = convert(dataToUpdate.permissions.bots)
		}
		if (dataToUpdate.permissions.lobbies) {
			dataToUpdate.permissions.lobbies = convert(
				dataToUpdate.permissions.lobbies
			)
		}
		if (dataToUpdate.permissions.webhooks) {
			dataToUpdate.permissions.webhooks = convert(
				dataToUpdate.permissions.webhooks
			)
		}
		if (dataToUpdate.permissions.apiKeys) {
			dataToUpdate.permissions.apiKeys = convert(
				dataToUpdate.permissions.apiKeys
			)

			// Make sure that we are not revoking api key permissions to the only admin key
			if (
				dataToUpdate.permissions.apiKeys < ApiAccessLevel.WRITE &&
				(await isKeyTheLastWithKeyWritePermissions(key))
			) {
				return generateError("CANNOT_LOWER_ONLY_ADMIN_PERMISSIONS")
			}
		}
		dataToUpdate.permissions = Object.assign(
			{},
			key.permissions,
			dataToUpdate.permissions
		)
	}

	const apiKey = await ApiKeys.update(key, dataToUpdate as any)

	return [200, apiKey.serialize()]
})
