import { createController } from "../../support/createController"

export const getBot = createController(async req => [200, req.bot!.serialize()])
