import { Request } from "express"
import { ApiKey, Bot, Lobby } from "@daas/model"

export interface DaasRequest extends Request {
	apiKey: ApiKey
	queriedApiKey?: ApiKey
	bot?: Bot
	lobby?: Lobby
}
