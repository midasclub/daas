import { ApiAccessLevel } from "@daas/model"
import { getApiKeysAdapter } from "@daas/db-adapter"
import { stripIndents } from "common-tags"
import chalk from "chalk"

export async function createFirstApiKeyIfNeeded() {
	const ApiKeys = await getApiKeysAdapter()
	const keys = await ApiKeys.findAll(1)

	if (keys.length === 0) {
		const adminKey = await ApiKeys.insert({
			label: "Service administrator",
			permissions: {
				bots: ApiAccessLevel.WRITE,
				lobbies: ApiAccessLevel.WRITE,
				apiKeys: ApiAccessLevel.WRITE,
				webhooks: ApiAccessLevel.WRITE
			}
		})

		console.log(stripIndents`
		
		${chalk.black.bold.bgRed("PLEASE READ THIS!")}
		
		An admin API Key has been generated because this is the first time you're
		running DaaS, or because you manually deleted all API Keys from the database.
		
		${chalk.red.bold("Copy it to a safe place NOW!")}
		This is the only time that it will be shown to you. If you don't copy it now
		you will have to manually reconfigure the service.
		
		Here's the API Key:
		${chalk.cyan(adminKey.value)}
		
		This key has full administrative access to the service. It is not recommended
		that you use it in the system you're going to integrate with DaaS. Instead,
		generate another key using only the privileges that your system is going to
		need.
		`)
	}
}
