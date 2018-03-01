import { Router } from "express"
import { json as jsonParser } from "body-parser"
import { authenticate } from "../middleware/authenticate"
import { errorHandler } from "../middleware/errorHandler"
import { apiKeys } from "./apiKeys"
import { bots } from "./bots"
import { lobbies } from "./lobbies"
import { webhooks } from "./webhooks"

const router = Router()

router.use(jsonParser())
router.use(authenticate)

router.use("/apiKeys", apiKeys)
router.use("/bots", bots)
router.use("/lobbies", lobbies)
router.use("/webhooks", webhooks)

router.use((req, res) => res.status(404).send())
router.use(errorHandler)

export { router as api }
