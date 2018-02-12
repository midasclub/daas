import { Communications, MessageType } from "@daas/communications"
import { Observable } from "rxjs"

/**
 * Sends a message to a machine repeated times, in case one misses. This should only be used for
 * messages that the machine will listen to just once, like "LOBBY_INFO", or "KILL_YOURSELF".
 * @param comms The open communications with the machine
 * @param messageType The type of the message to send.
 * @param messageInfo The info of the message to send
 */
export function sendManyTimes(
	comms: Communications,
	messageType: MessageType,
	messageInfo?: any
) {
	Observable.interval(1000)
		.take(30)
		.flatMap(() =>
			Observable.fromPromise(comms.sendMessage(messageType, messageInfo))
		)
		// Wait for all promises to resolve
		.toArray()
		.flatMap(() => comms.close())
		.subscribe(
			() => {},
			err => {
				console.error("Error when sending a message!")
				console.error({ comms, messageType, messageInfo })
				console.error(err)
			}
		)
}
