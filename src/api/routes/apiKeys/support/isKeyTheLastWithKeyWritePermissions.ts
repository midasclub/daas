import { ApiKey } from "@daas/model/src/ApiKey"
import { ApiKeys } from "@daas/db-adapter"
import { ApiAccessLevel } from "@daas/model/src/ApiAccessLevel"

export async function isKeyTheLastWithKeyWritePermissions(key: ApiKey) {
	if (key.permissions.apiKeys < ApiAccessLevel.WRITE) {
		return false
	}

	const keys = await ApiKeys.findAll()
	const withWritePermissions = keys.filter(
		it => it.permissions.apiKeys >= ApiAccessLevel.WRITE
	)

	return withWritePermissions.length === 1
}
