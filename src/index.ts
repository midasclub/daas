import * as dotenv from "dotenv"
import { checkEnvVars } from "./checkEnvVars"

dotenv.config()
checkEnvVars()

import { closeDb } from "@daas/db-adapter"
import { oneLine } from "common-tags"
import { closeServer, launchServer } from "./server"
import { createFirstApiKeyIfNeeded } from "./createFirstApiKeyIfNeeded"
import { getIepaas } from "./api/support/getIepaas"

async function main() {
	try {
		getIepaas()
	} catch (e) {
		console.warn(oneLine`Warning: not running in iepaas. The server won't be able to launch
		@daas/core in order to launch lobbies.`)
	}

	await Promise.all([createFirstApiKeyIfNeeded(), launchServer()])
}

async function onShutDown() {
	try {
		await Promise.all([closeServer(), closeDb()])
	} catch (e) {
		console.error("Error when trying to shut down!")
		console.error(e)
	}
}

main().catch(console.error)

process.on("SIGINT", onShutDown)
process.on("SIGTERM", onShutDown)
