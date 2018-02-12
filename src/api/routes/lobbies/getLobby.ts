import { createController } from "../../support/createController"

export const getLobby = createController(async req => [
	200,
	req.lobby!.serialize()
])
