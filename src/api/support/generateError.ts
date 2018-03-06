import { oneLine } from "common-tags"
import { ApiAccessLevel } from "@daas/model"

export function generateError(errorCode: string, info?: any) {
	let statusCode = 400
	const additionalProperties = {} as any

	switch (errorCode) {
		case "API_KEY_NOT_PRESENT":
			statusCode = 401
			additionalProperties.message =
				"In order to make requests to the API the X-DaaS-Api-Key header must be set"
			break
		case "API_KEY_INVALID":
			statusCode = 401
			additionalProperties.message =
				"The API key you provided is not valid or has been revoked"
			break
		case "CANNOT_LOWER_ONLY_ADMIN_PERMISSIONS":
			statusCode = 403
			additionalProperties.message = oneLine`You're trying to revoke an API key, or lower its
			key management permission below the WRITE level, but the key you're modifying is the
			only key in the database with API Key management WRITE permissions, which means that
			after this change, API Keys will not be generateable or modifiable. This operation is
			therefore forbidden.`
			break
		case "INSUFFICIENT_PERMISSIONS":
			statusCode = 403
			additionalProperties.message = oneLine`Your API Key does not have enough permissions to
			access the route you requested. You need a minimum access level of
			${ApiAccessLevel[info.requiredPermission]}, but you have an access level of
			${ApiAccessLevel[info.currentPermission]}.`
			break
		case "IMPOSSIBLE_ACTION":
			statusCode = 403
			additionalProperties.message = info
			break
		case "INVALID_JSON":
			additionalProperties.message =
				"The body of your request is not valid JSON."
			break
		case "VALIDATION_ERROR":
			additionalProperties.message =
				"The body of your request didn't pass the server-side validation. Please refer " +
				"to the documentation."
			additionalProperties.conflictingParameters = info.array()
			break
		case "STEAM_GUARD_CODE_INVALID":
			additionalProperties.message =
				"The Steam Guard code you provided is invalid or has expired."
			break
		case "STEAM_GUARD_CODE_MISSING":
			additionalProperties.message =
				"The support has Steam Guard enabled but you didn't provide a Steam Guard code."
			break
		case "STEAM_INVALID_LOGIN":
			additionalProperties.message =
				"The username or password you entered are invalid."
			break
		case "STEAM_UNKNOWN_ERROR":
			additionalProperties.message = oneLine`Steam sent an error code unsupported by DaaS: 
			${info}. You may check what it means here: https://steamerrors.com/`
			break
		case "CANNOT_RESEND_INVITE_LOBBY_NOT_OPEN":
			statusCode = 422
			additionalProperties.message =
				"Cannot resend an invite in a lobby that is not OPEN."
	}
	return [
		statusCode,
		{
			error: {
				code: errorCode,
				...additionalProperties
			}
		}
	]
}
