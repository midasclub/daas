import { ApiAccessLevel, ApiPermissions } from "@daas/model"
import { generateError } from "../support/generateError"
import { createMiddleware } from "../support/createMiddleware"

interface Permission {
	key: keyof ApiPermissions
	required: ApiAccessLevel
}

export function requirePerm(
	key: keyof ApiPermissions,
	required: ApiAccessLevel
) {
	return requirePerms({ key, required })
}

export function requirePerms(...permissions: Array<Permission>) {
	return createMiddleware(async req => {
		for (const permission of permissions) {
			const currentPermission = req.apiKey.permissions[permission.key]

			if (currentPermission < permission.required) {
				return generateError("INSUFFICIENT_PERMISSIONS", {
					requiredPermission: permission.required,
					currentPermission
				})
			}
		}
	})
}
