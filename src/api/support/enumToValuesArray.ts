export function enumToValuesArray(Enum: object): string[] {
	return Object.keys(Enum).filter(key => isNaN(+key))
}
