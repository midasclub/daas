import { Request, Response, NextFunction } from "express"

export function methodNotAllowed(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.status(405).send()
}
