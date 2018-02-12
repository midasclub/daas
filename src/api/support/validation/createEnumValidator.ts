import { CustomValidator } from "express-validator/check"
import { oneLine } from "common-tags"
import { enumToValuesArray } from "../enumToValuesArray"

export function createEnumValidator(Enum: any): CustomValidator {
	return function(value: any) {
		if (Enum[value] === undefined || isNaN(Enum[value])) {
			throw new Error(oneLine`Invalid enum value.
			Possible values are: ${enumToValuesArray(Enum).join(", ")}.`)
		}
		return true
	}
}
