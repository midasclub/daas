function checkEnvVar(key: string) {
	/* istanbul ignore if */
	if (!process.env[key]) {
		console.error(`The ${key} environment variable is not defined!`)
		process.exit(1)
	}
}

export function checkEnvVars() {
	const prodVars = ["PORT", "DATABASE_URL"]
	const testVars: string[] = []

	prodVars.forEach(checkEnvVar)
	/* istanbul ignore else */
	if (process.env.NODE_ENV === "test") {
		testVars.forEach(checkEnvVar)
	}
}
