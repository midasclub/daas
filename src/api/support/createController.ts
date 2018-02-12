import { Request, Response, NextFunction } from "express"
import { DaasRequest } from "../interfaces/DaasRequest"

type ControllerResponse = Array<number | object>

type Controller = (req: DaasRequest) => Promise<ControllerResponse>

export function createController(predicate: Controller) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			const [status, body] = await predicate(req as DaasRequest)
			res.status(status as number).send(body as object)
		} catch (e) {
			next(e)
		}
	}
}
