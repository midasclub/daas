import { Bot } from "@daas/model"
import { getBotsAdapter } from "@daas/db-adapter"

/**
 * Disables a bot for a given amount of time
 * @param bot The bot to disable
 * @param time The time to disable the bot, in minutes
 */
export async function disableBot(bot: Bot, time: number) {
	await getBotsAdapter().then(it =>
		it.update(bot, { disabledUntil: new Date(Date.now() + time * 60 * 1000) })
	)
}
