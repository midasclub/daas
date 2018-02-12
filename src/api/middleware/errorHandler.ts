import { Request, Response, NextFunction } from "express"

export function errorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (err instanceof SyntaxError) {
		return res.status(400).json({
			error: {
				code: "INVALID_JSON",
				message: "The body of your request is not valid JSON."
			}
		})
	}

	console.error(err)
	res.status(500).send()
}
