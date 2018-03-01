import { Router } from "express"
import { ApiAccessLevel } from "@daas/model"
import { methodNotAllowed } from "../../middleware/methodNotAllowed"
import { requirePerm } from "../../middleware/requirePerms"
import { getAllWebhooks } from "./getAllWebhooks"
import { createWebhook } from "./createWebhook"
import { createWebhookValidations } from "./validations/createWebhookValidations"
import { queryWebhook } from "./queryWebhook"
import { getWebhook } from "./getWebhook"
import { updateWebhook } from "./updateWebhook"
import { updateWebhookValidations } from "./validations/updateWebhookValidations"
import { deleteWebhook } from "./deleteWebhook"

const router = Router()

router
	.route("/")
	.get(requirePerm("webhooks", ApiAccessLevel.READ), getAllWebhooks)
	.post(
		requirePerm("webhooks", ApiAccessLevel.WRITE),
		createWebhookValidations,
		createWebhook
	)
	.all(methodNotAllowed)

router.use("/:id", queryWebhook)

router
	.route("/:id")
	.get(requirePerm("webhooks", ApiAccessLevel.READ), getWebhook)
	.put(
		requirePerm("webhooks", ApiAccessLevel.WRITE),
		updateWebhookValidations,
		updateWebhook
	)
	.patch(
		requirePerm("webhooks", ApiAccessLevel.WRITE),
		updateWebhookValidations,
		updateWebhook
	)
	.delete(requirePerm("webhooks", ApiAccessLevel.WRITE), deleteWebhook)
	.all(methodNotAllowed)

export { router as webhooks }
