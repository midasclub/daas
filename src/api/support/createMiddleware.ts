import { Request, Response, NextFunction } from "express"
import { DaasRequest } from "../interfaces/DaasRequest"

type MiddlewareResponse = Array<number | object>

type Middleware = (req: DaasRequest) => Promise<MiddlewareResponse | void>

export function createMiddleware(predicate: Middleware) {
	return async function(req: Request, res: Response, next: NextFunction) {
		try {
			const response = await predicate(req as DaasRequest)
			if (response) {
				const [status, body] = response
				res.status(status as number).send(body as object)
			} else {
				next()
			}
		} catch (e) {
			next(e)
		}
	}
}
