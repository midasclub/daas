import { CustomValidator } from "express-validator/check"

export function createObjectHasKeysValidator(
	requiredKeys: Array<string>
): CustomValidator {
	return function(value: any) {
		if (typeof value !== "object") {
			throw new Error("Must be an object")
		}

		requiredKeys.forEach(key => {
			if (typeof value[key] === "undefined") {
				throw new Error(`The required property '${key}' is missing`)
			}
		})
		return true
	}
}
