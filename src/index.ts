import * as dotenv from "dotenv"
import { checkEnvVars } from "./checkEnvVars"

dotenv.config()
checkEnvVars()

import { closeDb } from "@daas/db-adapter"
import { closeServer, launchServer } from "./server"
import { createFirstApiKeyIfNeeded } from "./createFirstApiKeyIfNeeded"

async function main() {
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
