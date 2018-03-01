import fetch from "node-fetch"
// import * as retry from "async-retry"
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
		/*await retry(
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
		)*/

		// TODO add retry support
		// Disabled right now because of an error in typings:
		// The typings assume:
		// import {retry} from "async-retry"
		// But it's:
		// import * as retry from "async-retry"
		// Source of the typings
		// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/4d1d1b5ecbec8b111457bc9bbbe2ef0a7a3640ed/types/async-retry

		await fetch(webhook.url, {
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
		})

		console.log(`Sent ${WebHookEventType[webhook.eventType]} webhook to ${webhook.url}`)
	} catch (e) {
		console.error(`Webhook #${webhook.id} (${webhook.url}) failed!`)
		console.error(e)
	}
}
