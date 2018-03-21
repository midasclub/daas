import { Bots } from "@daas/db-adapter"
import { oneLine } from "common-tags"
import { validationResult } from "express-validator/check"
import { matchedData } from "express-validator/filter"
import { createController } from "../../support/createController"
import { generateError } from "../../support/generateError"
import { validateBotCredentials } from "../../../support/validateSteamBotCredentials"

export const createBot = createController(async req => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return generateError("VALIDATION_ERROR", errors)
	}

	const data = matchedData(req)
	/*
	 * The reason we create here the Steam client instead of having a singleton client for all
	 * requests is that Steam is unreliable and may randomly disconnect. A singleton client
	 * would process the request faster, since when the request reaches the server, the steam
	 * client is already connected to the network. However, we would have to keep restarting
	 * it in the event of crashes. The increased response time is a good trade for the simplicity
	 * of just instantiating it when a request comes, and destroying it afterwards.
	 */
	const {
		success,
		error,
		sentryFile,
		additionalErrorData
	} = await validateBotCredentials(
		data.username,
		data.password,
		data.steamGuardCode
	)

	if (success) {
		if (data.steamGuardCode && !sentryFile) {
			console.error(oneLine`Error when adding the bot with username '${
				data.username
			}':
			The user provided a Steam Guard code and the log in was successful, but Steam never
			sent a sentry file, and future logins will fail because of that.`)
			return [500]
		} else {
			const bot = await Bots.insert({
				username: data.username,
				password: data.password,
				sentryFile: sentryFile
			})

			return [201, bot.serialize()]
		}
	} else {
		return generateError(error!, additionalErrorData)
	}
})
