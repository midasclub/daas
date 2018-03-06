import { Request } from "express"
import { ApiKey, Bot, Lobby, Player, WebHook } from "@daas/model"

export interface DaasRequest extends Request {
	apiKey: ApiKey
	queriedApiKey?: ApiKey
	bot?: Bot
	lobby?: Lobby
	player?: Player
	webhook?: WebHook
}
