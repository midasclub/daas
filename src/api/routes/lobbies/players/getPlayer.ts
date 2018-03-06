import { createController } from "../../../support/createController"

export const getPlayer = createController(async req => [200, req.player!])
