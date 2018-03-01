import fetch from "node-fetch"
import { retry } from "async-retry"
import { Lobby, WebHook, WebHookEventType } from "@daas/model"
import { WebHooks } from "@daas/db-adapter"

export async function sendWebhooks(
	eventType: WebHookEventType,
	lobby: Lobby,
	data: any
) {
	const webhooks = await WebHooks.findAllByEventType(eventType)
	await Promise.all(webhooks.map(it => sendWebhook(it, lobby, data)))
}

async function sendWebhook(webhook: WebHook, lobby: Lobby, data: any) {
	try {
		await retry(
			() =>
				fetch(webhook.url, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-DaaS-Webhook-Secret": webhook.secret
					},
					body: JSON.stringify({
						webhook: webhook.serialize(),
						lobby: lobby.serialize(),
						data
					})
				}),
			{
				retries: 10
			}
		)

		console.log(`Sent ${WebHookEventType[webhook.eventType]} webhook to ${webhook.url}`)
	} catch (e) {
		console.error(`Webhook #${webhook.id} (${webhook.url}) failed!`)
		console.error(e)
	}
}
